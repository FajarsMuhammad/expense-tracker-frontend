import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

/**
 * Debt Service
 *
 * Handles all debt-related API calls including:
 * - CRUD operations for debts
 * - Payment management
 * - Filtering and pagination
 */
export default {
  /**
   * Get all debts with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.type - Filter by debt type (PAYABLE/RECEIVABLE)
   * @param {string} params.status - Filter by status (OPEN/PARTIAL/PAID)
   * @param {boolean} params.overdue - Filter by overdue status
   * @param {number} params.page - Page number (0-indexed)
   * @param {number} params.size - Page size
   * @returns {Promise<Object>} Paginated debt response
   */
  async getAllDebts(params = {}) {
    const queryParams = new URLSearchParams()

    // Add filters (only if they have valid values)
    if (params.type) queryParams.append('type', params.type)
    if (params.status) queryParams.append('status', params.status)
    // Only append overdue if it's explicitly true or false (not null/undefined)
    if (typeof params.overdue === 'boolean') queryParams.append('overdue', params.overdue)

    // Add pagination
    queryParams.append('page', params.page ?? 0)
    queryParams.append('size', params.size ?? 20)

    const queryString = queryParams.toString()
    const url = queryString ? `${API_ENDPOINTS.DEBTS.BASE}?${queryString}` : API_ENDPOINTS.DEBTS.BASE

    const response = await api.get(url)
    return response.data
  },

  /**
   * Get a single debt by ID
   * @param {string} id - Debt ID
   * @returns {Promise<Object>} Debt object
   */
  async getDebtById(id) {
    const response = await api.get(API_ENDPOINTS.DEBTS.BY_ID(id))
    return response.data
  },

  /**
   * Create a new debt
   * @param {Object} debtData - Debt data
   * @param {string} debtData.type - Debt type (PAYABLE/RECEIVABLE)
   * @param {string} debtData.counterpartyName - Name of person/entity
   * @param {number} debtData.totalAmount - Total debt amount
   * @param {string} debtData.dueDate - Due date (ISO format)
   * @param {string} debtData.note - Optional note
   * @returns {Promise<Object>} Created debt object
   */
  async createDebt(debtData) {
    const response = await api.post(API_ENDPOINTS.DEBTS.BASE, debtData)
    return response.data
  },

  /**
   * Update an existing debt
   * @param {string} id - Debt ID
   * @param {Object} debtData - Updated debt data
   * @returns {Promise<Object>} Updated debt object
   */
  async updateDebt(id, debtData) {
    const response = await api.put(API_ENDPOINTS.DEBTS.BY_ID(id), debtData)
    return response.data
  },

  /**
   * Delete a debt
   * @param {string} id - Debt ID
   * @returns {Promise<void>}
   */
  async deleteDebt(id) {
    const response = await api.delete(API_ENDPOINTS.DEBTS.BY_ID(id))
    return response.data
  },

  /**
   * Add a payment to a debt
   * @param {string} debtId - Debt ID
   * @param {Object} paymentData - Payment data
   * @param {number} paymentData.amount - Payment amount
   * @param {string} paymentData.paidAt - Payment date/time (ISO format)
   * @param {string} paymentData.note - Optional note
   * @returns {Promise<Object>} Updated debt object with payment
   */
  async addPayment(debtId, paymentData) {
    const response = await api.post(API_ENDPOINTS.DEBTS.PAYMENTS(debtId), paymentData)
    return response.data
  },

  /**
   * Mark a debt as fully paid
   * @param {string} debtId - Debt ID
   * @returns {Promise<Object>} Updated debt object
   */
  async markAsPaid(debtId) {
    const response = await api.post(API_ENDPOINTS.DEBTS.MARK_PAID(debtId))
    return response.data
  },
}
