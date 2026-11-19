<script setup lang="ts">
import { computed, ref } from 'vue'

interface ModelSpec {
  id: string
  label: string
  regime: 'pre6' | 'gpt6'
  inputTpmPerPtu: number
  minGlobalDz: number
  minRegional: number
  incGlobalDz: number
  outputWeight: number
  readWeight: number
  writeWeight: number
  ptuBreakpoints: boolean
}

const MODELS: ModelSpec[] = [
  {
    id: 'gpt-5.6-terra',
    label: 'gpt-5.6-terra (2026-07-09)',
    regime: 'pre6',
    inputTpmPerPtu: 3000,
    minGlobalDz: 15,
    minRegional: 15,
    incGlobalDz: 5,
    outputWeight: 6,
    readWeight: 0,
    writeWeight: 0,
    ptuBreakpoints: false,
  },
  {
    id: 'gpt-5.6-sol',
    label: 'gpt-5.6-sol (2026-07-09)',
    regime: 'pre6',
    inputTpmPerPtu: 1200,
    minGlobalDz: 15,
    minRegional: 15,
    incGlobalDz: 5,
    outputWeight: 6,
    readWeight: 0,
    writeWeight: 0,
    ptuBreakpoints: false,
  },
  {
    id: 'gpt-5.6-luna',
    label: 'gpt-5.6-luna (2026-07-09)',
    regime: 'pre6',
    inputTpmPerPtu: 30000,
    minGlobalDz: 15,
    minRegional: 15,
    incGlobalDz: 5,
    outputWeight: 6,
    readWeight: 0,
    writeWeight: 0,
    ptuBreakpoints: false,
  },
  {
    id: 'gpt-6-astra',
    label: 'gpt-6-astra (2026-09-03)',
    regime: 'gpt6',
    inputTpmPerPtu: 600,
    minGlobalDz: 15,
    minRegional: 25,
    incGlobalDz: 5,
    outputWeight: 5.0,
    readWeight: 0.1,
    writeWeight: 1.25,
    ptuBreakpoints: true,
  },
  {
    id: 'gpt-6-sol',
    label: 'gpt-6-sol (2026-09-22)',
    regime: 'gpt6',
    inputTpmPerPtu: 3000,
    minGlobalDz: 15,
    minRegional: 15,
    incGlobalDz: 5,
    outputWeight: 5.0,
    readWeight: 0.1,
    writeWeight: 1.25,
    ptuBreakpoints: true,
  },
  {
    id: 'gpt-6-luna',
    label: 'gpt-6-luna (2026-09-22)',
    regime: 'gpt6',
    inputTpmPerPtu: 59400,
    minGlobalDz: 15,
    minRegional: 15,
    incGlobalDz: 5,
    outputWeight: 5.0,
    readWeight: 0.1,
    writeWeight: 1.25,
    ptuBreakpoints: true,
  },
  {
    id: 'gpt-6.1-sol',
    label: 'gpt-6.1-sol (2026-09-29)',
    regime: 'gpt6',
    inputTpmPerPtu: 3000,
    minGlobalDz: 15,
    minRegional: 25,
    incGlobalDz: 5,
    outputWeight: 5.0,
    readWeight: 0.05,
    writeWeight: 1.25,
    ptuBreakpoints: true,
  },
]

const selectedId = ref('gpt-5.6-terra')
const peakRpm = ref(100)
const avgInput = ref(10000)
const avgOutput = ref(500)
const cacheHitPct = ref(80)
const rwRatio = ref(10)
const activePreset = ref('doc-review')
const copiedSizing = ref(false)

interface Preset {
  id: string
  label: string
  model: string
  rpm: number
  input: number
  output: number
  hitPct: number
  rw: number
}

