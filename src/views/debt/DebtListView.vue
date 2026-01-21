<template>
  <AppLayout>
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{{
            $t('debts.title') }}</h1>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {{ $t('debts.subtitle') }}
          </p>
        </div>
        <!-- Desktop Add Button -->
        <router-link to="/debts/create"
          class="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-sm font-bold text-white dark:text-neutral-900 shadow-soft hover:shadow-soft-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-200 active:scale-95">
          <PlusIcon class="size-4 stroke-[3]" />
          {{ $t('debts.add') }}
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link to="/debts/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-neutral-900 dark:bg-neutral-100 rounded-full shadow-soft-2xl transition-all duration-300 hover:scale-110 active:scale-95">
        <PlusIcon class="size-7 text-white dark:text-neutral-900 stroke-[3]" />
      </router-link>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <!-- Total Payable -->
        <div class="card-base p-5 border-l-4 border-l-neutral-400 dark:border-l-neutral-600">
          <div class="flex items-center gap-4">
            <div
              class="rounded-xl bg-neutral-50 dark:bg-dark-surface p-3 border border-neutral-100 dark:border-dark-border">
              <ArrowUpCircleIcon class="size-6 text-neutral-500" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">{{
                  $t('debts.summary.youOwe') }}</p>
                <span
                  class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-900 dark:bg-neutral-100 text-[9px] font-bold text-white dark:text-neutral-900">
                  {{ payableCount }}
                </span>
              </div>
              <p
                class="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                {{ formatCurrency(totalPayable) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Receivable -->
        <div class="card-base p-5 border-l-4 border-l-neutral-900 dark:border-l-neutral-100">
          <div class="flex items-center gap-4">
            <div
              class="rounded-xl bg-neutral-50 dark:bg-dark-surface p-3 border border-neutral-100 dark:border-dark-border">
              <ArrowDownCircleIcon class="size-6 text-neutral-900 dark:text-neutral-100" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">{{
                  $t('debts.summary.owedToYou') }}</p>
                <span
                  class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-900 dark:bg-neutral-100 text-[9px] font-bold text-white dark:text-neutral-900">
                  {{ receivableCount }}
                </span>
              </div>
              <p
                class="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                {{ formatCurrency(totalReceivable) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Net Position -->
        <div class="card-base p-5 bg-neutral-900 dark:bg-neutral-100">
          <div class="flex items-center gap-4">
            <div
              class="rounded-xl bg-white/10 dark:bg-neutral-900/10 p-3 border border-white/20 dark:border-neutral-900/10">
              <ScaleIcon class="size-6 text-white dark:text-neutral-900" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-white/50 dark:text-neutral-900/50 uppercase tracking-widest">{{
                $t('debts.summary.netPosition') }}</p>
              <p class="text-xl font-display font-bold text-white dark:text-neutral-900 tracking-tight leading-tight">
                {{ formatCurrency(Math.abs(netPosition)) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Overdue Count -->
        <div class="card-base p-5 border-l-4 border-l-neutral-200 dark:border-l-neutral-800">
          <div class="flex items-center gap-4">
            <div
              class="rounded-xl bg-neutral-50 dark:bg-dark-surface p-3 border border-neutral-100 dark:border-dark-border">
              <ExclamationCircleIcon class="size-6 text-neutral-400" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">{{
                $t('debts.summary.overdue') }}</p>
              <p
                class="text-xl font-display font-bold text-neutral-400 dark:text-neutral-600 tracking-tight leading-tight">
                {{ overdueDebts.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="flex items-center justify-between mb-6">
        <button @click="showFilters = !showFilters"
          class="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-soft transition-all hover:bg-neutral-50 dark:border-dark-border dark:bg-dark-card dark:text-neutral-100 dark:hover:bg-dark-hover">
          <FunnelIcon class="size-5" />
          {{ showFilters ? $t('debts.filters.hide') : $t('debts.filters.show') }} {{ $t('debts.filters.type') }}
          <span v-if="activeFilterCount > 0"
            class="inline-flex items-center rounded-full bg-neutral-900 dark:bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-white dark:text-neutral-900">
            {{ activeFilterCount }}
          </span>
        </button>
      </div>

      <!-- Filters -->
      <transition name="slide-up">
        <DebtFilters v-if="showFilters" :filters="filters" @apply="handleApplyFilters" @reset="handleResetFilters" />
      </transition>

      <!-- Debt List -->
      <DebtList :debts="debts" :loading="loading" :has-more="hasMore" @edit="handleEdit" @delete="handleDelete"
        @view="handleView" @load-more="handleLoadMore" />
    </div>

    <!-- Delete Confirmation Dialog -->
    <AppConfirmDialog v-model="showDeleteDialog" :title="$t('debts.deleteConfirm.title')" :message="deleteMessage"
      :confirm-text="$t('debts.deleteConfirm.confirm')" :cancel-text="$t('debts.deleteConfirm.cancel')" variant="danger"
      @confirm="confirmDelete" @cancel="showDeleteDialog = false" />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()
const {
  debts,
  loading,
  filters,
  hasMore,
  overdueDebts,
  totalPayable,
  totalReceivable,
  payableCount,
  receivableCount,
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

const deleteMessage = computed(() => {
  if (!debtToDelete.value) return ''
  return t('debts.deleteConfirm.message', { name: debtToDelete.value.counterpartyName })
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
