/**
 * Locale Store
 *
 * Manages application locale state and persistence
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  // State
  const currentLocale = ref(i18n.global.locale.value)
  const availableLocales = ref(['id', 'en'])

  /**
   * Change application locale
   * @param {string} locale - Locale code ('id' or 'en')
   */
  function setLocale(locale) {
    if (!availableLocales.value.includes(locale)) {
      console.warn(`Locale ${locale} not supported, falling back to 'id'`)
      locale = 'id'
    }

    // Update state
    currentLocale.value = locale
    i18n.global.locale.value = locale

    // Persist to localStorage
    localStorage.setItem('locale', locale)

    // Update HTML lang attribute for accessibility
    document.documentElement.lang = locale

    // Update dayjs locale if available (for date formatting)
    if (window.dayjs) {
      window.dayjs.locale(locale)
    }
  }

  /**
   * Get display label for locale
   * @param {string} locale - Locale code
   * @returns {string} Display label
   */
  function getLocaleLabel(locale) {
    const labels = {
      id: 'Bahasa Indonesia',
      en: 'English'
    }
    return labels[locale] || locale
  }

  /**
   * Get flag emoji for locale (optional, for UI)
   * @param {string} locale - Locale code
   * @returns {string} Flag emoji
   */
  function getLocaleFlag(locale) {
    const flags = {
      id: '🇮🇩',
      en: '🇬🇧'
    }
    return flags[locale] || '🌐'
  }

  return {
    currentLocale,
    availableLocales,
    setLocale,
    getLocaleLabel,
    getLocaleFlag
  }
})
