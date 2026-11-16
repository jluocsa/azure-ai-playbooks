import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PlaybookMeta from './components/PlaybookMeta.vue'
import PtuCalculator from './components/PtuCalculator.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PlaybookMeta', PlaybookMeta)
    app.component('PtuCalculator', PtuCalculator)
  },
} satisfies Theme
