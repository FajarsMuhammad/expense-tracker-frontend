<template>
  <AppCard class="cursor-pointer transition-all duration-300 hover:shadow-lg group" @click="$emit('view', debt)">
    <div class="space-y-3 md:space-y-4">
      <!-- Header: Type Badge + Status -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <!-- Debt Type Badge -->
        <span
          :class="typeClasses"
          class="inline-flex items-center gap-1 md:gap-1.5 rounded-lg px-2 md:px-2.5 py-1 md:py-1.5 text-xs font-bold uppercase tracking-wide"
        >
          <component :is="typeIcon" class="size-3.5 md:size-4" />
          <span class="text-[10px] md:text-xs">{{ typeLabel }}</span>
        </span>

        <!-- Status Badge with Overdue -->
        <DebtStatusBadge :status="debt.status" :is-overdue="debt.isOverdue" />
      </div>

      <!-- Counterparty Name -->
      <div>
        <h3 class="text-sm md:text-base lg:text-lg font-bold text-neutral-900 dark:text-neutral-100 break-words">
          {{ debt.counterpartyName }}
        </h3>
      </div>

      <!-- Amounts Section -->
      <div class="space-y-2 md:space-y-3">
        <!-- Total & Remaining Amounts -->
        <div class="grid grid-cols-2 gap-2 md:gap-3">
          <div class="space-y-0.5 md:space-y-1 min-w-0 overflow-hidden">
            <p class="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400">{{ $t('debts.card.totalAmount') }}</p>
            <p class="text-[10px] md:text-xs lg:text-sm font-semibold text-neutral-700 dark:text-neutral-300 break-all leading-tight">
              {{ formatCurrency(debt.totalAmount) }}
            </p>
          </div>

          <div class="space-y-0.5 md:space-y-1 text-right min-w-0 overflow-hidden">
            <p class="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400">{{ $t('debts.card.remaining') }}</p>
            <p :class="remainingAmountColor" class="text-[10px] md:text-xs lg:text-sm font-bold break-all leading-tight">
              {{ formatCurrency(debt.remainingAmount) }}
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <DebtProgressBar :paid-amount="debt.paidAmount" :total-amount="debt.totalAmount" />
      </div>

      <!-- Due Date & Payment Count -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-neutral-200 pt-2 md:pt-3 dark:border-neutral-700">
        <div class="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs">
          <CalendarDaysIcon class="size-3 md:size-3.5 text-neutral-400 flex-shrink-0" />
          <span class="text-neutral-600 dark:text-neutral-400">{{ $t('debts.card.due') }}:</span>
          <span :class="dueDateColor" class="font-semibold">
            {{ formatDate(debt.dueDate) }}
          </span>
        </div>

        <div v-if="debt.paymentCount > 0" class="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs">
          <BanknotesIcon class="size-3 md:size-3.5 text-neutral-400 flex-shrink-0" />
          <span class="text-neutral-600 dark:text-neutral-400">
            {{ debt.paymentCount }} {{ debt.paymentCount === 1 ? $t('debts.card.payment') : $t('debts.card.payments') }}
          </span>
        </div>
      </div>

      <!-- Note Preview -->
      <div v-if="debt.note" class="border-t border-neutral-200 pt-2 md:pt-3 dark:border-neutral-700">
        <p class="line-clamp-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          {{ debt.note }}
        </p>
      </div>

      <!-- Action Buttons (shown on hover on desktop, always visible on mobile) -->
      <div
        class="flex gap-1.5 md:gap-2 border-t border-neutral-200 pt-2 md:pt-3 opacity-100 lg:opacity-0 transition-opacity duration-200 lg:group-hover:opacity-100 dark:border-neutral-700"
      >
        <button
          @click.stop="$emit('edit', debt)"
          class="flex-1 rounded-lg bg-neutral-100 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          :title="$t('debts.card.edit')"
        >
          {{ $t('debts.card.edit') }}
        </button>
        <button
          @click.stop="$emit('delete', debt)"
          class="flex-1 rounded-lg bg-red-100 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
          :title="$t('debts.card.delete')"
        >
          {{ $t('debts.card.delete') }}
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppCard from '@/components/common/AppCard.vue'
import DebtStatusBadge from './DebtStatusBadge.vue'
import DebtProgressBar from './DebtProgressBar.vue'
import { CalendarDaysIcon, BanknotesIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/vue/24/outline'
import { DEBT_TYPES, DEBT_STATUS } from '@/config/api.config'

const { t } = useI18n()

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
  return props.debt.type === DEBT_TYPES.PAYABLE ? t('debts.types.youOwe') : t('debts.types.owedToYou')
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
  // Handle null, undefined, or empty string
  if (!dateString) {
    return 'N/A'
  }

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString)
    return 'Invalid date'
  }

  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>
