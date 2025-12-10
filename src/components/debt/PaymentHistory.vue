<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div v-if="!payments || payments.length === 0" class="rounded-lg bg-neutral-50 p-8 text-center dark:bg-neutral-800/50">
      <BanknotesIcon class="mx-auto size-12 text-neutral-400" />
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{{ $t('debts.paymentHistory.empty.title') }}</p>
      <p class="text-xs text-neutral-500 dark:text-neutral-500">
        {{ $t('debts.paymentHistory.empty.description') }}
      </p>
    </div>

    <!-- Payment Timeline -->
    <div v-else class="space-y-4">
      <div
        v-for="(payment, index) in sortedPayments"
        :key="payment.id"
        class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100/50 p-3 transition-all hover:shadow-md dark:from-neutral-800/50 dark:to-neutral-800/30 dark:hover:shadow-primary-500/10 sm:p-4"
      >
        <!-- Timeline Line (except for last item) -->
        <div v-if="index < sortedPayments.length - 1" class="absolute left-5 top-12 h-[calc(100%+1rem)] w-0.5 bg-gradient-to-b from-primary-300 to-neutral-300 dark:from-primary-700 dark:to-neutral-600 sm:left-6"></div>

        <!-- Payment Content Wrapper -->
        <div class="flex gap-2.5 sm:gap-3">
          <!-- Payment Number Icon -->
          <div class="relative flex-shrink-0">
            <div
              class="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-neutral-900 sm:size-9"
            >
              #{{ sortedPayments.length - index }}
            </div>
          </div>

          <!-- Payment Details Container -->
          <div class="min-w-0 flex-1 space-y-2.5">
            <!-- Amount -->
            <div class="flex items-start justify-between gap-2">
              <p class="truncate text-base font-bold text-green-600 dark:text-green-400 sm:text-lg">
                {{ formatCurrency(payment.amount) }}
              </p>
            </div>

            <!-- Date & Time -->
            <div class="flex flex-col gap-1 text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
              <div>{{ formatDateTime(payment.paidAt) }}</div>
              <div class="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-500">
                <ClockIcon class="size-3.5 flex-shrink-0" />
                <span>{{ formatRelativeTime(payment.paidAt) }}</span>
              </div>
            </div>

            <!-- Note -->
            <div v-if="payment.note" class="rounded-lg border border-neutral-200 bg-white p-2.5 dark:border-neutral-700 dark:bg-neutral-900/50">
              <p class="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">{{ payment.note }}</p>
            </div>

            <!-- Actions -->
            <div v-if="!readonly" class="flex gap-2 pt-1">
              <button
                @click="$emit('edit-payment', payment)"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <PencilSquareIcon class="size-3.5 flex-shrink-0" />
                <span>{{ $t('debts.paymentHistory.edit') }}</span>
              </button>
              <button
                @click="$emit('delete-payment', payment)"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600 dark:hover:bg-red-900/30"
              >
                <TrashIcon class="size-3.5 flex-shrink-0" />
                <span>{{ $t('debts.paymentHistory.delete') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BanknotesIcon, ClockIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

const props = defineProps({
  payments: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit-payment', 'delete-payment'])

const sortedPayments = computed(() => {
  if (!props.payments) return []
  return [...props.payments].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return t(days > 1 ? 'debts.paymentHistory.timeAgo.daysAgo' : 'debts.paymentHistory.timeAgo.dayAgo', { count: days })
  if (hours > 0) return t(hours > 1 ? 'debts.paymentHistory.timeAgo.hoursAgo' : 'debts.paymentHistory.timeAgo.hourAgo', { count: hours })
  if (minutes > 0) return t(minutes > 1 ? 'debts.paymentHistory.timeAgo.minutesAgo' : 'debts.paymentHistory.timeAgo.minuteAgo', { count: minutes })
  return t('debts.paymentHistory.timeAgo.justNow')
}
</script>
