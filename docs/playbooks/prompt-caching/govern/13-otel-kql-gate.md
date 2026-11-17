---
title: 13 · OpenTelemetry Spans, Privacy & Two-Regime KQL Gate
description: Metadata-only OpenTelemetry span attributes, DCR privacy guardrails, and the two-regime Application Insights KQL release gate.
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 13 · Observability, Privacy & Two-Regime KQL Release Gate

Production agent telemetry flows through OpenTelemetry into workspace-based Azure Monitor Application Insights and Log Analytics, anchored on the entry request span and correlated across internal agent nodes by `thread_id` <span class="ev-badge ev-arch">[Arch]</span>.

## 1. Required Span Attributes & Privacy Guardrails `[Arch]`

| Span Attribute (`Properties`) | Example / Requirement | Governance Purpose |
| :--- | :--- | :--- |
| `gen_ai.request.model` & `azure.deployment.sku` | `gpt-5.6-terra`, `PTU-M` / `Standard` | Selects the correct PTU normalized-token formula (`pre-6` vs. `6` vs. `6.1`). |
| `gen_ai.prompt_cache.key` | `doc-review:summarizer:v12:shard-0` | Measures per-shard hit rate and detects `>15 RPM` shard saturation. |
| `gen_ai.usage.input_tokens` & `output_tokens` | Integer counters | Baseline prompt and generation volume. |
| `gen_ai.usage.cached_tokens` & `cache_write_tokens` | Integer counters (`0` when absent) | Computes hit rate, cached share, and read/write amortization ratio. |
| `gen_ai.latency.ttft_ms`, `thread_id`, `agent.node_name` | Numeric latency + correlation IDs | Correlates multi-node turns and tracks TTFT p95 gains. |
| `finops.practice` & `finops.cost_center` *(optional)* | Pseudonymized practice / cost-center tags | Allocates normalized PTU-M & Standard spillover tokens per engagement without polluting `prompt_cache_key` ([Profile](/playbooks/prompt-caching/profiles/regulated-multi-engagement#2-chargeback-vs-cache-key-separation-preventing-cardinality-collapse)). |

::: info Metadata-Only Telemetry & Cardinality Guardrails
- **Zero raw prompt logging by default:** Prompt-caching governance requires *only* numeric token counters and the static `prompt_cache_key`—never raw customer documents or prompt text.
- **DCR ingestion masking:** Keep Azure Monitor Data Collection Rule (DCR) transformations active to strip accidental PII.
- **Query Log Analytics, not custom metrics:** Aggregate per-key and per-node PTU utilization in KQL rather than custom metrics to avoid metric cardinality limits.
:::

## 2. Reference KQL Query: Two-Regime Peak-Minute PTU Sizing & Release Gate

Download raw file: <a :href="withBase('/kits/ptu-cache-release-gate.kql')" download target="_blank" rel="noopener"><code>ptu-cache-release-gate.kql</code></a>

```kusto
// Application Insights KQL: Per-node cache efficiency + Two-Regime Peak 1-Min vs. Avg PTU Normalized TPM
let BaseCalls = AppDependencies
| where TimeGenerated > ago(24h) and Type == "AzureOpenAI"
| extend cd = parse_json(Properties)
| extend cache_key = tostring(cd["gen_ai.prompt_cache.key"]), node_name = tostring(cd["agent.node_name"]),
         model_name = tostring(cd["gen_ai.request.model"]), sku = tostring(cd["azure.deployment.sku"]),
         input_tok = tolong(cd["gen_ai.usage.input_tokens"]), output_tok = tolong(cd["gen_ai.usage.output_tokens"]),
         cached_tok = tolong(coalesce(cd["gen_ai.usage.cached_tokens"], 0)),
         write_tok = tolong(coalesce(cd["gen_ai.usage.cache_write_tokens"], 0)),
         ttft_ms = todouble(cd["gen_ai.latency.ttft_ms"])
| where isnotempty(cache_key) and input_tok >= 1024
| extend uncached_tok = max_of(input_tok - cached_tok - write_tok, 0)
| extend norm_tok = case(  // Ch. 04 <=272K weights; use 2x input/cache & 7.5x output if input_tok > 272000
         model_name has "6.1", uncached_tok + 0.05 * cached_tok + 1.25 * write_tok + 5.0 * output_tok,
         model_name has "gpt-6", uncached_tok + 0.10 * cached_tok + 1.25 * write_tok + 5.0 * output_tok,
         (input_tok - cached_tok) + 6.0 * output_tok);  // Pre-GPT-6 (5.6 / 5.4): 0x cached, 6x output
let PeakMinute = BaseCalls
| summarize MinuteNormTPM = sum(norm_tok) by node_name, model_name, sku, cache_key, bin(TimeGenerated, 1m)
| summarize PeakNormTPM = round(max(MinuteNormTPM), 0), P95NormTPM = round(percentile(MinuteNormTPM, 95), 0)
         by node_name, model_name, sku, cache_key;
BaseCalls
| summarize Calls = count(), HitRatePct = round(100.0 * countif(cached_tok > 0) / count(), 1),
            CachedSharePct = round(100.0 * sum(cached_tok) / max_of(sum(input_tok), 1), 1),
            ReadWriteRatio = iff(sum(write_tok) == 0, real(null), round(todouble(sum(cached_tok)) / sum(write_tok), 1)),
            TTFT_p95_ms = round(percentile(ttft_ms, 95), 0), AvgNormTPM = round(sum(norm_tok) / 1440.0, 0)
         by node_name, model_name, sku, cache_key
| join kind=inner PeakMinute on node_name, model_name, sku, cache_key
| extend GateStatus = iff(HitRatePct >= 80.0 and CachedSharePct >= 60.0
                          and (isnull(ReadWriteRatio) or ReadWriteRatio >= 10.0), "PASS", "FAIL")
| project-away node_name1, model_name1, sku1, cache_key1 | order by GateStatus asc, PeakNormTPM desc
```

> **Why both `PeakNormTPM` and `AvgNormTPM` are required:** PTU allocation and HTTP `429` throttling are governed by 1-minute burst demand (`PeakNormTPM` / `P95NormTPM`), whereas reservation cost amortization is governed by sustained 24-hour volume (`AvgNormTPM`).
