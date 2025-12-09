<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <!-- <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl font-bold">
          Transactions
        </h1>
        <AppButton
          @click="$router.push('/transactions/create')"
          class="w-full sm:w-auto"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">Add Transaction</span>
          <span class="sm:hidden">New</span>
        </AppButton>
      </div> -->

      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Transactions</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Track your income and expenses
          </p>
        </div>
        <!-- Desktop Add Button -->
        <router-link
          to="/transactions/create"
          class="hidden md:inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <PlusIcon class="size-5" />
          Add
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link
        to="/transactions/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-2xl shadow-primary-500/50 transition-all duration-300 hover:shadow-primary-500/70 hover:scale-110 active:scale-95"
      >
        <PlusIcon class="size-7 text-white stroke-[3]" />
      </router-link>

      <!-- Filters Section (Collapsible) -->
      <div class="mb-6">
        <button
          @click="showFilters = !showFilters"
          class="w-full flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-2xl shadow-soft border border-neutral-200 dark:border-dark-border hover:shadow-md transition-all duration-300 mb-4"
        >
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="font-medium text-neutral-900 dark:text-neutral-100">Filters</span>
            <span v-if="activeFilterCount > 0" class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
              {{ activeFilterCount }} active
            </span>
          </div>
          <svg
            class="w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform duration-200"
            :class="{ 'rotate-180': showFilters }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          v-show="showFilters"
          class="transition-all duration-300"
        >
          <TransactionFilters
            :wallets="wallets"
            :categories="categories"
            :filters="filters"
            @apply="handleApplyFilters"
            @reset="handleResetFilters"
          />
        </div>
      </div>

      <!-- Transaction List -->
      <TransactionList
        :transactions="transactions"
        :loading="loading"
        :has-more="hasMore"
        :income-total="incomeTotal"
        :expense-total="expenseTotal"
        :total-transactions="totalTransactions"
        @edit="handleEdit"
        @delete="confirmDelete"
        @load-more="handleLoadMore"
      />

      <!-- Delete Confirmation Modal -->
      <AppConfirmDialog
        v-model="showDeleteModal"
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone and will affect your wallet balance."
        variant="danger"
        confirm-text="Delete"
        :loading="loading"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import TransactionFilters from '@/components/transaction/TransactionFilters.vue'
import TransactionList from '@/components/transaction/TransactionList.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useTransaction } from '@/composables/useTransaction'
import { useWallet } from '@/composables/useWallet'
import { useCategory } from '@/composables/useCategory'

const router = useRouter()

// Transaction composable
const {
  transactions,
  loading,
  filters,
  hasMore,
  incomeTotal,
  expenseTotal,
  totalTransactions,
  loadTransactions,
  loadMoreTransactions,
  handleDeleteTransaction,
  applyFilters,
  resetFilters,
} = useTransaction()

// Wallet and Category composables for filter dropdowns
const { wallets, loadWallets } = useWallet()
const { categories, loadCategories } = useCategory()

const showFilters = ref(false)
const showDeleteModal = ref(false)
const transactionToDelete = ref(null)

// Count active filters
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.walletId) count++
  if (filters.value.categoryId) count++
  if (filters.value.type) count++
  if (filters.value.dateFrom) count++
  if (filters.value.dateTo) count++
  return count
})

onMounted(async () => {
  // Load wallets and categories first for filters
  await Promise.all([
    loadWallets(),
    loadCategories(),
  ])
  // Then load transactions
  await loadTransactions()
})

onActivated(async () => {
  // Reload data when component is re-activated (for keep-alive)
  await loadTransactions()
})

function handleEdit(transaction) {
  router.push(`/transactions/${transaction.id}/edit`)
}

function confirmDelete(transaction) {
  transactionToDelete.value = transaction
  showDeleteModal.value = true
}

async function handleDelete() {
  if (transactionToDelete.value) {
    await handleDeleteTransaction(transactionToDelete.value.id)
    showDeleteModal.value = false
    transactionToDelete.value = null
  }
}

async function handleApplyFilters(newFilters) {
  showFilters.value = false // Collapse filters after applying
  await applyFilters(newFilters)
}

async function handleResetFilters() {
  await resetFilters()
}

async function handleLoadMore() {
  await loadMoreTransactions()
}
</script>
