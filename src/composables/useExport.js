/**
 * useExport Composable
 *
 * Business logic and validation layer for export functionality.
 * Bridges the UI components with the export store.
 */

import { storeToRefs } from 'pinia'
import { useExportStore } from '@/stores/export'
import { useUIStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'
import { EXPORT_FORMATS } from '@/config/api.config'

export function useExport() {
  const exportStore = useExportStore()
  const uiStore = useUIStore()
  const { t } = useI18n()

  // Use storeToRefs to maintain reactivity
  const {
    exporting,
    exportProgress,
    lastExport,
    error,
    quota,
    isExporting,
    hasQuota,
    isQuotaExceeded,
    lastExportFileName,
    lastExportTime,
  } = storeToRefs(exportStore)

  // ==================== Export Operations ====================

  /**
   * Export transactions with validation
   * @param {string} format - Export format (CSV/EXCEL/PDF)
   * @param {Object} filter - Filter parameters
   */
  async function exportTransactions(format, filter = {}) {
    try {
      // Validate format
      if (!Object.values(EXPORT_FORMATS).includes(format)) {
        uiStore.showToast({
          message: t('common.toast.invalidExportFormat'),
          type: 'error',
        })
        return
      }

      // Check if already exporting
      if (isExporting.value) {
        uiStore.showToast({
          message: t('common.toast.exportInProgress'),
          type: 'warning',
        })
        return
      }

      // Check quota (if needed)
      // await exportStore.checkQuota()
      // if (isQuotaExceeded.value) {
      //   uiStore.showToast({
      //     message: 'Export quota exceeded. Please upgrade to premium.',
      //     type: 'warning',
      //   })
      //   return
      // }

      // Validate date range if provided
      if (filter.startDate && filter.endDate) {
        const start = new Date(filter.startDate)
        const end = new Date(filter.endDate)

        if (start > end) {
          uiStore.showToast({
            message: t('common.toast.startDateBeforeEndDate'),
            type: 'warning',
          })
          return
        }
      }

      // Perform export
      await exportStore.exportTransactions(format, filter)

      uiStore.showToast({
        message: t('common.toast.transactionsExported'),
        type: 'success',
      })
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('common.toast.exportFailed'),
        type: 'error',
      })
    }
  }

  /**
   * Export debts with validation
   * @param {string} format - Export format (CSV/EXCEL/PDF)
   * @param {Object} filter - Filter parameters
   */
  async function exportDebts(format, filter = {}) {
    try {
      // Validate format
      if (!Object.values(EXPORT_FORMATS).includes(format)) {
        uiStore.showToast({
          message: t('common.toast.invalidExportFormat'),
          type: 'error',
        })
        return
      }

      // Check if already exporting
      if (isExporting.value) {
        uiStore.showToast({
          message: t('common.toast.exportInProgress'),
          type: 'warning',
        })
        return
      }

      // Perform export
      await exportStore.exportDebts(format, filter)

      uiStore.showToast({
        message: t('common.toast.debtsExported'),
        type: 'success',
      })
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('common.toast.exportFailed'),
        type: 'error',
      })
    }
  }

  /**
   * Export summary with validation
   * @param {string} format - Export format (EXCEL/PDF)
   * @param {Object} filter - Filter parameters
   */
  async function exportSummary(format, filter = {}) {
    try {
      // CSV not supported for summary
      if (format === EXPORT_FORMATS.CSV) {
        uiStore.showToast({
          message: t('common.toast.csvNotSupportedForSummary'),
          type: 'warning',
        })
        return
      }

      // Validate format
      if (!Object.values(EXPORT_FORMATS).includes(format)) {
        uiStore.showToast({
          message: t('common.toast.invalidExportFormat'),
          type: 'error',
        })
        return
      }

      // Check if already exporting
      if (isExporting.value) {
        uiStore.showToast({
          message: t('common.toast.exportInProgress'),
          type: 'warning',
        })
        return
      }

      // Validate date range if provided
      if (filter.startDate && filter.endDate) {
        const start = new Date(filter.startDate)
        const end = new Date(filter.endDate)

        if (start > end) {
          uiStore.showToast({
            message: t('common.toast.startDateBeforeEndDate'),
            type: 'warning',
          })
          return
        }
      }

      // Perform export
      await exportStore.exportSummary(format, filter)

      uiStore.showToast({
        message: t('common.toast.summaryExported'),
        type: 'success',
      })
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('common.toast.exportFailed'),
        type: 'error',
      })
    }
  }

  /**
   * Check export quota
   */
  async function checkQuota() {
    try {
      await exportStore.checkQuota()
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('common.toast.exportQuotaCheckFailed'),
        type: 'error',
      })
    }
  }

  /**
   * Check if format is available for user (premium check)
   * @param {string} format - Export format to check
   * @returns {boolean} True if format is available
   */
  function isFormatAvailable(format) {
    // TODO: Implement premium check
    // For now, all formats are available
    // In production, check user subscription:
    // - Free: CSV only
    // - Premium: CSV, Excel, PDF

    // const authStore = useAuthStore()
    // if (format === EXPORT_FORMATS.CSV) return true
    // return authStore.isPremium

    return true
  }

  /**
   * Get format label for display
   * @param {string} format - Export format
   * @returns {string} Display label
   */
  function getFormatLabel(format) {
    switch (format) {
      case EXPORT_FORMATS.CSV:
        return 'CSV (Comma-Separated Values)'
      case EXPORT_FORMATS.EXCEL:
        return 'Excel Spreadsheet'
      case EXPORT_FORMATS.PDF:
        return 'PDF Document'
      default:
        return format
    }
  }

  /**
   * Get format icon class
   * @param {string} format - Export format
   * @returns {string} Icon class or component name
   */
  function getFormatIcon(format) {
    switch (format) {
      case EXPORT_FORMATS.CSV:
        return 'DocumentTextIcon'
      case EXPORT_FORMATS.EXCEL:
        return 'TableCellsIcon'
      case EXPORT_FORMATS.PDF:
        return 'DocumentIcon'
      default:
        return 'DocumentIcon'
    }
  }

  /**
   * Format last export time for display
   * @returns {string} Formatted time string
   */
  function formatLastExportTime() {
    if (!lastExportTime.value) return 'Never'

    const date = new Date(lastExportTime.value)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  /**
   * Clear export error
   */
  function clearError() {
    exportStore.clearError()
  }

  /**
   * Clear last export metadata
   */
  function clearLastExport() {
    exportStore.clearLastExport()
  }

  /**
   * Reset export state
   */
  function resetExportState() {
    exportStore.resetExportState()
  }

  // ==================== Return ====================

  return {
    // State
    exporting,
    exportProgress,
    lastExport,
    error,
    quota,

    // Computed
    isExporting,
    hasQuota,
    isQuotaExceeded,
    lastExportFileName,
    lastExportTime,

    // Export operations
    exportTransactions,
    exportDebts,
    exportSummary,
    checkQuota,

    // Utility functions
    isFormatAvailable,
    getFormatLabel,
    getFormatIcon,
    formatLastExportTime,
    clearError,
    clearLastExport,
    resetExportState,
  }
}
