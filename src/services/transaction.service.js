import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async getAllTransactions(params = {}) {
    const queryParams = new URLSearchParams()

    // Add filters
    if (params.walletId) queryParams.append('walletId', params.walletId)
    if (params.categoryId) queryParams.append('categoryId', params.categoryId)
    if (params.type) queryParams.append('type', params.type)
    if (params.from) queryParams.append('from', params.from)
    if (params.to) queryParams.append('to', params.to)

    // Add pagination
    queryParams.append('page', params.page ?? 0)
    queryParams.append('size', params.size ?? 20)

    const queryString = queryParams.toString()
    const url = queryString ? `${API_ENDPOINTS.TRANSACTIONS.BASE}?${queryString}` : API_ENDPOINTS.TRANSACTIONS.BASE

    const response = await api.get(url)
    return response.data
  },

  async getTransactionById(id) {
    const response = await api.get(API_ENDPOINTS.TRANSACTIONS.BY_ID(id))
    return response.data
  },

  async createTransaction(transactionData) {
    const response = await api.post(API_ENDPOINTS.TRANSACTIONS.BASE, transactionData)
    return response.data
  },

  async updateTransaction(id, transactionData) {
    const response = await api.put(API_ENDPOINTS.TRANSACTIONS.BY_ID(id), transactionData)
    return response.data
  },

  async deleteTransaction(id) {
    const response = await api.delete(API_ENDPOINTS.TRANSACTIONS.BY_ID(id))
    return response.data
  },
}
