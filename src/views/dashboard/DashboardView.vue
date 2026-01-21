<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Trial Banner -->
      <TrialBanner />

      <!-- Header & Filter Row -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {{ $t('dashboard.title') }}
          </h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-500">
            Track your financial progress
          </p>
        </div>

        <WalletFilter :wallets="wallets" :selected-wallet-id="selectedWalletId"
          @update:selected-wallet-id="handleWalletFilter" />
      </div>

      <!-- Loading State -->
      <div v-if="loading">
        <AppSkeleton type="stats" :count="4" grid class="mb-6" />
        <div class="grid gap-6 xl:grid-cols-3">
          <AppSkeleton type="chart" height="320px" class="xl:col-span-2" />
          <div class="space-y-6">
            <AppSkeleton type="list" :count="5" />
            <AppSkeleton type="list" :count="3" />
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Balance Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <BalanceCard :label="$t('dashboard.walletBalance')" :value="summary.walletBalance || 0" currency="IDR"
            type="neutral" :icon-svg="walletIcon" class="animate-fade-in-up" />

          <BalanceCard :label="$t('dashboard.todayIncome')" :value="summary.todayIncome || 0" currency="IDR"
            type="positive" :icon-svg="incomeIcon" class="animate-fade-in-up animation-delay-100" />

          <BalanceCard :label="$t('dashboard.todayExpense')" :value="summary.todayExpense || 0" currency="IDR"
            type="negative" :icon-svg="expenseIcon" class="animate-fade-in-up animation-delay-200" />

          <BalanceCard :label="$t('dashboard.netToday')" :value="netToday" currency="IDR"
            :type="netToday >= 0 ? 'positive' : 'negative'" :icon-svg="netIcon"
            class="animate-fade-in-up animation-delay-300" />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <!-- Left Column: Chart (Takes 2 cols on XL) -->
          <div class="xl:col-span-2 animate-fade-in-up animation-delay-200">
            <WeeklyTrendChart :data="summary.weeklyTrend || []" />
          </div>

          <!-- Right Column: Transactions & Debt (Takes 1 col on XL) -->
          <div class="space-y-6 xl:col-span-1">
            <!-- Recent Transactions -->
            <div class="animate-fade-in-up animation-delay-300">
              <RecentTransactions :transactions="summary.recentTransactions || []" />
            </div>

            <!-- Debt Summary -->
            <div class="animate-fade-in-up animation-delay-400">
              <DebtSummaryCard :total-payable="debtTotalPayable" :total-receivable="debtTotalReceivable"
                :net-position="debtNetPosition" :overdue-count="debtOverdueCount" :total-debts="debtTotalDebts"
                :loading="debtLoading" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
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

const { summary, selectedWalletId, loading, netToday, loadDashboard, handleWalletFilter } = useDashboard()

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

// SVG Icons - Monochrome style
const walletIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>`

const incomeIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>`

const expenseIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" /></svg>`

const netIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>`

onMounted(async () => {
  // Load subscription first to show trial banner
  await subscriptionStore.fetchSubscription()
  await walletStore.fetchWallets()
  await loadDashboard()
  await loadDebts()
})
</script>

<style scoped>
.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}
</style>
