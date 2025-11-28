import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async getAllCategories(type = null) {
    const params = type ? { type } : {}
    const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE, { params })
    return response.data
  },

  async getCategoryById(id) {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.BY_ID(id))
    return response.data
  },

  async createCategory(categoryData) {
    const response = await api.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData)
    return response.data
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData)
    return response.data
  },

  async deleteCategory(id) {
    const response = await api.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id))
    return response.data
  },
}
