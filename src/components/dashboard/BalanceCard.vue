<template>
  <AppCard class="group hover:shadow-card-hover transition-all duration-300" :padding="false">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <!-- Label -->
          <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5">
            {{ label }}
          </p>

          <!-- Value with tooltip -->
          <div class="relative group/value mt-1">
            <p
              class="text-lg sm:text-2xl font-display font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
              {{ compactValue }}
            </p>

            <!-- Desktop hover tooltip -->
            <div
              class="hidden md:block absolute bottom-full left-0 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold rounded-lg opacity-0 invisible group-hover/value:opacity-100 group-hover/value:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none shadow-soft-lg">
              {{ fullValue }}
              <div
                class="absolute top-full left-4 w-0 h-0 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100">
              </div>
            </div>
          </div>

          <p v-if="subtitle"
            class="mt-1 text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
            {{ subtitle }}
          </p>
        </div>

        <!-- Icon (Monochrome) -->
        <div v-if="iconSvg" class="flex-shrink-0">
          <div
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-neutral-100 shadow-soft group-hover:scale-110 transition-transform duration-300">
            <div class="text-white dark:text-neutral-900 w-5 h-5 stroke-[2.5]" v-html="iconSvg"></div>
          </div>
        </div>
      </div>

      <!-- Trend Indicator (Monochrome) -->
      <div v-if="trend !== undefined" class="mt-3 pt-3 border-t border-neutral-100 dark:border-dark-border">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
            :class="trend >= 0 ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-100 text-neutral-400 dark:bg-dark-surface dark:text-neutral-600'">
            <svg v-if="trend >= 0" class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <svg v-else class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            {{ Math.abs(trend) }}%
          </span>
          <span class="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider">vs
            yesterday</span>
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
  type: { type: String, default: 'neutral' },
  iconSvg: { type: String, default: '' },
  subtitle: String,
  trend: Number,
})

const compactValue = computed(() => formatCurrencyCompact(props.value, props.currency))
const fullValue = computed(() => formatCurrency(props.value, props.currency))
</script>
