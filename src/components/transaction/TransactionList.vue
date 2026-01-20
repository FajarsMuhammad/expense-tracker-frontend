<template>
  <div class="space-y-6">

    <!-- Loading State -->
    <div v-if="loading && !hasTransactions">
      <AppSkeleton :count="5" height="120px" />
    </div>

    <!-- Empty State -->
    <AppEmpty v-else-if="!loading && !hasTransactions" :title="$t('transactions.empty.title')"
      :description="$t('transactions.empty.description')">
      <AppButton @click="$router.push('/transactions/create')">
        {{ $t('transactions.empty.create') }}
      </AppButton>
    </AppEmpty>

    <!-- Transaction Cards -->
    <div v-else class="space-y-4">
      <!-- Total Transaction Info -->
      <div v-if="totalTransactions > 0"
        class="relative overflow-hidden rounded-xl bg-white dark:bg-dark-card border border-primary-100 dark:border-primary-900/30 shadow-sm">
        <div class="relative px-4 md:px-5 py-3 md:py-4">
          <div class="flex items-center justify-between gap-3">
            <!-- Left: Icon & Label -->
            <div class="flex items-center gap-2.5 md:gap-3">
              <!-- Icon -->
              <div
                class="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-primary-600 dark:text-primary-400" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>

              <!-- Label -->
              <div class="flex flex-col">
                <span class="text-xs md:text-sm font-medium text-primary-600 dark:text-primary-400">
                  {{ $t('transactions.total') }}
                </span>
                <span class="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400">
                  {{ $t('transactions.showing', { count: transactions.length, total: totalTransactions }) }}
                </span>
              </div>
            </div>

            <!-- Right: Count -->
            <div class="flex items-baseline gap-1">
              <span class="text-lg md:text-xl font-bold text-primary-700 dark:text-primary-300 tabular-nums">
                {{ totalTransactions.toLocaleString() }}
              </span>
              <span class="text-xs font-medium text-primary-600/70 dark:text-primary-400/70">
                {{ $t('transactions.items') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Cards -->
      <div class="grid gap-4">
        <TransactionCard v-for="transaction in transactions" :key="transaction.id" :transaction="transaction"
          @edit="$emit('edit', transaction)" @delete="$emit('delete', transaction)" />
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && hasTransactions" class="flex justify-center pt-4">
      <AppButton @click="$emit('load-more')" :loading="loading" variant="secondary" class="min-w-[200px]">
        <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        {{ loading ? $t('transactions.loading') : $t('transactions.loadMore') }}
      </AppButton>
    </div>

    <!-- End of List Indicator -->
    <div v-if="!hasMore && hasTransactions && transactions.length > 10" class="text-center py-4">
      <p class="text-sm text-muted">{{ $t('transactions.endOfList') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TransactionCard from './TransactionCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import AppButton from '@/components/common/AppButton.vue'

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
  totalTransactions: {
    type: Number,
    default: 0,
  },
})

defineEmits(['edit', 'delete', 'load-more'])

const hasTransactions = computed(() => props.transactions.length > 0)
</script>
