<template>
  <div class="space-y-10">
    <div v-if="incomeCategories.length > 0">
      <h3
        class="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-2">
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
        {{ $t('categories.list.incomeCategories') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard v-for="category in incomeCategories" :key="category.id"
          class="hover:shadow-card-hover transition-all duration-300 group overflow-hidden border-l-4 border-l-neutral-900 dark:border-l-neutral-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-dark-surface flex items-center justify-center text-neutral-900 dark:text-neutral-100 shadow-inner">
                <span class="text-sm font-bold">{{ category.name.substring(0, 2).toUpperCase() }}</span>
              </div>
              <div>
                <p class="font-bold text-neutral-900 dark:text-neutral-100">{{ category.name }}</p>
                <p v-if="category.isDefault"
                  class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{{
                    $t('categories.list.default') }}</p>
              </div>
            </div>

            <div v-if="!category.isDefault"
              class="flex gap-1.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
              <button
                class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-dark-surface text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center justify-center transition-colors"
                @click="$emit('edit', category)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-dark-surface text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center justify-center transition-colors"
                @click="$emit('delete', category)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <div v-if="expenseCategories.length > 0">
      <h3
        class="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-2">
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
        {{ $t('categories.list.expenseCategories') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard v-for="category in expenseCategories" :key="category.id"
          class="hover:shadow-card-hover transition-all duration-300 group overflow-hidden border-l-4 border-l-neutral-400 dark:border-l-neutral-600">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-dark-surface flex items-center justify-center text-neutral-400 dark:text-neutral-600 shadow-inner">
                <span class="text-sm font-bold">{{ category.name.substring(0, 2).toUpperCase() }}</span>
              </div>
              <div>
                <p class="font-bold text-neutral-900 dark:text-neutral-100">{{ category.name }}</p>
                <p v-if="category.isDefault"
                  class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{{
                    $t('categories.list.default') }}</p>
              </div>
            </div>

            <div v-if="!category.isDefault"
              class="flex gap-1.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
              <button
                class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-dark-surface text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center justify-center transition-colors"
                @click="$emit('edit', category)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-dark-surface text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center justify-center transition-colors"
                @click="$emit('delete', category)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const incomeCategories = computed(() => props.categories.filter(c => c.type === 'INCOME'))
const expenseCategories = computed(() => props.categories.filter(c => c.type === 'EXPENSE'))
</script>
