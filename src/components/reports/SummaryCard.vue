<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:shadow-card-hover dark:border-dark-border dark:bg-dark-card">
    <!-- Background Gradient (Extremely Subtle Monochrome) -->
    <div
      class="absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.05] bg-neutral-900 dark:bg-neutral-100">
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="relative space-y-3">
      <AppSkeleton class="h-4 w-24" />
      <AppSkeleton class="h-8 w-32" />
      <AppSkeleton class="h-4 w-20" />
    </div>

    <!-- Content -->
    <div v-else class="relative">
      <!-- Icon & Title -->
      <div class="mb-3 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            class="rounded-xl p-2 flex-shrink-0 bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
            <component :is="iconComponent" class="size-4 text-neutral-900 dark:text-neutral-100" />
          </div>
          <h3 class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest truncate">
            {{ title }}
          </h3>
        </div>
        <slot name="action" />
      </div>

      <!-- Value -->
      <div class="mb-1.5">
        <p
          class="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
          {{ formattedValue }}
        </p>
      </div>

      <!-- Trend / Subtitle -->
      <div v-if="trend !== null" class="flex items-center gap-1.5 flex-wrap">
        <div class="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
          :class="trend >= 0 ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-100 text-neutral-400 dark:bg-dark-surface dark:text-neutral-600'">
          <component :is="trendIcon" class="size-2.5" />
          {{ Math.abs(trend) }}%
        </div>
        <span class="text-[10px] font-medium text-neutral-500 dark:text-neutral-500">
          {{ trendLabel || 'vs last period' }}
        </span>
      </div>

      <!-- Subtitle or additional info -->
      <p v-else-if="subtitle" class="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400">
        {{ subtitle }}
      </p>

      <!-- Custom slot for additional content -->
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  WalletIcon,
  ChartBarIcon,
  ScaleIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  icon: {
    type: String,
    default: 'BanknotesIcon',
    validator: (value) =>
      ['BanknotesIcon', 'WalletIcon', 'ChartBarIcon', 'ScaleIcon'].includes(value),
  },
  variant: {
    type: String,
    default: 'neutral',
    validator: (value) => ['neutral', 'success', 'danger', 'warning', 'primary'].includes(value),
  },
  format: {
    type: String,
    default: 'currency',
    validator: (value) => ['currency', 'number', 'percentage', 'text'].includes(value),
  },
  trend: {
    type: Number,
    default: null,
  },
  trendLabel: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    default: 'IDR',
  },
})

// Icon component mapping
const iconComponents = {
  BanknotesIcon,
  WalletIcon,
  ChartBarIcon,
  ScaleIcon,
}

const iconComponent = computed(() => iconComponents[props.icon] || BanknotesIcon)

// Trend icon
const trendIcon = computed(() => (props.trend >= 0 ? ArrowUpIcon : ArrowDownIcon))

// Variant-based styling
const variantConfig = computed(() => {
  switch (props.variant) {
    case 'success':
      return {
        gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        value: 'text-green-700 dark:text-green-300',
      }
    case 'danger':
      return {
        gradient: 'bg-gradient-to-br from-red-500 to-rose-500',
        iconBg: 'bg-red-100 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        value: 'text-red-700 dark:text-red-300',
      }
    case 'warning':
      return {
        gradient: 'bg-gradient-to-br from-orange-500 to-amber-500',
        iconBg: 'bg-orange-100 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        value: 'text-orange-700 dark:text-orange-300',
      }
    case 'primary':
      return {
        gradient: 'bg-gradient-to-br from-primary-500 to-blue-500',
        iconBg: 'bg-primary-100 dark:bg-primary-900/20',
        icon: 'text-primary-600 dark:text-primary-400',
        value: 'text-primary-700 dark:text-primary-300',
      }
    default:
      return {
        gradient: 'bg-gradient-to-br from-neutral-500 to-gray-500',
        iconBg: 'bg-neutral-100 dark:bg-neutral-800',
        icon: 'text-neutral-600 dark:text-neutral-400',
        value: 'text-neutral-900 dark:text-neutral-100',
      }
  }
})

const gradientClass = computed(() => variantConfig.value.gradient)
const iconBgClass = computed(() => variantConfig.value.iconBg)
const iconClass = computed(() => variantConfig.value.icon)
const valueClass = computed(() => variantConfig.value.value)

// Format value based on format prop
const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: props.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(props.value || 0)
  } else if (props.format === 'number') {
    return new Intl.NumberFormat('id-ID').format(props.value || 0)
  } else if (props.format === 'percentage') {
    return `${props.value}%`
  } else {
    return props.value
  }
})
</script>
