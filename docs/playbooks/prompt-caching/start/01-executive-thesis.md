---
title: 01 · Executive Thesis & Core Questions
description: Architectural thesis and verified engineering answers for migrating stateless enterprise agents to GPT-5.6, GPT-6, and GPT-6.1 across Standard and PTU-M deployments.
outline: [2, 3]
---

# 01 · Executive Thesis & Core Migration Questions

<PlaybookMeta
  track="01 · Prompt Caching & PTU Readiness (GPT-5.6+)"
  provenance="Customer-Zero Validated (Regulated Multi-Node Agent Platform)"
  governance="Sanitized · Peer Reviewed · IP Screened"
  owners="John Luo (@jluocsa) · Co-Authors Welcome"
  verified="2026-11-16"
  status="Live v1.0"
  paperHref="/papers/foundry-prompt-caching-gpt56-whitepaper"
  paperLabel="Single-Page White Paper →"
/>

Enterprise AI applications—such as **rubric-scoring / control-evaluation agents** and multi-node document-review workflows—assemble multi-thousand-token prompts combining system policies, skill catalogs, tool schemas, workspace context cards, and retrieved grounding evidence.

Migrating these workloads from `gpt-4.x` or `o3-mini` to **GPT-5.6, GPT-6, and GPT-6.1** without explicit prefix engineering causes cache misses, a **2.56× spike in deployed PTU draw** (`2.60×` raw TPM), higher time-to-first-token (TTFT) latency, and unamortized cache-write charges.

::: info Four Architectural Conclusions
1. **Prompt caching remains active on GPT-5.6+**, but introduces an explicit control surface (`prompt_cache_key`, `prompt_cache_options`, `prompt_cache_breakpoint`), TTL-tiered cache-write billing, and a default `reasoning.context = "all_turns"` setting on GPT-5.6 and GPT-6 that amplifies multi-turn token volume <span class="ev-badge ev-m">[M]</span>.
2. **Deployment SKU dictates available controls:** Explicit breakpoints work on **Standard 5.6+** and **PTU-M GPT-6+**, whereas **GPT-5.6 on PTU-M does not support breakpoints** and relies on strict prefix ordering + `prompt_cache_key` <span class="ev-badge ev-m">[M]</span>.
3. **In a stateless web backend (Model 2), Azure KV caching is the only cross-turn hydration cache:** Dynamic fields injected early by middleware (e.g., live timestamps or user IDs) silently zero out cache hits.
4. **Caching readiness belongs inside the 7-layer quality gate** alongside accuracy and safety checks so model-retirement waves never degrade production capacity or latency.
:::

## Core Engineering Questions for GPT-5.6, GPT-6 & GPT-6.1 Migrations

| Architectural Question | Verified Engineering Answer & Design Implication | Where Covered |
| :--- | :--- | :--- |
| **Does implicit (automatic) caching continue to apply on GPT-5.6+, or is explicit configuration required?** | `implicit` mode remains default <span class="ev-badge ev-m">[M]</span>, but GPT-5.6+ bills for cache writes, defaults `reasoning.context` to `all_turns` (on 5.6 and 6), and relies on key-assisted routing. Unstructured prompts suffer misses and paid writes; always set `prompt_cache_key` and enforce static-first prefix ordering. | [03 · KV Mechanics](./03-kv-mechanics), [09 · Wire Controls](../design/09-wire-controls) |
| **How should prompts be structured when tools, instructions, and retrieved context coexist?** | Align prompt assembly with a **Scope × Volatility taxonomy** <span class="ev-badge ev-arch">[Arch]</span>: (1) `response_format` + `T0` system/skill definitions, (2) sorted `tools[]`, (3) static domain methodology, (4) `L2` workspace/case card, (5) `L1` persona + append-only history, (6) live RAG/MCP & timestamps last. | [02 · Stateless Agents](./02-stateless-agents), [07 · Prefix Order](../design/07-prefix-taxonomy) |
| **How do explicit cache breakpoints work, and where should they be placed?** | `prompt_cache_breakpoint: {"mode":"explicit"}` marks the end of a reusable prefix (`>=1,024` tokens) <span class="ev-badge ev-m">[M]</span>. Supported on Standard 5.6+ and PTU-M GPT-6+, **not on GPT-5.6 PTU-M**. Place Breakpoint #1 after `T0` static instructions/tools and Breakpoint #2 after the `L2` workspace card. | [04 · PTU Math](../qualify/04-ptu-sizing-math), [07 · Prefix Order](../design/07-prefix-taxonomy) |
| **How do cache hits and misses affect PTU sizing and TPM rate limits?** | On pre-GPT-6 PTU-M (incl. GPT-5.6), cached tokens consume **0% PTU capacity**; on GPT-6/6.1 PTU-M, cached reads weigh `0.1x` / `0.05x` vs. `1.25x` for writes <span class="ev-badge ev-m">[M]</span>. Dropping from 80% to 0% cache hits spikes deployed PTU draw by **2.56×** (`170 → 435 PTUs` at the 5-PTU increment; `2.60×` raw TPM). | [04 · PTU Math](../qualify/04-ptu-sizing-math), [06 · Break-Even](../qualify/06-breakeven-economics) |
| **How can platform governance automatically prevent un-cached code from promoting?** | Adopt `PCR001–PCR006` static AST/regex lint rules in Layer 1 CI, a 2-pass DeepEval cache contract assertion in Layer 2 Prompt Evals, and two-regime App Insights KQL gates in Layer 7 Observability. | [11 · 7-Layer Gates](../validate/11-seven-layer-gates), [12 · Linter & Eval](../validate/12-ci-lint-deepeval), [13 · KQL Gate](../govern/13-otel-kql-gate) |

## Why Model Migration Readiness Should Be a Standing Discipline

Across enterprise AI portfolios, engineering teams face recurring model retirement waves—moving from `gpt-4.x`, `o3-mini`, or `gpt-5.4` onto `gpt-5.6`, `gpt-6`, and `gpt-6.1` while calibrating Provisioned Throughput (PTU-M) reservations against Standard PAYG spillover. Treating **prompt prefix architecture, two-regime PTU sizing, and 7-layer quality gates** as one standing engineering standard eliminates deadline-driven firefighting on every model transition.
