/**
 * Export Service
 *
 * Handles all API calls related to data export functionality.
 * Supports exporting transactions, debts, and summary reports
 * in multiple formats (CSV, Excel, PDF).
 */

import api from './api'
import { API_ENDPOINTS, EXPORT_FORMATS, EXPORT_TYPES } from '@/config/api.config'

/**
 * Helper to trigger browser download from base64 data
 * @param {string} base64Data - Base64 encoded file content
 * @param {string} fileName - Name for the downloaded file
 * @param {string} mimeType - MIME type of the file
 */
function downloadBase64File(base64Data, fileName, mimeType) {
  // Decode base64 and create blob
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })

  // Create download link and trigger
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Get MIME type for export format
 * @param {string} format - Export format (CSV/EXCEL/PDF)
 * @returns {string} MIME type
 */
function getMimeType(format) {
  switch (format) {
    case EXPORT_FORMATS.CSV:
      return 'text/csv'
    case EXPORT_FORMATS.EXCEL:
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case EXPORT_FORMATS.PDF:
      return 'application/pdf'
    default:
      return 'application/octet-stream'
  }
}

export default {
  /**
   * Export transactions to specified format
   * @param {Object} exportRequest - Export request parameters
   * @param {string} exportRequest.format - Export format (CSV/EXCEL/PDF)
   * @param {Object} exportRequest.filter - Filter parameters
   * @param {string} exportRequest.filter.startDate - Start date (YYYY-MM-DD)
   * @param {string} exportRequest.filter.endDate - End date (YYYY-MM-DD)
   * @param {Array<string>} exportRequest.filter.walletIds - Wallet IDs to filter
   * @param {Array<string>} exportRequest.filter.categoryIds - Category IDs to filter
   * @param {string} exportRequest.filter.type - Transaction type (INCOME/EXPENSE)
   * @returns {Promise<Object>} Export response with file data
   */
  async exportTransactions(exportRequest) {
    const requestBody = {
      format: exportRequest.format,
      type: EXPORT_TYPES.TRANSACTIONS,
      filter: exportRequest.filter || {},
    }

    const response = await api.post(API_ENDPOINTS.EXPORT.TRANSACTIONS, requestBody)
    const exportData = response.data

    // Auto-download if base64 data is returned
    if (exportData.base64Content || exportData.base64Data) {
      const mimeType = getMimeType(exportRequest.format)
      const base64Data = exportData.base64Content || exportData.base64Data
      downloadBase64File(base64Data, exportData.fileName, mimeType)
    }

    return exportData
  },

  /**
   * Export debts to specified format
   * @param {Object} exportRequest - Export request parameters
   * @param {string} exportRequest.format - Export format (CSV/EXCEL/PDF)
   * @param {Object} exportRequest.filter - Filter parameters
   * @param {string} exportRequest.filter.type - Debt type (PAYABLE/RECEIVABLE)
   * @param {string} exportRequest.filter.status - Debt status (OPEN/PARTIAL/PAID)
   * @param {boolean} exportRequest.filter.overdue - Filter overdue debts
   * @returns {Promise<Object>} Export response with file data
   */
  async exportDebts(exportRequest) {
    const requestBody = {
      format: exportRequest.format,
      type: EXPORT_TYPES.DEBTS,
      filter: exportRequest.filter || {},
    }

    const response = await api.post(API_ENDPOINTS.EXPORT.DEBTS, requestBody)
    const exportData = response.data

    // Auto-download if base64 data is returned
    if (exportData.base64Content || exportData.base64Data) {
      const mimeType = getMimeType(exportRequest.format)
      const base64Data = exportData.base64Content || exportData.base64Data
      downloadBase64File(base64Data, exportData.fileName, mimeType)
    }

    return exportData
  },

  /**
   * Export financial summary to specified format
   * @param {Object} exportRequest - Export request parameters
   * @param {string} exportRequest.format - Export format (EXCEL/PDF only)
   * @param {Object} exportRequest.filter - Filter parameters
   * @param {string} exportRequest.filter.startDate - Start date (YYYY-MM-DD)
   * @param {string} exportRequest.filter.endDate - End date (YYYY-MM-DD)
   * @param {Array<string>} exportRequest.filter.walletIds - Wallet IDs to filter
   * @returns {Promise<Object>} Export response with file data
   */
  async exportSummary(exportRequest) {
    const requestBody = {
      format: exportRequest.format,
      type: EXPORT_TYPES.SUMMARY,
      filter: exportRequest.filter || {},
    }

    const response = await api.post(API_ENDPOINTS.EXPORT.SUMMARY, requestBody)
    const exportData = response.data

    // Auto-download if base64 data is returned
    if (exportData.base64Content || exportData.base64Data) {
      const mimeType = getMimeType(exportRequest.format)
      const base64Data = exportData.base64Content || exportData.base64Data
      downloadBase64File(base64Data, exportData.fileName, mimeType)
    }

    return exportData
  },

  /**
   * Check if user has available export quota
   * This is a placeholder - actual implementation depends on backend API
   * @returns {Promise<Object>} Export quota information
   */
  async checkExportQuota() {
    // TODO: Implement when backend endpoint is available
    return {
      available: true,
      remaining: 100,
      limit: 100,
      resetDate: new Date().toISOString(),
    }
  },
}
