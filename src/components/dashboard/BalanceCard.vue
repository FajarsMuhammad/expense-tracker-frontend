<template>
  <AppCard>
    <div class="flex items-center justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-xs md:text-sm font-medium text-gray-600">{{ label }}</p>
        <p class="mt-2 font-bold whitespace-nowrap overflow-hidden text-ellipsis transition-all" :class="[valueColor, valueFontSize]">
          {{ formattedValue }}
        </p>
        <p v-if="subtitle" class="mt-1 text-xs text-gray-500">{{ subtitle }}</p>
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
import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  currency: { type: String, default: 'IDR' },
  type: { type: String, default: 'neutral' }, // 'positive', 'negative', 'neutral'
  iconSvg: { type: String, default: '' },
  subtitle: String,
})

const formattedValue = computed(() => {
  return formatCurrency(props.value, props.currency)
})

const valueFontSize = computed(() => {
  const length = formattedValue.value.length

  // Adjust font size based on the length of the formatted value
  if (length > 18) return 'text-sm sm:text-base md:text-lg lg:text-xl'
  if (length > 14) return 'text-base sm:text-lg md:text-xl lg:text-2xl'
  if (length > 10) return 'text-lg sm:text-xl md:text-2xl lg:text-3xl'
  return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
})

const valueColor = computed(() => {
  if (props.type === 'positive') return 'text-green-600'
  if (props.type === 'negative') return 'text-red-600'
  return 'text-gray-900'
})

const iconBgColor = computed(() => {
  if (props.type === 'positive') return 'bg-green-100'
  if (props.type === 'negative') return 'bg-red-100'
  return 'bg-blue-100'
})

const iconColor = computed(() => {
  if (props.type === 'positive') return 'text-green-600'
  if (props.type === 'negative') return 'text-red-600'
  return 'text-blue-600'
})
</script>
