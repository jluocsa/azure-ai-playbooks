---
title: "Copy-Ready Engineering Kits · PCR001–006 Linter & Two-Regime KQL Gate"
description: Previewable, copy-ready Python static AST/regex linter (pcr_lint.py) and Application Insights two-regime KQL release gate for GPT-5.6, GPT-6, and GPT-6.1 migrations.
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Copy-Ready Engineering Kits (`PCR001–006` & KQL Gate)

<PageBrief
  stepLabel="EXECUTABLE MIT KITS"
  readTime="2 min setup"
  problem="Writing static AST linters and normalized PTU KQL queries from scratch slows down migration readiness work."
  takeaway="Zero-dependency pcr_lint.py scans Python/TS/JS/C# repos in seconds, and ptu-cache-release-gate.kql computes two-regime PTU & shard SLOs."
  csaUse="Download or 1-click copy either file below directly into target repositories and Log Analytics workspaces (MIT licensed)."
/>

Both artifacts below are rendered directly from the live kit files in this repository so you can **inspect, search, 1-click copy**, or download the raw CLI/query file into customer repositories.

---

## 1. `PCR001–PCR006` Static CI Linter (`pcr_lint.py`) {#pcr-linter}

Zero-dependency Python 3 AST + regex scanner checking Python, TypeScript, JavaScript, and C# codebases for:

- **`PCR001`:** Missing `prompt_cache_key` or high-cardinality `user_id` / `request_id` / `uuid4` / `engagement_id` / `matter_id` / `client_id` / `cost_center` key interpolation on `responses.create` / `completions.create`.
- **`PCR002`:** Live timestamps, UUIDs, or per-request context (`req_ctx`) injected near leading `system` / `developer` prompts.
- **`PCR003`:** `json.dumps(...)` on tool, schema, context, card, rubric, or taxonomy objects without `sort_keys=True`.
- **`PCR004`:** Dynamic `rag_chunks` / `search_results` placed ahead of static policy or domain methodology.
- **`PCR005`:** Deprecated `prompt_cache_retention` on GPT-5.6+ or `prompt_cache_breakpoint` targeting GPT-5.6 PTU-M.
- **`PCR006`:** Wrapper modules reading `prompt_tokens` or `usage.input_tokens` without extracting `cached_tokens`.

### Run in Local Dev or Pull-Request CI

```bash
python3 pcr_lint.py ./src
python3 pcr_lint.py ./src --json
```

Raw CLI download: <a :href="withBase('/kits/pcr_lint.py')" download target="_blank" rel="noopener"><strong><code>Download pcr_lint.py</code></strong></a>

<<< @/public/kits/pcr_lint.py{python}

---

## 2. Two-Regime Application Insights KQL Release Gate {#kql-release-gate}

Evaluates 24-hour `AppDependencies` OpenTelemetry spans across both **pre-GPT-6** (`5.6` / `5.4`: `0%` cached PTU draw, `6x` output) and **GPT-6 / GPT-6.1** (`0.10x` / `0.05x` cached read, `1.25x` write, `5.0x` output), reporting:

- **`DeployPeakNormTPM` & `DeployP95NormTPM`:** Coincident 1-minute normalized TPM across *all* calls hitting `(model_name, sku)`—including `<1,024`-token routers and unkeyed calls—to right-size PTU capacity.
- **`HitRatePct`, `CachedSharePct`, `ReadWriteRatio`, `TTFT_p95_ms`, `ShardPeakNormTPM` & `GateStatus`:** Per-node, per-shard cache efficiency against the recommended release SLOs (`>=80%` hit rate, `>=60%` cached share, `>=10:1` R/W ratio).

Raw KQL download: <a :href="withBase('/kits/ptu-cache-release-gate.kql')" download target="_blank" rel="noopener"><strong><code>Download ptu-cache-release-gate.kql</code></strong></a>

<<< @/public/kits/ptu-cache-release-gate.kql{kusto}
