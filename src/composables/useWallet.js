import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/wallet'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'

export function useWallet() {
  const walletStore = useWalletStore()
  const uiStore = useUIStore()
  const router = useRouter()

  // Use storeToRefs to maintain reactivity
  const { wallets, currentWallet, loading, canCreateWallet, walletCount } = storeToRefs(walletStore)

  async function loadWallets() {
    try {
      await walletStore.fetchWallets()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load wallets', type: 'error' })
    }
  }

  async function loadWallet(id) {
    try {
      await walletStore.fetchWalletById(id)
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load wallet', type: 'error' })
      router.push('/wallets')
    }
  }

  async function handleCreateWallet(walletData) {
    try {
      if (!walletStore.canCreateWallet) {
        uiStore.showToast({
          message: 'Free users can only create 1 wallet. Upgrade to Premium for unlimited wallets.',
          type: 'warning',
        })
        return
      }

      await walletStore.createWallet(walletData)
      uiStore.showToast({ message: 'Wallet created successfully!', type: 'success' })
      router.push('/wallets')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdateWallet(id, walletData) {
    try {
      await walletStore.updateWallet(id, walletData)
      uiStore.showToast({ message: 'Wallet updated successfully!', type: 'success' })
      router.push('/wallets')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteWallet(id) {
    try {
      await walletStore.deleteWallet(id)
      uiStore.showToast({ message: 'Wallet deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  return {
    wallets,
    currentWallet,
    loading,
    canCreateWallet,
    walletCount,
    loadWallets,
    loadWallet,
    handleCreateWallet,
    handleUpdateWallet,
    handleDeleteWallet,
  }
}
