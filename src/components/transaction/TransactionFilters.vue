<template>
  <AppCard>
    <div class="space-y-4">
      <!-- Header with active filters count -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-display font-semibold">Filters</h3>
        <span v-if="activeFilterCount > 0" class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
          {{ activeFilterCount }} active
        </span>
      </div>

      <!-- Wallet Filter -->
      <div>
        <label for="filter-wallet" class="block text-sm font-medium mb-1">
          Wallet
        </label>
        <select
          id="filter-wallet"
          v-model="localFilters.walletId"
          class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        >
          <option :value="null">All Wallets</option>
          <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
            {{ wallet.name }}
          </option>
        </select>
      </div>

      <!-- Type Filter -->
      <div>
        <label for="filter-type" class="block text-sm font-medium mb-1">
          Type
        </label>
        <select
          id="filter-type"
          v-model="localFilters.type"
          class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        >
          <option :value="null">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>

      <!-- Category Filter -->
      <div>
        <label for="filter-category" class="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="filter-category"
          v-model="localFilters.categoryId"
          class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
          :disabled="!localFilters.type"
        >
          <option :value="null">
            {{ localFilters.type ? 'All Categories' : 'Select type first' }}
          </option>
          <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Date From -->
      <div>
        <label for="filter-date-from" class="block text-sm font-medium mb-1">
          Date From
        </label>
        <input
          id="filter-date-from"
          v-model="localFilters.dateFrom"
          type="date"
          :max="localFilters.dateTo || maxDate"
          class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        />
      </div>

      <!-- Date To -->
      <div>
        <label for="filter-date-to" class="block text-sm font-medium mb-1">
          Date To
        </label>
        <input
          id="filter-date-to"
          v-model="localFilters.dateTo"
          type="date"
          :min="localFilters.dateFrom"
          :max="maxDate"
          class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">
        <AppButton @click="applyFilters" class="flex-1">
          Apply Filters
        </AppButton>
        <AppButton @click="resetFilters" variant="secondary" class="flex-1">
          Reset
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  wallets: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  filters: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['apply', 'reset'])

// Local copy of filters for form binding
const localFilters = ref({
  walletId: null,
  categoryId: null,
  type: null,
  dateFrom: null,
  dateTo: null,
})

// Get today's date in YYYY-MM-DD format for max date
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Filter categories based on selected type
const filteredCategories = computed(() => {
  if (!localFilters.value.type) return props.categories
  return props.categories.filter(c => c.type === localFilters.value.type)
})

// Count active filters
const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.value.walletId) count++
  if (localFilters.value.categoryId) count++
  if (localFilters.value.type) count++
  if (localFilters.value.dateFrom) count++
  if (localFilters.value.dateTo) count++
  return count
})

// Watch type changes and reset category if it's no longer valid
watch(() => localFilters.value.type, (newType, oldType) => {
  if (newType !== oldType && localFilters.value.categoryId) {
    const categoryStillValid = filteredCategories.value.some(c => c.id === localFilters.value.categoryId)
    if (!categoryStillValid) {
      localFilters.value.categoryId = null
    }
  }
})

// Sync local filters with prop filters
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { immediate: true, deep: true })

function applyFilters() {
  emit('apply', { ...localFilters.value })
}

function resetFilters() {
  localFilters.value = {
    walletId: null,
    categoryId: null,
    type: null,
    dateFrom: null,
    dateTo: null,
  }
  emit('reset')
}
</script>
