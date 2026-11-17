---
title: 04 · SKU Boundary, PTU Sizing & Interactive Calculator
description: Standard vs. PTU-M breakpoint rules, official Microsoft Learn PTU sizing parameters, two-regime PTU math, and live estimator.
outline: [2, 3]
---

# 04 · Deployment SKU Boundary & PTU Capacity Math

Enterprise production workloads commonly pair **Provisioned Throughput (PTU-M)** base capacity with **Standard (Pay-As-You-Go)** spillover. Available caching parameters and PTU utilization formulas differ sharply between **GPT-5.6** and **GPT-6 / GPT-6.1** <span class="ev-badge ev-m">[M]</span>.

## 1. Standard vs. PTU-M Control Matrix `[M]`

| Dimension | Standard (PAYG) on GPT-5.6+ | Provisioned (PTU-M) on GPT-5.6 | Provisioned (PTU-M) on GPT-6 & GPT-6.1 |
| :--- | :--- | :--- | :--- |
| **Explicit breakpoints** | **Supported** — up to 4 new writes/request; `implicit` or `explicit` mode. | **Not supported** — automatic prefix caching active; breakpoints unavailable. | **Supported** — full breakpoint support on PTU-M deployments. |
| **`prompt_cache_key`** | **Supported** — primary routing hint for shared prefixes. | **Supported** — primary control lever alongside strict Pos 1–6 ordering. | **Supported** — combine with explicit breakpoints for multi-tier reuse. |
| **Benefit of a cache hit** | Discounted input-token billing + lower TTFT latency. | **100% deducted from PTU utilization** (`0` PTU draw) + lower TTFT. | Discounted normalized token weight: **`0.1x`** (GPT-6) or **`0.05x`** (6.1 Sol). |
| **Impact of miss / rewrite** | Full input price + cache-write fee + higher TPM draw. | Full prompt counted against PTU budget; risk of HTTP `429` at peak. | Uncached input at `1.0x` + cache write at **`1.25x`** (short) / **`2.5x`** (long). |
| **Primary engineering levers** | Prompt structure + `prompt_cache_key` + breakpoints + TTL. | **Prompt structure + `prompt_cache_key` + key sharding** (`>15 RPM`). | Prompt structure + `prompt_cache_key` + breakpoints + write minimization. |

## 2. Official Microsoft Learn PTU Sizing Parameters `[M]`

| Model & Version | Input TPM / PTU | Min PTU (Global/DZ \| Reg) | Scale Increment | PTU Capacity Formula & Cache Accounting Rule <span class="ev-badge ev-m">[M]</span> |
| :--- | :--- | :--- | :--- | :--- |
| `gpt-5.6-luna` (2026-07-09) | **30,000** | `15` \| `15` | `5` \| `5` | Output ratio `6x`; cached input deducted **100%** (`0` PTU draw). |
| `gpt-5.6-terra` (2026-07-09) | **3,000** | `15` \| `15` | `5` \| `5` | Output ratio `6x`; cached input deducted **100%** (`0` PTU draw). |
| `gpt-5.6-sol` (2026-07-09) | **1,200** | `15` \| `15` | `5` \| `5` | Output ratio `6x`; cached input deducted **100%** (`0` PTU draw). |
| `gpt-5.4` / `5.4-mini` | **2,400** / **7,900** | `15` \| `50` / `25` | `5` \| `50` / `25` | Output ratio `6x`; cached input deducted **100%** (common baseline). |
| `gpt-6-astra` (2026-09-03) | **600** | `15` \| `25` | `5` \| `25` | Normalized weights: input `1.0`, cached read `0.1`, write `1.25`, output `5.0`. |
| `gpt-6-luna` (2026-09-22) | **59,400** | `15` \| `15` | `5` \| `5` | Normalized weights: input `1.0`, cached read `0.1`, write `1.25`, output `5.0`. |
| `gpt-6-sol` (2026-09-22) | **3,000** | `15` \| `15` | `5` \| `5` | Normalized weights: input `1.0`, cached read `0.1`, write `1.25`, output `5.0`. |
| `gpt-6.1-sol` (2026-09-29) | **3,000** | `15` \| `25` | `5` \| `25` | Normalized weights: input `1.0`, **cached read `0.05`**, write `1.25`, output `5.0`. |

*Note on context tiers & regional minimums:* On 1.05M-context models (`gpt-5.6-*`, `gpt-6-*`, `gpt-6.1-sol/terra`), short-context rates apply up to **272K input tokens**; long-context (`>272K` input) weights on GPT-6/6.1 use `2.0x` input, `0.2x`/`0.1x` cached read, `2.5x` write, and `7.5x` output (`>128K` triggers PTU spillover on `gpt-5.4` and `gpt-4.1*`). Global and Data Zone minimum PTU is `15` across both Microsoft Learn sizing docs and Azure OpenAI Pricing (for Regional PTU on `5.6-sol/terra`, Learn sizing lists `15` while Azure Pricing lists `50`—verify in target region).

## 3. Two-Regime PTU Sizing Math & Worked Example

- **Regime 1 — Pre-GPT-6 (including GPT-5.6):**
  - `Normalized TPM = Input TPM × (1 − Cache Rate) + (6 × Output TPM)`
  - `Raw PTUs = Normalized TPM ÷ Input TPM per PTU` &rarr; **round up to the 5-PTU scale increment**
  - At `100 RPM`, `10,000` input tokens, and `500` output tokens on `gpt-5.6-terra` (`3,000` Input TPM/PTU):
    - **80% cache hit rate:** `500,000 Normalized TPM` &rarr; `166.7` raw &rarr; **170 PTUs** (at the 5-PTU increment).
    - **0% cache hit rate:** `1,300,000 Normalized TPM` &rarr; `433.3` raw &rarr; **435 PTUs** (**2.56× deployed PTU spike**; `2.60×` raw TPM).
- **Regime 2 — GPT-6 & GPT-6.1 Normalized Tokens (`<=272K`):**
  - `Normalized TPM = (Uncached × 1.0) + (Cached Read × w_read) + (Cache Write × 1.25) + (Output × 5.0)`
  - Where `w_read = 0.10` on GPT-6 and `0.05` on `gpt-6.1-sol`. Size base PTUs so steady peak demand stays below queuing saturation (`~60–70%` utilization).

## 4. Live PTU & Cache-Shard Estimator

<PtuCalculator />

::: tip Seasonal Filing-Cliff & Deal-Sprint Workloads
For advisory, assurance, tax, legal, and compliance platforms with `3×–6×` statutory filing or fiscal-close surges, avoid sizing 12-month PTU reservations for peak-month cliffs—see [Seasonal Filing-Cliff & Deal-Sprint PTU Economics](/playbooks/prompt-caching/profiles/regulated-multi-engagement#3-seasonal-filing-cliff-deal-sprint-ptu-economics) (`71%` hybrid PTU-M + Standard spillover savings).
:::
