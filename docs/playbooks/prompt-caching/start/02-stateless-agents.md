---
title: 02 · Stateless Agents & Per-Turn Hydration Tax
description: Why Model 2 stateless enterprise web backends depend on Azure OpenAI KV prefix caching as their cross-turn hydration memory.
outline: [2, 3]
---

# 02 · Stateless Agent Runtimes & the Hydration Tax

Production enterprise agent platforms follow a **Model 2 stateless web backend pattern** (constructed and torn down on every HTTP request) rather than a **Model 1 stateful local CLI process** (resident in memory across turns) <span class="ev-badge ev-arch">[Arch]</span>.

Each turn hydrates three context tiers and transmits the full prompt over the wire:

- **`T0` (Global Static Layer):** Read-only system policies, skill headers, sorted tool schemas, and domain methodology mounted in the container image.
- **`L2` (Workspace / Case Context Card):** Shared engagement, project, or tenant scope facts loaded from the application database.
- **`L1` (User Persona & Session Checkpoints):** Operator preferences and append-only conversation turns rehydrated by `thread_id`.

## Per-Turn Hydration vs. Azure OpenAI KV Prefix Cache

```mermaid
flowchart LR
    subgraph Stores["Durable Context Stores"]
      T0["T0 Static Layer (RO)\nSkills, tools, domain rules"]
      DB["Session & Scope DB\nL2 Workspace Card,\nL1 Persona & Checkpoints"]
      RAG["Live RAG & MCP Tools\nAI Search, Enterprise APIs"]
    end

    subgraph Runtime["Stateless Agent Turn (Per-HTTP Request)"]
      Loader["Composite Context Loader\nHydrates T0, L2, L1"]
      MW["Session Context Middleware\nOrders Pos 1–6 + canonical tool JSON"]
      Wire["Wire Payload (/v1/responses or /chat)\nResends full hydrated prefix every call"]
      Loader --> MW --> Wire
    end

    subgraph KV["Azure OpenAI / Foundry KV Cache"]
      Hit["Cached Prefix Hit (>= 1,024 tok)\nReuses KV tensors for T0 & L2\n5.6 PTU-M: 0% draw | Std: discounted"]
      Miss["Early Prefix Mutation (e.g. Pos 1 timestamp)\nRecomputes all 4k–12k tokens every call\n100% PTU draw + unamortized write fee"]
    end

    T0 --> Loader
    DB --> Loader
    RAG --> MW
    Wire --> Hit
    Wire -.->|"If Pos 1–3 mutates"| Miss
```

## Model 1 (Stateful Local CLI) vs. Model 2 (Stateless Enterprise Backend) <span class="ev-badge ev-arch">[Arch]</span>

| Runtime Property | Model 1 — Stateful Local Agent (CLI) | Model 2 — Stateless Enterprise Backend (Container Service) |
| :--- | :--- | :--- |
| **Process & state lifetime** | Long-lived process; local disk and in-memory state remain warm across the session. | **Constructed and destroyed per turn:** Each HTTP request executes one turn and tears down; no state survives in process memory between turns. |
| **Skills & domain rules** | Local skill files and prompt templates loaded once at startup. | **Container image & registry mounts (`T0`):** Static system policies, skill definitions, and domain rubrics assembled into the prompt on every turn. |
| **Context hydration** | Cumulative transcript stays resident in local process memory. | Rehydrated per request from durable session checkpoints (by `thread_id`) + scoped **Workspace (`L2`)** and **User (`L1`)** context records. |
| **Token & PTU cost model** | Static context reads amortize across the local process lifetime. | **Every LLM call pays a hydration tax over the wire** unless the assembled prompt prefix hits the **Azure OpenAI KV Prefix Cache**. |

::: tip Core Architectural Insight
Because a stateless backend rehydrates and resends system instructions, skill catalogs, tool schemas, domain methodology, and checkpointed history on *every single LLM call*—and a single user turn in a multi-node review graph invokes the LLM **3 to 8 times**—**Azure OpenAI prompt caching is the stateless backend's cross-turn memory**. Preserving byte-identical prefix ordering across turns is an architectural invariant, not a micro-optimization.
:::
