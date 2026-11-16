---
title: 10 · APIM SKU-Aware PTU-to-Standard Spillover
description: Reference topology pairing right-sized PTU-M base capacity with SKU-aware Standard PAYG spillover behind Azure API Management.
outline: [2, 3]
---

# 10 · APIM SKU-Aware PTU-to-Standard Spillover

Rolling 30-day PTU right-sizing works best when base **Global / Data Zone PTU-M** capacity is sized for steady sustained demand (staying below `~60–70%` queuing saturation) and paired with automatic **Standard (PAYG) spillover** via Azure API Management (APIM) on HTTP `429` <span class="ev-badge ev-arch">[Arch]</span>.

## SKU-Aware Gateway Routing Topology <span class="ev-badge ev-arch">[Arch]</span>

```mermaid
flowchart LR
    App["Stateless Enterprise Agent\n• Pos 1–6 static-first prefix\n• Sharded prompt_cache_key\n• reasoning.context pinned\n• Breakpoints on Pos 3 & 4"]
    APIM["Azure API Management\n& SKU Adapter Policy\n1. Preserves prompt_cache_key\n2. Strips breakpoint fields when\n   target = GPT-5.6 PTU-M\n3. Circuit-breaks on 429 Retry-After"]
    PTU["Primary: Provisioned (PTU-M)\n• Sized below queuing saturation\n• 0% cached draw on 5.6 PTU-M\n• 0.1x / 0.05x read weight on GPT-6/6.1"]
    STD["Spillover: Standard (PAYG)\n• Absorbs burst traffic above PTU ceiling\n• Honors explicit breakpoints on 5.6+\n• Reports cache_write_tokens"]

    App --> APIM
    APIM -->|"Primary route"| PTU
    APIM -.->|"429 Retry-After failover"| STD
```

## Critical Gateway Rules When Mixing GPT-5.6 PTU-M & Standard

1. **Preserve `prompt_cache_key` across both legs:** Keep the exact sharded `prompt_cache_key` unchanged when failing over from PTU-M to Standard so repeated spillover requests still group onto the same Standard cache partition.
2. **Strip unsupported breakpoint fields on the GPT-5.6 PTU-M leg:** Because GPT-5.6 PTU-M does not support `prompt_cache_breakpoint` or `prompt_cache_options` <span class="ev-badge ev-m">[M]</span> (whereas GPT-5.6 Standard and GPT-6+ PTU-M do), let the gateway adapter strip those fields when forwarding to a GPT-5.6 PTU-M backend while leaving them intact on Standard spillover and GPT-6+ PTU-M.
3. **Bound retries & honor `Retry-After`:** Open the primary backend's circuit breaker for the returned `Retry-After` duration on HTTP `429`, route burst calls cleanly to Standard, and never replay mid-stream SSE failures.
