<template>
  <div class="space-y-6">
    <div v-if="incomeCategories.length > 0">
      <h3 class="text-lg font-semibold mb-3">Income Categories</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard
          v-for="category in incomeCategories"
          :key="category.id"
          class="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full flex-shrink-0 bg-income"
              />
              <div>
                <p class="font-medium">{{ category.name }}</p>
                <p v-if="category.isDefault" class="text-xs text-muted">Default</p>
              </div>
            </div>

            <div v-if="!category.isDefault" class="flex gap-2">
              <button
                class="p-1 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                @click="$emit('edit', category)"
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
                class="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                @click="$emit('delete', category)"
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
        </AppCard>
      </div>
    </div>

    <div v-if="expenseCategories.length > 0">
      <h3 class="text-lg font-semibold mb-3">Expense Categories</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard
          v-for="category in expenseCategories"
          :key="category.id"
          class="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full flex-shrink-0 bg-expense"
              />
              <div>
                <p class="font-medium">{{ category.name }}</p>
                <p v-if="category.isDefault" class="text-xs text-muted">Default</p>
              </div>
            </div>

            <div v-if="!category.isDefault" class="flex gap-2">
              <button
                class="p-1 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                @click="$emit('edit', category)"
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
                class="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                @click="$emit('delete', category)"
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
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const incomeCategories = computed(() => {
  return props.categories.filter((c) => c.type === 'INCOME')
})

const expenseCategories = computed(() => {
  return props.categories.filter((c) => c.type === 'EXPENSE')
})
</script>
