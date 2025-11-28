const CURRENCY_FORMATS = {
  IDR: { locale: 'id-ID', symbol: 'Rp', decimals: 2 },
  USD: { locale: 'en-US', symbol: '$', decimals: 2 },
  EUR: { locale: 'de-DE', symbol: '€', decimals: 2 },
  GBP: { locale: 'en-GB', symbol: '£', decimals: 2 },
  JPY: { locale: 'ja-JP', symbol: '¥', decimals: 0 },
  SGD: { locale: 'en-SG', symbol: 'S$', decimals: 2 },
  MYR: { locale: 'ms-MY', symbol: 'RM', decimals: 2 },
}

export function formatCurrency(amount, currency = 'IDR') {
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.IDR
  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: format.decimals,
    maximumFractionDigits: format.decimals,
  }).format(amount)
}

/**
 * Format currency in compact notation (e.g., Rp 10M)
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (IDR, USD, etc.)
 * @returns {string} Formatted compact currency string
 */
export function formatCurrencyCompact(amount, currency = 'IDR') {
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.IDR

  try {
    const formatted = new Intl.NumberFormat(format.locale, {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(amount)

    return `${format.symbol} ${formatted}`
  } catch (error) {
    console.error('Error formatting compact currency:', error)
    return `${format.symbol} ${amount}`
  }
}

export const SUPPORTED_CURRENCIES = [
  { value: 'IDR', label: 'Indonesian Rupiah (Rp)', symbol: 'Rp' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
  { value: 'MYR', label: 'Malaysian Ringgit (RM)', symbol: 'RM' },
]

export function getCurrencySymbol(currency) {
  const curr = SUPPORTED_CURRENCIES.find((c) => c.value === currency)
  return curr?.symbol || ''
}
