<template>
  <AppCard>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-display font-semibold text-neutral-900 dark:text-neutral-100">{{ $t('dashboard.recentTransactions') }}</h3>
      <router-link
        to="/transactions"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium hidden sm:block transition-colors"
      >
        {{ $t('dashboard.viewAll') }}
      </router-link>
    </div>

    <div v-if="transactions.length === 0" class="py-12 text-center text-neutral-500 dark:text-neutral-400">
      {{ $t('dashboard.noTransactions') }}
    </div>

    <div v-else class="divide-y divide-neutral-200 dark:divide-dark-border">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-dark-surface transition-colors px-2 rounded-xl"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div
            class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center"
            :class="transaction.type === 'INCOME' ? 'bg-income-light/40 dark:bg-income-dark/20' : 'bg-expense-light/40 dark:bg-expense-dark/20'"
          >
            <span
              class="text-lg font-semibold"
              :class="transaction.type === 'INCOME' ? 'text-income-dark dark:text-income' : 'text-expense-dark dark:text-expense'"
            >
              {{ transaction.type === 'INCOME' ? '+' : '-' }}
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {{ transaction.categoryName || $t('dashboard.uncategorized') }}
            </p>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ formatDate(transaction.date) }}</p>
          </div>
        </div>

        <div class="text-right ml-4 flex-shrink-0">
          <p
            class="font-semibold text-sm md:text-base"
            :class="transaction.type === 'INCOME' ? 'text-income dark:text-income-light' : 'text-expense dark:text-expense-light'"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}
            {{ formatCurrency(transaction.amount, 'IDR') }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[100px]">
            {{ transaction.walletName }}
          </p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/common/AppCard.vue'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

defineProps({
  transactions: {
    type: Array,
    required: true,
  },
})
</script>