const PRESETS: Preset[] = [
  {
    id: 'doc-review',
    label: 'Document Review Agent (Default)',
    model: 'gpt-5.6-terra',
    rpm: 100,
    input: 10000,
    output: 500,
    hitPct: 80,
    rw: 12,
  },
  {
    id: 'router',
    label: 'High-RPM Guardrail Router',
    model: 'gpt-5.6-luna',
    rpm: 240,
    input: 2400,
    output: 120,
    hitPct: 85,
    rw: 25,
  },
  {
    id: 'copilot',
    label: 'Multi-Turn Enterprise Copilot',
    model: 'gpt-6-sol',
    rpm: 60,
    input: 8000,
    output: 650,
    hitPct: 75,
    rw: 10,
  },
  {
    id: 'compliance',
    label: 'GPT-6.1 Compliance Scorer',
    model: 'gpt-6.1-sol',
    rpm: 120,
    input: 12000,
    output: 450,
    hitPct: 82,
    rw: 15,
  },
]

function applyPreset(p: Preset) {
  activePreset.value = p.id
  selectedId.value = p.model
  peakRpm.value = p.rpm
  avgInput.value = p.input
  avgOutput.value = p.output
  cacheHitPct.value = p.hitPct
  rwRatio.value = p.rw
}

const spec = computed(() => MODELS.find(m => m.id === selectedId.value) || MODELS[0])

function roundToDeployable(raw: number, minPtu: number, inc: number): number {
  if (raw <= minPtu) return minPtu
  return Math.ceil(raw / inc) * inc
}

const calc = computed(() => {
  const m = spec.value
  const inputTpm = Math.max(0, peakRpm.value) * Math.max(0, avgInput.value)
  const outputTpm = Math.max(0, peakRpm.value) * Math.max(0, avgOutput.value)
  const rawHitRate = Math.min(100, Math.max(0, cacheHitPct.value)) / 100
  const k = Math.max(0.1, rwRatio.value || 1)
  const maxSteadyHitRate = m.regime === 'gpt6' ? k / (k + 1) : 1
  const effectiveHitRate = Math.min(rawHitRate, maxSteadyHitRate)
  const isCapped = m.regime === 'gpt6' && rawHitRate > maxSteadyHitRate + 1e-6

  let normCached = 0
  let normUncached = 0
  if (m.regime === 'pre6') {
    normCached = inputTpm * (1 - effectiveHitRate) + m.outputWeight * outputTpm
    normUncached = inputTpm + m.outputWeight * outputTpm
  } else {
    const cachedTok = inputTpm * effectiveHitRate
    const writeTok = cachedTok / k
    const ordinaryInput = Math.max(0, inputTpm - cachedTok - writeTok)
    normCached =
      ordinaryInput * 1.0 +
      cachedTok * m.readWeight +
      writeTok * m.writeWeight +
      outputTpm * m.outputWeight
    normUncached = inputTpm * 1.0 + outputTpm * m.outputWeight
  }

  const rawCached = normCached / m.inputTpmPerPtu
  const rawUncached = normUncached / m.inputTpmPerPtu
  const depCached = roundToDeployable(rawCached, m.minGlobalDz, m.incGlobalDz)
  const depUncached = roundToDeployable(rawUncached, m.minGlobalDz, m.incGlobalDz)
  const spike = depCached > 0 ? depUncached / depCached : 1
  const savedPtu = Math.max(0, depUncached - depCached)
  const cachedBarPct = depUncached > 0 ? Math.max(8, Math.round((depCached / depUncached) * 100)) : 100
  const shards = Math.max(1, Math.ceil(Math.max(1, peakRpm.value) / 12))

  return {
    effectiveHitPct: Math.round(effectiveHitRate * 1000) / 10,
    isCapped,
    normCached: Math.round(normCached),
    normUncached: Math.round(normUncached),
    rawCached: rawCached.toFixed(1),
    rawUncached: rawUncached.toFixed(1),
    depCached,
    depUncached,
    savedPtu,
    cachedBarPct,
    spike: spike.toFixed(2),
    shards,
  }
})

