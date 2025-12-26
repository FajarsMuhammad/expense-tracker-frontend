/**
 * API Configuration
 *
 * This file contains all API endpoint configurations and constants.
 * Base URL is configured via environment variables (VITE_API_BASE_URL).
 *
 * Development: http://localhost:8081/api/v1
 * Production: https://api.expensetracker.com/api/v1
 */

// Validate required environment variables
const validateEnv = () => {
  const required = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
    VITE_MIDTRANS_IS_PRODUCTION: import.meta.env.VITE_MIDTRANS_IS_PRODUCTION,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => value === undefined)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file or copy from .env.example'
    )
  }
}

// Run validation
validateEnv()

// API Base URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// API version prefix (already included in base URL via .env)
export const API_VERSION = '/api/v1'

/**
 * API Endpoints
 * All endpoints are relative to the base URL
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
  },

  // User
  USER: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
  },

  // Wallets
  WALLETS: {
    BASE: '/wallets',
    BY_ID: (id) => `/wallets/${id}`,
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    BY_TYPE: (type) => `/categories?type=${type}`,
  },

  // Transactions
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ID: (id) => `/transactions/${id}`,
  },

  // Debts
  DEBTS: {
    BASE: '/debts',
    BY_ID: (id) => `/debts/${id}`,
    PAYMENTS: (id) => `/debts/${id}/payments`,
    PAYMENT_BY_ID: (debtId, paymentId) => `/debts/${debtId}/payments/${paymentId}`,
    MARK_PAID: (id) => `/debts/${id}/mark-paid`,
  },

  // Dashboard
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    SUMMARY_BY_WALLET: (walletId) => `/dashboard/summary?walletId=${walletId}`,
  },

  // Reports
  REPORTS: {
    SUMMARY: '/reports/summary',
    TRANSACTIONS: '/reports/transactions',
    DEBTS: '/reports/debts',
    CATEGORY_BREAKDOWN: '/reports/category-breakdown',
    TREND: '/reports/trend',
  },

  // Export
  EXPORT: {
    TRANSACTIONS: '/export/transactions',
    DEBTS: '/export/debts',
    SUMMARY: '/export/summary',
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    BASE: '/subscriptions',
    ME: '/subscriptions/me',
    UPGRADE: '/subscriptions/upgrade',
    TRIAL_ELIGIBILITY: '/subscriptions/trial-eligibility',
  },

  // Payments
  PAYMENTS: {
    BASE: '/payments',
    SUBSCRIPTION: '/payments/subscription',
  },
}

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
}

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000 // 30 seconds

/**
 * Supported currencies
 */
export const SUPPORTED_CURRENCIES = ['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR']

/**
 * Transaction types
 */
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
}

/**
 * Category types
 */
export const CATEGORY_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
}

/**
 * Debt types
 */
export const DEBT_TYPES = {
  PAYABLE: 'PAYABLE',
  RECEIVABLE: 'RECEIVABLE',
}

/**
 * Debt status
 */
export const DEBT_STATUS = {
  OPEN: 'OPEN',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
}

/**
 * Export formats
 */
export const EXPORT_FORMATS = {
  CSV: 'CSV',
  EXCEL: 'EXCEL',
  PDF: 'PDF',
}

/**
 * Export types
 */
export const EXPORT_TYPES = {
  TRANSACTIONS: 'TRANSACTIONS',
  DEBTS: 'DEBTS',
  SUMMARY: 'SUMMARY',
}

/**
 * Granularity for trend data
 */
export const GRANULARITY = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
}

/**
 * Subscription tiers
 */
export const SUBSCRIPTION_TIERS = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
}

/**
 * Subscription status
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  TRIAL: 'TRIAL',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING',
}

/**
 * Payment status
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
}

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  GOPAY: 'GOPAY',
  QRIS: 'QRIS',
  BCA_VA: 'BCA_VA',
  BNI_VA: 'BNI_VA',
  BRI_VA: 'BRI_VA',
  MANDIRI_VA: 'MANDIRI_VA',
  PERMATA_VA: 'PERMATA_VA',
  CIMB_VA: 'CIMB_VA',
  INDOMARET: 'INDOMARET',
  ALFAMART: 'ALFAMART',
}

export default {
  API_BASE_URL,
  API_VERSION,
  API_ENDPOINTS,
  HTTP_METHODS,
  HTTP_STATUS,
  REQUEST_TIMEOUT,
  SUPPORTED_CURRENCIES,
  TRANSACTION_TYPES,
  CATEGORY_TYPES,
  DEBT_TYPES,
  DEBT_STATUS,
  EXPORT_FORMATS,
  EXPORT_TYPES,
  GRANULARITY,
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
}
