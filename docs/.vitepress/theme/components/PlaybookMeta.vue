<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  track: string
  status?: string
  provenance?: string
  governance?: string
  owners?: string
  verified?: string
  pdfHref?: string
}>()
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
      <div v-if="pdfHref" class="pb-pdf">
        <span class="pb-label">Executive White Paper</span>
        <a :href="withBase(pdfHref)" target="_blank" rel="noopener">Download 16-Page PDF ↗</a>
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
</style>
