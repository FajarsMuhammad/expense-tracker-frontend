<template>
  <AppLayout>
    <div class="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col gap-2 md:gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg md:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-neutral-100">Debts</h1>
          <p class="mt-1 text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400">
            Manage your payables and receivables
          </p>
        </div>
        <!-- Desktop Add Button -->
        <router-link
          to="/debts/create"
          class="hidden md:inline-flex items-center gap-1.5 md:gap-2 rounded-lg bg-primary-600 px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <PlusIcon class="size-4 md:size-4.5" />
          Add
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link
        to="/debts/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-2xl shadow-primary-500/50 transition-all duration-300 hover:shadow-primary-500/70 hover:scale-110 active:scale-95"
      >
        <PlusIcon class="size-7 text-white stroke-[3]" />
      </router-link>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Payable -->
        <div class="rounded-lg bg-red-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-red-900/10">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-red-100 p-2 md:p-2.5 lg:p-3 dark:bg-red-900/20 flex-shrink-0">
              <ArrowUpCircleIcon class="size-4 md:size-5 lg:size-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-red-600 dark:text-red-400">You Owe</p>
              <p class="text-xs md:text-sm lg:text-lg font-bold text-red-700 dark:text-red-300 break-all leading-tight">
                {{ formatCurrency(totalPayable) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Receivable -->
        <div class="rounded-lg bg-green-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-green-900/10">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-green-100 p-2 md:p-2.5 lg:p-3 dark:bg-green-900/20 flex-shrink-0">
              <ArrowDownCircleIcon class="size-4 md:size-5 lg:size-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-green-600 dark:text-green-400">Owed to You</p>
              <p class="text-xs md:text-sm lg:text-lg font-bold text-green-700 dark:text-green-300 break-all leading-tight">
                {{ formatCurrency(totalReceivable) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Net Position -->
        <div class="rounded-lg bg-blue-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-blue-900/10">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-blue-100 p-2 md:p-2.5 lg:p-3 dark:bg-blue-900/20 flex-shrink-0">
              <ScaleIcon class="size-4 md:size-5 lg:size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-blue-600 dark:text-blue-400">Net Position</p>
              <p :class="netPositionColor" class="text-xs md:text-sm lg:text-lg font-bold break-all leading-tight">
                {{ formatCurrency(Math.abs(netPosition)) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Overdue Count -->
        <div class="rounded-lg bg-orange-50 p-3 md:p-4 lg:p-5 shadow-sm dark:bg-orange-900/10">
          <div class="flex items-center gap-2 md:gap-2.5 lg:gap-3">
            <div class="rounded-lg bg-orange-100 p-2 md:p-2.5 lg:p-3 dark:bg-orange-900/20 flex-shrink-0">
              <ExclamationCircleIcon class="size-4 md:size-5 lg:size-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[10px] md:text-xs lg:text-sm font-medium text-orange-600 dark:text-orange-400">Overdue</p>
              <p class="text-xs md:text-sm lg:text-lg font-bold text-orange-700 dark:text-orange-300">
                {{ overdueDebts.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="flex items-center justify-between">
        <button
          @click="showFilters = !showFilters"
          class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <FunnelIcon class="size-5" />
          {{ showFilters ? 'Hide' : 'Show' }} Filters
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
        <DebtFilters v-if="showFilters" :filters="filters" @apply="handleApplyFilters" @reset="handleResetFilters" />
      </transition>

      <!-- Debt List -->
      <DebtList
        :debts="debts"
        :loading="loading"
        :has-more="hasMore"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- Delete Confirmation Dialog -->
    <AppConfirmDialog
      v-model="showDeleteDialog"
      title="Delete Debt"
      :message="`Are you sure you want to delete debt for ${debtToDelete?.counterpartyName}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDebt } from '@/composables/useDebt'
import AppLayout from '@/components/layout/AppLayout.vue'
import DebtList from '@/components/debt/DebtList.vue'
import DebtFilters from '@/components/debt/DebtFilters.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import {
  PlusIcon,
  FunnelIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ScaleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const {
  debts,
  loading,
  filters,
  hasMore,
  overdueDebts,
  totalPayable,
  totalReceivable,
  netPosition,
  loadDebts,
  handleDeleteDebt,
  applyFilters,
  resetFilters,
  loadMoreDebts,
} = useDebt()

const showFilters = ref(false)
const showDeleteDialog = ref(false)
const debtToDelete = ref(null)

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.type !== null) count++
  if (filters.value.status !== null) count++
  if (filters.value.overdue === true) count++
  return count
})

const netPositionColor = computed(() => {
  if (netPosition.value >= 0) {
    return 'text-green-700 dark:text-green-300'
  } else {
    return 'text-red-700 dark:text-red-300'
  }
})

function handleEdit(debt) {
  router.push(`/debts/${debt.id}/edit`)
}

function handleDelete(debt) {
  debtToDelete.value = debt
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!debtToDelete.value) return

  await handleDeleteDebt(debtToDelete.value.id)
  showDeleteDialog.value = false
  debtToDelete.value = null

  // Reload the list
  await loadDebts()
}

function handleView(debt) {
  router.push(`/debts/${debt.id}`)
}

function handleApplyFilters(newFilters) {
  applyFilters(newFilters)
}

function handleResetFilters() {
  resetFilters()
}

function handleLoadMore() {
  loadMoreDebts()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

onMounted(() => {
  loadDebts()
})
</script>
