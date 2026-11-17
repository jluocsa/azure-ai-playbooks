---
title: White Papers & Copy-Ready Engineering Kits
description: Sanitized print-ready executive white papers, KQL release-gate queries, PR readiness checklists, and companion evaluation repositories.
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# White Papers & Copy-Ready Engineering Kits

Every live playbook in this hub provides **two synchronized formats**:

1. **Interactive Web Playbook** (`Ctrl+K` searchable chapters, Mermaid diagrams, and live sizing calculators for day-to-day engineering reviews), and
2. **Print-Ready Executive White Paper (PDF)** + **Copy-Ready Kits** (built automatically from sanitized print HTML with verified page-layout clearance for offline architecture review boards and FinOps sign-off).

## 1. Executive White Papers (Sanitized Print Editions)

| Document | Scope & Highlights | Format |
| :--- | :--- | :--- |
| **Model Migration Readiness: Prompt Caching on GPT-5.6 & Later (`v1.0`)** | 16-page Letter architecture white paper covering Model 2 stateless hydration, GPT-5.6 / GPT-6 / GPT-6.1 caching mechanics, Standard vs. PTU-M breakpoint boundaries, two-regime PTU sizing math, `Scope × Volatility` Pos 1–6 prefix taxonomy, `PCR001–006` CI lint rules, 2-pass DeepEval gate, two-regime App Insights KQL, and the `C1–C15` readiness standard. | <a :href="withBase('/papers/foundry-prompt-caching-gpt56-whitepaper-v1.0.pdf')" target="_blank" rel="noopener"><strong>Download 16-Page PDF ↗</strong></a> |

## 2. Copy-Ready Engineering Kits (Drop Into Customer Repos)

| Kit Artifact | Purpose | Download / Raw File |
| :--- | :--- | :--- |
| **`PCR001–PCR006` Static CI Linter (Python CLI)** | Zero-dependency Python AST/regex scanner flagging missing/per-user `prompt_cache_key`, Pos-1 timestamps, unsorted `json.dumps` schemas, early RAG chunks, invalid `5.6` PTU-M breakpoints, and missing `cached_tokens` telemetry. | <a :href="withBase('/kits/pcr_lint.py')" download target="_blank" rel="noopener"><code>pcr_lint.py</code></a> |
| **Two-Regime App Insights KQL Release Gate** | Computes per-node `HitRatePct`, `CachedSharePct`, `ReadWriteRatio`, `TTFT_p95_ms`, `PeakNormTPM`, and `AvgNormTPM` across both pre-GPT-6 (`5.6`/`5.4`) and `gpt-6`/`6.1` normalized weights. | <a :href="withBase('/kits/ptu-cache-release-gate.kql')" download target="_blank" rel="noopener"><code>ptu-cache-release-gate.kql</code></a> |
| **`C1–C15` Migration Readiness PR / Cutover Template** | Markdown release-gate checklist ready to paste into `.github/pull_request_template.md` or Azure DevOps release work items before model cutover. | <a :href="withBase('/kits/migration-readiness-pr-checklist.md')" download target="_blank" rel="noopener"><code>migration-readiness-pr-checklist.md</code></a> |

## 3. Companion Open-Source Evaluation & Governance Repositories

Keep runnable harnesses, CLI tools, and evaluation suites modular in dedicated code repositories:

- **[`waza`](https://github.com/jluocsa/waza):** CLI and evaluation framework for creating, testing, and measuring agent skill quality and effectiveness.
- **[`sentinel-evals`](https://github.com/jluocsa/sentinel-evals):** Reproducible multi-turn LLM safety evaluation harness with baseline benchmarks.
- **[`agentic-rag-scanner`](https://github.com/jluocsa/agentic-rag-scanner):** Reference .NET / Azure workflow scanner for agentic RAG readiness and verification.
