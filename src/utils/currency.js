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

/**
 * Format number with thousand separator (dots for Indonesian)
 * @param {number|string} value - The value to format
 * @returns {string} Formatted string (e.g., "1.000.000")
 */
export function formatNumber(value) {
  // Handle null, undefined, empty string
  if (value === null || value === undefined || value === '') {
    return ''
  }

  // Convert to string and remove any existing formatting
  const stringValue = String(value).replace(/\./g, '')

  // Parse to number
  const number = parseFloat(stringValue)

  // Check if it's a valid number
  if (isNaN(number)) {
    return ''
  }

  // Format with thousand separator (Indonesian style)
  return number.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * Parse formatted number string to actual number
 * @param {string} formattedValue - The formatted string (e.g., "1.000.000")
 * @returns {number|null} The actual number (e.g., 1000000) or null if invalid
 */
export function parseNumber(formattedValue) {
  // Handle null, undefined, empty string
  if (formattedValue === null || formattedValue === undefined || formattedValue === '') {
    return null
  }

  // Remove thousand separators (dots) and convert to number
  const stringValue = String(formattedValue).replace(/\./g, '')
  const number = parseFloat(stringValue)

  // Return null for invalid numbers
  return isNaN(number) ? null : number
}

/**
 * Validate if input is a valid number input
 * Allows digits only (dots will be auto-formatted)
 * @param {string} value - The input value
 * @returns {boolean} True if valid
 */
export function isValidNumberInput(value) {
  // Allow empty
  if (value === '') return true

  // Remove dots for validation
  const withoutDots = value.replace(/\./g, '')

  // Check if remaining is all digits
  return /^\d+$/.test(withoutDots)
}
