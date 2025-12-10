<template>
  <div class="flex items-center gap-2 sm:gap-4">
    <button
      @click="handleBack"
      class="rounded-lg p-1.5 sm:p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 flex-shrink-0"
      :aria-label="backButtonLabel"
    >
      <ArrowLeftIcon class="size-5 sm:size-6" />
    </button>
    <div class="min-w-0">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 break-words">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  backButtonLabel: {
    type: String,
    default: 'Go back',
  },
})

const router = useRouter()

function handleBack() {
  router.back()
}
</script>
