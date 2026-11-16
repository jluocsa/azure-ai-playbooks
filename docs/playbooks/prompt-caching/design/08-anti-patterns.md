---
title: 08 · Eliminating Prefix-Breaking Anti-Patterns
description: Six concrete code-level causes of cache misses in agent harnesses and how to refactor context assembly middleware.
outline: [2, 3]
---

# 08 · Eliminating Prefix-Breaking Anti-Patterns

A single dynamic byte inside the first 1,024 tokens forces `cached_tokens = 0` and, on GPT-5.6+ Standard or GPT-6+ PTU-M, writes a new unamortized cache entry <span class="ev-badge ev-m">[M]</span>. Below are the six prefix-breaking patterns most frequently uncovered during codebase audits.

## Six Middleware & Tooling Anti-Patterns <span class="ev-badge ev-arch">[Arch]</span>

| Anti-Pattern | Why It Breaks Caching in the Agent Runtime | Required Engineering Fix |
| :--- | :--- | :--- |
| **1. Early request-context timestamp & user ID injection** | Middleware prepending `request_timestamp: "2026-11-16T09:12:03Z"` or `user_id` at the top of `system` mutates the prefix around token `~40` on every call. | Keep Positions 1–3 100% user- and time-agnostic. Place scoped `L2`/`L1` cards at Positions 4–5, and pass timestamps in Position 6 only when date reasoning is needed. |
| **2. Non-deterministic `tools[]` schema serialization** | Building an agent's toolset from an unordered `set`/dict or dynamic MCP discovery changes tool order or JSON key order across container replicas. | Sort tools by `tool["function"]["name"]` (or Responses `tool["name"]`) and canonicalize schemas with `json.dumps(..., sort_keys=True)` at startup. |
| **3. Dynamic `response_format` schema mutations** | Azure OpenAI prepends the structured output schema *before* the system message <span class="ev-badge ev-m">[M]</span>. Mutating enum lists or field descriptions per request invalidates token `0`. | Keep `response_format` schemas static per node/skill version; pass dynamic allowed codes in Position 6 instead of mutating the JSON schema. |
| **4. Prepending RAG passages ahead of instructions** | Prompt templates placing retrieved search chunks at the top (*"Given these documents..."*) invalidate everything after token `0` on every query. | Move static role, policy, rubric rules, and few-shot examples to Positions 1–3; inject retrieved RAG passages inside the final user turn (Position 6). |
| **5. Sliding-window front truncation & unbounded `all_turns` reasoning** | Dropping turn 1 when turn 6 arrives shifts every subsequent token offset; meanwhile `gpt-5.6`/`6` default `reasoning.context` to `all_turns` <span class="ev-badge ev-m">[M]</span>, inflating multi-turn input tokens. | Keep history append-only within a session window; set `reasoning.context: "current_turn"` when cross-turn reasoning replay is unnecessary, and compact via periodic checkpoints. |
| **6. Per-turn tool filtering ahead of static context** | Adding/removing tools dynamically on every turn mutates Position 2, invalidating Position 3 static reference blocks that follow. | Keep a stable toolset per skill/node family (and route distinct skills to separate `prompt_cache_key` prefixes). |

## Middleware Refactoring Pattern (Before vs. After)

```python
import json

# ❌ ANTI-PATTERN: Injecting live timestamp & user_id at the top of the system prompt
def build_messages_broken(req_ctx: dict, static_policy: str, domain_methodology: str, rag_chunks: str, query: str):
    # Token ~15 mutates on EVERY call because req_ctx["timestamp"] is a live ISO timestamp!
    sys_text = f"<session_context>{json.dumps(req_ctx)}</session_context>\n{static_policy}\n{domain_methodology}"
    return [{"role": "system", "content": sys_text}, {"role": "user", "content": f"{rag_chunks}\n{query}"}]


# ✅ CACHE-READY PATTERN: Strict T0 -> L2 -> L1 -> Volatile Tail ordering with SKU-aware breakpoints
def build_messages_cache_ready(
    static_policy: str,
    domain_methodology: str,
    l2_workspace_card: dict,
    l1_persona_card: dict,
    history: list[dict],
    rag_chunks: str,
    query: str,
    supports_explicit_breakpoints: bool,  # True on Standard 5.6+ & PTU-M GPT-6+; False on PTU-M GPT-5.6
):
    t0_block = {"type": "text", "text": f"{static_policy}\n\n{domain_methodology}"}      # Pos 1 & 3 (>= 1,024 tokens)
    l2_block = {"type": "text", "text": json.dumps(l2_workspace_card, sort_keys=True)}   # Pos 4 (shared per scope_id)
    l1_block = {"type": "text", "text": json.dumps(l1_persona_card, sort_keys=True)}     # Pos 5 (shared per user_id)

    if supports_explicit_breakpoints:
        t0_block["prompt_cache_breakpoint"] = {"mode": "explicit"}  # Breakpoint #1: global reuse across all users
        l2_block["prompt_cache_breakpoint"] = {"mode": "explicit"}  # Breakpoint #2: workspace-wide reuse

    return [
        {"role": "system", "content": [t0_block, l2_block, l1_block]},
        *history,  # Pos 5b: append-only checkpointed turns
        {"role": "user", "content": f"<retrieved_grounding>\n{rag_chunks}\n</retrieved_grounding>\n\n{query}"},  # Pos 6
    ]
```
