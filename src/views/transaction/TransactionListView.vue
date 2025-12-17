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
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ $t('transactions.title') }}</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('transactions.subtitle') }}
          </p>
        </div>
        <!-- Desktop Add Button -->
        <router-link
          to="/transactions/create"
          class="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <PlusIcon class="size-4" />
          {{ $t('transactions.add') }}
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link
        to="/transactions/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-2xl shadow-primary-500/50 transition-all duration-300 hover:shadow-primary-500/70 hover:scale-110 active:scale-95"
      >
        <PlusIcon class="size-7 text-white stroke-[3]" />
      </router-link>

      <!-- Summary Cards -->
      <div v-if="!loading && transactions.length > 0" class="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <!-- Income Card -->
        <div class="rounded-lg bg-green-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-green-900/10">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-green-100 p-2 md:p-2.5 lg:p-3 dark:bg-green-900/20 flex-shrink-0">
              <svg class="size-4 md:size-5 lg:size-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-green-600 dark:text-green-400">
                {{ $t('transactions.income') }}
              </p>
              <p class="text-xs md:text-sm lg:text-lg font-bold text-green-700 dark:text-green-300 break-all leading-tight">
                {{ formatCurrency(incomeTotal) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Expense Card -->
        <div class="rounded-lg bg-red-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-red-900/10">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-red-100 p-2 md:p-2.5 lg:p-3 dark:bg-red-900/20 flex-shrink-0">
              <svg class="size-4 md:size-5 lg:size-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-red-600 dark:text-red-400">
                {{ $t('transactions.expense') }}
              </p>
              <p class="text-xs md:text-sm lg:text-lg font-bold text-red-700 dark:text-red-300 break-all leading-tight">
                {{ formatCurrency(expenseTotal) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Net Balance Card -->
        <div class="rounded-lg bg-blue-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-blue-900/10 sm:col-span-2 lg:col-span-1">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-blue-100 p-2 md:p-2.5 lg:p-3 dark:bg-blue-900/20 flex-shrink-0">
              <svg class="size-4 md:size-5 lg:size-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ $t('transactions.netBalance') }}
              </p>
              <p
                class="text-xs md:text-sm lg:text-lg font-bold break-all leading-tight"
                :class="netBalance >= 0
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'"
              >
                {{ formatCurrency(netBalance) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="showFilters = !showFilters"
          class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ showFilters ? $t('transactions.filters') : $t('transactions.filters') }}
          <span
            v-if="activeFilterCount > 0"
            class="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
          >
            {{ activeFilterCount }}
          </span>
        </button>
      </div>

      <!-- Filters -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <TransactionFilters
          v-if="showFilters"
          :wallets="wallets"
          :categories="categories"
          :filters="filters"
          @apply="handleApplyFilters"
          @reset="handleResetFilters"
        />
      </transition>

      <!-- Transaction List -->
      <TransactionList
        :transactions="transactions"
        :loading="loading"
        :has-more="hasMore"
        :total-transactions="totalTransactions"
        @edit="handleEdit"
        @delete="confirmDelete"
        @load-more="handleLoadMore"
      />

      <!-- Delete Confirmation Modal -->
      <AppConfirmDialog
        v-model="showDeleteModal"
        :title="$t('transactions.deleteConfirm.title')"
        :message="$t('transactions.deleteConfirm.message')"
        variant="danger"
        :confirm-text="$t('transactions.deleteConfirm.confirm')"
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
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import TransactionFilters from '@/components/transaction/TransactionFilters.vue'
import TransactionList from '@/components/transaction/TransactionList.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useTransaction } from '@/composables/useTransaction'
import { useWallet } from '@/composables/useWallet'
import { useCategory } from '@/composables/useCategory'
import { formatCurrency } from '@/utils/currency'

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

// Net Balance
const netBalance = computed(() => incomeTotal.value - expenseTotal.value)

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
