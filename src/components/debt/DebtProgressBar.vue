<template>
  <div class="space-y-2">
    <!-- Progress Bar -->
    <div class="relative h-3 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
      <div
        :class="progressColor"
        :style="{ width: `${percentage}%` }"
        class="h-full rounded-full transition-all duration-500 ease-out"
        role="progressbar"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>

    <!-- Labels -->
    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-green-600 dark:text-green-400">
          {{ formatCurrency(paidAmount) }}
        </span>
        <span class="text-neutral-500 dark:text-neutral-400">paid</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-neutral-500 dark:text-neutral-400">of</span>
        <span class="font-semibold text-neutral-700 dark:text-neutral-300">
          {{ formatCurrency(totalAmount) }}
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <span :class="percentageColor" class="font-bold">
          {{ percentage }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
})

const percentage = computed(() => {
  if (props.totalAmount === 0) return 0
  const percent = (props.paidAmount / props.totalAmount) * 100
  return Math.min(Math.round(percent), 100)
})

const progressColor = computed(() => {
  const percent = percentage.value

  if (percent === 100) {
    return 'bg-gradient-to-r from-green-400 to-green-600'
  } else if (percent >= 67) {
    return 'bg-gradient-to-r from-yellow-400 to-green-400'
  } else if (percent >= 34) {
    return 'bg-gradient-to-r from-orange-400 to-yellow-400'
  } else {
    return 'bg-gradient-to-r from-red-400 to-orange-400'
  }
})

const percentageColor = computed(() => {
  const percent = percentage.value

  if (percent === 100) {
    return 'text-green-600 dark:text-green-400'
  } else if (percent >= 67) {
    return 'text-yellow-600 dark:text-yellow-400'
  } else if (percent >= 34) {
    return 'text-orange-600 dark:text-orange-400'
  } else {
    return 'text-red-600 dark:text-red-400'
  }
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
