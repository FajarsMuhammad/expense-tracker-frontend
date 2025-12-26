import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/profile'
import { useUIStore } from '@/stores/ui'

/**
 * Profile Composable
 *
 * Provides a clean API for working with user profile:
 * - Load profile with subscription info
 * - Update profile (name, locale)
 * - Access subscription status and trial countdown
 */
export function useProfile() {
  const profileStore = useProfileStore()
  const uiStore = useUIStore()

  // Use storeToRefs to maintain reactivity
  const {
    profile,
    loading,
    error,
    userId,
    userEmail,
    userName,
    userLocale,
    createdAt,
    updatedAt,
    subscription,
    subscriptionId,
    tier,
    status,
    isPremium,
    isTrial,
    trialDaysRemaining,
    subscriptionStartedAt,
    subscriptionEndedAt,
    badgeType,
    badgeVariant,
  } = storeToRefs(profileStore)

  /**
   * Load user profile from API
   */
  async function loadProfile() {
    try {
      await profileStore.fetchProfile()
    } catch (err) {
      uiStore.showToast({
        message: err.message || 'Failed to load profile',
        type: 'error',
      })
      throw err
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - User's name
   * @param {string} [profileData.locale] - User's locale (optional)
   */
  async function handleUpdateProfile(profileData) {
    try {
      await profileStore.updateProfile(profileData)
      uiStore.showToast({
        message: 'Profile updated successfully!',
        type: 'success',
      })
    } catch (err) {
      uiStore.showToast({
        message: err.message || 'Failed to update profile',
        type: 'error',
      })
      throw err
    }
  }

  /**
   * Format date for display
   * @param {string} date - ISO date string
   * @returns {string} Formatted date
   */
  function formatDate(date) {
    if (!date) return ''
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return date
    }
  }

  /**
   * Get trial status message
   * @returns {string} Trial status message
   */
  function getTrialMessage() {
    if (!isTrial.value) return ''
    const days = trialDaysRemaining.value
    if (days === 0) return 'Your trial ends today'
    if (days === 1) return '1 day left in your trial'
    return `${days} days left in your trial`
  }

  return {
    // State
    profile,
    loading,
    error,

    // User data
    userId,
    userEmail,
    userName,
    userLocale,
    createdAt,
    updatedAt,

    // Subscription data
    subscription,
    subscriptionId,
    tier,
    status,
    isPremium,
    isTrial,
    trialDaysRemaining,
    subscriptionStartedAt,
    subscriptionEndedAt,

    // Badge data
    badgeType,
    badgeVariant,

    // Actions
    loadProfile,
    handleUpdateProfile,

    // Helpers
    formatDate,
    getTrialMessage,
  }
}
