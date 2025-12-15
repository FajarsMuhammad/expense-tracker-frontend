<template>
  <AppLayout>
    <div class="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Loading Skeleton -->
      <div v-if="loading && !currentDebt" class="space-y-6">
        <AppSkeleton class="h-16" />
        <AppSkeleton class="h-96" />
      </div>

      <!-- Debt Content -->
      <template v-else-if="currentDebt">
        <!-- Header with Actions -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <button
              @click="router.back()"
              class="flex-shrink-0 rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ArrowLeftIcon class="size-5 sm:size-6" />
            </button>
            <div class="min-w-0 flex-1">
              <h1 class="truncate text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl lg:text-3xl">
                {{ currentDebt?.counterpartyName }}
              </h1>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span
                  :class="typeClasses"
                  class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase sm:px-3"
                >
                  <component :is="typeIcon" class="size-3.5 sm:size-4" />
                  {{ typeLabel }}
                </span>
                <DebtStatusBadge v-if="currentDebt" :status="currentDebt.status" :is-overdue="currentDebt.isOverdue" />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="handleEdit"
              class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex-none sm:px-4 sm:text-sm"
            >
              <PencilIcon class="size-4" />
              <span>{{ t('debts.detail.edit') }}</span>
            </button>
            <button
              @click="showDeleteDialog = true"
              class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30 sm:flex-none sm:px-4 sm:text-sm"
            >
              <TrashIcon class="size-4" />
              <span>{{ t('debts.detail.delete') }}</span>
            </button>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Left Column: Debt Summary & Info -->
          <div class="space-y-6">
            <!-- Debt Summary Card -->
            <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card">
              <h2 class="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ t('debts.detail.debtSummary') }}</h2>

              <!-- Amounts -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ t('debts.detail.totalAmount') }}</span>
                  <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ formatCurrency(currentDebt?.totalAmount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ t('debts.detail.paidAmount') }}</span>
                  <span class="text-lg font-semibold text-green-600 dark:text-green-400">
                    {{ formatCurrency(currentDebt?.paidAmount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <span class="font-medium text-neutral-700 dark:text-neutral-300">{{ t('debts.detail.remainingAmount') }}</span>
                  <span :class="remainingAmountColor" class="text-2xl font-bold">
                    {{ formatCurrency(currentDebt?.remainingAmount) }}
                  </span>
                </div>

                <!-- Progress Bar -->
                <div v-if="currentDebt" class="pt-2">
                  <DebtProgressBar :paid-amount="currentDebt.paidAmount" :total-amount="currentDebt.totalAmount" />
                </div>
              </div>
            </div>

            <!-- Debt Information Card -->
            <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card">
              <h2 class="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ t('debts.detail.information') }}</h2>

              <div class="space-y-3">
                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ t('debts.detail.dueDate') }}</span>
                  <span :class="dueDateColor" class="text-right text-sm font-semibold">
                    {{ formatDate(currentDebt?.dueDate) }}
                    <span class="block text-xs">{{ daysUntilDue }}</span>
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ t('debts.detail.paymentsMade') }}</span>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ currentDebt?.paymentCount || 0 }}
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ t('debts.detail.created') }}</span>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ formatDateTime(currentDebt?.createdAt) }}
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ t('debts.detail.lastUpdated') }}</span>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ formatDateTime(currentDebt?.updatedAt) }}
                  </span>
                </div>

                <div v-if="currentDebt?.note" class="border-t border-neutral-200 pt-3 dark:border-neutral-700">
                  <p class="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ t('debts.detail.note') }}</p>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ currentDebt?.note }}</p>
                </div>
              </div>
            </div>

            <!-- Mark as Paid Button -->
            <button
              v-if="currentDebt?.status !== DEBT_STATUS.PAID"
              @click="showMarkPaidDialog = true"
              class="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
            >
              <CheckCircleIcon class="inline size-5" />
              {{ t('debts.detail.markAsFullyPaid') }}
            </button>
          </div>

          <!-- Right Column: Payment History -->
          <div class="space-y-6">
            <!-- Payment History Card -->
            <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-dark-card sm:p-6">
              <div class="mb-4 flex items-center justify-between gap-2">
                <h2 class="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100 sm:text-lg">{{ t('debts.detail.paymentHistory') }}</h2>
                <button
                  v-if="currentDebt?.status !== DEBT_STATUS.PAID"
                  @click="handleAddPaymentClick"
                  class="group flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 sm:px-4 sm:py-2"
                >
                  <PlusIcon class="size-3.5 flex-shrink-0 text-white transition-transform group-hover:scale-110 sm:size-4" />
                  <span class="text-white">{{ t('debts.detail.add') }}</span>
                </button>
              </div>

              <PaymentHistory
                :payments="currentDebt?.payments"
                :readonly="currentDebt?.status === DEBT_STATUS.PAID"
                @edit-payment="handleEditPaymentClick"
                @delete-payment="handleDeletePaymentClick"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <div v-else class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/10">
        <p class="text-red-700 dark:text-red-300">{{ t('debts.detail.debtNotFound') }}</p>
      </div>
    </div>

    <!-- Add/Edit Payment Modal -->
    <AppModal v-model="showPaymentModal" :title="editingPayment ? t('debts.detail.editPayment') : t('debts.detail.addPayment')">
      <PaymentForm
        :debt="currentDebt"
        :payment="editingPayment"
        :loading="loading"
        @submit="handlePaymentSubmit"
        @cancel="handleCancelPaymentForm"
      />
    </AppModal>

    <!-- Delete Confirmation Dialog -->
    <AppConfirmDialog
      v-model="showDeleteDialog"
      :title="t('debts.detail.deleteDebt')"
      :message="t('debts.detail.deleteDebtConfirm')"
      :confirm-text="t('common.buttons.delete')"
      :cancel-text="t('common.buttons.cancel')"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />

    <!-- Mark as Paid Confirmation Dialog -->
    <AppConfirmDialog
      v-model="showMarkPaidDialog"
      :title="t('debts.detail.markAsPaid')"
      :message="t('debts.detail.markAsPaidConfirm')"
      :confirm-text="t('debts.detail.markAsPaid')"
      :cancel-text="t('common.buttons.cancel')"
      @confirm="confirmMarkAsPaid"
      @cancel="showMarkPaidDialog = false"
    />

    <!-- Delete Payment Confirmation Dialog -->
    <AppConfirmDialog
      v-model="showDeletePaymentDialog"
      :title="t('debts.detail.deletePayment')"
      :message="t('debts.detail.deletePaymentConfirm')"
      :confirm-text="t('common.buttons.delete')"
      :cancel-text="t('common.buttons.cancel')"
      @confirm="confirmDeletePayment"
      @cancel="showDeletePaymentDialog = false"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDebt } from '@/composables/useDebt'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import DebtStatusBadge from '@/components/debt/DebtStatusBadge.vue'
