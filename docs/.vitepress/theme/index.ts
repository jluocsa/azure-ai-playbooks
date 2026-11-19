import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ExecutiveOverview from './components/ExecutiveOverview.vue'
import HomeShowcase from './components/HomeShowcase.vue'
import IntakeScorecard from './components/IntakeScorecard.vue'
import PageBrief from './components/PageBrief.vue'
import PlaybookMeta from './components/PlaybookMeta.vue'
import PtuCalculator from './components/PtuCalculator.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ExecutiveOverview', ExecutiveOverview)
    app.component('HomeShowcase', HomeShowcase)
    app.component('IntakeScorecard', IntakeScorecard)
    app.component('PageBrief', PageBrief)
    app.component('PlaybookMeta', PlaybookMeta)
    app.component('PtuCalculator', PtuCalculator)
  },
} satisfies Theme
