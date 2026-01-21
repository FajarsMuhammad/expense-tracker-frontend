<template>
  <div :class="containerClass">
    <div v-for="i in count" :key="i" class="rounded-2xl overflow-hidden"
      :style="type === 'default' ? { height: height } : undefined">
      <!-- Card Skeleton -->
      <div v-if="type === 'card'" class="skeleton-shimmer">
        <div class="bg-neutral-200 dark:bg-dark-surface h-full rounded-2xl" :style="{ height: height }" />
      </div>

      <!-- List Skeleton -->
      <div v-else-if="type === 'list'" class="skeleton-shimmer flex items-center gap-4 p-4">
        <div class="w-12 h-12 bg-neutral-200 dark:bg-dark-surface rounded-xl flex-shrink-0" />
        <div class="flex-1 space-y-2.5">
          <div class="h-4 bg-neutral-200 dark:bg-dark-surface rounded-lg w-3/4" />
          <div class="h-3 bg-neutral-200 dark:bg-dark-surface rounded-lg w-1/2" />
        </div>
        <div class="h-5 w-20 bg-neutral-200 dark:bg-dark-surface rounded-lg" />
      </div>

      <!-- Text Skeleton -->
      <div v-else-if="type === 'text'" class="skeleton-shimmer space-y-3">
        <div class="h-4 bg-neutral-200 dark:bg-dark-surface rounded-lg w-full" />
        <div class="h-4 bg-neutral-200 dark:bg-dark-surface rounded-lg w-5/6" />
        <div class="h-4 bg-neutral-200 dark:bg-dark-surface rounded-lg w-4/6" />
      </div>

      <!-- Chart Skeleton -->
      <div v-else-if="type === 'chart'" class="skeleton-shimmer">
        <div class="bg-neutral-200 dark:bg-dark-surface rounded-2xl" :style="{ height: height || '300px' }" />
      </div>

      <!-- Stats Skeleton -->
      <div v-else-if="type === 'stats'"
        class="skeleton-shimmer p-5 bg-white dark:bg-dark-card rounded-2xl border border-neutral-200/60 dark:border-dark-border">
        <div class="flex items-center justify-between">
          <div class="space-y-3 flex-1">
            <div class="h-3 bg-neutral-200 dark:bg-dark-surface rounded-lg w-24" />
            <div class="h-8 bg-neutral-200 dark:bg-dark-surface rounded-lg w-32" />
          </div>
          <div class="w-14 h-14 bg-neutral-200 dark:bg-dark-surface rounded-xl" />
        </div>
      </div>

      <!-- Default Skeleton -->
      <div v-else class="skeleton-shimmer bg-neutral-200 dark:bg-dark-surface rounded-2xl"
        :style="{ height: height }" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
  height: {
    type: String,
    default: '100px',
  },
  type: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'card', 'list', 'text', 'chart', 'stats'].includes(v),
  },
  grid: {
    type: Boolean,
    default: false,
  },
})

const containerClass = computed(() => {
  if (props.grid) {
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'
  }
  return 'space-y-4'
})
</script>

<style scoped>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%);
  animation: shimmer 1.5s infinite;
}

:global(.dark) .skeleton-shimmer::after {
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
