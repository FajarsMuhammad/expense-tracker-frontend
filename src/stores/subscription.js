import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as subscriptionService from '@/services/subscription.service'
import * as paymentService from '@/services/payment.service'
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUS } from '@/config/api.config'

export const useSubscriptionStore = defineStore('subscription', () => {
  // State
  const subscription = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const paymentHistory = ref([])
  const paymentLoading = ref(false)
  const midtransLoaded = ref(false)

  // Computed
  // Use values from backend if available, otherwise compute client-side
  const isPremium = computed(() => {
    // Backend includes isPremium field
    if (subscription.value?.isPremium !== undefined) {
      return subscription.value.isPremium
    }
    // Fallback: compute based on tier
    return subscription.value?.tier === SUBSCRIPTION_TIERS.PREMIUM
  })

  const isFree = computed(() => {
    // Inverse of isPremium
    return !isPremium.value
  })

  const isTrial = computed(() => {
    // Backend includes isTrial field
    if (subscription.value?.isTrial !== undefined) {
      return subscription.value.isTrial
    }
    // Fallback: compute based on status
    return subscription.value?.status === SUBSCRIPTION_STATUS.TRIAL
  })

  const isActive = computed(() => {
    return subscription.value?.status === SUBSCRIPTION_STATUS.ACTIVE
  })

  const daysRemaining = computed(() => {
    return subscription.value?.daysRemaining || 0
  })

  const subscriptionEndDate = computed(() => {
    return subscription.value?.endedAt || null
  })

  const hasActiveSubscription = computed(() => {
    return isPremium.value && (isActive.value || isTrial.value)
  })

  // Actions
  async function fetchSubscription() {
    loading.value = true
    error.value = null

    try {
      const data = await subscriptionService.getCurrentSubscription()
      subscription.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch subscription'
      console.error('Error fetching subscription:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get upgrade information
   * @param {Object} data - Upgrade request data
   * @returns {Promise<Object>} Upgrade information (pricing, etc)
   */
  async function getUpgradeInfo(data = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await subscriptionService.getUpgradeInfo({
        tier: SUBSCRIPTION_TIERS.PREMIUM,
        durationMonths: data.durationMonths || 1,
      })

      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to get upgrade information'
      console.error('Error getting upgrade info:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create subscription payment
   * @param {Object} data - Payment request data
   * @returns {Promise<Object>} Payment response with snapToken
   */
  async function createSubscriptionPayment(data = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await paymentService.createSubscriptionPayment({
        idempotencyKey: data.idempotencyKey,
      })

      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create payment'
      console.error('Error creating subscription payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadMidtrans() {
    if (midtransLoaded.value) {
      return
    }

    try {
      const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY
      const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'

      await subscriptionService.loadMidtransScript(clientKey, isProduction)
      midtransLoaded.value = true
    } catch (err) {
      console.error('Error loading Midtrans:', err)
      throw new Error('Failed to initialize payment system')
    }
  }

  function openPayment(snapToken, callbacks) {
    return subscriptionService.openMidtransPayment(snapToken, callbacks)
  }

  async function fetchPaymentHistory(params = {}) {
    paymentLoading.value = true

    try {
      const data = await paymentService.getPaymentHistory(params)
      paymentHistory.value = data.content || data
      return data
    } catch (err) {
      console.error('Error fetching payment history:', err)
      throw err
    } finally {
      paymentLoading.value = false
    }
  }

  async function cancelPayment(paymentId) {
    try {
      const data = await paymentService.cancelPayment(paymentId)
      // Refresh payment history
      await fetchPaymentHistory()
      return data
    } catch (err) {
      console.error('Error cancelling payment:', err)
      throw err
    }
  }

  async function checkTrialEligibility() {
    try {
      return await subscriptionService.checkTrialEligibility()
    } catch (err) {
      console.error('Error checking trial eligibility:', err)
      throw err
    }
  }

  function resetError() {
    error.value = null
  }

  function $reset() {
    subscription.value = null
    loading.value = false
    error.value = null
    paymentHistory.value = []
    paymentLoading.value = false
    midtransLoaded.value = false
  }

  return {
    // State
    subscription,
    loading,
    error,
    paymentHistory,
    paymentLoading,
    midtransLoaded,

    // Computed
    isPremium,
    isFree,
    isTrial,
    isActive,
    daysRemaining,
    subscriptionEndDate,
    hasActiveSubscription,

    // Actions
    fetchSubscription,
    getUpgradeInfo,
    createSubscriptionPayment,
    loadMidtrans,
    openPayment,
    fetchPaymentHistory,
    cancelPayment,
    checkTrialEligibility,
    resetError,
    $reset,
  }
})
