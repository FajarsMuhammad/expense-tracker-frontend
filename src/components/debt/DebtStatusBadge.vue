<template>
  <div class="flex items-center gap-2">
    <!-- Status Badge -->
    <span :class="statusClasses" class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
      <component :is="statusIcon" class="size-4" />
      {{ statusLabel }}
    </span>

    <!-- Overdue Indicator -->
    <span
      v-if="isOverdue && status !== 'PAID'"
      class="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300"
      title="This debt is overdue"
    >
      <ExclamationCircleIcon class="size-4" />
      OVERDUE
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['OPEN', 'PARTIAL', 'PAID'].includes(value),
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
})

const statusClasses = computed(() => {
  const baseClasses = 'transition-colors duration-200'

  switch (props.status) {
    case 'OPEN':
      return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300`
    case 'PARTIAL':
      return `${baseClasses} bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300`
    case 'PAID':
      return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300`
    default:
      return `${baseClasses} bg-neutral-100 text-neutral-700 dark:bg-neutral-900/20 dark:text-neutral-300`
  }
})

const statusLabel = computed(() => {
  switch (props.status) {
    case 'OPEN':
      return 'Open'
    case 'PARTIAL':
      return 'Partial'
    case 'PAID':
      return 'Paid'
    default:
      return 'Unknown'
  }
})

const statusIcon = computed(() => {
  switch (props.status) {
    case 'OPEN':
      return ClockIcon
    case 'PARTIAL':
      return ArrowPathIcon
    case 'PAID':
      return CheckCircleIcon
    default:
      return ClockIcon
  }
})
</script>
