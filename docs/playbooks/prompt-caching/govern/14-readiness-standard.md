---
title: 14 · 15-Point Migration Readiness Standard (C1–C15)
description: Recommended 15-point production readiness standard mapped across the 7-layer quality pipeline and 4-stage governance lifecycle.
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 14 · 15-Point Migration Readiness Standard (`C1–C15`)

Download raw PR checklist template: <a :href="withBase('/kits/migration-readiness-pr-checklist.md')" download target="_blank" rel="noopener"><code>migration-readiness-pr-checklist.md</code></a>

Adopt criteria **`C1`–`C15`** as a standing release gate across the 7-layer pipeline before cutting over any production agent workload to **GPT-5.6, GPT-6, or GPT-6.1** <span class="ev-badge ev-agree">[Agree]</span>:

| # | Scope | Recommended Readiness Criterion | Target Evidence | Quality Layer |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | `ALL` | Every prompt family / agent node has a documented stable prefix boundary (`>=1,024` tokens) mapped to Pos 1–6. | Prompt design spec | Architecture |
| **C2** | `ALL` | Pos 1–3 system instructions and `response_format` schemas contain zero timestamps, user IDs, or request GUIDs. | CI lint (`PCR002`) | Layer 1 (Unit/CI) |
| **C3** | `ALL` | Tool definitions (`tools[]`) are sorted by name and serialized with canonical JSON key ordering (`sort_keys=True`). | Unit test (`PCR003`) | Layer 1 (Unit/CI) |
| **C4** | `ALL` | Dynamic content (retrieved search/vector chunks, live MCP data, user query) is placed at Pos 6 (tail). | CI lint (`PCR004`) | Layer 1 (Unit/CI) |
| **C5** | `ALL` | Multi-turn checkpointed conversation history is strictly append-only within a session window. | Session replay test | Layer 3 (Integ) |
| **C6** | `ALL` | `prompt_cache_key` is set on every GPT-5.6+ call, encodes `{app}:{node}:{ver}`, and excludes per-user/request GUIDs. | CI lint (`PCR001`) | Layer 1 (Unit/CI) |
| **C7** | `ALL` | Deterministic key sharding (`0..N-1` where `N = ceil(RPM / 12)`) is implemented for nodes exceeding `~15 RPM` per prefix. | Shard load test (`PCR001`) | Layer 5 (Load) |
| **C8** | `STD / 6+` | Explicit cache breakpoints (`prompt_cache_breakpoint`) placed after Pos 3 (`>=1,024t`) and optionally Pos 4; max 4 writes respected. | Wire sample (`PCR005`) | Layer 1 (Unit/CI) |
| **C9** | `PTU 5.6` | Workloads targeting GPT-5.6 PTU-M omit unsupported breakpoint fields and rely on deterministic prefix ordering + key. | SKU adapter config | Layer 3 (Integ) |
| **C10** | `ALL` | `prompt_cache_options.ttl` (`30m` vs `12h`), `reasoning.context` (`current_turn` vs `all_turns`), and removal of `prompt_cache_retention` verified; `R/W >=10:1`. | Validation report (`PCR005`) | Layer 2 (Eval) |
| **C11** | `ALL` | `cached_tokens`, `cache_write_tokens`, `prompt_cache_key`, and TTFT are emitted via OTel to App Insights (metadata-only). | KQL span check (`PCR006`) | Layer 7 (OTel) |
| **C12** | `ALL` | Layer 2 DeepEval golden set (50–200 cases) run before and after migration; hit rate (`>=80%`), cached share (`>=60%`), TTFT, and quality pass. | 2-pass DeepEval report | Layer 2 (Eval) |
| **C13** | `ALL` | Layer 5 peak load test completed with zero cache degradation and zero unexpected HTTP `429`s at target concurrency. | Concurrency report | Layer 5 (Load) |
| **C14** | `ALL` | PTU / TPM capacity sizing updated using measured `PeakNormTPM` hit rate and Chapter 04 model-specific PTU formulas. | Right-sized PTU model | FinOps / Sizing |
| **C15** | `ALL` | All validation and sizing artifacts recorded in the Model Migration Readiness Record for engineering and FinOps sign-off. | Readiness record | Release Gate |

*Scope legend:* `ALL` = all GPT-5.6+ deployments; `STD / 6+` = Standard 5.6+ and PTU-M GPT-6+; `PTU 5.6` = Provisioned Throughput on GPT-5.6.

## Four-Stage Standing Governance Lifecycle <span class="ev-badge ev-arch">[Arch]</span>

1. **Stage I — Design & Lint:** Map every prompt family to Pos 1–6 and enforce `PCR001–006` in PR CI.
2. **Stage II — Shadow Eval:** Execute the 2-pass DeepEval quality + cache contract suite on candidate models.
3. **Stage III — Capacity Calibration:** Right-size base PTUs from 30-day sustained usage, empirical `PeakNormTPM`, and measured hit rates, paired with APIM Standard spillover.
4. **Stage IV — Continuous Assurance:** Monitor Layer 7 OTel/KQL drift alerts across model snapshot updates.
