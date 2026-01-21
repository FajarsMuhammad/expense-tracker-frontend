<template>
  <AppCard class="hover:shadow-soft-xl transition-all duration-300 cursor-pointer group" @click="$emit('view', wallet)">
    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="flex-1 min-w-0">
        <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">{{
          $t('wallets.wallet') }}</p>
        <h3
          class="text-base font-display font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
          {{ wallet.name }}
        </h3>
        <span
          class="inline-block px-1.5 py-0.5 mt-1 text-[9px] font-bold bg-neutral-100 dark:bg-dark-surface dark:text-neutral-400 border border-neutral-200 dark:border-dark-border rounded uppercase tracking-tighter">
          {{ wallet.currency }}
        </span>
      </div>

      <div class="flex-shrink-0">
        <div
          class="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-neutral-100 shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-6 h-6 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">{{
        $t('wallets.currentBalance') }}</p>

      <!-- Compact amount with tooltip -->
      <div class="relative group">
        <p class="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
          {{ compactBalance }}
        </p>

        <!-- Tooltip -->
        <div
          class="hidden md:block absolute bottom-full left-0 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none shadow-lg">
          {{ formattedBalance }}
          <div
            class="absolute top-full left-4 w-0 h-0 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100">
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2 pt-3 border-t border-neutral-100 dark:border-dark-border">
      <button @click.stop="$emit('edit', wallet)"
        class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-dark-hover text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
        <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {{ $t('wallets.edit') }}
      </button>

      <button v-if="!hasTransactions" @click.stop="$emit('delete', wallet)"
        class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-dark-hover text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-colors">
        <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {{ $t('wallets.delete') }}
      </button>

      <button v-else @click.stop="$emit('cannotDelete', wallet)"
        class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-dark-surface text-xs font-bold text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-neutral-100 dark:border-dark-border"
        :title="$t('wallets.cannotDelete')">
        <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        {{ $t('wallets.locked') }}
      </button>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  wallet: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'edit', 'delete', 'cannotDelete'])

const hasTransactions = computed(() => {
  if (!props.wallet) return false
  const initial = props.wallet.initialBalance || 0
  const current = props.wallet.currentBalance || 0
  return initial !== current
})

const compactBalance = computed(() => {
  return formatCurrency(props.wallet.currentBalance || 0, props.wallet.currency)
})

const formattedBalance = computed(() => {
  return formatCurrency(props.wallet.currentBalance || 0, props.wallet.currency)
})
</script>
