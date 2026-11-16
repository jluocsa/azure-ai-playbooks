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

const spec = computed(() => MODELS.find(m => m.id === selectedId.value) || MODELS[0])

function roundToDeployable(raw: number, minPtu: number, inc: number): number {
  if (raw <= minPtu) return minPtu
  return Math.ceil(raw / inc) * inc
}

const calc = computed(() => {
  const m = spec.value
  const inputTpm = Math.max(0, peakRpm.value) * Math.max(0, avgInput.value)
  const outputTpm = Math.max(0, peakRpm.value) * Math.max(0, avgOutput.value)
  const hitRate = Math.min(100, Math.max(0, cacheHitPct.value)) / 100

  let normCached = 0
  let normUncached = 0
  if (m.regime === 'pre6') {
    normCached = inputTpm * (1 - hitRate) + m.outputWeight * outputTpm
    normUncached = inputTpm + m.outputWeight * outputTpm
  } else {
    const cachedTok = inputTpm * hitRate
    const writeTok = rwRatio.value > 0 ? cachedTok / rwRatio.value : 0
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
  const shards = Math.max(1, Math.ceil(Math.max(1, peakRpm.value) / 12))

  return {
    normCached: Math.round(normCached),
    normUncached: Math.round(normUncached),
    rawCached: rawCached.toFixed(1),
    rawUncached: rawUncached.toFixed(1),
    depCached,
    depUncached,
    spike: spike.toFixed(2),
    shards,
  }
})
</script>

<template>
  <div class="ptu-calc">
    <div class="ptu-header">
      <strong>Interactive Two-Regime PTU &amp; Cache-Shard Estimator (Global / Data Zone)</strong>
      <span class="ev-badge ev-m">[M] Learn Formulas</span>
    </div>

    <div class="ptu-inputs">
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
        <span class="k">With {{ cacheHitPct }}% Cached Input</span>
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
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}
.ptu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.ptu-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(195px, 1fr));
  gap: 10px 14px;
  margin-bottom: 14px;
}
.ptu-inputs label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.ptu-inputs input,
.ptu-inputs select {
  padding: 6px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
}
.ptu-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}
.ptu-card {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.ptu-card.highlight {
  border-left: 4px solid var(--vp-c-brand-1);
}
.ptu-card.warn {
  border-left: 4px solid #d97706;
}
.ptu-card .k {
  display: block;
  font-size: 0.74rem;
  color: var(--vp-c-text-2);
}
.ptu-card .v {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2px 0;
}
.ptu-card .sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
.ptu-note {
  margin: 10px 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style>
