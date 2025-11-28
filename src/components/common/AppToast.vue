<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.show" class="fixed top-4 right-4 z-50 max-w-md">
        <div :class="toastClasses" class="relative overflow-hidden">
          <div class="flex items-center gap-3 px-6 py-4">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <svg v-if="toast.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else-if="toast.type === 'error'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else-if="toast.type === 'warning'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Message -->
            <p class="text-sm font-medium flex-1">{{ toast.message }}</p>

            <!-- Close Button -->
            <button
              class="ml-auto flex-shrink-0 hover:opacity-75 transition-opacity"
              @click="handleClose"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Progress Bar -->
          <div v-if="toast.duration > 0" class="absolute bottom-0 left-0 w-full h-[3px]">
            <div :class="progressBarClasses" :style="progressBarStyle"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const toast = uiStore.toast

const toastClasses = computed(() => {
  const classes = {
    success:
      'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
    error:
      'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800',
    warning:
      'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
  }
  return [classes[toast.value.type] || classes.info, 'rounded-2xl shadow-soft-xl'].join(' ')
})

const progressBarClasses = computed(() => {
  const classes = {
    success: 'bg-income',
    error: 'bg-expense',
    warning: 'bg-warning',
    info: 'bg-primary-500',
  }
  return [classes[toast.value.type] || classes.info, 'h-full rounded-b-2xl'].join(' ')
})

const progressBarStyle = computed(() => {
  if (toast.value.duration <= 0) return {}
  return {
    animation: `progress-shrink ${toast.value.duration}ms linear`,
  }
})

function handleClose() {
  uiStore.hideToast()
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

@keyframes progress-shrink {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}
</style>
