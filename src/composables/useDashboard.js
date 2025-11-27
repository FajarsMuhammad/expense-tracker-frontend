import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'
import { useUIStore } from '@/stores/ui'

export function useDashboard() {
  const dashboardStore = useDashboardStore()
  const uiStore = useUIStore()

  const { summary, selectedWalletId, loading, netToday } = storeToRefs(dashboardStore)

  async function loadDashboard() {
    try {
      await dashboardStore.fetchDashboardData()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load dashboard data', type: 'error' })
    }
  }

  async function handleRefresh() {
    try {
      await dashboardStore.refreshDashboard()
      uiStore.showToast({ message: 'Dashboard refreshed!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: 'Failed to refresh dashboard', type: 'error' })
    }
  }

  function handleWalletFilter(walletId) {
    dashboardStore.setSelectedWallet(walletId)
  }

  return {
    summary,
    selectedWalletId,
    loading,
    netToday,
    loadDashboard,
    handleRefresh,
    handleWalletFilter,
  }
}
