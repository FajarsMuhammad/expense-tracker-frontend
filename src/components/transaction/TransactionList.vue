<template>
  <div class="space-y-6">

    <!-- Loading State -->
    <div v-if="loading && !hasTransactions">
      <AppSkeleton :count="5" height="120px" />
    </div>

    <!-- Empty State -->
    <AppEmpty
      v-else-if="!loading && !hasTransactions"
      :title="$t('transactions.empty.title')"
      :description="$t('transactions.empty.description')"
    >
      <AppButton @click="$router.push('/transactions/create')">
        {{ $t('transactions.empty.create') }}
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
})

defineEmits(['edit', 'delete', 'load-more'])

const hasTransactions = computed(() => props.transactions.length > 0)
</script>
