---
title: White Papers & Copy-Ready Engineering Kits
description: Searchable single-page executive white papers with print-to-PDF support, inline KQL release-gate queries, static CI linters, PR readiness checklists, and companion evaluation repositories.
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# White Papers & Copy-Ready Engineering Kits

Every live playbook in this hub provides **first-class Markdown subpages**—fully searchable via `⌘K` / `Ctrl+K`, deep-linkable by section, 1-click copyable for code/templates, and formatted with `@media print` (**Print / Save as PDF**) when an offline executive handout is needed for Architecture Review Boards or FinOps sign-off.

## 1. Consolidated Architecture White Papers (Single-Page Reader & Print Edition)

| Document | Scope & Highlights | Subpage |
| :--- | :--- | :--- |
| **Model Migration Readiness: Prompt Caching on GPT-5.6 & Later (`v1.0`)** | Consolidated architecture white paper covering Model 2 stateless hydration, GPT-5.6 / GPT-6 / GPT-6.1 caching mechanics, Standard vs. PTU-M breakpoint boundaries, two-regime PTU sizing math + live estimator, `Scope × Volatility` Pos 1–6 prefix taxonomy, `PCR001–006` CI lint rules, two-regime App Insights KQL, and the `C1–C15` readiness standard. Includes built-in **Print / Save as PDF** layout. | **[Read Single-Page White Paper →](/papers/foundry-prompt-caching-gpt56-whitepaper)** |

## 2. Copy-Ready Engineering Kits (Preview, Copy & Raw CLI Downloads)

| Kit Artifact | Purpose | Subpage Preview & Copy | Raw CLI / Query File |
| :--- | :--- | :--- | :--- |
| **`PCR001–PCR006` Static CI Linter (Python CLI)** | Zero-dependency Python AST/regex scanner flagging missing/per-user `prompt_cache_key`, Pos-1 timestamps/`req_ctx`, unsorted `json.dumps` schemas, early RAG chunks, invalid `5.6` PTU-M breakpoints, and missing `cached_tokens` extraction across Responses & Chat APIs. | **[View & Copy Linter →](/papers/engineering-kits#pcr-linter)** | <a :href="withBase('/kits/pcr_lint.py')" download target="_blank" rel="noopener"><code>pcr_lint.py</code></a> |
| **Two-Regime App Insights KQL Release Gate** | Computes deployment-wide `DeployPeakNormTPM` (across all calls sharing the PTU deployment) alongside per-shard `HitRatePct`, `CachedSharePct`, `ReadWriteRatio`, `TTFT_p95_ms`, and `GateStatus` across pre-GPT-6 (`5.6`/`5.4`) and `gpt-6`/`6.1` normalized weights. | **[View & Copy KQL →](/papers/engineering-kits#kql-release-gate)** | <a :href="withBase('/kits/ptu-cache-release-gate.kql')" download target="_blank" rel="noopener"><code>ptu-cache-release-gate.kql</code></a> |
| **`C1–C15` Migration Readiness PR / Cutover Checklist** | Rendered release-gate sign-off checklist plus a 1-click copyable Markdown block ready to paste into `.github/pull_request_template.md` or Azure DevOps release work items. | **[Open Checklist & PR Template →](/papers/migration-readiness-checklist)** | Markdown subpage + print view |

## 3. Companion Open-Source Evaluation & Governance Repositories

Keep runnable harnesses, CLI tools, and evaluation suites modular in dedicated code repositories:

- **[`microsoft/waza`](https://github.com/microsoft/waza):** CLI and evaluation framework for creating, testing, and measuring agent skill quality and effectiveness.
- **[`sentinel-evals`](https://github.com/jluocsa/sentinel-evals):** Reproducible multi-turn LLM safety evaluation harness with baseline benchmarks.
- **[`agentic-rag-scanner`](https://github.com/jluocsa/agentic-rag-scanner):** Reference .NET / Azure workflow scanner for agentic RAG readiness and verification.
