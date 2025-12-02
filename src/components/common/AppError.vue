<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <!-- Error Icon -->
    <div class="w-16 h-16 mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
      <svg
        class="w-8 h-8 text-red-600 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
      {{ title }}
    </h3>

    <!-- Message -->
    <p class="text-neutral-600 dark:text-neutral-400 text-center mb-6 max-w-sm">
      {{ message }}
    </p>

    <!-- Retry Button -->
    <AppButton
      v-if="showRetry"
      @click="$emit('retry')"
      :loading="retryLoading"
      variant="primary"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Try Again
    </AppButton>
  </div>
</template>

<script setup>
import AppButton from './AppButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Something went wrong',
  },
  message: {
    type: String,
    required: true,
  },
  showRetry: {
    type: Boolean,
    default: true,
  },
  retryLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['retry'])
</script>
