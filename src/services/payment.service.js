import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/config/api.config'

/**
 * Payment Service
 * Handles all payment-related API calls
 */

/**
 * Create subscription payment transaction
 * @param {Object} data - Payment request data
 * @param {string} data.idempotencyKey - Idempotency key for preventing duplicate payments
 * @returns {Promise<Object>} Payment response with snapToken
 */
export async function createSubscriptionPayment(data = {}) {
  const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.SUBSCRIPTION, {
    idempotencyKey:
      data.idempotencyKey ||
      `payment-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  })
  return response.data
}

/**
 * Get payment transaction history
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.size - Page size
 * @returns {Promise<Object>} Payment transactions
 */
export async function getPaymentHistory(params = {}) {
  const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.BASE, { params })
  return response.data
}

/**
 * Get specific payment transaction
 * @param {string} paymentId - Payment transaction ID
 * @returns {Promise<Object>} Payment transaction details
 */
export async function getPaymentById(paymentId) {
  const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}`)
  return response.data
}

/**
 * Cancel pending payment
 * @param {string} paymentId - Payment transaction ID
 * @returns {Promise<Object>} Cancellation response
 */
export async function cancelPayment(paymentId) {
  const response = await apiClient.post(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}/cancel`)
  return response.data
}

export default {
  createSubscriptionPayment,
  getPaymentHistory,
  getPaymentById,
  cancelPayment,
}