import DebtProgressBar from '@/components/debt/DebtProgressBar.vue'
import PaymentHistory from '@/components/debt/PaymentHistory.vue'
import PaymentForm from '@/components/debt/PaymentForm.vue'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import { DEBT_TYPES, DEBT_STATUS } from '@/config/api.config'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const {
  currentDebt,
  loading,
  loadDebt,
  handleDeleteDebt,
  handleAddPayment,
  handleUpdatePayment,
  handleDeletePayment,
  handleMarkAsPaid,
} = useDebt()

const showPaymentModal = ref(false)
const showDeleteDialog = ref(false)
const showMarkPaidDialog = ref(false)
const showDeletePaymentDialog = ref(false)
const editingPayment = ref(null)
const deletingPayment = ref(null)

const typeClasses = computed(() => {
  if (!currentDebt.value) return ''
  if (currentDebt.value.type === DEBT_TYPES.PAYABLE) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-300 dark:border-red-700'
  } else {
    return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700'
  }
})

const typeLabel = computed(() => {
  if (!currentDebt.value) return ''
  return currentDebt.value.type === DEBT_TYPES.PAYABLE
    ? t('debts.detail.youOwe')
    : t('debts.detail.owedToYou')
})

const typeIcon = computed(() => {
  if (!currentDebt.value) return null
  return currentDebt.value.type === DEBT_TYPES.PAYABLE ? ArrowUpCircleIcon : ArrowDownCircleIcon
})

