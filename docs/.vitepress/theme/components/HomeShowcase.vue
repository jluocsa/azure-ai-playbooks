<script setup lang="ts">
import { withBase } from 'vitepress'

const heroStack = [
  {
    layer: 'Layer A · Edge & Resiliency',
    title: 'SKU-Aware APIM Gateway & 429 Spillover',
    meta: 'Strips 5.6 PTU-M breakpoints · Honors Retry-After · Preserves cache keys',
    href: '/playbooks/prompt-caching/design/10-apim-spillover',
    pill: 'Pattern',
  },
  {
    layer: 'Layer B · Context & Capacity',
    title: 'Pos 1–6 Prefix Order & Two-Regime PTU Math',
    meta: 'T0 → L2 → L1 → Tail · >15 RPM key sharding · GPT-5.6 vs. GPT-6/6.1 weights',
    href: '/playbooks/prompt-caching/qualify/04-ptu-sizing-math',
    pill: 'Live v1.0',
  },
  {
    layer: 'Layer C · Regulated Isolation',
    title: 'Ethical Walls, Chargeback & Workpaper Lineage',
    meta: 'Posture A (0 client KV) vs. Posture B · Out-of-band FinOps · C-WP1–C-WP4',
    href: '/playbooks/prompt-caching/profiles/regulated-multi-engagement',
    pill: 'Profile',
  },
  {
    layer: 'Layer D · Release Assurance',
    title: '7-Layer CI Linter, 2-Pass Evals & KQL Gate',
    meta: 'PCR001–006 AST CLI · DeepEval cache parity · App Insights DeployPeakNormTPM',
    href: '/papers/engineering-kits',
    pill: 'MIT Kit',
  },
]

const kpis = [
  {
    metric: '2.56×',
    unit: 'PTU Spike Prevented',
    detail: '170 PTUs at 80% prefix cache hit vs. 435 PTUs on an un-tuned 0%-hit migration (gpt-5.6-terra, 5-PTU increment).',
  },
  {
    metric: '71%',
    unit: 'Seasonal TCO Saved',
    detail: '110-PTU baseline reservation paired with APIM 429 Standard PAYG spillover across 4× statutory filing cliffs.',
  },
  {
    metric: 'PCR 01–06',
    unit: 'Static AST / Regex CI Gate',
    detail: 'Zero-dependency Python CLI blocking Pos-1 timestamps, unsorted tool schemas, and high-cardinality cache keys.',
  },
  {
    metric: 'C1–C15',
    unit: 'Cutover Readiness Standard',
    detail: '15 release gates (+ C-WP1–C-WP4 workpaper controls) spanning unit lint, 2-pass evals, load tests, and OTel KQL.',
  },
]

