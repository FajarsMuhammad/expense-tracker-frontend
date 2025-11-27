import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const uiStore = useUIStore()

  // Use storeToRefs to maintain reactivity
  const { user, isAuthenticated, loading } = storeToRefs(authStore)

  async function handleLogin(credentials) {
    try {
      await authStore.login(credentials)
      uiStore.showToast({ message: 'Login successful!', type: 'success' })
      router.push('/dashboard')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleRegister(userData) {
    try {
      await authStore.register(userData)
      uiStore.showToast({ message: 'Registration successful!', type: 'success' })
      router.push('/dashboard')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  function handleLogout() {
    authStore.logout()
    uiStore.showToast({ message: 'Logged out successfully', type: 'info' })
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
