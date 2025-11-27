import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dashboardService from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref({
    walletBalance: 0,
    todayIncome: 0,
    todayExpense: 0,
    weeklyTrend: [],
    recentTransactions: [],
  })
  const selectedWalletId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const netToday = computed(() => summary.value.todayIncome - summary.value.todayExpense)

  async function fetchDashboardData() {
    loading.value = true
    error.value = null
    try {
      const data = await dashboardService.getDashboardSummary(selectedWalletId.value)
      summary.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function refreshDashboard() {
    await fetchDashboardData()
  }

  function setSelectedWallet(walletId) {
    selectedWalletId.value = walletId
    fetchDashboardData()
  }

  return {
    summary,
    selectedWalletId,
    loading,
    error,
    netToday,
    fetchDashboardData,
    refreshDashboard,
    setSelectedWallet,
  }
})
