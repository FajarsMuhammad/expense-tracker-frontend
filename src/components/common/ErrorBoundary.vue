<template>
  <div>
    <!-- Error state -->
    <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg p-4">
      <div class="max-w-md w-full bg-white dark:bg-dark-card rounded-xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg
            class="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Something went wrong
        </h2>

        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>

        <div v-if="isDevelopment && errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-left">
          <p class="text-xs font-mono text-red-800 dark:text-red-300 break-all">
            {{ errorMessage }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="handleRefresh"
            class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Page
          </button>
          <button
            @click="handleReset"
            class="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-dark-surface dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Normal content -->
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')
const isDevelopment = import.meta.env.DEV

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message || String(err)

  // Log error in development
  if (isDevelopment) {
    console.error('Error caught by ErrorBoundary:', err)
    console.error('Component:', instance)
    console.error('Error info:', info)
  }

  // Prevent error from propagating
  return false
})

function handleRefresh() {
  window.location.reload()
}

function handleReset() {
  hasError.value = false
  errorMessage.value = ''
}
</script>
