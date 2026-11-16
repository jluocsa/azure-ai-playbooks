---
title: 05 · Enterprise Agent Node Archetypes
description: Eight recurring enterprise LLM node archetypes with prefix sizes, primary cache-miss risks, target cached shares, and GPT-5.6+ prescriptions.
outline: [2, 3]
---

# 05 · Enterprise Agent Node Archetypes

Multi-node enterprise AI platforms (such as rubric-scoring evaluators, compliance reviewers, and multi-agent RAG orchestrators) combine distinct LLM node archetypes with different prefix sizes, RPM profiles, and SKU controls <span class="ev-badge ev-arch">[Arch]</span>.

## Archetype Classification & Caching Prescription Matrix <span class="ev-badge ev-arch">[Arch]</span>

| Agent Node Archetype | Typical Prefix (Pos 1–4) | Primary Cache-Miss Risk on Migration | Target Cached Share <span class="ev-badge ev-agree">[Agree]</span> | GPT-5.6+ Caching Prescription |
| :--- | :--- | :--- | :--- | :--- |
| **1. Rubric / Control Evaluator** | `2,500–6,000` tok (rubric + schema) | Dynamic enum values mutated inside `response_format` or Pos 1 system prompt. | **70%–85%** | Static `response_format`; Breakpoint #1 after Pos 3 rubric; evidence payload in Pos 6. |
| **2. Evidence & Document Summarizer** | `1,800–4,500` tok (policy + L2 card) | Retrieved RAG chunks prepended ahead of synthesis instructions. | **60%–75%** | Breakpoint #1 on `T0` policy, Breakpoint #2 on `L2` card; RAG chunks in Pos 6. |
| **3. High-RPM Guardrail / Intent Router** | `1,200–2,000` tok (routing rules) | Exceeding `~15 RPM` on a single unsharded `prompt_cache_key` at peak load. | **80%–90%** | Shard `prompt_cache_key` across `N = ⌈RPM ÷ 12⌉` deterministic buckets. |
| **4. Methodology & Taxonomy Classifier** | `3,000–8,000` tok (taxonomy catalog) | Taxonomy definitions rebuilt in non-deterministic dictionary order across replicas. | **85%–92%** | Canonical JSON sort (`sort_keys=True`); Breakpoint #1 after catalog. |
| **5. Tool-Calling Orchestrator** | `2,000–5,500` tok (`tools[]` + skills) | Per-turn tool filtering or unsorted MCP `tools[]` array invalidating Pos 2. | **65%–80%** | Pin stable toolset per skill family; sort `tools[]` by function name. |
| **6. Groundedness & Citation Verifier** | `1,500–3,200` tok (verification rubric) | Sharing the same `prompt_cache_key` as the generator node, thrashing cache slots. | **70%–85%** | Dedicated verifier `prompt_cache_key`; pin `reasoning.context: "current_turn"`. |
| **7. Multi-Turn Follow-Up Rewriter** | `1,200–4,000` tok (sys + history) | Sliding-window front truncation or GPT-5.6/6 default `all_turns` reasoning bloat. | **65%–80%** | Append-only session turns in Pos 5; pin `reasoning.context: "current_turn"`. |
| **8. One-Shot Short-Prefix Extractor** | `<1,024` tok (below min threshold) | Paying `1.25x` cache-write weight on one-shot calls with zero subsequent reads. | **N/A (`<1,024t`)** | Set `prompt_cache_options: {"mode":"explicit"}` with zero breakpoints on Standard / 6+. |

::: tip Portfolio Prioritization Rule
During Week 1 of a [Readiness Engagement](/operating-model/delivery-scoping), rank all LLM nodes by **`Peak RPM × Prompt Tokens`** and refactor the top 3 archetypes first—they typically account for **75%–85% of total PTU and token spend**.
:::
