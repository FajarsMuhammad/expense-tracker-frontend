<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      <div v-if="uiStore.toast.show" key="toast" :class="toastClasses" class="relative overflow-hidden">
        <div class="flex items-start gap-3 px-4 py-4">
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5" :class="iconColorClass">
            <svg v-if="uiStore.toast.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="uiStore.toast.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="uiStore.toast.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pt-0.5">
            <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {{ toastTitle }}
            </p>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              {{ uiStore.toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            class="flex-shrink-0 p-1 -mr-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-hover transition-all duration-200"
            @click="handleClose">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div v-if="uiStore.toast.duration > 0"
          class="absolute bottom-0 left-0 w-full h-1 bg-neutral-200 dark:bg-dark-border">
          <div :class="progressBarClasses" :style="progressBarStyle"></div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const toastTitle = computed(() => {
  const titles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
  }
  return titles[uiStore.toast.type] || titles.info
})

const toastClasses = computed(() => {
  return 'bg-white dark:bg-dark-card rounded-xl shadow-soft-xl border border-neutral-200 dark:border-dark-border'
})

const iconColorClass = computed(() => {
  const colors = {
    success: 'text-income',
    error: 'text-expense',
    warning: 'text-warning',
    info: 'text-neutral-500',
  }
  return colors[uiStore.toast.type] || colors.info
})

const progressBarClasses = computed(() => {
  const colors = {
    success: 'bg-income',
    error: 'bg-expense',
    warning: 'bg-warning',
    info: 'bg-neutral-400',
  }
  return [colors[uiStore.toast.type] || colors.info, 'h-full rounded-b-xl transition-all'].join(' ')
})

const progressBarStyle = computed(() => {
  const t = uiStore.toast
  if (!t.duration || t.duration <= 0) return {}
  return {
    animation: `progress-shrink ${t.duration}ms linear forwards`,
  }
})

function handleClose() {
  uiStore.hideToast()
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50%);
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
