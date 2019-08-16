import Vue from 'vue'
import VueI18n from 'vue-i18n'
import blipCardsTranslations from './blipCards'
import { BASE_LOCALE, FALLBACK_LOCALE } from './constants'

Vue.use(VueI18n)
export default new VueI18n({
  locale: BASE_LOCALE, // set locale
  fallbackLocale: FALLBACK_LOCALE,
  messages: blipCardsTranslations
})
