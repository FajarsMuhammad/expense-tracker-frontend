import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as subscriptionService from '@/services/subscription.service'
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
  const isPremium = computed(() => {
    return subscription.value?.tier === SUBSCRIPTION_TIERS.PREMIUM
  })

  const isFree = computed(() => {
    return !subscription.value || subscription.value?.tier === SUBSCRIPTION_TIERS.FREE
  })

  const isTrial = computed(() => {
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

  async function upgradeSubscription(data = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await subscriptionService.upgradeSubscription({
        tier: SUBSCRIPTION_TIERS.PREMIUM,
        durationMonths: data.durationMonths || 1,
        idempotencyKey: data.idempotencyKey,
      })

      // If trial activated, update subscription state
      if (response.status === SUBSCRIPTION_STATUS.TRIAL) {
        subscription.value = response
      }

      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upgrade subscription'
      console.error('Error upgrading subscription:', err)
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
      const data = await subscriptionService.getPaymentHistory(params)
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
      const data = await subscriptionService.cancelPayment(paymentId)
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
    upgradeSubscription,
    loadMidtrans,
    openPayment,
    fetchPaymentHistory,
    cancelPayment,
    checkTrialEligibility,
    resetError,
    $reset,
  }
})
