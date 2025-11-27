import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')

  async function login(credentials) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = {
        id: response.userId,
        email: response.email,
        name: response.name,
      }
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user.value))
      return response
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      const response = await authService.register(userData)
      token.value = response.token
      user.value = {
        id: response.userId,
        email: response.email,
        name: response.name,
      }
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user.value))
      return response
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function initializeAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userName,
    login,
    register,
    logout,
    initializeAuth
  }
})
