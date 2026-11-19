<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

const retiringSoon = ref(true)
const statelessRuntime = ref(true)
const skuMix = ref<'ptu-hybrid' | 'ptu-only' | 'payg'>('ptu-hybrid')
const highRpmAndLargePrefix = ref(true)
const hasCiAndOtel = ref(false)
const regulatedMultiClient = ref(false)
const copied = ref(false)

const score = computed(() => {
  let pts = 0
  if (retiringSoon.value) pts += 2
  if (statelessRuntime.value) pts += 2
  if (skuMix.value !== 'payg') pts += 2
  if (highRpmAndLargePrefix.value) pts += 2
  if (!hasCiAndOtel.value) pts += 1
  if (regulatedMultiClient.value) pts += 2
  return pts
})

const tier = computed(() => {
  if (score.value >= 8) {
    return {
      level: 'High-Priority Cutover Scope (Full 3-Week Blueprint)',
      tone: 'high',
      summary:
        'High risk of 2.56× PTU spikes or cache-miss regressions on model cutover. Run all 3 weeks: Baseline Audit → Prefix & APIM Spillover Refactor → 2-Pass Load & KQL Sign-Off.',
    }
  }
  if (score.value >= 5) {
    return {
      level: 'Targeted Readiness Scope (Focused 2-Week Sprint)',
      tone: 'med',
      summary:
        'Moderate cutover exposure. Prioritize Pos 1–6 static prefix ordering, deterministic shard keys, and the 2-pass cache hit contract check.',
    }
  }
  return {
    level: 'Lightweight Architecture Review (1-Session ADS)',
    tone: 'low',
    summary:
      'Lower capacity exposure. Validate prefix ordering in a 60-minute Architecture Design Session and drop pcr_lint.py into PR CI.',
  }
})

const branches = computed(() => {
  const out: string[] = []
  if (retiringSoon.value) {
    out.push('Apply two-regime PTU math (GPT-5.6 0% cached PTU draw vs. GPT-6/6.1 normalized read/write weights).')
  }
  if (statelessRuntime.value) {
    out.push('Enforce byte-identical Pos 1–3 static T0 prefix + sorted tools[] as cross-turn hydration memory.')
  }
  if (skuMix.value === 'ptu-hybrid') {
    out.push('Configure SKU-aware APIM 429 Retry-After spillover (strip breakpoints on GPT-5.6 PTU-M; preserve cache keys).')
  } else if (skuMix.value === 'ptu-only') {
    out.push('Size base PTU-M below 60–70% queuing saturation and omit unsupported breakpoints on GPT-5.6 PTU-M.')
  }
  if (highRpmAndLargePrefix.value) {
    out.push('Shard prompt_cache_key across N = ceil(Peak_RPM / 12) deterministic buckets routed by thread_id.')
  }
  if (!hasCiAndOtel.value) {
    out.push('Wire zero-dependency pcr_lint.py in Layer 1 CI and metadata-only gen_ai.* OpenTelemetry spans to App Insights.')
  }
  if (regulatedMultiClient.value) {
    out.push('Activate Regulated Multi-Engagement Profile: Posture A/B ethical walls, out-of-band FinOps headers & C-WP1–C-WP4.')
  }
  return out
})

async function copyScopeSummary() {
  const lines = [
    `### Foundry Model Migration & PTU Readiness — 30-Min Intake Summary`,
    `- **Recommended Scope:** ${tier.value.level}`,
    `- **Assessment:** ${tier.value.summary}`,
    `- **Activated Architectural Branches:**`,
    ...branches.value.map(b => `  - ${b}`),
  ]
  try {
    await navigator.clipboard.writeText(lines.join('\n'))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch {}
}
</script>

<template>
  <div class="isc-card no-print">
    <div class="isc-head">
      <div>
        <span class="isc-kicker">INTERACTIVE DISCOVERY TOOL &middot; 30-MINUTE TRIAGE</span>
        <strong class="isc-title">Live Intake Qualification Scorecard</strong>
      </div>
      <button type="button" class="isc-copy-btn" @click="copyScopeSummary">
        {{ copied ? '✓ Copied Scope Summary' : 'Copy Intake Summary' }}
      </button>
    </div>

    <div class="isc-grid">
      <label class="isc-toggle">
        <input v-model="retiringSoon" type="checkbox" />
        <div>
          <strong>1. Migrating to GPT-5.6, GPT-6, or GPT-6.1</strong>
          <span>Moving off gpt-4o, gpt-4.1, o3-mini, or gpt-5.4 under a cutover deadline</span>
        </div>
      </label>

      <label class="isc-toggle">
        <input v-model="statelessRuntime" type="checkbox" />
        <div>
          <strong>2. Stateless Web / Container Agent (Model 2)</strong>
          <span>Rehydrates instructions, tools, and session history on every HTTP turn</span>
        </div>
      </label>

      <label class="isc-toggle">
        <input v-model="highRpmAndLargePrefix" type="checkbox" />
        <div>
          <strong>3. Prefix &ge;1,024 Tokens &amp; Peak &gt;15 RPM</strong>
          <span>Shared system/rubric/tool prefix with concurrent multi-user traffic</span>
        </div>
      </label>

      <label class="isc-toggle">
        <input v-model="regulatedMultiClient" type="checkbox" />
        <div>
          <strong>4. Client Ethical Walls, Chargeback or Filing Cliffs</strong>
          <span>Multi-matter isolation, cost-center billing, or 3&times;–6&times; seasonal surges</span>
        </div>
      </label>

      <label class="isc-toggle">
        <input v-model="hasCiAndOtel" type="checkbox" />
        <div>
          <strong>5. Existing Automated Evals &amp; OTel Telemetry</strong>
          <span>Already runs pytest/DeepEval in CI and emits gen_ai.* spans to App Insights</span>
        </div>
      </label>

      <label class="isc-select-box">
        <span>6. Target Production SKU Topology</span>
        <select v-model="skuMix">
          <option value="ptu-hybrid">PTU-M Primary + Standard PAYG Spillover (Recommended)</option>
          <option value="ptu-only">Provisioned Throughput (PTU-M) Only</option>
          <option value="payg">Standard (Pay-As-You-Go) Only</option>
        </select>
      </label>
    </div>

    <div :class="['isc-verdict', `tone-${tier.tone}`]">
      <div class="isc-verdict-top">
        <span class="isc-verdict-badge">{{ tier.level }}</span>
        <a v-if="regulatedMultiClient" :href="withBase('/playbooks/prompt-caching/profiles/regulated-multi-engagement')" class="isc-profile-link">
          Include Regulated Profile &rarr;
        </a>
      </div>
      <p class="isc-verdict-summary">{{ tier.summary }}</p>
      <ul class="isc-branch-list">
        <li v-for="b in branches" :key="b">{{ b }}</li>
      </ul>
    </div>
  </div>
</template>
