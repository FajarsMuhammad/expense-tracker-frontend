/**
 * Reports Service
 *
 * Handles all API calls related to financial reports and analytics.
 * Provides methods for fetching summary reports, transaction reports,
 * debt reports, category breakdowns, and trend data.
 */

import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

/**
 * Build query string from parameters, excluding null/undefined values
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
function buildQueryString(params = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      // Handle arrays (e.g., walletIds, categoryIds)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((item) => queryParams.append(key, item))
        }
      } else {
        queryParams.append(key, value)
      }
    }
  })

  return queryParams.toString()
}

export default {
  /**
   * Get financial summary report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {Array<string>} params.walletIds - Wallet IDs to filter
   * @param {Array<string>} params.categoryIds - Category IDs to filter
   * @returns {Promise<Object>} Financial summary response
   */
  async getFinancialSummary(params = {}) {
    const queryString = buildQueryString(params)
    const url = queryString
      ? `${API_ENDPOINTS.REPORTS.SUMMARY}?${queryString}`
      : API_ENDPOINTS.REPORTS.SUMMARY

    const response = await api.get(url)
    return response.data
  },

  /**
   * Get transaction report with pagination
   * @param {Object} params - Filter and pagination parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {Array<string>} params.walletIds - Wallet IDs to filter
   * @param {Array<string>} params.categoryIds - Category IDs to filter
   * @param {string} params.type - Transaction type (INCOME/EXPENSE)
   * @param {number} params.page - Page number (0-indexed)
   * @param {number} params.size - Page size
   * @returns {Promise<Object>} Paginated transaction report
   */
  async getTransactionReport(params = {}) {
    const queryString = buildQueryString({
      ...params,
      page: params.page ?? 0,
      size: params.size ?? 20,
    })
    const url = queryString
      ? `${API_ENDPOINTS.REPORTS.TRANSACTIONS}?${queryString}`
      : API_ENDPOINTS.REPORTS.TRANSACTIONS

    const response = await api.get(url)
    return response.data
  },

  /**
   * Get debt report
   * @param {Object} params - Filter parameters
   * @param {string} params.type - Debt type (PAYABLE/RECEIVABLE)
   * @param {string} params.status - Debt status (OPEN/PARTIAL/PAID)
   * @param {boolean} params.includePayments - Include payment history
   * @returns {Promise<Object>} Debt report response
   */
  async getDebtReport(params = {}) {
    const queryString = buildQueryString(params)
    const url = queryString
      ? `${API_ENDPOINTS.REPORTS.DEBTS}?${queryString}`
      : API_ENDPOINTS.REPORTS.DEBTS

    const response = await api.get(url)
    return response.data
  },

  /**
   * Get category breakdown for income or expense
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.type - Category type (INCOME/EXPENSE)
   * @param {Array<string>} params.walletIds - Wallet IDs to filter
   * @returns {Promise<Array>} List of category breakdowns
   */
  async getCategoryBreakdown(params = {}) {
    const queryString = buildQueryString(params)
    const url = queryString
      ? `${API_ENDPOINTS.REPORTS.CATEGORY_BREAKDOWN}?${queryString}`
      : API_ENDPOINTS.REPORTS.CATEGORY_BREAKDOWN

    const response = await api.get(url)
    return response.data
  },

  /**
   * Get income vs expense trend data
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.granularity - Granularity (DAILY/WEEKLY/MONTHLY)
   * @param {Array<string>} params.walletIds - Wallet IDs to filter
   * @returns {Promise<Array>} List of trend data points
   */
  async getTrendData(params = {}) {
    const queryString = buildQueryString({
      ...params,
      granularity: params.granularity ?? 'DAILY',
    })
    const url = queryString
      ? `${API_ENDPOINTS.REPORTS.TREND}?${queryString}`
      : API_ENDPOINTS.REPORTS.TREND

    const response = await api.get(url)
    return response.data
  },
}
