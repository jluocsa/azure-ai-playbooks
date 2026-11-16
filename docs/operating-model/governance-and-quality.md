---
title: 02 · Governance, Evidence & Adoption Signals
description: Evidence tagging standards, 3-gate pre-publication controls, multi-author ownership, and outcome-focused adoption telemetry.
outline: [2, 3]
---

# 02 · Governance, Evidence & Adoption Signals

High-trust architecture guidance requires strict separation between **verified platform specifications**, **reference design patterns**, and **proposed operational thresholds**—paired with clear ownership and outcome tracking.

## 1. Four-Tier Evidence Discipline

Every technical claim, table, and code block across this hub uses four explicit tags:

| Tag | Meaning | Verification Requirement |
| :--- | :--- | :--- |
| <span class="ev-badge ev-m">[M]</span> **Microsoft Learn Verified** | Published Azure OpenAI in Microsoft Foundry Models or OpenAI platform specification (e.g., PTU-M breakpoint boundaries, `12h` cache-write billing date, `reasoning.context` defaults, normalized token weights). | Must cite an authoritative URL on the playbook's `Sources` page with an explicit `Last verified` date. |
| <span class="ev-badge ev-arch">[Arch]</span> **Reference Architecture Pattern** | Recommended Cloud Solution Architecture pattern for enterprise runtimes, context assembly, APIM failover, or CI/CD quality pipelines. | Must document trade-offs, preconditions, and do/avoid boundaries. |
| <span class="ev-badge ev-agree">[Agree]</span> **Recommended Gate SLO** | Proposed engineering / FinOps release threshold (e.g., `&ge;80%` repeat cache hit rate, `&ge;60%` cached input share, `&ge;10:1` read/write ratio). | Presented transparently as a recommended target for customer App Lead + FinOps sign-off—never disguised as a hard platform limit. |
| <span class="ev-badge ev-val">[Validate]</span> **Subscription Empirical Check** | Behavior that depends on regional rollout state, quota tier, or endpoint configuration. | Paired with a reproducible probe (e.g., the 2-pass cache hit probe or regional quota check). Never references unpublished roadmaps. |

## 2. Three-Gate Pre-Publication Checklist

Every Pull Request into `main` enforces three gates via `.github/pull_request_template.md` and GitHub Actions:

1. **Sanitization & Confidentiality (`scripts/check-sanitized.mjs`):** Automated scan across `.md`, `.vue`, `.html`, `.kql`, and extracted `.pdf` text blocking customer names, project code names, internal aliases, internal email addresses, restricted classification banners, and Azure subscription GUIDs.
2. **Peer Architecture Review (`.github/CODEOWNERS`):** At least one review from a designated Track Owner confirming source accuracy, workload neutrality, and zero broken links (`npm run verify`).
3. **IP & Prior-Art Clearance:** Confirmation that the contribution synthesizes public platform capabilities + architectural best practices and does **not** prematurely publish an un-cleared invention disclosure.

## 3. Multi-Author Ownership Model

Playbooks are owned by **named Track Leads and Co-Authors**, not anonymous wiki edits:

- **Visible Bylines:** Every playbook displays its Track Owners, Customer-Zero provenance category, governance status, and `Last verified` date in the `<PlaybookMeta />` header banner and on the companion PDF cover.
- **Scoped Directory Ownership:** `.github/CODEOWNERS` routes PRs in `/docs/playbooks/<track>/` directly to that track's co-authors while keeping root sanitization rules gated centrally.
- **Low-Friction Peer Contribution:** Specialists can either co-own a full playbook ([see open Series Charters](/playbooks/series-charters/)) or contribute a single node archetype / KQL query via Pull Request.

## 4. Outcome-Oriented Adoption Metrics (What We Measure—and What We Don't)

::: warning Outcome Metrics Over Vanity Traffic
Page views, generic downloads, and social impressions do **not** prove architectural impact. Track adoption through concrete delivery and engineering outcomes.
:::

| Outcome Metric | What High-Impact Reuse Looks Like |
| :--- | :--- |
| **1. Architecture Design Sessions (ADS) Accelerated** | Count of customer architecture reviews where the playbook's decision matrices (`Scope × Volatility` prefix order, PTU calculator, APIM spillover) compressed design sign-off from weeks to a single working session. |
| **2. Pre-Cutover Regressions Prevented** | Count of model migrations (`gpt-4.x` / `o3-mini` &rarr; `gpt-5.6` / `gpt-6` / `gpt-6.1`) where `PCR001–006` linting or the 2-pass DeepEval / KQL gate caught `0%` cache hits or PTU under-sizing *before* production cutover. |
| **3. Repeatable Readiness Engagements Scoped** | Number of structured 2–3 week customer readiness engagements scoped directly from the [Repeatable Delivery Blueprint](/operating-model/delivery-scoping). |
| **4. Multi-Author Reuse Across Teams** | Number of peer architects actively contributing chapters, co-owning new playbook tracks, or adapting the KQL/lint kits on independent accounts. |
| **5. Upstream Product & Learn Contributions** | Count of Product Group engineering briefs actioned or Azure Architecture Center / Microsoft Learn pull requests merged from matured playbook chapters. |
