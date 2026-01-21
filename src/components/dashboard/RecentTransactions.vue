<template>
  <AppCard class="overflow-hidden">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-dark-surface flex items-center justify-center">
          <ClipboardDocumentListIcon class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div>
          <h3 class="text-base font-display font-bold text-neutral-900 dark:text-neutral-100">
            {{ $t('dashboard.recentTransactions') }}
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-500">Your latest financial activities</p>
        </div>
      </div>
      <router-link to="/transactions"
        class="p-2.5 rounded-xl text-neutral-500 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-dark-hover hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-200">
        <ArrowRightIcon class="w-5 h-5" />
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-if="transactions.length === 0" class="py-12 text-center">
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 dark:bg-dark-surface flex items-center justify-center mb-4">
        <ClipboardDocumentListIcon class="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
      </div>
      <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{{ $t('dashboard.noTransactions') }}</p>
      <router-link to="/transactions/create"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <PlusIcon class="w-4 h-4" />
        Add Transaction
      </router-link>
    </div>

    <!-- Transactions List -->
    <div v-else class="space-y-2">
      <div v-for="(transaction, index) in transactions" :key="transaction.id"
        class="group rounded-xl p-3 -mx-1 hover:bg-neutral-50 dark:hover:bg-dark-hover transition-all duration-200 cursor-pointer"
        :class="{ 'animate-fade-in-up': true }" :style="{ animationDelay: `${index * 50}ms` }">
        <div class="flex items-center justify-between gap-3">
          <!-- Left: Icon + Info -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div
              class="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              :class="transaction.type === 'INCOME'
                ? 'bg-income/10 dark:bg-income/20'
                : 'bg-expense/10 dark:bg-expense/20'">
              <component :is="transaction.type === 'INCOME' ? ArrowDownCircleIcon : ArrowUpCircleIcon" class="w-5 h-5"
                :class="transaction.type === 'INCOME'
                  ? 'text-income dark:text-income-muted'
                  : 'text-expense dark:text-expense-muted'" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                {{ transaction.categoryName || $t('dashboard.uncategorized') }}
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                {{ formatDate(transaction.date) }} • {{ transaction.walletName }}
              </p>
            </div>
          </div>

          <!-- Right: Amount -->
          <div class="text-right flex-shrink-0">
            <p class="font-bold text-sm tabular-nums" :class="transaction.type === 'INCOME'
              ? 'text-income dark:text-income-muted'
              : 'text-expense dark:text-expense-muted'">
              {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(transaction.amount, 'IDR') }}
            </p>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <router-link to="/transactions"
        class="mt-4 flex items-center justify-center gap-2 px-4 py-3 -mx-1 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-hover transition-all duration-200 group">
        {{ $t('dashboard.viewAll') }}
        <ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </router-link>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/common/AppCard.vue'
import {
  ClipboardDocumentListIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

defineProps({
  transactions: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
