<template>
  <AppCard>
    <div class="flex items-center justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">{{ label }}</p>

        <!-- Compact amount with tooltip -->
        <div class="relative group mt-2">
          <p
            class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold transition-colors"
            :class="valueColor"
          >
            {{ compactValue }}
          </p>

          <!-- Desktop hover tooltip with full amount -->
          <div
            class="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none shadow-lg"
          >
            {{ fullValue }}
            <!-- Tooltip arrow -->
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100"></div>
          </div>
        </div>

        <p v-if="subtitle" class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ subtitle }}</p>
      </div>

      <div v-if="iconSvg" class="flex-shrink-0">
        <div
          class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full"
          :class="iconBgColor"
        >
          <div :class="iconColor" v-html="iconSvg" class="w-5 h-5 md:w-6 md:h-6"></div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  currency: { type: String, default: 'IDR' },
  type: { type: String, default: 'neutral' }, // 'positive', 'negative', 'neutral'
  iconSvg: { type: String, default: '' },
  subtitle: String,
})

// Compact format for display
const compactValue = computed(() => {
  return formatCurrencyCompact(props.value, props.currency)
})

// Full format for tooltip
const fullValue = computed(() => {
  return formatCurrency(props.value, props.currency)
})

const valueColor = computed(() => {
  if (props.type === 'positive') return 'text-income dark:text-income-light'
  if (props.type === 'negative') return 'text-expense dark:text-expense-light'
  return 'text-neutral-900 dark:text-neutral-100'
})

const iconBgColor = computed(() => {
  if (props.type === 'positive') return 'bg-income-light/40 dark:bg-income-dark/20'
  if (props.type === 'negative') return 'bg-expense-light/40 dark:bg-expense-dark/20'
  return 'bg-primary-100 dark:bg-primary-900/20'
})

const iconColor = computed(() => {
  if (props.type === 'positive') return 'text-income-dark dark:text-income'
  if (props.type === 'negative') return 'text-expense-dark dark:text-expense'
  return 'text-primary-600 dark:text-primary-400'
})
</script>
