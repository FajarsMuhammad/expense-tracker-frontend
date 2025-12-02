<template>
  <div class="space-y-6">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AppSkeleton v-for="i in 6" :key="i" class="h-80" />
    </div>

    <!-- Empty State -->
    <AppEmpty
      v-else-if="!loading && debts.length === 0"
      title="No debts found"
      description="You don't have any debts matching the current filters. Create your first debt to get started."
    >
      <template #icon>
        <BanknotesIcon class="size-16 text-neutral-400" />
      </template>
    </AppEmpty>

    <!-- Debt Grid -->
    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DebtCard
        v-for="debt in debts"
        :key="debt.id"
        :debt="debt"
        @edit="$emit('edit', debt)"
        @delete="$emit('delete', debt)"
        @view="$emit('view', debt)"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="!loading && hasMore" class="flex justify-center pt-4">
      <button
        @click="$emit('load-more')"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        <ArrowPathIcon class="size-5" />
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import DebtCard from './DebtCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import { BanknotesIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

defineProps({
  debts: {
    type: Array,
    required: true,
    default: () => [],
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

defineEmits(['edit', 'delete', 'view', 'load-more'])
</script>
