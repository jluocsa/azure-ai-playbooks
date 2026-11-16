---
title: 09 · Explicit Cache Keys, >15 RPM Sharding & TTL
description: Wire-level configuration for Responses API and Chat Completions API on GPT-5.6, GPT-6, and GPT-6.1.
outline: [2, 3]
---

# 09 · Wire-Level Cache Configuration

Enterprise agent workloads on Azure OpenAI in Microsoft Foundry call both the **Responses API (`/openai/v1/responses`)** and the **Chat Completions API (`/openai/v1/chat/completions`)**. Both APIs support `prompt_cache_key`, `prompt_cache_options`, and `prompt_cache_breakpoint` on GPT-5.6+ <span class="ev-badge ev-m">[M]</span> (note: to combine function tools with active reasoning on `gpt-5.6`, use `/openai/v1/responses` <span class="ev-badge ev-m">[M]</span>).

## 1. `prompt_cache_key` Taxonomy & `>15 RPM` Sharding <span class="ev-badge ev-m">[M]</span>

Azure OpenAI routes requests sharing a `prompt_cache_key` to the same cache partition. Per Microsoft Learn, if traffic for one prefix + key combination exceeds **~15 requests per minute (RPM)**, overflow requests can miss the cache <span class="ev-badge ev-m">[M]</span>.

Use a deterministic four-part key format <span class="ev-badge ev-arch">[Arch]</span>:

```text
{app}:{node_or_skill}:{prompt_ver}:shard-{0..N-1}
```

- Compute `N = max(1, ceil(Peak_RPM / 12))` (for example, `8` shards for a `90 RPM` node: `doc-review:summarizer:v12:shard-0` through `shard-7`).
- Route deterministically by `shard = hash(thread_id) % N` so all turns of a conversation hit the same shard.
- **Never** embed `user_id`, `request_id`, or `uuid4()` in `prompt_cache_key` unless the prefix itself is user-unique.

## 2. Breakpoint Budgets & Minimum TTL Rules <span class="ev-badge ev-m">[M]</span>

- **Write budget:** Maximum **4 new cache writes** per request.
  - In `implicit` mode (default), the automatic breakpoint on the latest message consumes `1` write slot, leaving up to **3 explicit breakpoints**.
  - In `explicit` mode, up to **4 explicit breakpoints** can be written (and if zero breakpoints are present, caching and cache-write charges are completely disabled).
- **Read budget:** Azure OpenAI evaluates up to the latest **50 breakpoints** in the conversation; breakpoints from earlier turns are read-only.
- **Minimum TTL (`prompt_cache_options.ttl`):** `"30m"` (default on both APIs) or `"12h"` (supported on Responses API; `12h` cache-write billing applies from **November 1, 2026**). Legacy `prompt_cache_retention` is deprecated on GPT-5.6+.

## 3. Production Wire Payloads <span class="ev-badge ev-m">[M]</span>

### A. Responses API (`/openai/v1/responses`) — `implicit` Mode + `T0` & `L2` Breakpoints

```json
{
  "model": "gpt-5-6-prod-std",
  "prompt_cache_key": "doc-review:evidence-summarizer:v1:shard-2",
  "prompt_cache_options": { "mode": "implicit", "ttl": "30m" },
  "reasoning": { "effort": "medium", "context": "current_turn" },
  "input": [
    {
      "type": "message",
      "role": "developer",
      "content": [
        {
          "type": "input_text",
          "text": "<>= 1,024 tokens: static instructions + domain methodology>",
          "prompt_cache_breakpoint": { "mode": "explicit" }
        },
        {
          "type": "input_text",
          "text": "<Workspace L2 Context Card JSON (sorted keys)>",
          "prompt_cache_breakpoint": { "mode": "explicit" }
        }
      ]
    },
    {
      "type": "message",
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "<dynamic retrieved RAG chunks + current user question>"
        }
      ]
    }
  ],
  "tools": []
}
```

> **On GPT-5.6 PTU-M:** Omit `prompt_cache_options` and `prompt_cache_breakpoint`, while keeping `prompt_cache_key`, `reasoning.context`, and deterministic Pos 1–6 ordering intact.

### B. Chat Completions API (`/openai/v1/chat/completions`) — `explicit` Mode

```json
{
  "model": "gpt-5-6-rubric-std",
  "prompt_cache_key": "doc-review:control-evaluator:v12:shard-0",
  "prompt_cache_options": { "mode": "explicit", "ttl": "30m" },
  "messages": [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "<>= 1,024 tokens: static system + evaluation rubric>",
          "prompt_cache_breakpoint": { "mode": "explicit" }
        }
      ]
    },
    {
      "role": "user",
      "content": "<dynamic rubric item + evidence excerpt>"
    }
  ]
}
```