async function copyEstimate() {
  const m = spec.value
  const text = [
    `### PTU & Cache-Shard Estimate (${m.label})`,
    `- **Traffic Profile:** ${peakRpm.value} Peak RPM · ${avgInput.value.toLocaleString()} Input Tok · ${avgOutput.value.toLocaleString()} Output Tok`,
    `- **Tuned PTU Allocation (${calc.value.effectiveHitPct}% Cache Hit):** **${calc.value.depCached} PTUs** (${calc.value.normCached.toLocaleString()} Norm TPM)`,
    `- **Un-Tuned 0%-Hit Exposure:** ${calc.value.depUncached} PTUs (${calc.value.spike}× spike · saves ${calc.value.savedPtu} PTUs)`,
    `- **Recommended Key Shards (>15 RPM Rule):** \`${calc.value.shards}\` shard(s) (\`shard-0..${calc.value.shards - 1}\`)`,
  ].join('\n')
  try {
    await navigator.clipboard.writeText(text)
    copiedSizing.value = true
    setTimeout(() => {
      copiedSizing.value = false
    }, 2200)
  } catch {}
}
</script>

<template>
  <div class="ptu-calc">
    <div class="ptu-header">
      <div>
        <span class="ptu-kicker">INTERACTIVE CSA SIZING TOOL &middot; LIVE CUSTOMER ESTIMATOR</span>
        <strong class="ptu-title">Two-Regime PTU &amp; Cache-Shard Calculator (Global / Data Zone)</strong>
      </div>
      <div class="ptu-header-right">
        <span class="ev-badge ev-m">[M] Learn Formulas</span>
        <button type="button" class="ptu-copy-btn no-print" @click="copyEstimate">
          {{ copiedSizing ? '✓ Copied Summary' : 'Copy Estimate' }}
        </button>
      </div>
    </div>

    <div class="ptu-presets no-print" role="group" aria-label="Customer scenario presets">
      <span class="ptu-preset-lbl">Quick Scenarios:</span>
      <button
        v-for="p in PRESETS"
        :key="p.id"
        type="button"
        :class="['ptu-preset-chip', { 'is-active': activePreset === p.id }]"
        @click="applyPreset(p)"
      >
        {{ p.label }}
      </button>
    </div>

    <div class="ptu-inputs" @input="activePreset = 'custom'">
      <label>
        <span>Target Model</span>
        <select v-model="selectedId">
          <option v-for="m in MODELS" :key="m.id" :value="m.id">{{ m.label }}</option>
        </select>
      </label>
      <label>
        <span>Peak RPM (per prefix family)</span>
        <input v-model.number="peakRpm" type="number" min="1" step="10" />
      </label>
      <label>
        <span>Avg Input Tokens / Call (&le;272K)</span>
        <input v-model.number="avgInput" type="number" min="100" step="500" />
      </label>
      <label>
        <span>Avg Output Tokens / Call</span>
        <input v-model.number="avgOutput" type="number" min="10" step="50" />
      </label>
      <label>
        <span>Cached Input Share (%)</span>
        <input v-model.number="cacheHitPct" type="number" min="0" max="98" step="5" />
      </label>
      <label v-if="spec.regime === 'gpt6'">
        <span>Steady-State Read/Write Ratio (k:1)</span>
        <input v-model.number="rwRatio" type="number" min="1" max="100" step="1" />
      </label>
    </div>

    <div class="ptu-results">
      <div class="ptu-card highlight">
        <span class="k">With {{ calc.effectiveHitPct }}% Cached Input<template v-if="calc.isCapped"> (max @ {{ rwRatio }}:1 R/W)</template></span>
        <div class="v">{{ calc.depCached }} PTUs</div>
        <span class="sub">{{ calc.rawCached }} raw &rarr; {{ spec.incGlobalDz }}-PTU increment ({{ calc.normCached.toLocaleString() }} Norm TPM)</span>
      </div>
      <div class="ptu-card warn">
        <span class="k">At 0% Cache Hits (Miss Regression)</span>
        <div class="v">{{ calc.depUncached }} PTUs ({{ calc.spike }}&times;)</div>
        <span class="sub">{{ calc.rawUncached }} raw ({{ calc.normUncached.toLocaleString() }} Norm TPM)</span>
      </div>
      <div class="ptu-card">
        <span class="k">Recommended Key Shards (&gt;15 RPM Rule)</span>
        <div class="v">{{ calc.shards }} shard(s)</div>
        <span class="sub"><code>shard-0..{{ calc.shards - 1 }}</code> (&lceil;RPM &divide; 12&rceil;)</span>
      </div>
    </div>

    <div class="ptu-bars">
      <div class="ptu-bar-row">
        <div class="ptu-bar-meta">
          <span><strong>Tuned Prefix Architecture</strong> ({{ calc.effectiveHitPct }}% cached share)</span>
          <strong class="ptu-bar-ok">{{ calc.depCached }} PTUs</strong>
        </div>
        <div class="ptu-bar-track">
          <div class="ptu-bar-fill fill-ok" :style="{ width: `${calc.cachedBarPct}%` }"></div>
        </div>
      </div>
      <div class="ptu-bar-row">
        <div class="ptu-bar-meta">
          <span><strong>Un-Tuned Migration</strong> (0% cache hits — saves {{ calc.savedPtu }} PTUs)</span>
          <strong class="ptu-bar-warn">{{ calc.depUncached }} PTUs ({{ calc.spike }}&times;)</strong>
        </div>
        <div class="ptu-bar-track">
          <div class="ptu-bar-fill fill-warn" style="width: 100%"></div>
        </div>
      </div>
    </div>

    <p class="ptu-note">
      <strong>SKU Breakpoint Rule:</strong>
      <span v-if="spec.ptuBreakpoints">
        <code>{{ spec.id }}</code> supports <strong>explicit breakpoints on PTU-M</strong>; cached reads weigh <code>{{ spec.readWeight }}x</code> and writes <code>{{ spec.writeWeight }}x</code>.
      </span>
      <span v-else>
        <code>{{ spec.id }}</code> on <strong>PTU-M does NOT support explicit breakpoints</strong> (omit <code>prompt_cache_breakpoint</code> on PTU leg; rely on deterministic Pos 1–6 ordering + sharded <code>prompt_cache_key</code>). Cached tokens deduct <strong>100%</strong> from PTU draw.
      </span>
    </p>
  </div>
