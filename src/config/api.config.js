/**
 * API Configuration
 *
 * This file contains all API endpoint configurations and constants.
 * Base URL is configured via environment variables (VITE_API_BASE_URL).
 *
 * Development: http://localhost:8081/api/v1
 * Production: https://api.expensetracker.com/api/v1
 */

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
    ME: '/me',
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

  // Dashboard
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    SUMMARY_BY_WALLET: (walletId) => `/dashboard/summary?walletId=${walletId}`,
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
}
