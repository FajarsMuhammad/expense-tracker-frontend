<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
    :class="badgeClass"
  >
    <span
      v-if="showIcon"
      class="w-2 h-2 rounded-full"
      :class="iconColorClass"
    />
    {{ category.name }}
    <span v-if="showType" class="text-xs opacity-75">({{ category.type }})</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  showType: {
    type: Boolean,
    default: false,
  },
})

const badgeClass = computed(() => {
  if (props.category.type === 'INCOME') {
    return 'bg-income-light/40 text-income-dark dark:bg-income-dark/20 dark:text-income-light'
  }
  return 'bg-expense-light/40 text-expense-dark dark:bg-expense-dark/20 dark:text-expense-light'
})

const iconColorClass = computed(() => {
  if (props.category.type === 'INCOME') {
    return 'bg-income'
  }
  return 'bg-expense'
})
</script>
