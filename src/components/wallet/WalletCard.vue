<template>
  <AppCard class="hover:shadow-soft-xl transition-all duration-300 cursor-pointer group" @click="$emit('view', wallet)">
    <div class="flex items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4">
      <div class="flex-1 min-w-0">
        <p class="text-[10px] md:text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-0.5 md:mb-1">Wallet</p>
        <h3 class="text-sm md:text-base lg:text-lg font-display font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {{ wallet.name }}
        </h3>
        <p class="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 md:mt-1">{{ wallet.currency }}</p>
      </div>

      <div class="flex-shrink-0">
        <div class="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-primary shadow-glow-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="mb-3 md:mb-4">
      <p class="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mb-1">Current Balance</p>

      <!-- Compact amount with tooltip -->
      <div class="relative group">
        <p class="text-base md:text-lg lg:text-xl font-display font-bold transition-colors break-words leading-tight" :class="balanceColor">
          {{ compactBalance }}
        </p>

        <!-- Desktop hover tooltip with full amount -->
        <div
          class="hidden md:block absolute bottom-full left-0 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs sm:text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none shadow-lg"
        >
          {{ formattedBalance }}
          <!-- Tooltip arrow -->
          <div class="absolute top-full left-4 w-0 h-0 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100"></div>
        </div>
      </div>
    </div>

    <div class="flex gap-1.5 md:gap-2 pt-2 md:pt-3 border-t border-neutral-200 dark:border-dark-border">
      <AppButton size="sm" variant="secondary" @click.stop="$emit('edit', wallet)" class="flex-1">
        <svg class="w-3 h-3 md:w-3.5 md:h-3.5 mr-0.5 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span class="text-[10px] md:text-xs">Edit</span>
      </AppButton>
      <AppButton size="sm" variant="danger" @click.stop="$emit('delete', wallet)" class="flex-1">
        <svg class="w-3 h-3 md:w-3.5 md:h-3.5 mr-0.5 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span class="text-[10px] md:text-xs">Delete</span>
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

const props = defineProps({
  wallet: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'edit', 'delete'])

// format for display
const compactBalance = computed(() => {
  return formatCurrency(props.wallet.currentBalance || 0, props.wallet.currency)
})

// Full format for tooltip
const formattedBalance = computed(() => {
  return formatCurrency(props.wallet.currentBalance || 0, props.wallet.currency)
})

const balanceColor = computed(() => {
  const balance = props.wallet.currentBalance || 0
  if (balance >= 0) {
    return 'text-income dark:text-income-light'
  }
  return 'text-expense dark:text-expense-light'
})
</script>
