---
title: 06 · Cache Write/Read Break-Even Economics
description: Mathematical break-even analysis balancing 1.25x cache-write weights against 0.10x / 0.05x cached-read weights across GPT-5.6, GPT-6, and GPT-6.1.
outline: [2, 3]
---

# 06 · Cache Write vs. Cache Read Break-Even Economics

Because GPT-5.6, GPT-6, and GPT-6.1 introduce explicit cache-write billing (including `12h` write billing effective November 1, 2026) and normalized PTU weights <span class="ev-badge ev-m">[M]</span>, architecture teams must verify that cached prefixes are read enough times within their TTL to amortize the initial write premium.

## Mathematical Break-Even Formula `[M]`

For a reusable prefix of `P >= 1,024` tokens written once at short-context (`<=272K`) normalized weight `w_write = 1.25` and read `k` subsequent times within its TTL at weight `w_read` (`0.10` on GPT-6, `0.05` on `gpt-6.1-sol`), the effective normalized weight per prefix token across `k + 1` total requests is:

```text
C(k) = (1.25 + k × w_read) ÷ (k + 1)
```

## Effective Prefix Cost Across Reuse Regimes

| Reuse Regime (`k` Reads per Write) | Read/Write Ratio (`k : 1`) | GPT-6 Effective Weight / Prefix Token | GPT-6.1 Sol Weight / Prefix Token | Architectural & FinOps Prescription |
| :--- | :--- | :--- | :--- | :--- |
| **One-shot (`k = 0`)** | `0 : 1` (Miss) | `1.25x` (**+25% penalty**) | `1.25x` (**+25% penalty**) | **Disable caching:** set `prompt_cache_options: {"mode":"explicit"}` with zero breakpoints <span class="ev-badge ev-m">[M]</span>. |
| **Single reuse (`k = 1`)** | `1 : 1` (Break-even+) | `0.675x` (**−32.5% net**) | `0.650x` (**−35.0% net**) | **Already net-positive:** just *one* cache hit more than pays back the `0.25x` write premium. |
| **Multi-turn session (`k = 4`)** | `4 : 1` | `0.330x` (**−67.0% net**) | `0.290x` (**−71.0% net**) | **Use `ttl: "30m"` (default):** covers typical 5-turn interactive review sessions. |
| **Steady gate target (`k = 10`)** | `10 : 1` <span class="ev-badge ev-agree">[Agree]</span> | `0.205x` (**−79.5% net**) | `0.159x` (**−84.1% net**) | **Production gate baseline:** unlocks `~5×–6×` prefix compression across shared `T0/L2` prefixes. |
| **Cross-day batch (`k >= 25`)** | `25 : 1+` | `0.144x` (**−85.6% net**) | `0.096x` (**−90.4% net**) | **Evaluate `ttl: "12h"` (Responses API):** justified when inter-arrival gaps exceed 30 minutes. |

::: info FinOps Takeaway
Break-even requires **only one subsequent read (`k = 1`)** on `30m` TTL. Cache-write regressions occur only when early volatile tokens (such as timestamps in Pos 1) force `k = 0` on *every* request—turning every call into an unamortized `1.25x` write.
:::
