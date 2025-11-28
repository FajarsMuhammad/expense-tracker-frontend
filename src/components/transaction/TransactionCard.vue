<template>
  <AppCard class="hover:shadow-lg transition-all duration-300 group">
    <div class="flex items-start justify-between gap-4">
      <!-- Left side: Icon, Category, Date, Note -->
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <!-- Type Icon -->
        <div
          class="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-soft"
          :class="transaction.type === 'INCOME'
            ? 'bg-income-light/40 dark:bg-income-dark/20'
            : 'bg-expense-light/40 dark:bg-expense-dark/20'"
        >
          <span
            class="text-xl font-bold"
            :class="transaction.type === 'INCOME'
              ? 'text-income-dark dark:text-income'
              : 'text-expense-dark dark:text-expense'"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}
          </span>
        </div>

        <!-- Transaction Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <p class="font-semibold text-neutral-900 dark:text-neutral-100">
              {{ transaction.categoryName || 'Uncategorized' }}
            </p>
          </div>

          <p class="text-sm text-muted mb-1">
            {{ formatDate(transaction.date) }}
          </p>

          <p v-if="transaction.note" class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {{ truncateNote(transaction.note) }}
          </p>

          <p class="text-xs text-muted mt-1">
            {{ transaction.walletName }}
          </p>
        </div>
      </div>

      <!-- Right side: Amount and Actions -->
      <div class="flex flex-col items-end gap-2 flex-shrink-0">
        <!-- Amount -->
        <p
          class="font-display font-bold text-lg"
          :class="transaction.type === 'INCOME'
            ? 'text-income dark:text-income-light'
            : 'text-expense dark:text-expense-light'"
        >
          {{ transaction.type === 'INCOME' ? '+' : '-' }}
          {{ formatCurrency(transaction.amount, 'IDR') }}
        </p>

        <!-- Action Buttons (shown on hover) -->
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            @click="$emit('edit', transaction)"
            class="p-2 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-card"
            title="Edit transaction"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            @click="$emit('delete', transaction)"
            class="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-card"
            title="Delete transaction"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
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
  transaction: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

function truncateNote(note) {
  if (!note) return ''
  return note.length > 100 ? note.substring(0, 100) + '...' : note
}
</script>
