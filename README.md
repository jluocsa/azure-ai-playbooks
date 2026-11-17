# Enterprise Azure AI Architecture Playbooks

Live Hub: **<https://jluocsa.github.io/azure-ai-playbooks/>**

A governed, multi-author field playbook hub that converts **Customer-Zero** Azure AI and Microsoft Foundry architecture engagements into **repeatable engineering patterns, readiness gates, and scopable delivery kits**.

Built with [VitePress](https://vitepress.dev/), enforced by an automated pre-publication sanitization gate (`scripts/check-sanitized.mjs`), zero-dependency `PCR001–006` CLI linting (`docs/public/kits/pcr_lint.py`), and print-ready Markdown white-paper subpages (`@media print`).

## Why This Hub Exists

1. **1:N Architectural Leverage:** One deep Customer-Zero engagement sets a verified engineering bar reusable across specialist teams and enterprise accounts without re-deriving cross-service answers under cutover pressure.
2. **Cutover & Capacity Risk Protection:** Readiness gates (`C1–C15`), two-regime PTU math, and APIM spillover patterns prevent latency regressions, HTTP `429` storms, and stalled rollouts during model retirement waves.
3. **Solution Industrialization Factory:** Standardizes the pipeline from *Customer-Zero Validation → Sanitization Gate → Architecture Review → IP / Product Group / Playbook Disposition*.
4. **Governed Field-to-Product Pathway:** Routes field discoveries cleanly toward Product Group feedback, Azure Architecture Center pull requests, or prior-art-safe IP review before publication.
5. **Scopable Delivery Accelerators:** Pairs every playbook with an intake qualification scorecard, a 3-week readiness engagement blueprint, static CI rules, eval contracts, and Application Insights KQL gates.

## Repository Structure

```text
azure-ai-playbooks/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts                  # Site config, path-scoped sidebars & local search
│  │  └─ theme/                      # Executive styling, @media print, <PlaybookMeta /> & <PtuCalculator />
│  ├─ operating-model/               # Industrialization pipeline, governance & 3-week delivery scope
│  ├─ playbooks/
│  │  ├─ prompt-caching/             # Playbook 01 (Live): GPT-5.6+ Prompt Caching, PTU & Regulated Multi-Engagement Profile
│  │  └─ series-charters/            # Playbooks 02 & 03: Scoped charters open for co-author leads
│  ├─ papers/                        # Single-page Markdown white paper, inline kits & PR checklist subpages
│  └─ public/
│     └─ kits/                       # Runnable pcr_lint.py CLI & ptu-cache-release-gate.kql
├─ scripts/
│  ├─ check-sanitized.mjs            # Blocks customer names, internal terms, emails & GUIDs
│  └─ deploy-gh-pages.mjs            # Runs sanitization + VitePress build & publishes to gh-pages
├─ CONTRIBUTING.md                   # Co-authoring workflow & 3-gate pre-publication checklist
└─ .github/
   ├─ CODEOWNERS                     # Per-playbook track ownership
   ├─ pull_request_template.md       # Sanitization, ARB & IP disposition attestation
   └─ workflows/deploy.yml           # Sanitization check -> CLI lint smoke -> VitePress build -> Pages
```

## Local Development & Verification

```bash
npm install
npm run verify            # Run check:sanitized + production VitePress build
npm run docs:dev          # Start local VitePress dev server
npm run deploy:pages      # Verify sanitization, build static site, and push to origin/gh-pages
```

## Publishing to GitHub Pages

1. Initialize a clean Git repository from this directory (`git init` — never import history from private customer repositories).
2. If deploying at a root domain (`<owner>.github.io`), set `VITEPRESS_BASE=/`; for a project subpath (`<owner>.github.io/<repo>/`), the default `/azure-ai-playbooks/` base applies automatically.
3. Run `npm run deploy:pages` to publish directly to the `gh-pages` branch (or push to `main` when GitHub Actions runners are enabled).

> **Disclaimer:** Community architecture guidance grounded in public Microsoft Learn documentation. Personal/community views of the contributors; not official Microsoft product documentation or contractual SLA guidance.
