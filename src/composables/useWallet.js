import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/wallet'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useWallet() {
  const walletStore = useWalletStore()
  const uiStore = useUIStore()
  const router = useRouter()
  const { t } = useI18n()

  // Use storeToRefs to maintain reactivity
  const { wallets, currentWallet, loading, canCreateWallet, walletCount } = storeToRefs(walletStore)

  async function loadWallets() {
    try {
      await walletStore.fetchWallets()
    } catch (error) {
      uiStore.showToast({ message: t('common.toast.walletLoadFailed'), type: 'error' })
    }
  }

  async function loadWallet(id) {
    try {
      await walletStore.fetchWalletById(id)
    } catch (error) {
      uiStore.showToast({ message: t('common.toast.walletLoadFailed'), type: 'error' })
      router.push('/wallets')
    }
  }

  async function handleCreateWallet(walletData) {
    try {
      if (!walletStore.canCreateWallet) {
        uiStore.showToast({
          message: t('common.toast.walletLimitReached'),
          type: 'warning',
        })
        return
      }

      await walletStore.createWallet(walletData)
      uiStore.showToast({ message: t('common.toast.walletCreated'), type: 'success' })
      router.push('/wallets')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdateWallet(id, walletData) {
    try {
      await walletStore.updateWallet(id, walletData)
      uiStore.showToast({ message: t('common.toast.walletUpdated'), type: 'success' })
      router.push('/wallets')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteWallet(id) {
    try {
      await walletStore.deleteWallet(id)
      uiStore.showToast({ message: t('common.toast.walletDeleted'), type: 'success' })
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
