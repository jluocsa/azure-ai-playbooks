---
title: 03 · Repeatable Readiness Engagement Scope
description: Turnkey intake qualification scorecard and 3-week structured delivery blueprint for scoping proactive Foundry model migration & PTU readiness engagements.
outline: [2, 3]
---

# 03 · Repeatable Readiness Engagement Scope

A core goal of Solution Industrialization is making architecture patterns **immediately scopable as repeatable proactive delivery engagements**. Any engineering lead or delivery manager can use the intake scorecard and 3-week blueprint below to scope a **Foundry Model Migration, Prompt Caching & PTU Readiness Engagement**.

## 1. Intake Qualification Scorecard

Capture **orders of magnitude and architectural boundaries** during a 30-minute intake call—not false precision:

| Qualification Dimension | Discovery Question | Architectural Branch Triggered |
| :--- | :--- | :--- |
| **1. Migration Trigger & Timeline** | Which retiring or baseline models (`gpt-4o`, `gpt-4.1`, `o3-mini`, `gpt-5.4`) are migrating to `gpt-5.6`, `gpt-6`, or `gpt-6.1`, and what is the cutover date? | Determines whether pre-GPT-6 (`0%` cached PTU draw, `6x` output) or GPT-6/6.1 normalized weights (`0.1x`/`0.05x` read, `1.25x` write, `5.0x` output) govern sizing. |
| **2. Agent Runtime Lifespan** | Is the workload a **Model 2 stateless container/web service** (rehydrating system prompt, tools, and history per HTTP turn) or a stateful worker? | Stateless multi-node agents invoke the LLM `3–8×` per user turn; prefix caching is mandatory cross-turn hydration memory. |
| **3. Deployment SKU Mix** | Will production run **Provisioned Throughput (PTU-M)**, **Standard (PAYG)**, or **PTU-M primary + Standard spillover** behind APIM? | On **GPT-5.6 PTU-M**, explicit breakpoints are unsupported—APIM must strip breakpoint fields on the PTU leg while preserving `prompt_cache_key`. |
| **4. Prefix Size & Peak Concurrency** | Do static instructions + tool schemas exceed **1,024 tokens**, and does any prompt family exceed **~15 RPM** at peak? | Prefixes `<1,024` tokens cannot cache (disable writes on 5.6+); families `>15 RPM` require deterministic `prompt_cache_key` sharding (`N = ⌈RPM ÷ 12⌉`). |
| **5. Existing CI & Telemetry Maturity** | Does the team already run automated prompt evaluations (`pytest` / DeepEval / Foundry Evals) and emit OpenTelemetry spans to Application Insights? | Determines effort needed to wire `PCR001–006` static linting, 2-pass cache assertions, and the Log Analytics KQL release gate. |

## 2. Phased 3-Week Delivery Blueprint

| Phase | Core Engineering Activities | Concrete Exit Artifact |
| :--- | :--- | :--- |
| **Week 1: Baseline Audit & Prefix Mapping** | • Inventory top prompt families / agent nodes by token volume and peak RPM.<br>• Run `PCR001–PCR006` audit for early timestamps, unsorted `tools[]`, mutated `response_format`, and unpinned `reasoning.context`.<br>• Capture baseline quality, TTFT p50/p95, and `cached_tokens` on current vs. un-tuned target model (50–200 golden cases). | **1. Prefix Audit & Baseline Ablation Report** (quantifying un-tuned miss rate & PTU exposure). |
| **Week 2: Prefix Refactoring, Sharding & Gateway Wiring** | • Refactor context assembly middleware to strict `Pos 1–6` (`T0 → L2 → L1 → Volatile Tail`) order.<br>• Add deterministic `prompt_cache_key` with `>15 RPM` sharding and SKU-aware breakpoints (`Standard` / `GPT-6+ PTU-M`).<br>• Configure APIM `429 Retry-After` circuit-breaker spillover from PTU-M to Standard PAYG. | **2. Refactored Context Middleware & SKU-Aware APIM Policy** validated in non-prod. |
| **Week 3: 7-Layer Gate Verification & PTU Right-Sizing** | • Execute 2-pass DeepEval quality + cache parity suite (`cached_tokens >= 1024`, share `>=60%`, `R/W >= 10:1`).<br>• Run peak concurrency load test (`>15 RPM/family`) verifying zero HTTP `429`s below `60–70%` PTU saturation.<br>• Deploy App Insights KQL workbook and finalize right-sized PTU reservation model. | **3. Signed `C1–C15` Migration Readiness Record + Right-Sized PTU Capacity Model**. |

## 3. Roles & Ownership Boundaries

| Role | Responsibility During the 3-Week Engagement |
| :--- | :--- |
| **Cloud Solution Architect (Advisor)** | Leads intake scorecard, `Pos 1–6` prefix architecture workshop, APIM spillover design review, and two-regime PTU sizing verification. |
| **Customer App / Prompt Lead** | Refactors prompt/middleware ordering, canonicalizes `tools[]` JSON serialization, and owns the 50–200 case golden evaluation dataset. |
| **Customer Platform / SRE Lead** | Implements APIM backend pool failover policy, OpenTelemetry `gen_ai.*` span attributes, DCR PII masking, and KQL alert rules. |
| **Customer FinOps / Capacity Lead** | Reviews `PeakNormTPM` vs. `AvgNormTPM` telemetry and approves the final Global / Data Zone PTU allocation + Standard spillover budget. |