</template>

<style scoped>
.ptu-calc {
  margin: 20px 0;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 29, 61, 0.04);
}
.ptu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.ptu-kicker {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: var(--vp-c-brand-1);
  margin-bottom: 2px;
}
.ptu-title {
  display: block;
  font-size: 0.96rem;
  color: var(--vp-c-text-1);
}
.ptu-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ptu-copy-btn {
  padding: 4px 11px;
  border-radius: 5px;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.ptu-copy-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.ptu-presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}
.ptu-preset-lbl {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-right: 2px;
}
.ptu-preset-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.14s ease;
}
.ptu-preset-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.ptu-preset-chip.is-active {
  background: #0078d4;
  border-color: #0078d4;
  color: #fff;
}
.ptu-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.ptu-bar-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-bottom: 5px;
}
.ptu-bar-ok {
  color: #0f766e;
}
.dark .ptu-bar-ok {
  color: #5eead4;
}
.ptu-bar-warn {
  color: #b45309;
}
.dark .ptu-bar-warn {
  color: #fbbf24;
}
.ptu-bar-track {
  width: 100%;
  height: 9px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.ptu-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.25s ease;
}
.ptu-bar-fill.fill-ok {
  background: linear-gradient(90deg, #0078d4 0%, #0f766e 100%);
}
.ptu-bar-fill.fill-warn {
  background: linear-gradient(90deg, #d97706 0%, #dc2626 100%);
}
.ptu-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px 14px;
  margin-bottom: 16px;
}
.ptu-inputs label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.ptu-inputs input,
.ptu-inputs select {
  padding: 7px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
  font-size: 0.86rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ptu-inputs input:focus,
.ptu-inputs select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}
.ptu-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.ptu-card {
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  border-top: 3px solid #64748b;
  background: var(--vp-c-bg);
}
.ptu-card.highlight {
  border-top-color: var(--vp-c-brand-1);
}
.ptu-card.warn {
  border-top-color: #d83b01;
}
.ptu-card .k {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-2);
}
.ptu-card .v {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 4px 0 3px;
  color: var(--vp-c-text-1);
}
.ptu-card .sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
.ptu-note {
  margin: 12px 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style>