const remainingAmountColor = computed(() => {
  if (!currentDebt.value) return ''
  if (currentDebt.value.remainingAmount === 0) {
    return 'text-green-600 dark:text-green-400'
  } else if (currentDebt.value.isOverdue) {
    return 'text-red-600 dark:text-red-400'
  } else {
    return 'text-orange-600 dark:text-orange-400'
  }
})

const dueDateColor = computed(() => {
  if (!currentDebt.value) return ''
  if (currentDebt.value.status === DEBT_STATUS.PAID) {
    return 'text-green-600 dark:text-green-400'
  } else if (currentDebt.value.isOverdue) {
    return 'text-red-600 dark:text-red-400'
  } else {
    return 'text-neutral-700 dark:text-neutral-300'
  }
})

const daysUntilDue = computed(() => {
  if (!currentDebt.value) return ''
  const dueDate = new Date(currentDebt.value.dueDate)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (currentDebt.value.status === DEBT_STATUS.PAID) {
    return t('debts.detail.paid')
  } else if (diffDays < 0) {
    return t('debts.detail.daysOverdue', { count: Math.abs(diffDays) })
  } else if (diffDays === 0) {
    return t('debts.detail.dueToday')
  } else {
    return t('debts.detail.daysRemaining', { count: diffDays })
  }
})

function handleEdit() {
  router.push(`/debts/${route.params.id}/edit`)
}

async function confirmDelete() {
  await handleDeleteDebt(route.params.id)
  showDeleteDialog.value = false
  router.push('/debts')
}

function handleAddPaymentClick() {
  editingPayment.value = null
  showPaymentModal.value = true
}

function handleEditPaymentClick(payment) {
  editingPayment.value = payment
  showPaymentModal.value = true
}

function handleDeletePaymentClick(payment) {
  deletingPayment.value = payment
  showDeletePaymentDialog.value = true
}

function handleCancelPaymentForm() {
  showPaymentModal.value = false
  editingPayment.value = null
}

async function handlePaymentSubmit(paymentData) {
  if (editingPayment.value) {
    await handleEditPaymentSubmit(paymentData)
  } else {
    await handleAddPaymentSubmit(paymentData)
  }
}

async function handleAddPaymentSubmit(paymentData) {
  await handleAddPayment(route.params.id, paymentData)
  showPaymentModal.value = false
  editingPayment.value = null
  // Reload to ensure all calculated fields are fresh
  await loadDebt(route.params.id)
}

async function handleEditPaymentSubmit(paymentData) {
  await handleUpdatePayment(route.params.id, editingPayment.value.id, paymentData)
  showPaymentModal.value = false
  editingPayment.value = null
  // Reload to ensure all calculated fields are fresh
  await loadDebt(route.params.id)
}

async function confirmDeletePayment() {
  if (!deletingPayment.value) return
  await handleDeletePayment(route.params.id, deletingPayment.value.id)
  showDeletePaymentDialog.value = false
  deletingPayment.value = null
  // Reload to ensure all calculated fields are fresh
  await loadDebt(route.params.id)
}

async function confirmMarkAsPaid() {
  await handleMarkAsPaid(route.params.id)
  showMarkPaidDialog.value = false
  // Reload to ensure all calculated fields are fresh
  await loadDebt(route.params.id)
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(() => {
  loadDebt(route.params.id)
})
</script>
