import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/azure-ai-playbooks/'
const siteOrigin = 'https://jluocsa.github.io'
const siteUrl = `${siteOrigin}${base}`
const buildTimestamp = Date.now()

export default defineConfig({
  title: 'Azure AI Playbooks',
  description:
    'Customer-Zero validated architecture playbooks, readiness gates, PTU sizing economics, and repeatable delivery kits for Microsoft Foundry and Azure AI.',
  lang: 'en-US',
  base,
  cleanUrls: true,
  lastUpdated: true,

  transformPageData(pageData) {
    pageData.lastUpdated = buildTimestamp
  },

  sitemap: {
    hostname: siteUrl,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg?v=2` }],
    ['link', { rel: 'icon', sizes: '48x48 32x32 16x16', href: `${base}favicon.ico?v=2` }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}apple-touch-icon.png?v=2` }],
    ['meta', { name: 'theme-color', content: '#0a2652' }],
    ['meta', { property: 'og:site_name', content: 'Enterprise Azure AI Playbooks' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: `${siteUrl}og-card.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Enterprise Azure AI Playbooks — Solution Industrialization Hub' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}og-card.png` }],
  ],

  transformHead({ pageData }) {
    const relPath = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const canonicalUrl = `${siteUrl}${relPath}`
      const pageTitle = pageData.relativePath === 'index.md'
      ? 'Enterprise Azure AI Playbooks | Solution Industrialization Hub'
      : `${pageData.title} | Azure AI Playbooks`
    const pageDesc =
      pageData.description ||
      pageData.frontmatter.description ||
      'Customer-Zero validated architecture playbooks, readiness gates, PTU sizing economics, and repeatable delivery kits for Microsoft Foundry and Azure AI.'

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDesc }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDesc }],
    ]
  },

  themeConfig: {
      logo: '/favicon.svg',
      aside: false,
      outline: false,
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

      lastUpdated: {
        text: 'Last updated',
        formatOptions: {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        },
      },

      editLink: {
        pattern: 'https://github.com/jluocsa/azure-ai-playbooks/edit/main/docs/:path',
        text: 'Suggest an edit to this page on GitHub',
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/jluocsa/azure-ai-playbooks' },
      ],

      footer: {
        message:
          'Enterprise Azure AI Architecture Playbooks — Customer-Zero validated patterns grounded in public <a href="https://learn.microsoft.com/en-us/azure/foundry/" target="_blank" rel="noopener">Microsoft Learn</a> documentation.',
        copyright:
          '&copy; 2026 Contributors &middot; Documentation under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> &middot; Code &amp; Engineering Kits under <a href="https://github.com/jluocsa/azure-ai-playbooks/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>',
      },
    },
})
