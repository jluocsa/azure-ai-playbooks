<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const copiedPitch = ref(false)

function printOverview() {
  if (typeof window !== 'undefined') window.print()
}

async function copyCustomerPitch() {
  const pitch = [
    `Enterprise Azure AI — Solution Industrialization Hub (Verified 2026-11-18 21:21 PST)`,
    `• What it solves: Prevents 2.56× PTU capacity spikes, cache-miss latency, and 429 throttling when migrating AI workloads to GPT-5.6, GPT-6, and GPT-6.1.`,
    `• Proven outcomes: 2.56× capacity spike avoided · 71% peak-season TCO saved · turnkey 3-week customer readiness scope.`,
    `• Includes: Live 30-min intake scorecard, two-regime PTU & shard calculator, regulated ethical-wall profile, printable white paper, and MIT Python/KQL release gates.`,
    `• Hub link: https://jluocsa.github.io/azure-ai-playbooks/`,
  ].join('\n')
  try {
    await navigator.clipboard.writeText(pitch)
    copiedPitch.value = true
    setTimeout(() => {
      copiedPitch.value = false
    }, 2200)
  } catch {}
}

const headlineStats = [
  {
    value: '1 → Many',
    label: 'Solve Once, Reuse Everywhere',
    detail: 'Turn one deep flagship customer engagement into a sanitized, peer-reviewed kit any delivery team can run.',
  },
  {
    value: '2.56×',
    label: 'Capacity Spike Prevented',
    detail: 'Proven in Playbook 01: preserving Azure prompt reuse avoids a 2.56× jump in reserved AI capacity during model upgrades.',
  },
  {
    value: '71%',
    label: 'Peak-Season Cost Saved',
    detail: 'Right-sized baseline capacity paired with automatic pay-as-you-go overflow handles seasonal traffic surges economically.',
  },
  {
    value: '3 Weeks',
    label: 'Turnkey Customer Scope',
    detail: 'Every playbook ships with a 30-minute triage scorecard, week-by-week plan, and copy-ready automation checks.',
  },
]

const factoryStages = [
  {
    num: '1',
    title: 'Customer-Zero Proof',
    desc: 'Every pattern starts in a real production workload with measured latency, throughput, and cost—never theoretical summaries.',
  },
  {
    num: '2',
    title: 'Automated Sanitization',
    desc: 'An automated CI check strips all customer names, internal aliases, emails, and tenant IDs across docs, code, and PDFs.',
  },
  {
    num: '3',
    title: 'Peer Architecture Review',
    desc: 'Reviewers verify published Microsoft Learn product facts and clearly separate them from field design recommendations.',
  },
  {
    num: '4',
    title: 'Three-Way Routing',
    desc: 'Novel IP goes to confidential patent hold (4A); product gaps go to Azure engineering & Docs (4B); reusable patterns become playbooks (4C).',
  },
  {
    num: '5',
    title: '1:N Field Delivery',
    desc: 'Specialist teams apply the finished playbook in architecture sessions and repeatable 3-week customer readiness engagements.',
  },
]

const playbookOneBox = [
  {
    tag: 'DECISION GUIDE & SIZING',
    title: 'Clear Architecture Rules & Capacity Calculator',
    body: 'Shows how to order prompts so static instructions stay cached across turns, and calculates the exact Azure AI capacity needed across GPT-5.6, GPT-6, and GPT-6.1.',
    href: '/playbooks/prompt-caching/start/01-executive-thesis',
    cta: 'Open Playbook 01',
  },
  {
    tag: 'REGULATED INDUSTRIES',
    title: 'Client Data Walls & Cost Chargeback Profile',
    body: 'Ready-made guidance for audit, tax, legal, and financial platforms that must isolate client data, bill usage by department, and survive seasonal deadlines.',
    href: '/playbooks/prompt-caching/profiles/regulated-multi-engagement',
    cta: 'View Regulated Profile',
  },
  {
    tag: 'DROP-IN AUTOMATION',
    title: 'Pre-Release Code Check, Live Alert Query & Checklist',
    body: 'Copy-ready Python code scanner, Application Insights monitoring query, and 15-point launch checklist that catch regressions before production cutover.',
    href: '/papers/',
    cta: 'Inspect White Paper & Kits',
  },
]
</script>