const catalog = [
  {
    badge: 'LIVE PLAYBOOK · v1.0',
    badgeTone: 'live',
    title: '01 · Prompt Caching & PTU Readiness (GPT-5.6 / 6 / 6.1)',
    summary:
      '15-chapter architecture standard covering stateless Model 2 hydration, Standard vs. PTU-M breakpoint boundaries, two-regime PTU sizing math, Pos 1–6 ordering, and >15 RPM key sharding.',
    tags: ['GPT-5.6+', 'PTU-M', 'Responses API', '15 Chapters'],
    href: '/playbooks/prompt-caching/start/01-executive-thesis',
    cta: 'Open Playbook 01',
    icon: 'layers',
  },
  {
    badge: 'WORKLOAD PROFILE · LIVE',
    badgeTone: 'profile',
    title: 'Regulated Multi-Engagement & Compliance Platforms',
    summary:
      'Security-verified ethical-wall postures (Posture A zero-client-cache vs. Posture B scoped L2), out-of-band chargeback headers, seasonal filing-cliff math, and workpaper reproducibility.',
    tags: ['Ethical Walls', 'FinOps KQL', 'Audit / Tax / Legal', 'C-WP1–C-WP4'],
    href: '/playbooks/prompt-caching/profiles/regulated-multi-engagement',
    cta: 'Explore Workload Profile',
    icon: 'shield',
  },
  {
    badge: 'SINGLE-PAGE EDITION',
    badgeTone: 'paper',
    title: 'Consolidated Architecture White Paper (Print-Ready)',
    summary:
      'Single-page architecture reference consolidating core thesis, prefix diagrams, PTU formulas, break-even tables, and verified Microsoft Learn citations with Save-as-PDF layout.',
    tags: ['ARB Sign-Off', 'Print / PDF Ready', 'Section Guide'],
    href: '/papers/foundry-prompt-caching-gpt56-whitepaper',
    cta: 'Read White Paper',
    icon: 'doc',
  },
  {
    badge: 'DROP-IN MIT KITS',
    badgeTone: 'kit',
    title: 'Executable Engineering Kits & PR Cutover Template',
    summary:
      'Copy-ready pcr_lint.py static AST/regex scanner, two-regime Application Insights KQL release gate (DeployPeakNormTPM + per-shard SLOs), and C1–C15 pull-request sign-off template.',
    tags: ['Python CLI', 'Log Analytics KQL', 'PR Checklist'],
    href: '/papers/engineering-kits',
    cta: 'Inspect Code & KQL Kits',
    icon: 'code',
  },
  {
    badge: 'PROACTIVE DELIVERY',
    badgeTone: 'scope',
    title: '3-Week Readiness Engagement Scope & Intake Scorecard',
    summary:
      'Turnkey 6-dimension intake qualification scorecard and Week 1–3 delivery blueprint with clear workstream boundaries and concrete exit deliverables.',
    tags: ['30-Min Intake', '3-Week Scope', 'Workstreams'],
    href: '/operating-model/delivery-scoping',
    cta: 'View Delivery Blueprint',
    icon: 'compass',
  },
  {
    badge: 'SERIES ROADMAP · CO-AUTHORS',
    badgeTone: 'charter',
    title: 'Playbooks 02 (APIM Gateway) & 03 (Multi-Region BCP)',
    summary:
      'Chartered multi-author tracks covering Multi-Backend Foundry APIM circuit breakers, SSE streaming safety, Data Zone vs. Regional PTU residency, and failover game-day drills.',
    tags: ['APIM Pools', 'BCP / DR', 'Open for Track Leads'],
    href: '/playbooks/series-charters/',
    cta: 'Review Series Charters',
    icon: 'network',
  },
]

const phases = [
  {
    step: '01',
    when: 'Intake (30 Min)',
    title: 'Qualify Boundaries & Exposure',
    desc: 'Score retiring models, Model 2 stateless hydration, PTU-M vs. Standard mix, and >15 RPM concurrency.',
    href: '/operating-model/delivery-scoping',
  },
  {
    step: '02',
    when: 'Week 1',
    title: 'Baseline Audit & Ablation',
    desc: 'Rank prompt families by RPM × Tokens, run PCR001–006 lint, and measure un-tuned cache miss & TTFT baseline.',
    href: '/playbooks/prompt-caching/validate/11-seven-layer-gates',
  },
  {
    step: '03',
    when: 'Week 2',
    title: 'Prefix & Gateway Refactoring',
    desc: 'Enforce Pos 1–6 ordering, deterministic shard keys, SKU-aware breakpoints, and APIM 429 Retry-After spillover.',
    href: '/playbooks/prompt-caching/design/07-prefix-taxonomy',
  },
  {
    step: '04',
    when: 'Week 3 & Standing Gate',
    title: '2-Pass Evals, KQL & PTU Sign-Off',
    desc: 'Verify >=80% hit rate & >=10:1 R/W under peak load, deploy KQL alerts, and sign off C1–C15.',
    href: '/playbooks/prompt-caching/govern/14-readiness-standard',
  },
]

const signals = [
  {
    code: '[M] [Arch] [Agree] [Validate]',
    title: '1. Four-Tier Source Discipline',
    body: 'Every technical statement separates published Microsoft Learn specs from reference architecture patterns, target gate SLOs, and subscription-level probes.',
  },
  {
    code: 'Customer-Zero Validated',
    title: '2. Production Provenance',
    body: 'Extracted from real enterprise multi-node agent architectures and model-migration engagements—never synthetic documentation summaries.',
  },
  {
    code: 'npm run check:sanitized',
    title: '3. Three-Gate Governance',
    body: 'Automated confidentiality & lockfile sanitization, peer Architecture Review, and prior-art-safe IP / channel disposition before publication.',
  },
  {
    code: '.github/CODEOWNERS',
    title: '4. Multi-Author Track Ownership',
    body: 'Named Track Leads and specialist co-authors per playbook with visible frontmatter provenance and scoped directory review ownership.',
  },
]
</script>

