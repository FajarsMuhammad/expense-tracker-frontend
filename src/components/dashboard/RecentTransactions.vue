<template>
  <AppCard class="overflow-hidden">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-3 shadow-lg">
          <ClipboardDocumentListIcon class="size-6 text-white" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">{{ $t('dashboard.recentTransactions') }}</h3>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">Your latest financial activities</p>
        </div>
      </div>
      <router-link
        to="/transactions"
        class="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        <ArrowRightIcon class="size-5" />
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-if="transactions.length === 0" class="py-8 text-center">
      <ClipboardDocumentListIcon class="mx-auto size-12 text-neutral-400" />
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.noTransactions') }}</p>
      <router-link
        to="/transactions/create"
        class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        <PlusIcon class="size-4" />
        Add Transaction
      </router-link>
    </div>

    <!-- Transactions List -->
    <div v-else class="space-y-3">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="rounded-xl p-3 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      >
        <div class="flex items-center justify-between gap-3">
          <!-- Left: Icon + Info -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div
              class="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center"
              :class="transaction.type === 'INCOME' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'"
            >
              <component
                :is="transaction.type === 'INCOME' ? ArrowDownCircleIcon : ArrowUpCircleIcon"
                class="size-6"
                :class="transaction.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              />
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                {{ transaction.categoryName || $t('dashboard.uncategorized') }}
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                {{ formatDate(transaction.date) }} • {{ transaction.walletName }}
              </p>
            </div>
          </div>

          <!-- Right: Amount -->
          <div class="text-right flex-shrink-0">
            <p
              class="font-bold text-base"
              :class="transaction.type === 'INCOME' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'"
            >
              {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(transaction.amount, 'IDR') }}
            </p>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <router-link
        to="/transactions"
        class="mt-4 flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {{ $t('dashboard.viewAll') }}
        <ArrowRightIcon class="size-4" />
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
