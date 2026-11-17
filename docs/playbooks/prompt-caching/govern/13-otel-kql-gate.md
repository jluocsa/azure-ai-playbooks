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

Preview on [Copy-Ready Engineering Kits](/papers/engineering-kits#kql-release-gate) or download raw file: <a :href="withBase('/kits/ptu-cache-release-gate.kql')" download target="_blank" rel="noopener"><code>ptu-cache-release-gate.kql</code></a>

<<< @/public/kits/ptu-cache-release-gate.kql{kusto}

> **Why `DeployPeakNormTPM`, `ShardPeakNormTPM`, and `ShardAvgNormTPM` are separated:** `DeployPeakNormTPM` aggregates *all* calls hitting `(model_name, sku)` in the same 1-minute bucket—including `<1,024`-token routers and unkeyed calls—to size PTU headroom against HTTP `429` throttling, while `CacheCalls` evaluates per-shard cache efficiency (`HitRatePct`, `CachedSharePct`, `ReadWriteRatio`) and 24-hour sustained amortization (`ShardAvgNormTPM`).