<template>
  <div class="eo-page">
    <!-- Hero -->
    <section class="eo-hero">
      <div class="eo-hero-bg" aria-hidden="true"></div>
      <div class="ms-container eo-hero-inner">
        <div class="ms-eyebrow">
          <span class="ms-eyebrow-dot"></span>
          <span>MICROSOFT FOUNDRY &amp; AZURE AI &middot; SOLUTION INDUSTRIALIZATION HUB</span>
        </div>

        <h1 class="eo-title">
          Enterprise Azure AI
          <span class="ms-hero-accent">Solution Industrialization Hub</span>
        </h1>

        <p class="eo-lead">
          Enterprise AI projects rarely stall on a basic demo—they stall at production scale when
          <strong>cost, latency, traffic spikes, and security boundaries collide</strong>. This hub is a governed
          factory that takes proven solutions from one flagship customer engagement and packages them into
          <strong>reusable playbooks, 3-week delivery scopes, and automated guardrails</strong>.
        </p>

        <div class="eo-hero-actions no-print">
          <a class="ms-btn ms-btn-primary" :href="withBase('/playbooks/prompt-caching/start/01-executive-thesis')">
            <span>Playbook 01 &middot; Prompt Caching</span>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>
          </a>
          <a class="ms-btn ms-btn-secondary" :href="withBase('/operating-model/delivery-scoping')">
            3-Week Delivery Scope
          </a>
          <button type="button" class="ms-btn ms-btn-secondary eo-print-btn" @click="copyCustomerPitch">
            {{ copiedPitch ? '✓ Copied 60-Sec Pitch' : 'Copy 60-Sec Pitch' }}
          </button>
          <button type="button" class="ms-btn ms-btn-ghost eo-print-btn" @click="printOverview">
            Print / Save Brief as PDF
          </button>
        </div>

        <div class="eo-live-strip">
          <span class="eo-live-badge">
            <span class="ms-live-dot" aria-hidden="true"></span>
            <span>Active v1.0 &middot; Last Verified: <strong>2026-11-18 21:21 PST</strong></span>
          </span>
          <span class="eo-live-sep" aria-hidden="true">&middot;</span>
          <span class="eo-live-meta">100% Sanitized &middot; Grounded in Published Microsoft Learn &middot; Open for User Co-Authors</span>
        </div>

        <div class="eo-kpi-strip">
          <div v-for="item in headlineStats" :key="item.label" class="eo-kpi-card">
            <div class="eo-kpi-val">{{ item.value }}</div>
            <div class="eo-kpi-lbl">{{ item.label }}</div>
            <p class="eo-kpi-txt">{{ item.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Step 1: Lead Directly with The Five-Stage Industrialization Factory -->
    <section id="step-1-factory" class="eo-section">
      <div class="ms-container">
        <div class="eo-step-header">
          <span class="eo-step-badge">01 &middot; HOW THE HUB WORKS</span>
          <h2 class="eo-h2">The Five-Stage Industrialization Factory</h2>
          <p class="eo-sub">
            Every engagement pattern passes through five governed stages so field teams share high-value assets quickly
            without risking customer confidentiality, unverified product claims, or premature patent disclosure.
          </p>
        </div>

        <div class="arch-diagram eo-diagram">
          <svg
            viewBox="0 0 760 186"
            role="img"
            aria-labelledby="eo-d2-title eo-d2-desc"
            font-family="Segoe UI, Inter, -apple-system, sans-serif"
          >
            <title id="eo-d2-title">The Five-Stage Solution Industrialization Factory</title>
            <desc id="eo-d2-desc">Stage 1 Customer-Zero flows to Stage 2 Sanitization, Stage 3 Architecture Review, then branches to 4A Patent or IP Hold, 4B Product Group and Learn PR, and 4C Field Playbook, converging into Stage 5 1:N Reuse.</desc>
            <defs>
              <marker id="eo-arr-ind" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8Z" fill="#0f766e" />
              </marker>
            </defs>

            <rect x="8" y="42" width="126" height="80" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.4" />
            <text x="16" y="60" font-size="9.5" font-weight="700" fill="#115e59">1. Customer-Zero</text>
            <text x="16" y="75" font-size="8.4" fill="#334e68">Real production</text>
            <text x="16" y="88" font-size="8.4" fill="#334e68">workload &amp; metrics</text>
            <text x="16" y="108" font-size="7.9" font-weight="700" fill="#0f766e">[Proven Baseline]</text>

            <path d="M134 82 H152" stroke="#0f766e" stroke-width="1.8" marker-end="url(#eo-arr-ind)" />

            <rect x="156" y="42" width="126" height="80" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="164" y="60" font-size="9.5" font-weight="700" fill="#183e62">2. Sanitization</text>
            <text x="164" y="75" font-size="8.4" fill="#334e68">Strip customer IDs,</text>
            <text x="164" y="88" font-size="8.4" fill="#334e68">emails &amp; GUIDs</text>
            <text x="164" y="108" font-size="7.9" font-weight="700" fill="#1d4ed8">[Automated CI Gate]</text>

            <path d="M282 82 H300" stroke="#0f766e" stroke-width="1.8" marker-end="url(#eo-arr-ind)" />

            <rect x="304" y="42" width="128" height="80" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="312" y="60" font-size="9.5" font-weight="700" fill="#183e62">3. Arch Review</text>
            <text x="312" y="75" font-size="8.4" fill="#334e68">Verify MS Learn facts</text>
            <text x="312" y="88" font-size="8.4" fill="#334e68">&amp; design boundaries</text>
            <text x="312" y="108" font-size="7.9" font-weight="700" fill="#1d4ed8">[Peer Review Check]</text>

            <path d="M432 61 H458 V28 H470" stroke="#0f766e" stroke-width="1.6" fill="none" marker-end="url(#eo-arr-ind)" />
            <path d="M432 82 H470" stroke="#0f766e" stroke-width="1.6" fill="none" marker-end="url(#eo-arr-ind)" />
            <path d="M432 103 H458 V136 H470" stroke="#0f766e" stroke-width="1.6" fill="none" marker-end="url(#eo-arr-ind)" />

            <rect x="474" y="6" width="142" height="44" rx="5" fill="#fff7eb" stroke="#d97706" stroke-width="1.3" />
            <text x="482" y="23" font-size="8.9" font-weight="700" fill="#92400e">4A. Patent / IP Hold</text>
            <text x="482" y="37" font-size="8.0" fill="#92400e">Confidential IP review</text>

            <rect x="474" y="60" width="142" height="44" rx="5" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.3" />
            <text x="482" y="77" font-size="8.9" font-weight="700" fill="#183e62">4B. Product &amp; Learn PR</text>
            <text x="482" y="91" font-size="8.0" fill="#334e68">Upstream doc &amp; product</text>

            <rect x="474" y="114" width="142" height="46" rx="5" fill="#eaf7f5" stroke="#0f766e" stroke-width="1.5" />
            <text x="482" y="131" font-size="8.9" font-weight="700" fill="#115e59">4C. Field Playbook</text>
            <text x="482" y="145" font-size="8.0" fill="#334e68">Web + White Paper + Kits</text>

            <path d="M616 82 H634" stroke="#0f766e" stroke-width="1.8" marker-end="url(#eo-arr-ind)" />
            <path d="M616 137 H625 V97 H634" stroke="#0f766e" stroke-width="1.6" fill="none" marker-end="url(#eo-arr-ind)" />

            <rect x="638" y="45" width="114" height="76" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.4" />
            <text x="646" y="63" font-size="9.4" font-weight="700" fill="#115e59">5. 1:N Reuse</text>
            <text x="646" y="78" font-size="8.2" fill="#334e68">Design sessions,</text>
            <text x="646" y="91" font-size="8.2" fill="#334e68">3-wk scopes &amp; KPIs</text>
            <text x="646" y="109" font-size="7.9" font-weight="700" fill="#0f766e">[Field Impact]</text>

            <text x="10" y="177" font-size="8.5" fill="#526c80">
              Governed five-stage factory converting 1:1 Customer-Zero engagements into sanitized, peer-reviewed 1:N assets.
            </text>
          </svg>
        </div>

        <div class="eo-stage-strip">
          <div v-for="s in factoryStages" :key="s.num" class="eo-stage-item">
            <span class="eo-stage-num">Stage {{ s.num }}</span>
            <h3 class="eo-stage-title">{{ s.title }}</h3>
            <p class="eo-stage-desc">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Step 2: Why This Solves the 1:1 Bottleneck -->
    <section id="step-2-why" class="eo-section eo-section-alt">
      <div class="ms-container">
        <div class="eo-step-header">
          <span class="eo-step-badge">02 &middot; THE PROBLEM SOLVED</span>
          <h2 class="eo-h2">Why Bespoke 1:1 AI Architecture Does Not Scale</h2>
          <p class="eo-sub">
            When every account solves next-generation model upgrades, capacity sizing, and failover from scratch,
            hard-won engineering lessons stay trapped inside single-customer slide decks.
          </p>
        </div>

        <div class="arch-diagram eo-diagram">
          <svg
            viewBox="0 0 760 198"
            role="img"
            aria-labelledby="eo-d1-title eo-d1-desc"
            font-family="Segoe UI, Inter, -apple-system, sans-serif"
          >
            <title id="eo-d1-title">Comparison of Ad-Hoc 1:1 Delivery versus 1:N Solution Industrialization</title>
            <desc id="eo-d1-desc">Top row shows ad-hoc 1:1 delivery trapping work in customer silos and forcing repeated effort. Bottom row shows 1:N industrialization proving once on Customer-Zero, sanitizing and reviewing, and scaling repeatable 3-week kits across accounts.</desc>
            <defs>
              <marker id="eo-arr-warn" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8Z" fill="#b45309" />
              </marker>
              <marker id="eo-arr-ok" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8Z" fill="#0f766e" />
              </marker>
            </defs>

            <text x="10" y="20" font-size="9.2" font-weight="700" fill="#92400e">WITHOUT INDUSTRIALIZATION (1:1 SILOS)</text>

            <rect x="10" y="28" width="166" height="58" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.3" />
            <text x="20" y="45" font-size="9.4" font-weight="700" fill="#92400e">1. Bespoke Fire-Drill</text>
            <text x="20" y="59" font-size="8.3" fill="#475569">Specialists solve tough cutover</text>
            <text x="20" y="71" font-size="8.3" fill="#475569">issue for one flagship account</text>

            <path d="M176 57 H198" stroke="#b45309" stroke-width="1.7" marker-end="url(#eo-arr-warn)" />

            <rect x="202" y="28" width="166" height="58" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.3" />
            <text x="212" y="45" font-size="9.4" font-weight="700" fill="#92400e">2. Trapped in Silos</text>
            <text x="212" y="59" font-size="8.3" fill="#475569">IP locked in customer-specific</text>
            <text x="212" y="71" font-size="8.3" fill="#475569">decks &amp; private repos</text>

            <path d="M368 57 H390" stroke="#b45309" stroke-width="1.7" marker-end="url(#eo-arr-warn)" />

            <rect x="394" y="28" width="166" height="58" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.3" />
            <text x="404" y="45" font-size="9.4" font-weight="700" fill="#92400e">3. Re-Solved Again</text>
            <text x="404" y="59" font-size="8.3" fill="#475569">Next account hits the exact</text>
            <text x="404" y="71" font-size="8.3" fill="#475569">same bottleneck weeks later</text>

            <path d="M560 57 H582" stroke="#b45309" stroke-width="1.7" marker-end="url(#eo-arr-warn)" />

            <rect x="586" y="28" width="164" height="58" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.3" />
            <text x="596" y="45" font-size="9.4" font-weight="700" fill="#991b1b">Result: Bottlenecked</text>
            <text x="596" y="59" font-size="8.3" fill="#475569">High delivery cost &amp; delayed</text>
            <text x="596" y="72" font-size="8.0" font-weight="700" fill="#b91c1c">[Does Not Scale]</text>

            <line x1="10" y1="98" x2="750" y2="98" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1" />

            <text x="10" y="115" font-size="9.2" font-weight="700" fill="#0f766e">WITH THIS HUB (1:N SOLUTION INDUSTRIALIZATION)</text>

            <rect x="10" y="123" width="166" height="58" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.4" />
            <text x="20" y="140" font-size="9.4" font-weight="700" fill="#115e59">1. Proven Once</text>
            <text x="20" y="154" font-size="8.3" fill="#334e68">Validated &amp; measured in live</text>
            <text x="20" y="166" font-size="8.3" fill="#334e68">Customer-Zero production</text>

            <path d="M176 152 H198" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-ok)" />

            <rect x="202" y="123" width="166" height="58" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="212" y="140" font-size="9.4" font-weight="700" fill="#183e62">2. Cleaned &amp; Vetted</text>
            <text x="212" y="154" font-size="8.3" fill="#334e68">Automated data strip + peer</text>
            <text x="212" y="166" font-size="8.3" fill="#334e68">check against MS Learn</text>

            <path d="M368 152 H390" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-ok)" />

            <rect x="394" y="123" width="166" height="58" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="404" y="140" font-size="9.4" font-weight="700" fill="#183e62">3. Turnkey Package</text>
            <text x="404" y="154" font-size="8.3" fill="#334e68">Playbook + White Paper +</text>
            <text x="404" y="166" font-size="8.3" fill="#334e68">3-Week Scope + Code Kits</text>

            <path d="M560 152 H582" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-ok)" />

            <rect x="586" y="123" width="164" height="58" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.5" />
            <text x="596" y="140" font-size="9.4" font-weight="700" fill="#115e59">Result: 1:N Leverage</text>
            <text x="596" y="154" font-size="8.3" fill="#334e68">Any field team delivers fast</text>
            <text x="596" y="167" font-size="8.0" font-weight="700" fill="#0f766e">[Repeatable Impact]</text>
          </svg>
        </div>
      </div>
    </section>

    <!-- Story Step 3: Proof in Action (Playbook 01 Overview) -->
    <section id="step-3-proof" class="eo-section">
      <div class="ms-container">
        <div class="eo-step-header">
          <span class="eo-step-badge">03 &middot; LIVE TODAY &middot; PLAYBOOK 01</span>
          <h2 class="eo-h2">What a Finished Playbook Looks Like: Stopping the Model-Upgrade Spike</h2>
          <p class="eo-sub">
            Our first live playbook solves a problem hitting enterprises moving from GPT-4 to GPT-5.6 and GPT-6:
            <strong>tiny dynamic changes at the top of a prompt silently break Azure’s prompt cache</strong>,
            driving a 2.56&times; jump in required capacity and latency.
          </p>
        </div>

        <div class="arch-diagram eo-diagram">
          <svg
            viewBox="0 0 760 156"
            role="img"
            aria-labelledby="eo-d3-title eo-d3-desc"
            font-family="Segoe UI, Inter, -apple-system, sans-serif"
          >
            <title id="eo-d3-title">Playbook 01 Architecture Summary Flow</title>
            <desc id="eo-d3-desc">Shows 1 Upgrade Trigger to GPT-5.6 and GPT-6, 2 Hidden Cost Trap where changing early text causes a 2.56x capacity spike, 3 Prompt and Gateway Fix placing stable instructions first with overflow routing, 4 Automated Guardrails scanning code and live telemetry, and 5 Verified Result saving 2.56x capacity and 71 percent seasonal cost.</desc>
            <defs>
              <marker id="eo-arr-p1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8Z" fill="#0f766e" />
              </marker>
            </defs>

            <!-- Box 1 -->
            <rect x="8" y="20" width="132" height="96" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="16" y="39" font-size="9.2" font-weight="700" fill="#183e62">1. Upgrade Trigger</text>
            <text x="16" y="55" font-size="8.2" fill="#334e68">Apps migrate from</text>
            <text x="16" y="68" font-size="8.2" fill="#334e68">GPT-4 / o3-mini to</text>
            <text x="16" y="81" font-size="8.2" fill="#334e68">GPT-5.6, 6 &amp; 6.1</text>
            <text x="16" y="102" font-size="7.8" font-weight="700" fill="#1d4ed8">[Model Retirement]</text>

            <path d="M140 68 H158" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-p1)" />

            <!-- Box 2 -->
            <rect x="162" y="20" width="134" height="96" rx="6" fill="#fff7eb" stroke="#d97706" stroke-width="1.4" />
            <text x="170" y="39" font-size="9.2" font-weight="700" fill="#92400e">2. Hidden Trap</text>
            <text x="170" y="55" font-size="8.2" fill="#334e68">Timestamps or user IDs</text>
            <text x="170" y="68" font-size="8.2" fill="#334e68">at top of prompt zero</text>
            <text x="170" y="81" font-size="8.2" fill="#334e68">out Azure memory reuse</text>
            <text x="170" y="102" font-size="7.8" font-weight="700" fill="#b45309">[2.56× Capacity Spike]</text>

            <path d="M296 68 H314" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-p1)" />

            <!-- Box 3 -->
            <rect x="318" y="20" width="136" height="96" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="326" y="39" font-size="9.2" font-weight="700" fill="#183e62">3. Architecture Fix</text>
            <text x="326" y="55" font-size="8.2" fill="#334e68">Put stable rules &amp; tools</text>
            <text x="326" y="68" font-size="8.2" fill="#334e68">first; route burst traffic</text>
            <text x="326" y="81" font-size="8.2" fill="#334e68">safely to pay-as-you-go</text>
            <text x="326" y="102" font-size="7.8" font-weight="700" fill="#1d4ed8">[80%+ Cache Reuse]</text>

            <path d="M454 68 H472" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-p1)" />

            <!-- Box 4 -->
            <rect x="476" y="20" width="132" height="96" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="484" y="39" font-size="9.2" font-weight="700" fill="#183e62">4. CI &amp; Live Gates</text>
            <text x="484" y="55" font-size="8.2" fill="#334e68">Automated code check</text>
            <text x="484" y="68" font-size="8.2" fill="#334e68">+ live dashboard query</text>
            <text x="484" y="81" font-size="8.2" fill="#334e68">block bad changes</text>
            <text x="484" y="102" font-size="7.8" font-weight="700" fill="#1d4ed8">[15-Point Check]</text>

            <path d="M608 68 H626" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-p1)" />

            <!-- Box 5 -->
            <rect x="630" y="20" width="122" height="96" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.5" />
            <text x="638" y="39" font-size="9.2" font-weight="700" fill="#115e59">5. Proven Result</text>
            <text x="638" y="55" font-size="8.2" fill="#334e68">2.56× spike avoided</text>
            <text x="638" y="68" font-size="8.2" fill="#334e68">&amp; 71% peak-season</text>
            <text x="638" y="81" font-size="8.2" fill="#334e68">cost saved</text>
            <text x="638" y="102" font-size="7.8" font-weight="700" fill="#0f766e">[Cutover Ready]</text>

            <text x="10" y="142" font-size="8.5" fill="#526c80">
              Playbook 01 packages the complete architecture fix, interactive capacity calculator, regulated-industry profile, and automation scripts.
            </text>
          </svg>
        </div>

        <div class="eo-box-grid">
          <a
            v-for="item in playbookOneBox"
            :key="item.title"
            :href="withBase(item.href)"
            class="eo-box-card"
          >
            <span class="eo-box-tag">{{ item.tag }}</span>
            <h3 class="eo-box-title">{{ item.title }}</h3>
            <p class="eo-box-body">{{ item.body }}</p>
            <span class="eo-box-cta">{{ item.cta }} &rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Story Step 4: How the Playbook Series Connects -->
    <section id="step-4-series" class="eo-section eo-section-alt">
      <div class="ms-container">
        <div class="eo-step-header">
          <span class="eo-step-badge">04 &middot; SERIES ROADMAP</span>
          <h2 class="eo-h2">One Connected Three-Playbook Series</h2>
          <p class="eo-sub">
            Rather than publishing disconnected articles, the hub is organized around the three production layers
            every enterprise Azure AI platform must get right—with open co-author roles for specialist leads.
          </p>
        </div>

        <div class="arch-diagram eo-diagram">
          <svg
            viewBox="0 0 760 186"
            role="img"
            aria-labelledby="eo-d4-title eo-d4-desc"
            font-family="Segoe UI, Inter, -apple-system, sans-serif"
          >
            <title id="eo-d4-title">Connected Three-Playbook Enterprise AI Architecture Series</title>
            <desc id="eo-d4-desc">Playbook 01 Model Efficiency and Capacity (Live), Playbook 02 API Gateway and Overflow Routing (Chartered), and Playbook 03 Multi-Region Continuity and Failover (Chartered) combine into one Production-Ready Enterprise AI Foundation.</desc>
            <defs>
              <marker id="eo-arr-ser" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8Z" fill="#0f766e" />
              </marker>
            </defs>

            <!-- Playbook 01 -->
            <rect x="10" y="12" width="462" height="44" rx="6" fill="#eaf7f5" stroke="#0f766e" stroke-width="1.5" />
            <text x="20" y="30" font-size="9.4" font-weight="700" fill="#115e59">
              Playbook 01 · Model Speed, Prompt Reuse &amp; Capacity Sizing
            </text>
            <text x="20" y="45" font-size="8.2" fill="#334e68">
              Keep latency low and reserved capacity predictable during GPT-5.6 / 6 / 6.1 upgrades
            </text>
            <rect x="386" y="18" width="76" height="18" rx="9" fill="#0f766e" />
            <text x="424" y="30" text-anchor="middle" font-size="7.6" font-weight="700" fill="#ffffff">LIVE v1.0</text>

            <!-- Playbook 02 -->
            <rect x="10" y="66" width="462" height="44" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="20" y="84" font-size="9.4" font-weight="700" fill="#183e62">
              Playbook 02 · API Gateway Traffic Control &amp; Overflow Routing
            </text>
            <text x="20" y="99" font-size="8.2" fill="#334e68">
              Route bursts across Azure AI pools &amp; spill over cleanly when reserved quota fills
            </text>
            <rect x="374" y="72" width="88" height="18" rx="9" fill="#dbeafe" />
            <text x="418" y="84" text-anchor="middle" font-size="7.5" font-weight="700" fill="#1e40af">CHARTERED</text>

            <!-- Playbook 03 -->
            <rect x="10" y="120" width="462" height="44" rx="6" fill="#fff7eb" stroke="#d97706" stroke-width="1.4" />
            <text x="20" y="138" font-size="9.4" font-weight="700" fill="#92400e">
              Playbook 03 · Multi-Region Continuity, Residency &amp; Failover Drills
            </text>
            <text x="20" y="153" font-size="8.2" fill="#334e68">
              Keep regulated AI apps running across regions within agreed recovery targets
            </text>
            <rect x="374" y="126" width="88" height="18" rx="9" fill="#fef3c7" />
            <text x="418" y="138" text-anchor="middle" font-size="7.5" font-weight="700" fill="#92400e">CHARTERED</text>

            <!-- Converging arrows -->
            <path d="M472 34 H504 V72 H524" stroke="#0f766e" stroke-width="1.6" fill="none" marker-end="url(#eo-arr-ser)" />
            <path d="M472 88 H524" stroke="#0f766e" stroke-width="1.8" fill="none" marker-end="url(#eo-arr-ser)" />
            <path d="M472 142 H504 V104 H524" stroke="#0f766e" stroke-width="1.6" fill="none" marker-end="url(#eo-arr-ser)" />

            <!-- Unified Outcome -->
            <rect x="528" y="34" width="222" height="108" rx="7" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.6" />
            <text x="540" y="56" font-size="9.8" font-weight="700" fill="#115e59">One Production Foundation</text>
            <text x="540" y="74" font-size="8.3" fill="#334e68">&bull; Predictable capacity &amp; TCO</text>
            <text x="540" y="89" font-size="8.3" fill="#334e68">&bull; Zero-throttle burst handling</text>
            <text x="540" y="104" font-size="8.3" fill="#334e68">&bull; Verified regional resilience</text>
            <text x="540" y="126" font-size="8.0" font-weight="700" fill="#0f766e">[Multi-Author Field Standard]</text>

            <text x="10" y="179" font-size="8.5" fill="#526c80">
              Each playbook owns one layer of enterprise AI readiness and pairs with the same repeatable 3-week delivery motion.
            </text>
          </svg>
        </div>
      </div>
    </section>

    <!-- Story Step 5: How Teams Deliver It in 3 Weeks -->
    <section id="step-5-delivery" class="eo-section">
      <div class="ms-container">
        <div class="eo-step-header">
          <span class="eo-step-badge">05 &middot; REPEATABLE FIELD EXECUTION</span>
          <h2 class="eo-h2">How Any Team Runs a Playbook with a Customer in 3 Weeks</h2>
          <p class="eo-sub">
            Every playbook includes a concrete engagement blueprint—turning architectural guidance into a predictable
            3-week customer delivery with clear roles and measurable exit criteria.
          </p>
        </div>

        <div class="arch-diagram eo-diagram">
          <svg
            viewBox="0 0 760 152"
            role="img"
            aria-labelledby="eo-d5-title eo-d5-desc"
            font-family="Segoe UI, Inter, -apple-system, sans-serif"
          >
            <title id="eo-d5-title">Repeatable Three-Week Customer Readiness Engagement Flow</title>
            <desc id="eo-d5-desc">Shows 1 30-Minute Triage, 2 Week 1 Baseline Audit, 3 Week 2 Prompt and Gateway Refactor, 4 Week 3 Load Test and Sign-Off, and 5 Standing Production Guardrail.</desc>
            <defs>
              <marker id="eo-arr-del" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8Z" fill="#0f766e" />
              </marker>
            </defs>

            <rect x="8" y="18" width="132" height="94" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="16" y="37" font-size="9.2" font-weight="700" fill="#183e62">1. 30-Min Triage</text>
            <text x="16" y="53" font-size="8.2" fill="#334e68">6 intake questions</text>
            <text x="16" y="66" font-size="8.2" fill="#334e68">score model timeline,</text>
            <text x="16" y="79" font-size="8.2" fill="#334e68">traffic &amp; isolation</text>
            <text x="16" y="99" font-size="7.8" font-weight="700" fill="#1d4ed8">[Intake Scorecard]</text>

            <path d="M140 65 H158" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-del)" />

            <rect x="162" y="18" width="134" height="94" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="170" y="37" font-size="9.2" font-weight="700" fill="#183e62">2. Week 1: Baseline</text>
            <text x="170" y="53" font-size="8.2" fill="#334e68">Scan code &amp; measure</text>
            <text x="170" y="66" font-size="8.2" fill="#334e68">current cache misses,</text>
            <text x="170" y="79" font-size="8.2" fill="#334e68">latency &amp; capacity</text>
            <text x="170" y="99" font-size="7.8" font-weight="700" fill="#1d4ed8">[Baseline Report]</text>

            <path d="M296 65 H314" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-del)" />

            <rect x="318" y="18" width="134" height="94" rx="6" fill="#edf3fb" stroke="#5b87b2" stroke-width="1.4" />
            <text x="326" y="37" font-size="9.2" font-weight="700" fill="#183e62">3. Week 2: Refactor</text>
            <text x="326" y="53" font-size="8.2" fill="#334e68">Reorder prompts &amp;</text>
            <text x="326" y="66" font-size="8.2" fill="#334e68">configure gateway</text>
            <text x="326" y="79" font-size="8.2" fill="#334e68">overflow in staging</text>
            <text x="326" y="99" font-size="7.8" font-weight="700" fill="#1d4ed8">[Staging Verified]</text>

            <path d="M452 65 H470" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-del)" />

            <rect x="474" y="18" width="134" height="94" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.4" />
            <text x="482" y="37" font-size="9.2" font-weight="700" fill="#115e59">4. Week 3: Sign-Off</text>
            <text x="482" y="53" font-size="8.2" fill="#334e68">Load-test peak traffic,</text>
            <text x="482" y="66" font-size="8.2" fill="#334e68">right-size capacity &amp;</text>
            <text x="482" y="79" font-size="8.2" fill="#334e68">sign 15-point checklist</text>
            <text x="482" y="99" font-size="7.8" font-weight="700" fill="#0f766e">[Cutover Ready]</text>

            <path d="M608 65 H626" stroke="#0f766e" stroke-width="1.7" marker-end="url(#eo-arr-del)" />

            <rect x="630" y="18" width="122" height="94" rx="6" fill="#eaf4f5" stroke="#0f766e" stroke-width="1.5" />
            <text x="638" y="37" font-size="9.2" font-weight="700" fill="#115e59">5. Ongoing Guard</text>
            <text x="638" y="53" font-size="8.2" fill="#334e68">Automated CI &amp; live</text>
            <text x="638" y="66" font-size="8.2" fill="#334e68">alerts stay active for</text>
            <text x="638" y="79" font-size="8.2" fill="#334e68">every future release</text>
            <text x="638" y="99" font-size="7.8" font-weight="700" fill="#0f766e">[Protected in Prod]</text>

            <text x="10" y="138" font-size="8.5" fill="#526c80">
              Clear roles across Solution Architect, Customer App Lead, Platform/SRE, and FinOps keep engagements bounded to 3 weeks.
            </text>
          </svg>
        </div>
      </div>
    </section>
  </div>
</template>
