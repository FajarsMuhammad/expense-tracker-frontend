<template>
  <AppCard class="cursor-pointer transition-all duration-300 hover:shadow-lg group" @click="$emit('view', debt)">
    <div class="space-y-4">
      <!-- Header: Type Badge + Status -->
      <div class="flex items-start justify-between gap-3">
        <!-- Debt Type Badge -->
        <span
          :class="typeClasses"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
        >
          <component :is="typeIcon" class="size-4" />
          {{ typeLabel }}
        </span>

        <!-- Status Badge with Overdue -->
        <DebtStatusBadge :status="debt.status" :is-overdue="debt.isOverdue" />
      </div>

      <!-- Counterparty Name -->
      <div>
        <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {{ debt.counterpartyName }}
        </h3>
      </div>

      <!-- Amounts Section -->
      <div class="space-y-3">
        <!-- Total & Remaining Amounts -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">Total Amount</p>
            <p class="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
              {{ formatCurrency(debt.totalAmount) }}
            </p>
          </div>

          <div class="space-y-1 text-right">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">Remaining</p>
            <p :class="remainingAmountColor" class="text-lg font-bold">
              {{ formatCurrency(debt.remainingAmount) }}
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <DebtProgressBar :paid-amount="debt.paidAmount" :total-amount="debt.totalAmount" />
      </div>

      <!-- Due Date & Payment Count -->
      <div class="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-700">
        <div class="flex items-center gap-1.5 text-sm">
          <CalendarDaysIcon class="size-4 text-neutral-400" />
          <span class="text-neutral-600 dark:text-neutral-400">Due:</span>
          <span :class="dueDateColor" class="font-semibold">
            {{ formatDate(debt.dueDate) }}
          </span>
        </div>

        <div v-if="debt.paymentCount > 0" class="flex items-center gap-1.5 text-sm">
          <BanknotesIcon class="size-4 text-neutral-400" />
          <span class="text-neutral-600 dark:text-neutral-400">
            {{ debt.paymentCount }} {{ debt.paymentCount === 1 ? 'payment' : 'payments' }}
          </span>
        </div>
      </div>

      <!-- Note Preview -->
      <div v-if="debt.note" class="border-t border-neutral-200 pt-3 dark:border-neutral-700">
        <p class="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {{ debt.note }}
        </p>
      </div>

      <!-- Action Buttons (shown on hover) -->
      <div
        class="flex gap-2 border-t border-neutral-200 pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:border-neutral-700"
      >
        <button
          @click.stop="$emit('edit', debt)"
          class="flex-1 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          title="Edit debt"
        >
          Edit
        </button>
        <button
          @click.stop="$emit('delete', debt)"
          class="flex-1 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
          title="Delete debt"
        >
          Delete
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import DebtStatusBadge from './DebtStatusBadge.vue'
import DebtProgressBar from './DebtProgressBar.vue'
import { CalendarDaysIcon, BanknotesIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/vue/24/outline'
import { DEBT_TYPES, DEBT_STATUS } from '@/config/api.config'

const props = defineProps({
  debt: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete', 'view'])

const typeClasses = computed(() => {
  if (props.debt.type === DEBT_TYPES.PAYABLE) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-300 dark:border-red-700'
  } else {
    return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700'
  }
})

const typeLabel = computed(() => {
  return props.debt.type === DEBT_TYPES.PAYABLE ? 'You Owe' : 'Owed to You'
})

const typeIcon = computed(() => {
  return props.debt.type === DEBT_TYPES.PAYABLE ? ArrowUpCircleIcon : ArrowDownCircleIcon
})

const remainingAmountColor = computed(() => {
  if (props.debt.remainingAmount === 0) {
    return 'text-green-600 dark:text-green-400'
  } else if (props.debt.isOverdue) {
    return 'text-red-600 dark:text-red-400'
  } else {
    return 'text-orange-600 dark:text-orange-400'
  }
})

const dueDateColor = computed(() => {
  if (props.debt.status === DEBT_STATUS.PAID) {
    return 'text-green-600 dark:text-green-400'
  } else if (props.debt.isOverdue) {
    return 'text-red-600 dark:text-red-400'
  } else {
    return 'text-neutral-700 dark:text-neutral-300'
  }
})

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
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>
