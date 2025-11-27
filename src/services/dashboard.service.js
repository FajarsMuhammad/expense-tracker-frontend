import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async getDashboardSummary(walletId = null) {
    const url = walletId
      ? API_ENDPOINTS.DASHBOARD.SUMMARY_BY_WALLET(walletId)
      : API_ENDPOINTS.DASHBOARD.SUMMARY
    const response = await api.get(url)
    return response.data
  },
}
