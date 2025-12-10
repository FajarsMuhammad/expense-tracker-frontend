import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import profileService from '@/services/profile.service'

/**
 * Profile Store
 *
 * Manages user profile state including:
 * - User information (id, email, name, locale)
 * - Subscription information (tier, status, trial days remaining)
 */
export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed properties
  const userId = computed(() => profile.value?.id || null)
  const userEmail = computed(() => profile.value?.email || '')
  const userName = computed(() => profile.value?.name || '')
  const userLocale = computed(() => profile.value?.locale || 'en_US')
  const createdAt = computed(() => profile.value?.createdAt || null)
  const updatedAt = computed(() => profile.value?.updatedAt || null)

  // Subscription computed properties
  const subscription = computed(() => profile.value?.subscription || null)
  const subscriptionId = computed(() => subscription.value?.subscriptionId || null)
  const tier = computed(() => subscription.value?.tier || 'FREE')
  const status = computed(() => subscription.value?.status || null)
  const isPremium = computed(() => subscription.value?.isPremium || false)
  const isTrial = computed(() => subscription.value?.isTrial || false)
  const trialDaysRemaining = computed(() => subscription.value?.trialDaysRemaining || 0)
  const subscriptionStartedAt = computed(() => subscription.value?.startedAt || null)
  const subscriptionEndedAt = computed(() => subscription.value?.endedAt || null)

  // Badge type for UI
  const badgeType = computed(() => {
    if (isTrial.value) return 'TRIAL'
    if (isPremium.value) return 'PREMIUM'
    return 'FREE'
  })

  // Badge variant for styling
  const badgeVariant = computed(() => {
    if (isTrial.value) return 'warning'
    if (isPremium.value) return 'success'
    return 'secondary'
  })

  // Actions
  /**
   * Fetch user profile from API
   */
  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.getProfile()
      profile.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to load profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   */
  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.updateProfile(profileData)
      profile.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear profile state (for logout)
   */
  function clearProfile() {
    profile.value = null
    error.value = null
  }

  return {
    // State
    profile,
    loading,
    error,

    // User computed
    userId,
    userEmail,
    userName,
    userLocale,
    createdAt,
    updatedAt,

    // Subscription computed
    subscription,
    subscriptionId,
    tier,
    status,
    isPremium,
    isTrial,
    trialDaysRemaining,
    subscriptionStartedAt,
    subscriptionEndedAt,

    // Badge computed
    badgeType,
    badgeVariant,

    // Actions
    fetchProfile,
    updateProfile,
    clearProfile,
  }
})
