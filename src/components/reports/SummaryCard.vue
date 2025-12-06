<template>
  <div
    class="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-neutral-700 dark:bg-dark-card"
  >
    <!-- Background Gradient (Subtle) -->
    <div
      class="absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-10"
      :class="gradientClass"
    ></div>

    <!-- Loading State -->
    <div v-if="loading" class="relative space-y-3">
      <AppSkeleton class="h-4 w-24" />
      <AppSkeleton class="h-8 w-32" />
      <AppSkeleton class="h-4 w-20" />
    </div>

    <!-- Content -->
    <div v-else class="relative">
      <!-- Icon & Title -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded-lg p-2" :class="iconBgClass">
            <component :is="iconComponent" class="size-6" :class="iconClass" />
          </div>
          <h3 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            {{ title }}
          </h3>
        </div>
        <!-- Optional badge or action -->
        <slot name="action" />
      </div>

      <!-- Value -->
      <div class="mb-2">
        <p class="text-3xl font-bold" :class="valueClass">
          {{ formattedValue }}
        </p>
      </div>

      <!-- Trend Indicator -->
      <div v-if="trend !== null" class="flex items-center gap-1">
        <component
          :is="trendIcon"
          class="size-4"
          :class="trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
        />
        <span
          class="text-sm font-medium"
          :class="trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
        >
          {{ Math.abs(trend) }}%
        </span>
        <span class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ trendLabel || 'vs last period' }}
        </span>
      </div>

      <!-- Subtitle or additional info -->
      <p v-else-if="subtitle" class="text-sm text-neutral-500 dark:text-neutral-400">
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
