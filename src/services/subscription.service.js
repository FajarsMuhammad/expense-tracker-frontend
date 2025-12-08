import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/config/api.config'

const ENDPOINTS = API_ENDPOINTS

/**
 * Subscription Service
 * Handles all subscription and payment-related API calls
 */

/**
 * Get current user's subscription
 * @returns {Promise<Object>} Subscription data
 */
export async function getCurrentSubscription() {
  const response = await apiClient.get(`${ENDPOINTS.SUBSCRIPTIONS}/me`)
  return response.data
}

/**
 * Upgrade subscription to premium
 * @param {Object} data - Upgrade request data
 * @param {string} data.tier - Target tier (e.g., 'PREMIUM')
 * @param {number} data.durationMonths - Duration in months (default: 1)
 * @param {string} data.idempotencyKey - Optional idempotency key for preventing duplicate payments
 * @returns {Promise<Object>} Payment response or trial activation response
 */
export async function upgradeSubscription(data) {
  const response = await apiClient.post(`${ENDPOINTS.SUBSCRIPTIONS}/upgrade`, {
    tier: data.tier || 'PREMIUM',
    durationMonths: data.durationMonths || 1,
    idempotencyKey: data.idempotencyKey || `upgrade-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
  const response = await apiClient.get(ENDPOINTS.PAYMENTS, { params })
  return response.data
}

/**
 * Get specific payment transaction
 * @param {string} paymentId - Payment transaction ID
 * @returns {Promise<Object>} Payment transaction details
 */
export async function getPaymentById(paymentId) {
  const response = await apiClient.get(`${ENDPOINTS.PAYMENTS}/${paymentId}`)
  return response.data
}

/**
 * Cancel pending payment
 * @param {string} paymentId - Payment transaction ID
 * @returns {Promise<Object>} Cancellation response
 */
export async function cancelPayment(paymentId) {
  const response = await apiClient.post(`${ENDPOINTS.PAYMENTS}/${paymentId}/cancel`)
  return response.data
}

/**
 * Check trial eligibility
 * @returns {Promise<Object>} Trial eligibility status
 */
export async function checkTrialEligibility() {
  const response = await apiClient.get(`${ENDPOINTS.SUBSCRIPTIONS}/trial-eligibility`)
  return response.data
}

/**
 * Load Midtrans Snap script dynamically
 * @param {string} clientKey - Midtrans client key
 * @param {boolean} isProduction - Whether to use production environment
 * @returns {Promise<void>}
 */
export function loadMidtransScript(clientKey, isProduction = false) {
  return new Promise((resolve, reject) => {
    // Check if script already loaded
    if (window.snap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', clientKey)

    script.onload = () => {
      console.log('Midtrans Snap.js loaded successfully')
      resolve()
    }

    script.onerror = () => {
      console.error('Failed to load Midtrans Snap.js')
      reject(new Error('Failed to load Midtrans Snap.js'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Open Midtrans payment page
 * @param {string} snapToken - Snap token from backend
 * @param {Object} callbacks - Payment callbacks
 * @param {Function} callbacks.onSuccess - Called when payment succeeds
 * @param {Function} callbacks.onPending - Called when payment is pending
 * @param {Function} callbacks.onError - Called when payment fails
 * @param {Function} callbacks.onClose - Called when payment popup is closed
 * @returns {void}
 */
export function openMidtransPayment(snapToken, callbacks = {}) {
  if (!window.snap) {
    console.error('Midtrans Snap.js not loaded')
    if (callbacks.onError) {
      callbacks.onError({ status_message: 'Payment system not initialized' })
    }
    return
  }

  window.snap.pay(snapToken, {
    onSuccess: (result) => {
      console.log('Payment success:', result)
      if (callbacks.onSuccess) callbacks.onSuccess(result)
    },
    onPending: (result) => {
      console.log('Payment pending:', result)
      if (callbacks.onPending) callbacks.onPending(result)
    },
    onError: (result) => {
      console.error('Payment error:', result)
      if (callbacks.onError) callbacks.onError(result)
    },
    onClose: () => {
      console.log('Payment popup closed')
      if (callbacks.onClose) callbacks.onClose()
    },
  })
}

export default {
  getCurrentSubscription,
  upgradeSubscription,
  getPaymentHistory,
  getPaymentById,
  cancelPayment,
  checkTrialEligibility,
  loadMidtransScript,
  openMidtransPayment,
}
