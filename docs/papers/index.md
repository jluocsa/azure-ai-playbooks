---
title: White Papers & Copy-Ready Engineering Kits
description: Searchable single-page executive white papers with print-to-PDF support, inline KQL release-gate queries, static CI linters, PR readiness checklists, and companion evaluation repositories.
---

<script setup>
import { withBase } from 'vitepress'
</script>

# White Papers & Copy-Ready Engineering Kits

<PageBrief
  stepLabel="DELIVERABLES & MIT KITS"
  readTime="2 min read"
  problem="Production rollouts require both a consolidated architecture document for review boards and runnable checks for repositories."
  takeaway="Every live playbook ships four ready-to-share artifacts: a printable single-page white paper, a Python AST linter, a KQL gate, and a PR checklist."
  csaUse="Select the artifact below—Save as PDF for offline architecture sign-off, or 1-click copy code/KQL straight into CI/CD pipelines."
/>

<div class="arch-diagram">
  <svg viewBox="0 0 760 132" role="img" aria-labelledby="kits-map-title kits-map-desc" font-family="Segoe UI, Inter, -apple-system, sans-serif">
    <title id="kits-map-title">Four Turnkey Deliverables Mapped to Workflow Stages</title>
    <desc id="kits-map-desc">Shows 1 Architecture White Paper, 2 Repository CI Check (pcr_lint.py), 3 Telemetry Gate (Two-Regime KQL), and 4 Cutover Checklist (C1-C15 PR Template).</desc>
    <rect x="8" y="12" width="178" height="84" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4"/>
    <text x="16" y="31" font-size="9.1" font-weight="700" fill="#183e62">1. Architecture Brief</text>
    <text x="16" y="47" font-size="8.2" fill="#334e68">Single-Page White Paper</text>
    <text x="16" y="60" font-size="8.2" fill="#334e68">1-click Print / Save PDF</text>
    <text x="16" y="80" font-size="7.8" font-weight="700" fill="#1d4ed8">[CC BY 4.0 Handout]</text>
    <rect x="196" y="12" width="178" height="84" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.4"/>
    <text x="204" y="31" font-size="9.1" font-weight="700" fill="#115e59">2. Repository CI Lint</text>
    <text x="204" y="47" font-size="8.2" fill="#334e68">pcr_lint.py AST CLI</text>
    <text x="204" y="60" font-size="8.2" fill="#334e68">Zero third-party deps</text>
    <text x="204" y="80" font-size="7.8" font-weight="700" fill="#0f766e">[MIT Python Kit]</text>
    <rect x="384" y="12" width="178" height="84" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.4"/>
    <text x="392" y="31" font-size="9.1" font-weight="700" fill="#115e59">3. Telemetry Gate</text>
    <text x="392" y="47" font-size="8.2" fill="#334e68">Two-Regime App Insights</text>
    <text x="392" y="60" font-size="8.2" fill="#334e68">KQL sizing &amp; SLO query</text>
    <text x="392" y="80" font-size="7.8" font-weight="700" fill="#0f766e">[MIT KQL Workbook]</text>
    <rect x="572" y="12" width="180" height="84" rx="6" fill="#fff7eb" stroke="#d97706" stroke-width="1.4"/>
    <text x="580" y="31" font-size="9.1" font-weight="700" fill="#92400e">4. Cutover Sign-Off</text>
    <text x="580" y="47" font-size="8.2" fill="#334e68">C1–C15 PR &amp; ADO</text>
    <text x="580" y="60" font-size="8.2" fill="#334e68">Readiness Template</text>
    <text x="580" y="80" font-size="7.8" font-weight="700" fill="#b45309">[Copy-Paste Markdown]</text>
    <text x="10" y="118" font-size="8.4" fill="#526c80">All four artifacts stay synchronized in source control, searchable via Ctrl+K / ⌘K, and sanitized automatically on every build.</text>
  </svg>
</div>

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
