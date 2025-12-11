/**
 * Vue I18n Configuration
 *
 * Internationalization setup for Indonesian (default) and English
 */

import { createI18n } from 'vue-i18n'
import numberFormats from './number-formats'
import datetimeFormats from './datetime-formats'

// Import locale messages
import id from '@/locales/id'
import en from '@/locales/en'

// Get saved locale or default to Indonesian
const savedLocale = localStorage.getItem('locale') || 'id'

const i18n = createI18n({
  legacy: false,                    // Use Composition API mode
  locale: savedLocale,              // Start with saved locale or 'id'
  fallbackLocale: 'id',             // Always fallback to Indonesian
  messages: {
    id,
    en
  },
  numberFormats,
  datetimeFormats,
  missing: (locale, key) => {
    // Warn in development about missing translations
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation: ${locale}.${key}`)
    }
    // Return key as fallback
    return key
  },
  globalInjection: true,            // Enable $t, $d, $n globally
  warnHtmlMessage: false            // Disable HTML in message warnings
})

export default i18n
