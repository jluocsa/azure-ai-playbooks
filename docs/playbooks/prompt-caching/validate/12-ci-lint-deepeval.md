---
title: 12 · PCR001–006 Static Linter & 2-Pass DeepEval Gate
description: Automated CI static scanner rules (PCR001–PCR006) and illustrative 2-pass DeepEval quality + prompt-caching contract test.
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 12 · Automated CI Scanner (`PCR001–006`) & DeepEval Gate

Prevent un-cached code from promoting by enforcing two automated checks in pull-request CI: **(1)** static AST/regex linting (`PCR001–PCR006`) in Layer 1, and **(2)** a 2-pass DeepEval quality + cache-hit contract test in Layer 2 <span class="ev-badge ev-arch">[Arch]</span>.

## 1. Layer 1: Static Codebase Scanner Rule Catalog (`PCR001–PCR006`)

Preview and copy the full zero-dependency CLI scanner on the [Copy-Ready Engineering Kits](/papers/engineering-kits#pcr-linter) page (or download <a :href="withBase('/kits/pcr_lint.py')" download target="_blank" rel="noopener"><code>pcr_lint.py</code></a> directly: `python3 pcr_lint.py ./src`).

| Rule ID | Defect Flagged | AST / Regex Detection Specification (Python, C#, TypeScript) | Readiness Item |
| :--- | :--- | :--- | :--- |
| `PCR001` | Missing or high-cardinality `prompt_cache_key` | Calls to `responses.create` / `chat.completions.create` on `gpt-5.6*` or `gpt-6*` missing `prompt_cache_key`, or interpolating `user_id`, `request_id`, `uuid4()`, `engagement_id`, `matter_id`, `client_id`, or `cost_center` into the key. | `C6`, `C7` |
| `PCR002` | Dynamic values in Position 1 system/developer prompt | Interpolation of `datetime.now`, `DateTime.UtcNow`, `Date.now`, `timestamp`, `uuid`, or per-request context (`req_ctx`) inside the leading `system` / `developer` block. | `C2` |
| `PCR003` | Non-deterministic `tools[]` or JSON schema order | Building `tools` from unsorted sets/dicts or serializing tool/context JSON in Positions 1–4 without `sort_keys=True` (or canonical C#/TS serializer settings). | `C3` |
| `PCR004` | RAG chunks or live MCP data ahead of static prefix | Prompt builders placing `rag_chunks`, `search_results`, or live enterprise MCP outputs before static instructions, ontology blocks, or tool schemas. | `C4` |
| `PCR005` | Invalid breakpoint, retention, or `reasoning.context` | Sending `prompt_cache_breakpoint` to pre-5.6 (HTTP `400`) or `5.6` PTU-M (unsupported); sending deprecated `prompt_cache_retention` to `5.6+`; or unpinned multi-turn `reasoning.context`. | `C8`, `C9`, `C10` |
| `PCR006` | Missing telemetry extraction for cache tokens | LLM client wrappers logging `input_tokens` / `prompt_tokens` while omitting `input_tokens_details` / `prompt_tokens_details.cached_tokens` and `cache_write_tokens`. | `C11` |

## 2. Layer 2: Unified DeepEval Quality + 2-Pass Cache Contract Test

Illustrative CI pattern normalizing usage fields across both the **Responses API** (`input_tokens` / `input_tokens_details`) and **Chat Completions API** (`prompt_tokens` / `prompt_tokens_details`):

```python
import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import GEval


def _extract_cache_usage(resp) -> tuple[int, int, str]:
    """Normalize usage & text across Responses API (/v1/responses) and Chat Completions."""
    u = resp.usage
    input_tok = getattr(u, "input_tokens", None) or getattr(u, "prompt_tokens", 0)
    details = getattr(u, "input_tokens_details", None) or getattr(u, "prompt_tokens_details", None)
    cached_tok = getattr(details, "cached_tokens", 0) or 0
    text = getattr(resp, "output_text", None) or resp.choices[0].message.content
    return input_tok, cached_tok, text


# Illustrative — bind invoke_node() and golden_cases (sharing >=1,024-token Pos 1-4 prefix) to your app client
@pytest.mark.parametrize("model", ["gpt-5.4", "gpt-5.6-prod-ptu"])
def test_node_migration_quality_and_cache_gate(model, golden_cases):
    """Layer 2 Gate: Verifies GEval accuracy AND 2-pass prompt cache hit rate on GPT-5.6+."""
    case_a, case_b = golden_cases[0], golden_cases[1]  # Distinct Pos 6 inputs sharing identical Pos 1-4 prefix

    # Pass 1: Cold/warm write call with deterministic family+version+shard key
    r1 = invoke_node(case_a["input"], model=model, prompt_cache_key="doc-review:summarizer:v12:shard-0")
    # Pass 2: Second case with identical static/workspace prefix (Pos 1-4) and different dynamic tail (Pos 6)
    r2 = invoke_node(case_b["input"], model=model, prompt_cache_key="doc-review:summarizer:v12:shard-0")

    _, _, out_a = _extract_cache_usage(r1)
    input_tok_b, cached_tokens, _ = _extract_cache_usage(r2)
    assert cached_tokens >= 1024, f"[{model}] Expected cache hit >= 1024 tokens on Pass 2, got {cached_tokens}"
    assert (cached_tokens / max(input_tok_b, 1)) >= 0.60, "Cached input share fell below 60% gate"
    # Assert steady-state Read/Write ratio (>= 10:1) across the full 50-200 case replay aggregate (Ch. 11 Step 5)

    assert_test(
        LLMTestCase(input=case_a["input"], actual_output=out_a, expected_output=case_a["expected"]),
        [GEval(name="Correctness", criteria="Accurately conveys expected domain findings", threshold=0.8)],
    )
```
