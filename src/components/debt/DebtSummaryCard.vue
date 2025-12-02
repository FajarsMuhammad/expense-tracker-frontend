<template>
  <AppCard class="overflow-hidden">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg">
          <BanknotesIcon class="size-6 text-white" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Debt Overview</h3>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">Track your payables and receivables</p>
        </div>
      </div>
      <router-link
        to="/debts"
        class="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        <ArrowRightIcon class="size-5" />
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <AppSkeleton class="h-20" />
      <AppSkeleton class="h-20" />
      <AppSkeleton class="h-16" />
    </div>

    <!-- Empty State -->
    <div v-else-if="totalDebts === 0" class="py-8 text-center">
      <BanknotesIcon class="mx-auto size-12 text-neutral-400" />
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No debts yet</p>
      <router-link
        to="/debts/create"
        class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        <PlusIcon class="size-4" />
        Add Debt
      </router-link>
    </div>

    <!-- Content -->
    <div v-else class="space-y-4">
      <!-- Payable -->
      <div class="rounded-xl bg-red-50 p-4 dark:bg-red-900/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
              <ArrowUpCircleIcon class="size-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-red-600 dark:text-red-400">You Owe</p>
              <p class="text-xl font-bold text-red-700 dark:text-red-300">
                {{ formatCurrency(totalPayable) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Receivable -->
      <div class="rounded-xl bg-green-50 p-4 dark:bg-green-900/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
              <ArrowDownCircleIcon class="size-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-green-600 dark:text-green-400">Owed to You</p>
              <p class="text-xl font-bold text-green-700 dark:text-green-300">
                {{ formatCurrency(totalReceivable) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Net Position -->
      <div class="rounded-xl border-2 border-dashed p-4" :class="netPositionBorderClass">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="netPositionIconBgClass" class="rounded-lg p-2">
              <ScaleIcon :class="netPositionIconClass" class="size-6" />
            </div>
            <div>
              <p :class="netPositionTextClass" class="text-sm font-medium">Net Position</p>
              <p :class="netPositionAmountClass" class="text-xl font-bold">
                {{ netPositionPrefix }}{{ formatCurrency(Math.abs(netPosition)) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Alert -->
      <div v-if="overdueCount > 0" class="rounded-xl bg-orange-50 p-4 dark:bg-orange-900/10">
        <div class="flex items-center gap-3">
          <ExclamationCircleIcon class="size-6 text-orange-600 dark:text-orange-400" />
          <div class="flex-1">
            <p class="text-sm font-medium text-orange-700 dark:text-orange-300">
              {{ overdueCount }} {{ overdueCount === 1 ? 'debt is' : 'debts are' }} overdue
            </p>
            <router-link
              to="/debts?overdue=true"
              class="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              View overdue debts →
            </router-link>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <router-link
        to="/debts"
        class="mt-4 flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        View All Debts
        <ArrowRightIcon class="size-4" />
      </router-link>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import {
  BanknotesIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ScaleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  totalPayable: {
    type: Number,
    default: 0,
  },
  totalReceivable: {
    type: Number,
    default: 0,
  },
  netPosition: {
    type: Number,
    default: 0,
  },
  overdueCount: {
    type: Number,
    default: 0,
  },
  totalDebts: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const netPositionPrefix = computed(() => {
  return props.netPosition >= 0 ? '+' : ''
})

const netPositionBorderClass = computed(() => {
  return props.netPosition >= 0
    ? 'border-green-300 dark:border-green-700'
    : 'border-red-300 dark:border-red-700'
})

const netPositionIconBgClass = computed(() => {
  return props.netPosition >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
})

const netPositionIconClass = computed(() => {
  return props.netPosition >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
})

const netPositionTextClass = computed(() => {
  return props.netPosition >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
})

const netPositionAmountClass = computed(() => {
  return props.netPosition >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
