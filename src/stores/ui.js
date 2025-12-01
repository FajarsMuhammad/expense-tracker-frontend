// src/stores/ui.js
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    toast: {
      show: false,
      message: '',
      type: 'info',
      duration: 3000,
    },
  }),

  actions: {
    showToast({ message, type = 'info', duration = 3000 }) {

      this.toast.show = true
      this.toast.message = message
      this.toast.type = type
      this.toast.duration = duration

      if (duration > 0) {
        setTimeout(() => {
          this.toast.show = false
        }, duration)
      }
    },

    hideToast() {
      this.toast.show = false
    },
  },
})
