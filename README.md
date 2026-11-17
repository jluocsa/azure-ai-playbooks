# Enterprise Azure AI Architecture Playbooks

Live Hub: **<https://jluocsa.github.io/azure-ai-playbooks/>**

A governed, multi-author field playbook hub that converts **Customer-Zero** Azure AI and Microsoft Foundry architecture engagements into **repeatable engineering patterns, readiness gates, and scopable delivery kits**.

Built with [VitePress](https://vitepress.dev/) + [Mermaid](https://mermaid.js.org/), enforced by an automated pre-publication sanitization gate (`scripts/check-sanitized.mjs`) and headless Chromium PDF white-paper builder (`scripts/build-pdfs.mjs`).

## Why This Hub Exists

1. **1:N Architectural Leverage:** One deep Customer-Zero engagement sets a verified engineering bar reusable across specialist teams and enterprise accounts without re-deriving cross-service answers under cutover pressure.
2. **Cutover & Capacity Risk Protection:** Readiness gates (`C1–C15`), two-regime PTU math, and APIM spillover patterns prevent latency regressions, HTTP `429` storms, and stalled rollouts during model retirement waves.
3. **Solution Industrialization Factory:** Standardizes the pipeline from *Customer-Zero Validation → Sanitization Gate → Architecture Review → IP / Product Group / Playbook Disposition*.
4. **Governed Field-to-Product Pathway:** Routes field discoveries cleanly toward Product Group feedback, Azure Architecture Center pull requests, or prior-art-safe IP review before publication.
5. **Scopable Delivery Accelerators:** Pairs every playbook with an intake qualification scorecard, a 3-week readiness engagement blueprint, static CI rules, eval contracts, and Application Insights KQL gates.

## Repository Structure

```text
playbook-hub/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts                  # Site config, path-scoped sidebars, Mermaid, search
│  │  └─ theme/                      # Executive styling, <PlaybookMeta /> & <PtuCalculator />
│  ├─ operating-model/               # Industrialization pipeline, governance & 3-week delivery scope
│  ├─ playbooks/
│  │  ├─ prompt-caching/             # Playbook 01 (Live): GPT-5.6+ Prompt Caching, PTU & Regulated Multi-Engagement Profile
│  │  └─ series-charters/            # Playbooks 02 & 03: Scoped charters open for co-author leads
│  ├─ papers/                        # Executive White Paper & Copy-Ready Engineering Kits index
│  └─ public/
│     ├─ papers/                     # Auto-built 16-page PDF white papers
│     └─ kits/                       # Copy-ready KQL release gate & PR readiness checklist
├─ papers-src/                       # Sanitized Letter-size HTML print source for white papers
├─ scripts/
│  ├─ check-sanitized.mjs            # Blocks customer names, internal terms, emails & GUIDs
│  └─ build-pdfs.mjs                 # Renders print HTML -> PDF & asserts zero footer overlap
├─ CONTRIBUTING.md                   # Co-authoring workflow & 3-gate pre-publication checklist
└─ .github/
   ├─ CODEOWNERS                     # Per-playbook track ownership
   ├─ pull_request_template.md       # Sanitization, ARB & IP disposition attestation
   └─ workflows/deploy.yml           # Sanitization check -> VitePress build -> GitHub Pages
```

## Local Development & Verification

```powershell
npm install
npm run check:sanitized   # Verify zero customer/internal/GUID leaks across docs & PDFs
npm run build:pdfs        # Rebuild 16-page executive white paper PDF & verify layout clearance
npm run docs:dev          # Start local VitePress dev server
npm run docs:build        # Build production static site
```

## Publishing to GitHub Pages

1. Initialize a clean Git repository from this directory (`git init` — never import history from private customer repositories).
2. If deploying at a root domain (`<owner>.github.io`), keep `base: '/'` in `docs/.vitepress/config.mts`. If deploying to a project subpath (`<owner>.github.io/<repo>/`), set `VITEPRESS_BASE=/<repo>/` in `.github/workflows/deploy.yml` (supported automatically).
3. In **Settings → Pages**, set **Source** to **GitHub Actions** and push to `main`.

> **Disclaimer:** Community architecture guidance grounded in public Microsoft Learn documentation. Personal/community views of the contributors; not official Microsoft product documentation or contractual SLA guidance.
