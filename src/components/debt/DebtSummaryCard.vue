<template>
  <AppCard class="overflow-hidden">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-dark-surface flex items-center justify-center">
          <BanknotesIcon class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div>
          <h3 class="text-base font-display font-bold text-neutral-900 dark:text-neutral-100">
            Debt Overview
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-500">Track your payables and receivables</p>
        </div>
      </div>
      <router-link to="/debts"
        class="p-2.5 rounded-xl text-neutral-500 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-dark-hover hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-200">
        <ArrowRightIcon class="w-5 h-5" />
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <AppSkeleton height="80px" />
      <AppSkeleton height="80px" />
      <AppSkeleton height="64px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="totalDebts === 0" class="py-12 text-center">
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 dark:bg-dark-surface flex items-center justify-center mb-4">
        <BanknotesIcon class="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
      </div>
      <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">No debts yet</p>
      <router-link to="/debts/create"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <PlusIcon class="w-4 h-4" />
        Add Debt
      </router-link>
    </div>

    <!-- Content -->
    <div v-else class="space-y-3">
      <!-- Payable -->
      <div class="rounded-xl bg-expense/5 dark:bg-expense/10 p-4 border border-expense/10 dark:border-expense/20">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-expense/10 dark:bg-expense/20 flex items-center justify-center">
              <ArrowUpCircleIcon class="w-5 h-5 text-expense dark:text-expense-muted" />
            </div>
            <div>
              <p class="text-xs font-medium text-expense dark:text-expense-muted uppercase tracking-wider">You Owe</p>
              <p class="text-xl font-bold text-expense-dark dark:text-expense-muted mt-0.5 tabular-nums">
                {{ formatCurrency(totalPayable) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Receivable -->
      <div class="rounded-xl bg-income/5 dark:bg-income/10 p-4 border border-income/10 dark:border-income/20">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-income/10 dark:bg-income/20 flex items-center justify-center">
              <ArrowDownCircleIcon class="w-5 h-5 text-income dark:text-income-muted" />
            </div>
            <div>
              <p class="text-xs font-medium text-income dark:text-income-muted uppercase tracking-wider">Owed to You</p>
              <p class="text-xl font-bold text-income-dark dark:text-income-muted mt-0.5 tabular-nums">
                {{ formatCurrency(totalReceivable) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Net Position -->
      <div class="rounded-xl p-4 border-2 border-dashed" :class="netPosition >= 0
        ? 'border-income/30 dark:border-income/40 bg-income/5 dark:bg-income/10'
        : 'border-expense/30 dark:border-expense/40 bg-expense/5 dark:bg-expense/10'">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="netPosition >= 0 ? 'bg-income/10 dark:bg-income/20' : 'bg-expense/10 dark:bg-expense/20'">
              <ScaleIcon class="w-5 h-5"
                :class="netPosition >= 0 ? 'text-income dark:text-income-muted' : 'text-expense dark:text-expense-muted'" />
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider"
                :class="netPosition >= 0 ? 'text-income dark:text-income-muted' : 'text-expense dark:text-expense-muted'">
                Net Position
              </p>
              <p class="text-xl font-bold mt-0.5 tabular-nums"
                :class="netPosition >= 0 ? 'text-income-dark dark:text-income-muted' : 'text-expense-dark dark:text-expense-muted'">
                {{ netPosition >= 0 ? '+' : '' }}{{ formatCurrency(Math.abs(netPosition)) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Debts Info -->
      <div
        class="rounded-xl bg-neutral-50 dark:bg-dark-surface p-4 border border-neutral-200/50 dark:border-dark-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-dark-hover flex items-center justify-center">
              <DocumentTextIcon class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">Total
                Active Debts</p>
              <p class="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                {{ totalDebts }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Alert -->
      <div v-if="overdueCount > 0"
        class="rounded-xl bg-warning/10 dark:bg-warning/20 p-4 border border-warning/20 dark:border-warning/30">
        <div class="flex items-center gap-3">
          <ExclamationCircleIcon class="w-6 h-6 text-warning flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-warning">
              {{ overdueCount }} {{ overdueCount === 1 ? 'debt is' : 'debts are' }} overdue
            </p>
            <router-link to="/debts?overdue=true"
              class="text-xs font-semibold text-warning hover:underline underline-offset-2">
              View overdue debts →
            </router-link>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <router-link to="/debts"
        class="mt-4 flex items-center justify-center gap-2 px-4 py-3 -mx-1 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-hover transition-all duration-200 group">
        View All Debts
        <ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
  DocumentTextIcon,
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

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
