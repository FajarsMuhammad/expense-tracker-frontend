import { storeToRefs } from 'pinia'
import { useSubscriptionStore } from '@/stores/subscription'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { formatCurrency } from '@/utils/currency'

export function useSubscription() {
  const subscriptionStore = useSubscriptionStore()
  const uiStore = useUIStore()
  const router = useRouter()

  // Use storeToRefs to maintain reactivity
  const {
    subscription,
    loading,
    error,
    paymentHistory,
    paymentLoading,
    isPremium,
    isFree,
    isTrial,
    isActive,
    daysRemaining,
    subscriptionEndDate,
    hasActiveSubscription,
  } = storeToRefs(subscriptionStore)

  /**
   * Load current subscription
   */
  async function loadSubscription() {
    try {
      await subscriptionStore.fetchSubscription()
    } catch (err) {
      uiStore.showToast({
        type: 'error',
        message: 'Failed to load subscription information',
      })
    }
  }

  /**
   * Upgrade to premium with payment flow
   * Follow the correct flow:
   * 1. POST /subscriptions/upgrade → Get pricing info
   * 2. POST /payments/subscription → Create payment & get snapToken
   * 3. Open Midtrans Snap UI
   * 4. GET /subscriptions/me → Verify upgrade
   */
  async function upgradeToPremium(durationMonths = 1) {
    try {
      // Load Midtrans first
      await subscriptionStore.loadMidtrans()

      // Step 1: Get upgrade information
      const upgradeInfo = await subscriptionStore.getUpgradeInfo({ durationMonths })

      // Check if user already premium
      if (upgradeInfo.premium) {
        uiStore.showToast({
          type: 'info',
          message: 'You already have an active premium subscription.',
        })
        return { success: false, alreadyPremium: true }
      }

      // Log upgrade info for debugging
      console.log('Upgrade info:', upgradeInfo)

      // Step 2: Create payment transaction
      const paymentResponse = await subscriptionStore.createSubscriptionPayment({
        idempotencyKey: `upgrade-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      })

      // Step 3: Open Midtrans payment page
      if (paymentResponse.snapToken) {
        return new Promise((resolve) => {
          subscriptionStore.openPayment(paymentResponse.snapToken, {
            onSuccess: async (result) => {
              console.log('Payment successful:', result)
              uiStore.showToast({
                type: 'success',
                message: 'Payment successful! Your premium subscription is now active.',
              })

              // Step 4: Verify subscription upgraded
              await loadSubscription()

              resolve({ success: true, result })
            },
            onPending: (result) => {
              console.log('Payment pending:', result)
              uiStore.showToast({
                type: 'warning',
                message: 'Payment is pending. Please complete your payment.',
              })
              resolve({ success: false, pending: true, result })
            },
            onError: (result) => {
              console.error('Payment error:', result)
              uiStore.showToast({
                type: 'error',
                message: `Payment failed: ${result.status_message || 'Unknown error'}`,
              })
              resolve({ success: false, error: true, result })
            },
            onClose: () => {
              console.log('Payment popup closed')
              resolve({ success: false, closed: true })
            },
          })
        })
      }

      throw new Error('No payment token received from backend')
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to upgrade subscription'
      uiStore.showToast({
        type: 'error',
        message,
      })
      throw err
    }
  }

  /**
   * Load payment history
   */
  async function loadPaymentHistory(params = {}) {
    try {
      await subscriptionStore.fetchPaymentHistory(params)
    } catch (err) {
      uiStore.showToast({
        type: 'error',
        message: 'Failed to load payment history',
      })
    }
  }

  /**
   * Cancel a pending payment
   */
  async function cancelPendingPayment(paymentId) {
    try {
      await subscriptionStore.cancelPayment(paymentId)
      uiStore.showToast({
        type: 'success',
        message: 'Payment cancelled successfully',
      })
    } catch (err) {
      uiStore.showToast({
        type: 'error',
        message: 'Failed to cancel payment',
      })
    }
  }

  /**
   * Check if user is eligible for trial
   */
  async function checkEligibility() {
    try {
      return await subscriptionStore.checkTrialEligibility()
    } catch (err) {
      console.error('Error checking trial eligibility:', err)
      return { eligible: false }
    }
  }

  /**
   * Format currency for display
   */
  function formatAmount(amount, currency = 'IDR') {
    return formatCurrency(amount, currency)
  }

  /**
   * Format date for display
   */
  function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  /**
   * Get subscription tier badge color
   */
  function getTierBadgeColor() {
    if (isPremium.value) {
      if (isTrial.value) return 'bg-yellow-500 text-white'
      if (isActive.value) return 'bg-green-500 text-white'
    }
    return 'bg-gray-400 text-white'
  }

  /**
   * Get subscription status text
   */
  function getStatusText() {
    if (!subscription.value) return 'Free'
    if (isTrial.value) return `Trial (${daysRemaining.value} days left)`
    if (isActive.value) return 'Active'
    return subscription.value.status || 'Free'
  }

  return {
    // State
    subscription,
    loading,
    error,
    paymentHistory,
    paymentLoading,

    // Computed
    isPremium,
    isFree,
    isTrial,
    isActive,
    daysRemaining,
    subscriptionEndDate,
    hasActiveSubscription,

    // Actions
    loadSubscription,
    upgradeToPremium,
    loadPaymentHistory,
    cancelPendingPayment,
    checkEligibility,

    // Helpers
    formatAmount,
    formatDate,
    getTierBadgeColor,
    getStatusText,
  }
}
