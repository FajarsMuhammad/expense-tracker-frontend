import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Initialize from localStorage or default to light
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  // Apply theme class to html element
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme on load
  applyTheme(isDark.value)

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // Watch for changes and persist
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    applyTheme(newValue)
  })

  return {
    isDark,
    toggleTheme,
  }
})
