import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async getAllWallets() {
    const response = await api.get(API_ENDPOINTS.WALLETS.BASE)
    return response.data
  },

  async getWalletById(id) {
    const response = await api.get(API_ENDPOINTS.WALLETS.BY_ID(id))
    return response.data
  },

  async createWallet(walletData) {
    const response = await api.post(API_ENDPOINTS.WALLETS.BASE, walletData)
    return response.data
  },

  async updateWallet(id, walletData) {
    const response = await api.put(API_ENDPOINTS.WALLETS.BY_ID(id), walletData)
    return response.data
  },

  async deleteWallet(id) {
    const response = await api.delete(API_ENDPOINTS.WALLETS.BY_ID(id))
    return response.data
  },
}
