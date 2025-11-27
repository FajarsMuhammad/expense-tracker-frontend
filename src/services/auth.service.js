import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response.data
  },

  async refreshToken(token) {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { token })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.USER.ME)
    return response.data
  },
}
