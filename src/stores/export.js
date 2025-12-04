/**
 * Export Store
 *
 * Manages state for data export functionality.
 * Handles exporting transactions, debts, and summary reports
 * in various formats (CSV, Excel, PDF).
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import exportService from '@/services/export.service'
import { EXPORT_FORMATS, EXPORT_TYPES } from '@/config/api.config'

export const useExportStore = defineStore('export', () => {
  // ==================== State ====================

  // Export in progress state
  const exporting = ref(false)

  // Export progress (0-100)
  const exportProgress = ref(0)

  // Last export metadata
  const lastExport = ref(null)

  // Export error
  const error = ref(null)

  // Export quota information
  const quota = ref({
    available: true,
    remaining: null,
    limit: null,
    resetDate: null,
  })

  // ==================== Computed Properties ====================

  // Check if currently exporting
  const isExporting = computed(() => exporting.value)

  // Check if export quota is available
  const hasQuota = computed(() => quota.value.available && quota.value.remaining > 0)

  // Check if user has exceeded quota
  const isQuotaExceeded = computed(() => !quota.value.available || quota.value.remaining <= 0)

  // Last export file name
  const lastExportFileName = computed(() => lastExport.value?.fileName || null)

  // Last export timestamp
  const lastExportTime = computed(() => lastExport.value?.timestamp || null)

  // ==================== Actions ====================

  /**
   * Export transactions to specified format
   * @param {string} format - Export format (CSV/EXCEL/PDF)
   * @param {Object} filter - Filter parameters
   * @returns {Promise<Object>} Export response
   */
  async function exportTransactions(format, filter = {}) {
    exporting.value = true
    exportProgress.value = 0
    error.value = null

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (exportProgress.value < 90) {
          exportProgress.value += 10
        }
      }, 200)

      const exportRequest = {
        format,
        filter,
      }

      const response = await exportService.exportTransactions(exportRequest)

      clearInterval(progressInterval)
      exportProgress.value = 100

      // Store last export metadata
      lastExport.value = {
        type: EXPORT_TYPES.TRANSACTIONS,
        format,
        fileName: response.fileName,
        timestamp: new Date().toISOString(),
      }

      return response
    } catch (err) {
      error.value = err.message || 'Failed to export transactions'
      throw err
    } finally {
      exporting.value = false
      // Reset progress after a delay
      setTimeout(() => {
        exportProgress.value = 0
      }, 2000)
    }
  }

  /**
   * Export debts to specified format
   * @param {string} format - Export format (CSV/EXCEL/PDF)
   * @param {Object} filter - Filter parameters
   * @returns {Promise<Object>} Export response
   */
  async function exportDebts(format, filter = {}) {
    exporting.value = true
    exportProgress.value = 0
    error.value = null

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (exportProgress.value < 90) {
          exportProgress.value += 10
        }
      }, 200)

      const exportRequest = {
        format,
        filter,
      }

      const response = await exportService.exportDebts(exportRequest)

      clearInterval(progressInterval)
      exportProgress.value = 100

      // Store last export metadata
      lastExport.value = {
        type: EXPORT_TYPES.DEBTS,
        format,
        fileName: response.fileName,
        timestamp: new Date().toISOString(),
      }

      return response
    } catch (err) {
      error.value = err.message || 'Failed to export debts'
      throw err
    } finally {
      exporting.value = false
      // Reset progress after a delay
      setTimeout(() => {
        exportProgress.value = 0
      }, 2000)
    }
  }

  /**
   * Export summary report to specified format
   * @param {string} format - Export format (EXCEL/PDF)
   * @param {Object} filter - Filter parameters
   * @returns {Promise<Object>} Export response
   */
  async function exportSummary(format, filter = {}) {
    // CSV not supported for summary
    if (format === EXPORT_FORMATS.CSV) {
      throw new Error('CSV format not supported for summary export')
    }

    exporting.value = true
    exportProgress.value = 0
    error.value = null

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (exportProgress.value < 90) {
          exportProgress.value += 10
        }
      }, 200)

      const exportRequest = {
        format,
        filter,
      }

      const response = await exportService.exportSummary(exportRequest)

      clearInterval(progressInterval)
      exportProgress.value = 100

      // Store last export metadata
      lastExport.value = {
        type: EXPORT_TYPES.SUMMARY,
        format,
        fileName: response.fileName,
        timestamp: new Date().toISOString(),
      }

      return response
    } catch (err) {
      error.value = err.message || 'Failed to export summary'
      throw err
    } finally {
      exporting.value = false
      // Reset progress after a delay
      setTimeout(() => {
        exportProgress.value = 0
      }, 2000)
    }
  }

  /**
   * Check export quota availability
   * @returns {Promise<Object>} Quota information
   */
  async function checkQuota() {
    try {
      const quotaData = await exportService.checkExportQuota()
      quota.value = quotaData
      return quotaData
    } catch (err) {
      error.value = err.message || 'Failed to check export quota'
      throw err
    }
  }

  /**
   * Clear error state
   */
  function clearError() {
    error.value = null
  }

  /**
   * Clear last export metadata
   */
  function clearLastExport() {
    lastExport.value = null
  }

  /**
   * Reset export state
   */
  function resetExportState() {
    exporting.value = false
    exportProgress.value = 0
    error.value = null
    lastExport.value = null
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

    // Actions
    exportTransactions,
    exportDebts,
    exportSummary,
    checkQuota,
    clearError,
    clearLastExport,
    resetExportState,
  }
})
