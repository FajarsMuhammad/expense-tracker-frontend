<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Trial Banner -->
      <TrialBanner />

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
        <AppButton
          size="sm"
          :loading="loading"
          @click="handleRefresh"
          class="w-full sm:w-auto"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </AppButton>
      </div>

      <!-- Wallet Filter -->
      <div class="mb-6 max-w-xs">
        <WalletFilter
          :wallets="wallets"
          :selected-wallet-id="selectedWalletId"
          @update:selected-wallet-id="handleWalletFilter"
        />
      </div>

      <!-- Loading State -->
      <AppSkeleton v-if="loading" :count="4" height="120px" class="mb-6" />

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Balance Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <BalanceCard
            label="Wallet Balance"
            :value="summary.walletBalance || 0"
            currency="IDR"
            type="neutral"
            :icon-svg="walletIcon"
          />

          <BalanceCard
            label="Today's Income"
            :value="summary.todayIncome || 0"
            currency="IDR"
            type="positive"
            :icon-svg="incomeIcon"
          />

          <BalanceCard
            label="Today's Expense"
            :value="summary.todayExpense || 0"
            currency="IDR"
            type="negative"
            :icon-svg="expenseIcon"
          />

          <BalanceCard
            label="Net Today"
            :value="netToday"
            currency="IDR"
            :type="netToday >= 0 ? 'positive' : 'negative'"
            :icon-svg="netIcon"
          />
        </div>

        <!-- Weekly Trend Chart -->
        <div class="mb-6 md:mb-8">
          <WeeklyTrendChart :data="summary.weeklyTrend || []" />
        </div>

        <!-- Two Column Grid: Recent Transactions & Debt Summary -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Recent Transactions -->
          <RecentTransactions :transactions="summary.recentTransactions || []" />

          <!-- Debt Summary -->
          <DebtSummaryCard
            :total-payable="debtTotalPayable"
            :total-receivable="debtTotalReceivable"
            :net-position="debtNetPosition"
            :overdue-count="debtOverdueCount"
            :total-debts="debtTotalDebts"
            :loading="debtLoading"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import BalanceCard from '@/components/dashboard/BalanceCard.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import WalletFilter from '@/components/dashboard/WalletFilter.vue'
import DebtSummaryCard from '@/components/debt/DebtSummaryCard.vue'
import TrialBanner from '@/components/subscription/TrialBanner.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useWalletStore } from '@/stores/wallet'
import { useSubscriptionStore } from '@/stores/subscription'
import { useDebt } from '@/composables/useDebt'

// Lazy load Chart.js component
const WeeklyTrendChart = defineAsyncComponent(() =>
  import('@/components/dashboard/WeeklyTrendChart.vue')
)

const { summary, selectedWalletId, loading, netToday, loadDashboard, handleRefresh, handleWalletFilter } = useDashboard()

const walletStore = useWalletStore()
const subscriptionStore = useSubscriptionStore()
const { wallets } = storeToRefs(walletStore)

// Debt data
const {
  loading: debtLoading,
  totalPayable: debtTotalPayable,
  totalReceivable: debtTotalReceivable,
  netPosition: debtNetPosition,
  overdueDebts,
  totalDebts: debtTotalDebts,
  loadDebts,
} = useDebt()

// Computed for overdue count
const debtOverdueCount = computed(() => overdueDebts.value.length)

// SVG Icons
const walletIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`
const incomeIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>`
const expenseIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>`
const netIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`

onMounted(async () => {
  // Load subscription first to show trial banner
  await subscriptionStore.fetchSubscription()
  await walletStore.fetchWallets()
  await loadDashboard()
  await loadDebts()
})
</script>