<template>
  <div class="ms-landing">
    <!-- Architecture Catalog Hero + Reference Stack -->
    <section class="ms-hero">
      <div class="ms-hero-bg" aria-hidden="true"></div>
      <div class="ms-container ms-hero-grid">
        <div class="ms-hero-copy">
          <a :href="withBase('/')" class="th-back-link no-print">&larr; Back to Hub Overview</a>
          <div class="ms-eyebrow">
            <span class="ms-eyebrow-dot"></span>
            <span>ARCHITECTURE CATALOG &middot; FULL TECHNICAL HUB</span>
          </div>
          <h1 class="ms-hero-title">
            Architecture Catalog &amp;
            <span class="ms-hero-accent">Cross-Service Engineering Kits</span>
          </h1>
          <p class="ms-hero-lead">
            Implementation-level reference layers across Microsoft Foundry, APIM, OpenTelemetry, and CI/CD—combining
            <strong>two-regime PTU sizing math</strong>, regulated ethical-wall postures, and executable
            <code>PCR001–006</code> &amp; KQL release gates.
          </p>
          <div class="ms-hero-actions">
            <a class="ms-btn ms-btn-primary" :href="withBase('/playbooks/prompt-caching/start/01-executive-thesis')">
              <span>Playbook 01 &middot; Prompt Caching</span>
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>
            </a>
            <a class="ms-btn ms-btn-secondary" :href="withBase('/playbooks/prompt-caching/profiles/regulated-multi-engagement')">
              Regulated Profile
            </a>
            <a class="ms-btn ms-btn-ghost" :href="withBase('/papers/')">
              White Paper &amp; Kits
            </a>
          </div>
          <div class="ms-hero-trust">
            <span class="ev-badge ev-m">[M] Learn Grounded</span>
            <span class="ev-badge ev-arch">[Arch] Patterns</span>
            <span class="ev-badge ev-agree">[Agree] Gate SLOs</span>
            <span class="pb-chip pb-chip-verified">
              <span class="ms-live-dot" aria-hidden="true"></span>
              <span>Verified 2026-11-18 21:21 PST</span>
            </span>
            <a :href="withBase('/playbooks/prompt-caching/sources')" class="ms-trust-link">Verified Sources &rarr;</a>
          </div>
        </div>

        <!-- Right Blueprint Panel -->
        <aside class="ms-blueprint-card" aria-label="Reference Architecture Stack">
          <div class="ms-bp-header">
            <span class="ms-bp-kicker">REFERENCE STACK &middot; CROSS-SERVICE SEAMS</span>
            <span class="ms-bp-status">Sanitized Baseline</span>
          </div>
          <div class="ms-bp-layers">
            <a
              v-for="item in heroStack"
              :key="item.title"
              :href="withBase(item.href)"
              class="ms-bp-row"
            >
              <div class="ms-bp-row-top">
                <span class="ms-bp-layer">{{ item.layer }}</span>
                <span class="ms-bp-pill">{{ item.pill }}</span>
              </div>
              <div class="ms-bp-title">{{ item.title }}</div>
              <div class="ms-bp-meta">{{ item.meta }}</div>
            </a>
          </div>
        </aside>
      </div>
    </section>

    <!-- Quantified Impact Strip -->
    <section class="ms-kpi-band" aria-label="Customer-Zero Quantified Impact">
      <div class="ms-container">
        <div class="ms-kpi-grid">
          <div v-for="k in kpis" :key="k.unit" class="ms-kpi-card">
            <div class="ms-kpi-top">
              <span class="ms-kpi-num">{{ k.metric }}</span>
              <span class="ms-kpi-unit">{{ k.unit }}</span>
            </div>
            <p class="ms-kpi-desc">{{ k.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Catalog -->
    <section class="ms-section">
      <div class="ms-container">
        <div class="ms-section-head">
          <div>
            <span class="ms-section-kicker">ARCHITECTURE CATALOG</span>
            <h2 class="ms-section-title">Playbooks, Workload Profiles &amp; Executable Kits</h2>
          </div>
          <p class="ms-section-sub">
            End-to-end reference assets spanning 30-minute intake scoping, capacity math, and automated pull-request gates.
          </p>
        </div>

        <div class="ms-catalog-grid">
          <a
            v-for="card in catalog"
            :key="card.title"
            :href="withBase(card.href)"
            class="ms-cat-card"
          >
            <div class="ms-cat-top">
              <span class="ms-cat-icon" aria-hidden="true">
                <svg v-if="card.icon === 'layers'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 16 10 5 10-5"/></svg>
                <svg v-else-if="card.icon === 'shield'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                <svg v-else-if="card.icon === 'doc'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>
                <svg v-else-if="card.icon === 'code'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
                <svg v-else-if="card.icon === 'compass'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M5 9v3h14V9M12 12v3"/></svg>
              </span>
              <span :class="['ms-cat-badge', `tone-${card.badgeTone}`]">{{ card.badge }}</span>
            </div>
            <h3 class="ms-cat-title">{{ card.title }}</h3>
            <p class="ms-cat-summary">{{ card.summary }}</p>
            <div class="ms-cat-tags">
              <span v-for="t in card.tags" :key="t" class="ms-tag">{{ t }}</span>
            </div>
            <div class="ms-cat-cta">
              <span>{{ card.cta }}</span>
              <span aria-hidden="true">&rarr;</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- 3-Week Delivery & Industrialization Flow -->
    <section class="ms-section ms-section-alt">
      <div class="ms-container">
        <div class="ms-section-head">
          <div>
            <span class="ms-section-kicker">REPEATABLE EXECUTION MODEL</span>
            <h2 class="ms-section-title">From 30-Minute Intake to Standing Production Gate</h2>
          </div>
          <p class="ms-section-sub">
            Every playbook pairs architectural guidance with a bounded 3-week delivery blueprint so
            specialist teams execute consistently across accounts.
          </p>
        </div>

        <div class="ms-phase-grid">
          <a
            v-for="p in phases"
            :key="p.step"
            :href="withBase(p.href)"
            class="ms-phase-card"
          >
            <div class="ms-phase-top">
              <span class="ms-phase-num">STEP {{ p.step }}</span>
              <span class="ms-phase-when">{{ p.when }}</span>
            </div>
            <h3 class="ms-phase-title">{{ p.title }}</h3>
            <p class="ms-phase-desc">{{ p.desc }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Governance & Quality Signals -->
    <section class="ms-section">
      <div class="ms-container">
        <div class="ms-section-head">
          <div>
            <span class="ms-section-kicker">ENGINEERING GOVERNANCE &amp; TRUST</span>
            <h2 class="ms-section-title">Quality Signals Enforced Across Every Asset</h2>
          </div>
          <p class="ms-section-sub">
            Official service limits and SKU tables evolve across model waves. This hub curates and links
            authoritative Microsoft Learn documentation as the product source of truth.
          </p>
        </div>

        <div class="ms-signal-grid">
          <div v-for="s in signals" :key="s.title" class="ms-signal-card">
            <code class="ms-signal-code">{{ s.code }}</code>
            <h3 class="ms-signal-title">{{ s.title }}</h3>
            <p class="ms-signal-body">{{ s.body }}</p>
          </div>
        </div>

        <div class="ms-operating-banner">
          <div>
            <strong>Co-Author Playbooks 02 (APIM Gateway) &amp; 03 (Multi-Region BCP)</strong>
            <p>
              Have a Customer-Zero architecture pattern ready for 1:N reuse? Review open Track Lead charters and the
              3-gate sanitization, ARB, and IP clearance workflow.
            </p>
          </div>
          <a class="ms-btn ms-btn-secondary" :href="withBase('/playbooks/series-charters/')">
            View Series Charters &rarr;
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
