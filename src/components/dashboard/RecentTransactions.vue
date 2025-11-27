<template>
  <AppCard>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      <router-link
        to="/transactions"
        class="text-sm text-primary-600 hover:text-primary-700 font-medium hidden sm:block"
      >
        View All
      </router-link>
    </div>

    <div v-if="transactions.length === 0" class="py-12 text-center text-gray-500">
      No transactions yet
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="py-3 flex items-center justify-between hover:bg-gray-50 transition-colors px-2 rounded"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div
            class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center"
            :class="transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'"
          >
            <span
              class="text-lg font-semibold"
              :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.type === 'INCOME' ? '+' : '-' }}
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">
              {{ transaction.categoryName || 'Uncategorized' }}
            </p>
            <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
          </div>
        </div>

        <div class="text-right ml-4 flex-shrink-0">
          <p
            class="font-semibold text-sm md:text-base"
            :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}
            {{ formatCurrency(transaction.amount, 'IDR') }}
          </p>
          <p class="text-xs text-gray-500 truncate max-w-[100px]">
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
