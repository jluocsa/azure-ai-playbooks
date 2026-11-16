## Summary of Pattern / Playbook Update

- **Playbook / Track:** `01 · Prompt Caching & PTU Readiness` | `02 · APIM Gateway` | `03 · Foundry BCP` | `Operating Model`
- **Customer-Zero Provenance (anonymized industry/workload type only):** e.g., *Regulated enterprise multi-node document review platform*

## Mandatory 3-Gate Pre-Publication Checklist

- [ ] **Gate 1 — Sanitization (`npm run check:sanitized` passes):** Zero customer names, stakeholder names, engagement timelines, internal org/sales acronyms, internal email addresses, or subscription/tenant GUIDs appear in prose, diagrams, code comments, or PDFs.
- [ ] **Gate 2 — Source & Architecture Review:** Product claims are tagged `[M]` and verified against public Microsoft Learn docs (`Last verified` updated); design patterns are tagged `[Arch]`; proposed thresholds are tagged `[Agree]`; zero unpublished NDA roadmap items are included.
- [ ] **Gate 3 — IP & Channel Disposition:** Confirmed this contribution does **not** disclose an un-cleared invention disclosure (IDF), and noted whether it is also queued for Azure Architecture Center / Product Group upstreaming.
- [ ] **Build Verification:** `npm run verify` completes with zero broken links or build errors.
