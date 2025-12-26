import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const uiStore = useUIStore()
  const { t } = useI18n()

  // Use storeToRefs to maintain reactivity
  const { user, isAuthenticated, loading } = storeToRefs(authStore)

  async function handleLogin(credentials) {
    try {
      await authStore.login(credentials)
      uiStore.showToast({ message: t('common.toast.loginSuccessful'), type: 'success' })
      router.push('/dashboard')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleRegister(userData) {
    try {
      const response = await authStore.register(userData)

      // Show success message with trial info
      const message = response?.subscription?.isTrial
        ? t('common.toast.trialStarted')
        : t('common.toast.registrationSuccessful')

      uiStore.showToast({ message, type: 'success', duration: 5000 })
      router.push('/dashboard')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  function handleLogout() {
    authStore.logout()
    uiStore.showToast({ message: t('common.toast.logoutSuccessful'), type: 'info' })
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  }
}
