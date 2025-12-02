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
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <button
              @click="router.back()"
              class="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ArrowLeftIcon class="size-6" />
            </button>
            <div>
              <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {{ currentDebt.counterpartyName }}
              </h1>
              <div class="mt-2 flex items-center gap-2">
                <span
                  :class="typeClasses"
                  class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold uppercase"
                >
                  <component :is="typeIcon" class="size-4" />
                  {{ typeLabel }}
                </span>
                <DebtStatusBadge :status="currentDebt.status" :is-overdue="currentDebt.isOverdue" />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="handleEdit"
              class="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <PencilIcon class="inline size-4" />
              Edit
            </button>
            <button
              @click="showDeleteDialog = true"
              class="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              <TrashIcon class="inline size-4" />
              Delete
            </button>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Left Column: Debt Summary & Info -->
          <div class="space-y-6">
            <!-- Debt Summary Card -->
            <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card">
              <h2 class="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Debt Summary</h2>

              <!-- Amounts -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">Total Amount</span>
                  <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ formatCurrency(currentDebt.totalAmount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">Paid Amount</span>
                  <span class="text-lg font-semibold text-green-600 dark:text-green-400">
                    {{ formatCurrency(currentDebt.paidAmount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <span class="font-medium text-neutral-700 dark:text-neutral-300">Remaining Amount</span>
                  <span :class="remainingAmountColor" class="text-2xl font-bold">
                    {{ formatCurrency(currentDebt.remainingAmount) }}
                  </span>
                </div>

                <!-- Progress Bar -->
                <div class="pt-2">
                  <DebtProgressBar :paid-amount="currentDebt.paidAmount" :total-amount="currentDebt.totalAmount" />
                </div>
              </div>
            </div>

            <!-- Debt Information Card -->
            <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card">
              <h2 class="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Information</h2>

              <div class="space-y-3">
                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">Due Date</span>
                  <span :class="dueDateColor" class="text-right text-sm font-semibold">
                    {{ formatDate(currentDebt.dueDate) }}
                    <span class="block text-xs">{{ daysUntilDue }}</span>
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">Payments Made</span>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ currentDebt.paymentCount || 0 }}
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">Created</span>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ formatDateTime(currentDebt.createdAt) }}
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">Last Updated</span>
                  <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ formatDateTime(currentDebt.updatedAt) }}
                  </span>
                </div>

                <div v-if="currentDebt.note" class="border-t border-neutral-200 pt-3 dark:border-neutral-700">
                  <p class="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Note</p>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ currentDebt.note }}</p>
                </div>
              </div>
            </div>

            <!-- Mark as Paid Button -->
            <button
              v-if="currentDebt.status !== DEBT_STATUS.PAID"
              @click="showMarkPaidDialog = true"
              class="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
            >
              <CheckCircleIcon class="inline size-5" />
              Mark as Fully Paid
            </button>
          </div>

          <!-- Right Column: Payment History -->
          <div class="space-y-6">
            <!-- Payment History Card -->
            <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Payment History</h2>
                <button
                  v-if="currentDebt.status !== DEBT_STATUS.PAID"
                  @click="showPaymentModal = true"
                  class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  <PlusIcon class="inline size-4" />
                  Add Payment
                </button>
              </div>

              <PaymentHistory :payments="currentDebt.payments" />
            </div>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <div v-else class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/10">
        <p class="text-red-700 dark:text-red-300">Debt not found</p>
      </div>
    </div>

    <!-- Add Payment Modal -->
    <AppModal v-if="showPaymentModal" title="Add Payment" @close="showPaymentModal = false">
      <PaymentForm :debt="currentDebt" :loading="loading" @submit="handleAddPayment" @cancel="showPaymentModal = false" />
    </AppModal>

    <!-- Delete Confirmation Dialog -->
    <AppConfirmDialog
      v-if="showDeleteDialog"
      title="Delete Debt"
      :message="`Are you sure you want to delete this debt? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />

    <!-- Mark as Paid Confirmation Dialog -->
    <AppConfirmDialog
      v-if="showMarkPaidDialog"
      title="Mark as Paid"
      :message="`Are you sure you want to mark this debt as fully paid? This will set the remaining amount to zero.`"
      confirm-text="Mark as Paid"
      cancel-text="Cancel"
      @confirm="confirmMarkAsPaid"
      @cancel="showMarkPaidDialog = false"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const { currentDebt, loading, loadDebt, handleDeleteDebt, handleAddPayment, handleMarkAsPaid } = useDebt()

const showPaymentModal = ref(false)
const showDeleteDialog = ref(false)
const showMarkPaidDialog = ref(false)

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
  return currentDebt.value.type === DEBT_TYPES.PAYABLE ? 'You Owe' : 'Owed to You'
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
    return 'Paid'
  } else if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else {
    return `${diffDays} days remaining`
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

async function handleAddPaymentSubmit(paymentData) {
  await handleAddPayment(route.params.id, paymentData)
  showPaymentModal.value = false
  await loadDebt(route.params.id)
}

async function confirmMarkAsPaid() {
  await handleMarkAsPaid(route.params.id)
  showMarkPaidDialog.value = false
  await loadDebt(route.params.id)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
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
