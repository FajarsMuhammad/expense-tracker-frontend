import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

/**
 * Profile Service
 *
 * Handles all profile-related API calls including:
 * - Get user profile with subscription info
 * - Update user profile (name, locale)
 */
export default {
  /**
   * Get current user profile with subscription information
   *
   * @returns {Promise} Profile data including subscription details
   * @throws {Error} If request fails
   */
  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.USER.ME)
      return response.data
    } catch (error) {
      console.error('Failed to get profile:', error)
      throw error
    }
  },

  /**
   * Update user profile
   *
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - User's name (2-100 characters)
   * @param {string} [profileData.locale] - User's locale (format: language_COUNTRY, e.g., id_ID, en_US)
   * @returns {Promise} Updated profile data
   * @throws {Error} If validation fails or request fails
   */
  async updateProfile(profileData) {
    try {
      // Validate input
      if (!profileData.name || profileData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters')
      }

      if (profileData.name.length > 100) {
        throw new Error('Name must not exceed 100 characters')
      }

      // Validate locale format if provided
      if (profileData.locale) {
        const localeRegex = /^[a-z]{2}_[A-Z]{2}$/
        if (!localeRegex.test(profileData.locale)) {
          throw new Error('Locale must be in format: language_COUNTRY (e.g., id_ID, en_US)')
        }
      }

      const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData)
      return response.data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  },
}
