<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div v-if="!payments || payments.length === 0" class="rounded-lg bg-neutral-50 p-8 text-center dark:bg-neutral-800/50">
      <BanknotesIcon class="mx-auto size-12 text-neutral-400" />
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No payments yet</p>
      <p class="text-xs text-neutral-500 dark:text-neutral-500">
        Add a payment to start tracking this debt
      </p>
    </div>

    <!-- Payment Timeline -->
    <div v-else class="space-y-4">
      <div
        v-for="(payment, index) in sortedPayments"
        :key="payment.id"
        class="relative flex gap-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50"
      >
        <!-- Timeline Line (except for last item) -->
        <div v-if="index < sortedPayments.length - 1" class="absolute left-7 top-14 h-[calc(100%+1rem)] w-0.5 bg-neutral-300 dark:bg-neutral-600"></div>

        <!-- Payment Number Icon -->
        <div class="relative flex-shrink-0">
          <div
            class="flex size-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
          >
            #{{ sortedPayments.length - index }}
          </div>
        </div>

        <!-- Payment Details -->
        <div class="flex-1 space-y-2">
          <!-- Amount & Date -->
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">
                {{ formatCurrency(payment.amount) }}
              </p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ formatDateTime(payment.paidAt) }}
              </p>
            </div>
            <div class="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <ClockIcon class="size-4" />
              {{ formatRelativeTime(payment.paidAt) }}
            </div>
          </div>

          <!-- Note -->
          <div v-if="payment.note" class="mt-2 rounded-md bg-white p-3 dark:bg-neutral-900/50">
            <p class="text-sm text-neutral-700 dark:text-neutral-300">{{ payment.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BanknotesIcon, ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  payments: {
    type: Array,
    default: () => [],
  },
})

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

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}
</script>
