<template>
  <div class="space-y-6">
    <!-- Summary Header -->
    <div v-if="!loading && hasTransactions" class="flex items-center justify-between">
      <div>
        <p class="text-sm text-muted">
          Showing {{ transactions.length }} of {{ totalTransactions }} transactions
        </p>
      </div>
      <div class="flex gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-muted">Income:</span>
          <span class="font-semibold text-income dark:text-income-light">
            {{ formatCurrency(incomeTotal, 'IDR') }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted">Expense:</span>
          <span class="font-semibold text-expense dark:text-expense-light">
            {{ formatCurrency(expenseTotal, 'IDR') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasTransactions">
      <AppSkeleton :count="5" height="120px" />
    </div>

    <!-- Empty State -->
    <AppEmpty
      v-else-if="!loading && !hasTransactions"
      title="No Transactions"
      description="Start tracking your finances by creating your first transaction"
    >
      <AppButton @click="$router.push('/transactions/create')">
        Create Transaction
      </AppButton>
    </AppEmpty>

    <!-- Transaction Cards -->
    <div v-else class="grid gap-4">
      <TransactionCard
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        @edit="$emit('edit', transaction)"
        @delete="$emit('delete', transaction)"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && hasTransactions" class="flex justify-center pt-4">
      <AppButton
        @click="$emit('load-more')"
        :loading="loading"
        variant="secondary"
        class="min-w-[200px]"
      >
        <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        {{ loading ? 'Loading...' : 'Load More' }}
      </AppButton>
    </div>

    <!-- End of List Indicator -->
    <div v-if="!hasMore && hasTransactions && transactions.length > 10" class="text-center py-4">
      <p class="text-sm text-muted">You've reached the end of the list</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TransactionCard from './TransactionCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import AppButton from '@/components/common/AppButton.vue'
import { formatCurrency } from '@/utils/currency'

const router = useRouter()

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
  incomeTotal: {
    type: Number,
    default: 0,
  },
  expenseTotal: {
    type: Number,
    default: 0,
  },
  totalTransactions: {
    type: Number,
    default: 0,
  },
})

defineEmits(['edit', 'delete', 'load-more'])

const hasTransactions = computed(() => props.transactions.length > 0)
</script>
