<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  track: string
  status?: string
  provenance?: string
  governance?: string
  owners?: string
  verified?: string
  paperHref?: string
  paperLabel?: string
  printable?: boolean
}>()

function printPage() {
  if (typeof window !== 'undefined') window.print()
}
</script>

<template>
  <div class="pb-meta">
    <div class="pb-meta-grid">
      <div>
        <span class="pb-label">Track</span>
        <strong>{{ track }}</strong>
      </div>
      <div>
        <span class="pb-label">Provenance</span>
        <strong>{{ provenance || 'Customer-Zero Validated (Sanitized)' }}</strong>
      </div>
      <div>
        <span class="pb-label">Governance Gate</span>
        <strong>{{ governance || 'Sanitized · Peer Reviewed · IP Screened' }}</strong>
      </div>
      <div>
        <span class="pb-label">Track Owners</span>
        <strong>{{ owners || 'John Luo (@jluocsa) · Co-Authors Welcome' }}</strong>
      </div>
      <div>
        <span class="pb-label">Last Verified</span>
        <strong>{{ verified || '2026-11-16' }} ({{ status || 'Active v1.0' }})</strong>
      </div>
      <div v-if="paperHref" class="pb-pdf no-print">
        <span class="pb-label">Consolidated Reader</span>
        <a :href="withBase(paperHref)">{{ paperLabel || 'Single-Page White Paper →' }}</a>
      </div>
      <div v-if="printable" class="pb-pdf no-print">
        <span class="pb-label">Offline / ARB Copy</span>
        <button type="button" class="pb-print-btn" @click="printPage">Print / Save as PDF</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-meta {
  margin: 14px 0 20px;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.85rem;
}
.pb-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px 16px;
}
.pb-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}
.pb-pdf a {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.pb-pdf a:hover {
  text-decoration: underline;
}
.pb-print-btn {
  display: inline-block;
  margin-top: 2px;
  padding: 3px 10px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 5px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.pb-print-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}
</style>
