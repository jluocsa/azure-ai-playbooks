## GPT-5.6 / GPT-6 / GPT-6.1 Model Migration & Prompt Caching Readiness Gate (`C1–C15`)

- **Service / Agent Workload:** `<service-name>`
- **Source Model -> Target Model & SKU:** `<e.g., gpt-5.4-mini -> gpt-5.6-terra (PTU-M + Standard spillover)>`
- **Target Cutover Window:** `<YYYY-MM-DD>`

### Layer 1 — Architecture & Static CI Lint (`PCR001–PCR006`)
- [ ] **C1:** Stable prefix boundary (`>=1,024` tokens) documented and mapped to Positions 1–6 (`T0 -> L2 -> L1 -> Volatile Tail`).
- [ ] **C2 (`PCR002`):** Positions 1–3 system instructions and `response_format` schemas contain zero timestamps, user IDs, or request GUIDs.
- [ ] **C3 (`PCR003`):** `tools[]` definitions sorted deterministically by name and serialized with canonical JSON key order (`sort_keys=True`).
- [ ] **C4 (`PCR004`):** Retrieved RAG chunks, live MCP outputs, and current user query placed at Position 6 (tail).
- [ ] **C6 (`PCR001`):** `prompt_cache_key` set on every GPT-5.6+ call (`{app}:{node}:{ver}:shard-{i}`) with zero per-user/request GUIDs.
- [ ] **C8 (`PCR005` — Standard 5.6+ & PTU-M GPT-6+):** Explicit `prompt_cache_breakpoint` set after Pos 3 (`>=1,024t`) and optionally Pos 4 (`<=4` writes).
- [ ] **C9 (`PCR005` — GPT-5.6 PTU-M):** Unsupported breakpoint/options fields stripped on the GPT-5.6 PTU-M leg; `prompt_cache_key` preserved.

### Layer 2 & 3 — Evaluation & Multi-Turn Session Parity
- [ ] **C5:** Multi-turn checkpointed conversation history verified strictly append-only within a session window.
- [ ] **C10:** `prompt_cache_options.ttl` (`30m` vs `12h`), `reasoning.context` (`current_turn` vs `all_turns`), and removal of `prompt_cache_retention` verified.
- [ ] **C12:** 2-pass golden evaluation suite (50–200 cases) passed: repeat hit rate `>=80%`, cached input share `>=60%`, `R/W >=10:1`, and output quality `>=` baseline.

### Layer 5 & 7 — Concurrency Load Test, OTel & PTU Right-Sizing
- [ ] **C7:** Deterministic `prompt_cache_key` sharding (`N = ceil(RPM / 12)`) validated above `~15 RPM` per prefix.
- [ ] **C11 (`PCR006`):** `cached_tokens`, `cache_write_tokens`, `prompt_cache_key`, and TTFT emitted via metadata-only OpenTelemetry spans to App Insights.
- [ ] **C13:** Peak load test completed below `60–70%` PTU queuing saturation with zero unexpected HTTP `429`s.
- [ ] **C14:** PTU capacity model updated from measured `PeakNormTPM` (pre-GPT-6 vs. GPT-6/6.1 normalized weights) and rounded to the 5-PTU increment.
- [ ] **C15:** Readiness artifacts reviewed and signed off by App Lead, Platform/SRE Lead, and FinOps Lead.
