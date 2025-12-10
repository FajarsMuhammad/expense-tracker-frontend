/**
 * Number formats configuration for vue-i18n
 *
 * Hybrid Currency Format Strategy:
 * - Keep original currency symbols (Rp, $, €, etc.)
 * - Adapt number formatting to user's locale
 * - ID: "Rp 1.000.000" (dot separator)
 * - EN: "Rp 1,000,000" (comma separator)
 */

export default {
  id: {
    currency: {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }
  },
  en: {
    currency: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }
  }
}
