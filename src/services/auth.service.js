import api from './api'

export default {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async refreshToken(token) {
    const response = await api.post('/auth/refresh', { token })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/me')
    return response.data
  },
}
