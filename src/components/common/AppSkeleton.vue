<template>
  <div class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="animate-pulse bg-gray-200 rounded-lg"
      :style="{ height: height }"
    />
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 1 },
  height: { type: String, default: '100px' },
})
</script>
