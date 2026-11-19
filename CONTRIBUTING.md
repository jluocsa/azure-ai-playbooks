# Contributing & Co-Authoring Guide

This hub operates as a **multi-author Solution Industrialization repository**. Every playbook and white paper originates from validated enterprise architecture work (**Customer-Zero**) and passes three mandatory gates before publication.

## 1. Co-Authoring Roles

- **Hub Maintainers (`.github/CODEOWNERS` root):** Own the site structure, evidence conventions (`[M]`, `[Arch]`, `[Agree]`, `[Validate]`), and automated sanitization checks.
- **Playbook Track Owners:** Lead a specific playbook (e.g., *01 · Prompt Caching & PTU Readiness*, *02 · Multi-Backend Foundry APIM Gateway*, *03 · Multi-Region Foundry BCP*), review PRs in their directory, and keep `Last verified` dates current during model waves.
- **Contributors:** Submit new workload archetypes, KQL queries, CI lint rules, or documentation fixes via Pull Request (or the *"Suggest an edit to this page"* link on any page).

## 2. Three Mandatory Pre-Publication Gates

Before opening or merging a Pull Request, verify all three gates:

1. **Sanitization & Confidentiality Gate (`npm run check:sanitized`):**
   - Strip all customer names, project code names, individual stakeholder names, engagement dates, internal organization/sales acronyms, `@microsoft.com` email addresses, and Azure tenant/subscription GUIDs.
   - Express every scenario in reusable domain terms (`Workspace / Case Context Card (L2)`, `Rubric-Scoring Agent`, `Standard PAYG Spillover`).
2. **Architecture & Source-Discipline Gate:**
   - Tag every product behavior claim `[M]` with a link to public Microsoft Learn or OpenAI documentation and update the `Last verified` date on the playbook's `sources.md` page.
   - Tag reference patterns `[Arch]`, proposed release thresholds `[Agree]`, and empirical environment checks `[Validate]`. Never cite unpublished internal roadmaps.
3. **IP & Channel Disposition Gate:**
   - Confirm whether any novel mechanism is an active patent / invention-disclosure candidate. **Do not commit active invention-disclosure drafts to public repositories** (public commits create immediate prior art).
   - Identify companion upstream targets where applicable (Product Group engineering brief or Azure Architecture Center PR).

## 3. Page Structure Standard (Readable Across All Audience Levels)

Every chapter and subpage follows a **progressive-disclosure pattern** so leadership, practitioners, and users across roles can all use the same page:

1. **Top `<PageBrief />` Card:** Concise 3-column summary (*Why It Matters*, *Key Takeaway*, *How Users Use This*) with journey stage indicator and read time.
2. **Visual Mental Model:** Clean horizontal SVG architecture/flow diagram (using `.arch-diagram`) before any wide specification tables.
3. **Verified Engineering Detail:** Evidence-tagged (`[M]`, `[Arch]`, `[Agree]`, `[Validate]`) matrices, formulas, and copy-ready code/KQL snippets.

```markdown
<PageBrief
  stage="design"
  audience="Architects & App Leads"
  readTime="3 min read"
  problem="Concise customer problem solved on this page."
  takeaway="Single-sentence architectural rule or bottom-line conclusion."
  csaUse="How users apply this page in an architecture review or delivery sprint."
/>
```

## 4. Submitting a Change

```powershell
git checkout -b feat/<playbook>-<topic>
npm run check:sanitized
npm run docs:build
```

Open a Pull Request and complete all checkboxes in `.github/pull_request_template.md`.
