import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const toast = ref({
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  })

  function showToast({ message, type = 'info', duration = 3000 }) {
    toast.value = {
      show: true,
      message,
      type,
    }

    if (duration > 0) {
      setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  function hideToast() {
    toast.value.show = false
  }

  return {
    toast,
    showToast,
    hideToast,
  }
})
