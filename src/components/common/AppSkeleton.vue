<template>
  <div class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="rounded-lg overflow-hidden"
      :style="type === 'default' ? { height: height } : undefined"
    >
      <!-- Card Skeleton -->
      <div v-if="type === 'card'" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-full rounded-lg" :style="{ height: height }" />
      </div>

      <!-- List Skeleton -->
      <div v-else-if="type === 'list'" class="animate-pulse flex items-center gap-4 p-4">
        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>

      <!-- Text Skeleton -->
      <div v-else-if="type === 'text'" class="animate-pulse space-y-3">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>

      <!-- Chart Skeleton -->
      <div v-else-if="type === 'chart'" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg" :style="{ height: height || '300px' }" />
      </div>

      <!-- Default Skeleton -->
      <div v-else class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" :style="{ height: height }" />
    </div>
  </div>
</template>

<script setup>
defineProps({
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
    validator: (v) => ['default', 'card', 'list', 'text', 'chart'].includes(v),
  },
})
</script>
