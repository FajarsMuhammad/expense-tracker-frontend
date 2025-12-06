/**
 * Reports Store
 *
 * Manages state for financial reports, summaries, and analytics data.
 * Handles fetching, caching, and filtering of report data.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import reportsService from '@/services/reports.service'
import { GRANULARITY } from '@/config/api.config'

export const useReportsStore = defineStore('reports', () => {
  // ==================== State ====================

  // Financial summary data
  const summary = ref(null)
  const summaryLoading = ref(false)
  const summaryError = ref(null)

  // Transaction report data
  const transactionReport = ref(null)
  const transactionReportLoading = ref(false)
  const transactionReportError = ref(null)

  // Debt report data
  const debtReport = ref(null)
  const debtReportLoading = ref(false)
  const debtReportError = ref(null)

  // Category breakdown data
  const categoryBreakdown = ref([])
  const categoryBreakdownLoading = ref(false)
  const categoryBreakdownError = ref(null)

  // Trend data
  const trendData = ref([])
  const trendLoading = ref(false)
  const trendError = ref(null)

  // Report filters
  const filters = ref({
    startDate: null,
    endDate: null,
    walletIds: [],
    categoryIds: [],
    type: null, // INCOME or EXPENSE
    granularity: GRANULARITY.DAILY,
  })

  // Pagination for transaction report
  const pagination = ref({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  })

  // ==================== Computed Properties ====================

  // Check if summary data exists
  const hasSummary = computed(() => summary.value !== null)

  // Total income from summary
  const totalIncome = computed(() => summary.value?.totalIncome || 0)

  // Total expense from summary
  const totalExpense = computed(() => summary.value?.totalExpense || 0)

  // Net balance (income - expense)
  const netBalance = computed(() => summary.value?.netBalance || 0)

  // Transaction count
  const transactionCount = computed(() => summary.value?.transactionCount || 0)

  // Check if category breakdown data exists
  const hasCategoryBreakdown = computed(() => categoryBreakdown.value.length > 0)

  // Top 5 categories by amount
  const topCategories = computed(() => {
    if (!hasCategoryBreakdown.value) return []
    return [...categoryBreakdown.value]
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
  })

  // Check if trend data exists
  const hasTrendData = computed(() => trendData.value.length > 0)

  // Check if any report is loading
  const isLoading = computed(() => {
    return (
      summaryLoading.value ||
      transactionReportLoading.value ||
      debtReportLoading.value ||
      categoryBreakdownLoading.value ||
      trendLoading.value
    )
  })

  // Check if any report has error
  const hasError = computed(() => {
    return (
      summaryError.value ||
      transactionReportError.value ||
      debtReportError.value ||
      categoryBreakdownError.value ||
      trendError.value
    )
  })

  // Active filter count
  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.startDate) count++
    if (filters.value.endDate) count++
    if (filters.value.walletIds.length > 0) count++
    if (filters.value.categoryIds.length > 0) count++
    if (filters.value.type) count++
    return count
  })

  // ==================== Actions ====================

  /**
   * Fetch financial summary report
   * @param {Object} params - Optional filter parameters
   */
  async function fetchSummary(params = {}) {
    summaryLoading.value = true
    summaryError.value = null
    try {
      const requestParams = {
        ...filters.value,
        ...params,
      }

      // Remove empty arrays and null values
      Object.keys(requestParams).forEach((key) => {
        if (
          requestParams[key] === null ||
          requestParams[key] === undefined ||
          (Array.isArray(requestParams[key]) && requestParams[key].length === 0)
        ) {
          delete requestParams[key]
        }
      })

      const data = await reportsService.getFinancialSummary(requestParams)
      summary.value = data
      return data
    } catch (err) {
      summaryError.value = err.message || 'Failed to fetch summary'
      throw err
    } finally {
      summaryLoading.value = false
    }
  }

  /**
   * Fetch transaction report with pagination
   * @param {Object} params - Optional filter and pagination parameters
   * @param {boolean} append - Append to existing data (for load more)
   */
  async function fetchTransactionReport(params = {}, append = false) {
    transactionReportLoading.value = true
    transactionReportError.value = null
    try {
      const requestParams = {
        ...filters.value,
        ...params,
        page: params.page ?? pagination.value.page,
        size: params.size ?? pagination.value.size,
      }

      // Remove empty arrays and null values
      Object.keys(requestParams).forEach((key) => {
        if (
          requestParams[key] === null ||
          requestParams[key] === undefined ||
          (Array.isArray(requestParams[key]) && requestParams[key].length === 0)
        ) {
          delete requestParams[key]
        }
      })

      const data = await reportsService.getTransactionReport(requestParams)

      if (append && transactionReport.value?.content) {
        transactionReport.value.content = [
          ...transactionReport.value.content,
          ...data.content,
        ]
      } else {
        transactionReport.value = data
      }

      // Update pagination
      pagination.value = {
        page: data.pageable.pageNumber,
        size: data.pageable.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      }

      return data
    } catch (err) {
      transactionReportError.value = err.message || 'Failed to fetch transaction report'
      throw err
    } finally {
      transactionReportLoading.value = false
    }
  }

  /**
   * Fetch debt report
   * @param {Object} params - Optional filter parameters
   */
  async function fetchDebtReport(params = {}) {
    debtReportLoading.value = true
    debtReportError.value = null
    try {
      const requestParams = {
        ...params,
      }

      const data = await reportsService.getDebtReport(requestParams)
      debtReport.value = data
      return data
    } catch (err) {
      debtReportError.value = err.message || 'Failed to fetch debt report'
      throw err
    } finally {
      debtReportLoading.value = false
    }
  }

  /**
   * Fetch category breakdown
   * @param {Object} params - Optional filter parameters
   */
  async function fetchCategoryBreakdown(params = {}) {
    categoryBreakdownLoading.value = true
    categoryBreakdownError.value = null
    try {
      const requestParams = {
        ...filters.value,
        ...params,
      }

      // Remove empty arrays and null values
      Object.keys(requestParams).forEach((key) => {
        if (
          requestParams[key] === null ||
          requestParams[key] === undefined ||
          (Array.isArray(requestParams[key]) && requestParams[key].length === 0)
        ) {
          delete requestParams[key]
        }
      })

      const data = await reportsService.getCategoryBreakdown(requestParams)
      categoryBreakdown.value = data
      return data
    } catch (err) {
      categoryBreakdownError.value = err.message || 'Failed to fetch category breakdown'
      throw err
    } finally {
      categoryBreakdownLoading.value = false
    }
  }

  /**
   * Fetch trend data
   * @param {Object} params - Optional filter parameters
   */
  async function fetchTrendData(params = {}) {
    trendLoading.value = true
    trendError.value = null
    try {
      const requestParams = {
        ...filters.value,
        ...params,
        granularity: params.granularity || filters.value.granularity,
      }

      // Remove empty arrays and null values
      Object.keys(requestParams).forEach((key) => {
        if (
          requestParams[key] === null ||
          requestParams[key] === undefined ||
          (Array.isArray(requestParams[key]) && requestParams[key].length === 0)
        ) {
          delete requestParams[key]
        }
      })

      const data = await reportsService.getTrendData(requestParams)
      trendData.value = data
      return data
    } catch (err) {
      trendError.value = err.message || 'Failed to fetch trend data'
      throw err
    } finally {
      trendLoading.value = false
    }
  }

  /**
   * Load more transactions (pagination)
   */
  async function loadMoreTransactions() {
    if (pagination.value.last) return
    await fetchTransactionReport({ page: pagination.value.page + 1 }, true)
  }

  /**
   * Set report filters
   * @param {Object} newFilters - New filter values
   */
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 0 // Reset pagination
  }

  /**
   * Reset all filters to default
   */
  function resetFilters() {
    filters.value = {
      startDate: null,
      endDate: null,
      walletIds: [],
      categoryIds: [],
      type: null,
      granularity: GRANULARITY.DAILY,
    }
    pagination.value.page = 0
  }

  /**
   * Clear all report data
   */
  function clearReports() {
    summary.value = null
    transactionReport.value = null
    debtReport.value = null
    categoryBreakdown.value = []
    trendData.value = []
    summaryError.value = null
    transactionReportError.value = null
    debtReportError.value = null
    categoryBreakdownError.value = null
    trendError.value = null
  }

  /**
   * Set date range filter
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  function setDateRange(startDate, endDate) {
    filters.value.startDate = startDate
    filters.value.endDate = endDate
    pagination.value.page = 0
  }

  /**
   * Apply quick date range presets
   * @param {string} preset - Preset type (7d, 30d, thisMonth, lastMonth)
   */
  function applyDatePreset(preset) {
    const today = new Date()
    let startDate, endDate

    endDate = today.toISOString().split('T')[0]

    switch (preset) {
      case '7d':
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]
        break
      case '30d':
        startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0]
        break
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        break
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          .toISOString()
          .split('T')[0]
        endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0]
        break
      default:
        return
    }

    setDateRange(startDate, endDate)
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

    // Actions
    fetchSummary,
    fetchTransactionReport,
    fetchDebtReport,
    fetchCategoryBreakdown,
    fetchTrendData,
    loadMoreTransactions,
    setFilters,
    resetFilters,
    clearReports,
    setDateRange,
    applyDatePreset,
  }
})
