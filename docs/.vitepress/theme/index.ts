import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeShowcase from './components/HomeShowcase.vue'
import PlaybookMeta from './components/PlaybookMeta.vue'
import PtuCalculator from './components/PtuCalculator.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeShowcase', HomeShowcase)
    app.component('PlaybookMeta', PlaybookMeta)
    app.component('PtuCalculator', PtuCalculator)
  },
} satisfies Theme
