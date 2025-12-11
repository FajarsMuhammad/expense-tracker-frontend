import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import walletService from '@/services/wallet.service'
import { useAuthStore } from './auth'
import { useSubscriptionStore } from '@/stores/subscription'

export const useWalletStore = defineStore('wallet', () => {
  const wallets = ref([])
  const currentWallet = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const walletCount = computed(() => wallets.value.length)

  const totalBalance = computed(() => {
    return wallets.value.reduce((sum, wallet) => sum + (wallet.currentBalance || 0), 0)
  })

  const canCreateWallet = computed(() => {
    const subscriptionStore = useSubscriptionStore()

    const isPremium = subscriptionStore.subscription?.isPremium || false
    return isPremium || walletCount.value < 1
  })

  async function fetchWallets() {
    loading.value = true
    error.value = null
    try {
      const data = await walletService.getAllWallets()
      wallets.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchWalletById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await walletService.getWalletById(id)
      console.log('WalletStore: Fetched wallet by ID:', data)
      currentWallet.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createWallet(walletData) {
    loading.value = true
    error.value = null
    try {
      console.log('WalletStore: Creating wallet with data:', walletData)
      const data = await walletService.createWallet(walletData)
      console.log('WalletStore: Create response from backend:', data)
      wallets.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateWallet(id, walletData) {
    loading.value = true
    error.value = null
    try {
      console.log('WalletStore: Updating wallet with data:', walletData)
      const data = await walletService.updateWallet(id, walletData)
      console.log('WalletStore: Update response from backend:', data)
      const index = wallets.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        wallets.value[index] = data
      }
      // Update currentWallet too if it's the same wallet
      if (currentWallet.value?.id === id) {
        currentWallet.value = data
        console.log('WalletStore: Updated currentWallet:', currentWallet.value)
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteWallet(id) {
    loading.value = true
    error.value = null
    try {
      await walletService.deleteWallet(id)
      wallets.value = wallets.value.filter((w) => w.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    wallets,
    currentWallet,
    loading,
    error,
    walletCount,
    totalBalance,
    canCreateWallet,
    fetchWallets,
    fetchWalletById,
    createWallet,
    updateWallet,
    deleteWallet,
  }
})
