/**
 * useReports Composable
 *
 * Business logic and validation layer for reports functionality.
 * Bridges the UI components with the reports store.
 */

import { storeToRefs } from 'pinia'
import { useReportsStore } from '@/stores/reports'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { GRANULARITY } from '@/config/api.config'

export function useReports() {
  const reportsStore = useReportsStore()
  const uiStore = useUIStore()
  const router = useRouter()

  // Use storeToRefs to maintain reactivity
  const {
    summary,
    summaryLoading,
    summaryError,
    transactionReport,
    transactionReportLoading,
    transactionReportError,
    debtReport,
    debtReportLoading,
    debtReportError,
    categoryBreakdown,
    categoryBreakdownLoading,
    categoryBreakdownError,
    trendData,
    trendLoading,
    trendError,
    filters,
    pagination,
    hasSummary,
    totalIncome,
    totalExpense,
    netBalance,
    transactionCount,
    hasCategoryBreakdown,
    topCategories,
    hasTrendData,
    isLoading,
    hasError,
    activeFilterCount,
  } = storeToRefs(reportsStore)

  // ==================== Load Operations ====================

  /**
   * Load financial summary report
   * @param {Object} params - Optional filter parameters
   */
  async function loadSummary(params = {}) {
    try {
      await reportsStore.fetchSummary(params)
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load summary report',
        type: 'error',
      })
    }
  }

  /**
   * Load transaction report
   * @param {Object} params - Optional filter and pagination parameters
   */
  async function loadTransactionReport(params = {}) {
    try {
      await reportsStore.fetchTransactionReport(params)
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load transaction report',
        type: 'error',
      })
    }
  }

  /**
   * Load more transactions (pagination)
   */
  async function loadMoreTransactions() {
    try {
      await reportsStore.loadMoreTransactions()
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load more transactions',
        type: 'error',
      })
    }
  }

  /**
   * Load debt report
   * @param {Object} params - Optional filter parameters
   */
  async function loadDebtReport(params = {}) {
    try {
      await reportsStore.fetchDebtReport(params)
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load debt report',
        type: 'error',
      })
    }
  }

  /**
   * Load category breakdown
   * @param {Object} params - Optional filter parameters
   */
  async function loadCategoryBreakdown(params = {}) {
    try {
      await reportsStore.fetchCategoryBreakdown(params)
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load category breakdown',
        type: 'error',
      })
    }
  }

  /**
   * Load trend data
   * @param {Object} params - Optional filter parameters
   */
  async function loadTrendData(params = {}) {
    try {
      await reportsStore.fetchTrendData(params)
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load trend data',
        type: 'error',
      })
    }
  }

  /**
   * Load all reports data (summary, category breakdown, trend)
   * @param {Object} params - Optional filter parameters
   */
  async function loadAllReports(params = {}) {
    try {
      // Load reports in parallel for better performance
      // Using Promise.allSettled to show partial data even if some requests fail
      const results = await Promise.allSettled([
        reportsStore.fetchSummary(params),
        reportsStore.fetchCategoryBreakdown(params),
        reportsStore.fetchTrendData(params),
      ])

      // Check if any requests failed with 403 (premium required)
      const forbidden = results.find((r) => r.status === 'rejected' && r.reason?.response?.status === 403)
      if (forbidden) {
        // Return error info so component can show upgrade modal
        return {
          error: 'PREMIUM_REQUIRED',
          message: forbidden.reason?.response?.data?.message || 'Reports are available for Premium users only',
        }
      }

      // Check if any other requests failed
      const failures = results.filter((r) => r.status === 'rejected')
      if (failures.length > 0) {
        // Show warning if some data failed to load, but don't block the UI
        const failedCount = failures.length
        uiStore.showToast({
          message: `${failedCount} report section${failedCount > 1 ? 's' : ''} failed to load`,
          type: 'warning',
        })
      }

      return { error: null }
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to load reports',
        type: 'error',
      })
      return { error: 'UNKNOWN', message: error.message }
    }
  }

  // ==================== Filter Management ====================

  /**
   * Apply filters to reports
   * @param {Object} newFilters - Filter values
   */
  async function applyFilters(newFilters) {
    try {
      // Validate date range
      if (newFilters.startDate && newFilters.endDate) {
        const start = new Date(newFilters.startDate)
        const end = new Date(newFilters.endDate)

        if (start > end) {
          uiStore.showToast({
            message: 'Start date must be before end date',
            type: 'warning',
          })
          return
        }

        // Check for max date range (e.g., 1 year for free users)
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        if (daysDiff > 365) {
          uiStore.showToast({
            message: 'Date range cannot exceed 365 days',
            type: 'warning',
          })
          return
        }
      }

      reportsStore.setFilters(newFilters)
      await loadAllReports()
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to apply filters',
        type: 'error',
      })
    }
  }

  /**
   * Reset all filters
   */
  async function resetFilters() {
    try {
      reportsStore.resetFilters()
      await loadAllReports()
      uiStore.showToast({
        message: 'Filters reset successfully',
        type: 'success',
      })
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to reset filters',
        type: 'error',
      })
    }
  }

  /**
   * Apply date range filter
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  async function applyDateRange(startDate, endDate) {
    try {
      // Validate dates
      if (!startDate || !endDate) {
        uiStore.showToast({
          message: 'Please select both start and end dates',
          type: 'warning',
        })
        return
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (start > end) {
        uiStore.showToast({
          message: 'Start date must be before end date',
          type: 'warning',
        })
        return
      }

      reportsStore.setDateRange(startDate, endDate)
      await loadAllReports()
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to apply date range',
        type: 'error',
      })
    }
  }

  /**
   * Apply quick date preset
   * @param {string} preset - Preset type (7d, 30d, thisMonth, lastMonth)
   */
  async function applyDatePreset(preset) {
    try {
      reportsStore.applyDatePreset(preset)
      await loadAllReports()
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to apply date preset',
        type: 'error',
      })
    }
  }

  /**
   * Change trend granularity
   * @param {string} granularity - Granularity (DAILY/WEEKLY/MONTHLY)
   */
  async function changeGranularity(granularity) {
    try {
      if (!Object.values(GRANULARITY).includes(granularity)) {
        throw new Error('Invalid granularity')
      }

      reportsStore.setFilters({ granularity })
      await reportsStore.fetchTrendData()
    } catch (error) {
      uiStore.showToast({
        message: error.message || 'Failed to change granularity',
        type: 'error',
      })
    }
  }

  // ==================== Utility Functions ====================

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: IDR)
   * @returns {string} Formatted currency string
   */
  function formatCurrency(amount, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  /**
   * Format percentage for display
   * @param {number} value - Value to format
   * @returns {string} Formatted percentage string
   */
  function formatPercentage(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format((value || 0) / 100)
  }

  /**
   * Format date range for display
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {string} Formatted date range string
   */
  function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return 'All time'

    const start = new Date(startDate)
    const end = new Date(endDate)

    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    const formatter = new Intl.DateTimeFormat('id-ID', options)

    return `${formatter.format(start)} - ${formatter.format(end)}`
  }

  /**
   * Get color class for net balance
   * @param {number} amount - Net balance amount
   * @returns {string} Tailwind color class
   */
  function getNetBalanceColor(amount) {
    if (amount > 0) return 'text-green-600 dark:text-green-400'
    if (amount < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  /**
   * Clear all report data
   */
  function clearReports() {
    reportsStore.clearReports()
  }

  // ==================== Return ====================

  return {
    // State
    summary,
    summaryLoading,
    summaryError,
    transactionReport,
    transactionReportLoading,
    transactionReportError,
    debtReport,
    debtReportLoading,
    debtReportError,
    categoryBreakdown,
    categoryBreakdownLoading,
    categoryBreakdownError,
    trendData,
    trendLoading,
    trendError,
    filters,
    pagination,

    // Computed
    hasSummary,
    totalIncome,
    totalExpense,
    netBalance,
    transactionCount,
    hasCategoryBreakdown,
    topCategories,
    hasTrendData,
    isLoading,
    hasError,
    activeFilterCount,

    // Load operations
    loadSummary,
    loadTransactionReport,
    loadMoreTransactions,
    loadDebtReport,
    loadCategoryBreakdown,
    loadTrendData,
    loadAllReports,

    // Filter management
    applyFilters,
    resetFilters,
    applyDateRange,
    applyDatePreset,
    changeGranularity,

    // Utility functions
    formatCurrency,
    formatPercentage,
    formatDateRange,
    getNetBalanceColor,
    clearReports,
  }
}
