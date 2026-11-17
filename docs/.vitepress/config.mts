import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/azure-ai-playbooks/'

export default defineConfig({
  title: 'Azure AI Playbooks',
  description:
    'Customer-Zero validated architecture playbooks, readiness gates, PTU sizing economics, and repeatable delivery kits for Microsoft Foundry and Azure AI.',
  lang: 'en-US',
  base,
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Operating Model', link: '/operating-model/industrialization-pipeline' },
        {
          text: 'Playbooks',
          items: [
            {
              text: '01 · Prompt Caching & PTU Readiness (GPT-5.6+)',
              link: '/playbooks/prompt-caching/start/01-executive-thesis',
            },
            {
              text: 'Profile · Regulated Multi-Engagement & Compliance',
              link: '/playbooks/prompt-caching/profiles/regulated-multi-engagement',
            },
            {
              text: '02 · Multi-Backend APIM Gateway & Spillover (Charter)',
              link: '/playbooks/series-charters/#playbook-02-multi-backend-foundry-apim-gateway-spillover',
            },
            {
              text: '03 · Multi-Region Foundry BCP & Resiliency (Charter)',
              link: '/playbooks/series-charters/#playbook-03-multi-region-foundry-bcp-failover-drills',
            },
          ],
        },
        { text: 'Scoping', link: '/operating-model/delivery-scoping' },
        { text: 'Papers & Kits', link: '/papers/' },
      ],

      sidebar: {
        '/operating-model/': [
          {
            text: 'Field Infrastructure & Governance',
            items: [
              {
                text: '01 · Industrialization Pipeline',
                link: '/operating-model/industrialization-pipeline',
              },
              {
                text: '02 · Governance & Quality Signals',
                link: '/operating-model/governance-and-quality',
              },
              {
                text: '03 · Repeatable Delivery Scope',
                link: '/operating-model/delivery-scoping',
              },
            ],
          },
          {
            text: 'Playbook Series & Ownership',
            items: [
              {
                text: 'Profile · Regulated Multi-Engagement',
                link: '/playbooks/prompt-caching/profiles/regulated-multi-engagement',
              },
              {
                text: 'Series Roadmap & Co-Author Charters',
                link: '/playbooks/series-charters/',
              },
              {
                text: 'White Papers & Engineering Kits',
                link: '/papers/',
              },
            ],
          },
        ],

        '/playbooks/series-charters/': [
          {
            text: 'Playbook Series & Ownership',
            items: [
              {
                text: 'Series Roadmap & Co-Author Charters',
                link: '/playbooks/series-charters/',
              },
              {
                text: '01 · Prompt Caching & PTU (Live)',
                link: '/playbooks/prompt-caching/start/01-executive-thesis',
              },
              {
                text: 'Industrialization Pipeline',
                link: '/operating-model/industrialization-pipeline',
              },
              {
                text: 'Repeatable Delivery Scope',
                link: '/operating-model/delivery-scoping',
              },
            ],
          },
        ],

        '/papers/': [
          {
            text: 'White Papers & Engineering Kits',
            items: [
              { text: 'Overview & Index', link: '/papers/' },
              {
                text: 'White Paper · Prompt Caching on GPT-5.6+',
                link: '/papers/foundry-prompt-caching-gpt56-whitepaper',
              },
              {
                text: 'Kits · PCR001–006 Linter & KQL Gate',
                link: '/papers/engineering-kits',
              },
              {
                text: 'Template · C1–C15 PR Readiness Checklist',
                link: '/papers/migration-readiness-checklist',
              },
            ],
          },
          {
            text: 'Related Playbooks & Scoping',
            items: [
              {
                text: 'Playbook 01 · Prompt Caching & PTU',
                link: '/playbooks/prompt-caching/start/01-executive-thesis',
              },
              {
                text: 'Repeatable 3-Week Delivery Scope',
                link: '/operating-model/delivery-scoping',
              },
            ],
          },
        ],

        '/playbooks/prompt-caching/': [
          {
            text: 'Start',
            items: [
              {
                text: '01 · Executive Thesis & Q&A',
                link: '/playbooks/prompt-caching/start/01-executive-thesis',
              },
              {
                text: '02 · Stateless Agents & Hydration Tax',
                link: '/playbooks/prompt-caching/start/02-stateless-agents',
              },
              {
                text: '03 · KV Mechanics & GPT-5.6+ Delta',
                link: '/playbooks/prompt-caching/start/03-kv-mechanics',
              },
            ],
          },
          {
            text: 'Qualify & Size',
            items: [
              {
                text: '04 · SKU Boundary & PTU Calculator',
                link: '/playbooks/prompt-caching/qualify/04-ptu-sizing-math',
              },
              {
                text: '05 · Agent Node Archetypes',
                link: '/playbooks/prompt-caching/qualify/05-node-archetypes',
              },
              {
                text: '06 · Break-Even Read/Write Math',
                link: '/playbooks/prompt-caching/qualify/06-breakeven-economics',
              },
            ],
          },
          {
            text: 'Design',
            items: [
              {
                text: '07 · Scope × Volatility Prefix Order',
                link: '/playbooks/prompt-caching/design/07-prefix-taxonomy',
              },
              {
                text: '08 · Prefix-Breaking Anti-Patterns',
                link: '/playbooks/prompt-caching/design/08-anti-patterns',
              },
              {
                text: '09 · Keys, >15 RPM Sharding & TTL',
                link: '/playbooks/prompt-caching/design/09-wire-controls',
              },
              {
                text: '10 · APIM PTU-to-Standard Spillover',
                link: '/playbooks/prompt-caching/design/10-apim-spillover',
              },
            ],
          },
          {
            text: 'Validate',
            items: [
              {
                text: '11 · 7-Layer Pipeline & 7-Step Protocol',
                link: '/playbooks/prompt-caching/validate/11-seven-layer-gates',
              },
              {
                text: '12 · PCR001–006 Linter & DeepEval',
                link: '/playbooks/prompt-caching/validate/12-ci-lint-deepeval',
              },
            ],
          },
          {
            text: 'Govern',
            items: [
              {
                text: '13 · OTel Spans & Two-Regime KQL Gate',
                link: '/playbooks/prompt-caching/govern/13-otel-kql-gate',
              },
              {
                text: '14 · 15-Point Readiness Standard',
                link: '/playbooks/prompt-caching/govern/14-readiness-standard',
              },
            ],
          },
          {
            text: 'Workload Profiles & Reference',
            items: [
              {
                text: 'Profile · Regulated Multi-Engagement & Compliance',
                link: '/playbooks/prompt-caching/profiles/regulated-multi-engagement',
              },
              {
                text: '15 · Verification Matrix & Sources',
                link: '/playbooks/prompt-caching/sources',
              },
              {
                text: 'Repeatable 3-Week Delivery Scope',
                link: '/operating-model/delivery-scoping',
              },
              {
                text: 'White Paper & Copy-Ready Kits',
                link: '/papers/',
              },
            ],
          },
        ],
      },

      search: { provider: 'local' },

      editLink: {
        pattern: 'https://github.com/jluocsa/azure-ai-playbooks/edit/main/docs/:path',
        text: 'Suggest an edit to this page on GitHub',
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/jluocsa/azure-ai-playbooks' },
      ],

      footer: {
        message:
          'Community Architecture Playbooks — Customer-Zero validated, sanitized, and grounded in public Microsoft Learn documentation.',
        copyright: 'CC BY 4.0 (Docs & White Papers) · MIT (Code, KQL & Lint Kits)',
      },
    },
})
