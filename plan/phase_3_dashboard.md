# Phase 3: Dashboard

**Duration:** 2 weeks (Week 5-6)
**Status:** Ready to start after Phase 2
**Dependencies:** Phase 1 (Authentication), Phase 2 (Wallets)

---

## Overview

This phase implements a comprehensive dashboard with key financial metrics, charts, and recent transactions. The dashboard provides users with an at-a-glance view of their financial status across all wallets with filtering capabilities.

---

## Week Breakdown

### Week 5: Dashboard Core
- **Day 1:** Dashboard store and service
- **Day 2:** Balance cards (wallet balance, today income/expense)
- **Day 3:** Weekly trend chart (Chart.js integration)
- **Day 4:** Recent transactions list
- **Day 5:** Wallet filter dropdown

### Week 6: Dashboard Polish
- **Day 1:** Chart customization and responsiveness
- **Day 2:** Refresh functionality
- **Day 3:** Loading skeletons
- **Day 4:** Empty states for no data
- **Day 5:** Dashboard testing and refinements

---

## Deliverables

- ✅ Dashboard with 4 key metrics (total balance, today's income, today's expense, transaction count)
- ✅ Interactive weekly trend chart
- ✅ Recent transactions display (last 10)
- ✅ Wallet filtering capability
- ✅ Refresh functionality
- ✅ Loading and empty states

---

## Implementation Checklist

### 1. Dashboard Service

- [x] Create src/services/dashboard.service.js
- [x] Implement getDashboardSummary method
- [x] Add wallet filter support

**`src/services/dashboard.service.js`**

```javascript
import api from './api'

export default {
  async getDashboardSummary(walletId = null) {
    const params = walletId ? { walletId } : {}
    const response = await api.get('/dashboard/summary', { params })
    return response.data
  },

  async getWeeklyTrend(walletId = null) {
    const params = walletId ? { walletId } : {}
    const response = await api.get('/dashboard/weekly-trend', { params })
    return response.data
  },

  async getRecentTransactions(walletId = null, limit = 10) {
    const params = { limit }
    if (walletId) params.walletId = walletId
    const response = await api.get('/dashboard/recent-transactions', { params })
    return response.data
  },
}
```

### 2. Dashboard Store

- [x] Create src/stores/dashboard.js
- [x] Add summary state (totalBalance, todayIncome, todayExpense, transactionCount)
- [x] Add weeklyTrend state
- [x] Add recentTransactions state
- [x] Add selectedWallet filter state
- [x] Implement fetchDashboardData action
- [x] Implement refreshDashboard action
- [x] Add loading states

**`src/stores/dashboard.js`**

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dashboardService from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref({
    totalBalance: 0,
    todayIncome: 0,
    todayExpense: 0,
    transactionCount: 0,
  })
  const weeklyTrend = ref([])
  const recentTransactions = ref([])
  const selectedWalletId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const netToday = computed(() => summary.value.todayIncome - summary.value.todayExpense)

  async function fetchDashboardData() {
    loading.value = true
    error.value = null
    try {
      const [summaryData, trendData, transactionsData] = await Promise.all([
        dashboardService.getDashboardSummary(selectedWalletId.value),
        dashboardService.getWeeklyTrend(selectedWalletId.value),
        dashboardService.getRecentTransactions(selectedWalletId.value),
      ])

      summary.value = summaryData
      weeklyTrend.value = trendData
      recentTransactions.value = transactionsData
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function refreshDashboard() {
    await fetchDashboardData()
  }

  function setSelectedWallet(walletId) {
    selectedWalletId.value = walletId
    fetchDashboardData()
  }

  return {
    summary,
    weeklyTrend,
    recentTransactions,
    selectedWalletId,
    loading,
    error,
    netToday,
    fetchDashboardData,
    refreshDashboard,
    setSelectedWallet,
  }
})
```

### 3. Dashboard Composable

- [x] Create src/composables/useDashboard.js
- [x] Implement loadDashboard function
- [x] Implement handleRefresh function
- [x] Implement handleWalletFilter function
- [x] Add toast notifications

**`src/composables/useDashboard.js`**

```javascript
import { useDashboardStore } from '@/stores/dashboard'
import { useUIStore } from '@/stores/ui'

export function useDashboard() {
  const dashboardStore = useDashboardStore()
  const uiStore = useUIStore()

  async function loadDashboard() {
    try {
      await dashboardStore.fetchDashboardData()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load dashboard data', type: 'error' })
    }
  }

  async function handleRefresh() {
    try {
      await dashboardStore.refreshDashboard()
      uiStore.showToast({ message: 'Dashboard refreshed!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: 'Failed to refresh dashboard', type: 'error' })
    }
  }

  function handleWalletFilter(walletId) {
    dashboardStore.setSelectedWallet(walletId)
  }

  return {
    summary: dashboardStore.summary,
    weeklyTrend: dashboardStore.weeklyTrend,
    recentTransactions: dashboardStore.recentTransactions,
    selectedWalletId: dashboardStore.selectedWalletId,
    loading: dashboardStore.loading,
    netToday: dashboardStore.netToday,
    loadDashboard,
    handleRefresh,
    handleWalletFilter,
  }
}
```

---

## Component Implementation

### 4. BalanceCard Component

- [x] Create src/components/dashboard/BalanceCard.vue
- [x] Display metric label and value
- [x] Add icon support
- [x] Add color coding (positive/negative)
- [x] Add responsive design for mobile

**`src/components/dashboard/BalanceCard.vue`**

```vue
<template>
  <AppCard>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ label }}</p>
        <p class="mt-2 text-3xl font-bold" :class="valueColor">
          {{ formattedValue }}
        </p>
        <p v-if="subtitle" class="mt-1 text-xs text-gray-500">{{ subtitle }}</p>
      </div>
      <div
        v-if="icon"
        class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
        :class="iconBgColor"
      >
        <component :is="icon" :class="iconColor" class="w-6 h-6" />
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  currency: { type: String, default: 'IDR' },
  type: { type: String, default: 'neutral' }, // 'positive', 'negative', 'neutral'
  icon: Object,
  subtitle: String,
})

const formattedValue = computed(() => {
  return formatCurrency(props.value, props.currency)
})

const valueColor = computed(() => {
  if (props.type === 'positive') return 'text-green-600'
  if (props.type === 'negative') return 'text-red-600'
  return 'text-gray-900'
})

const iconBgColor = computed(() => {
  if (props.type === 'positive') return 'bg-green-100'
  if (props.type === 'negative') return 'bg-red-100'
  return 'bg-blue-100'
})

const iconColor = computed(() => {
  if (props.type === 'positive') return 'text-green-600'
  if (props.type === 'negative') return 'text-red-600'
  return 'text-blue-600'
})
</script>
```

### 5. WeeklyTrendChart Component

- [x] Create src/components/dashboard/WeeklyTrendChart.vue
- [x] Install and configure Chart.js
- [x] Create line chart for weekly trend
- [x] Add income and expense lines
- [x] Make chart responsive
- [x] Add tooltips
- [x] Handle empty data

**`src/components/dashboard/WeeklyTrendChart.vue`**

```vue
<template>
  <AppCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">Weekly Trend</h3>
    </template>

    <div v-if="!hasData" class="py-12 text-center text-gray-500">
      No transaction data available for the past week
    </div>

    <div v-else class="relative h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import AppCard from '@/components/common/AppCard.vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const hasData = computed(() => props.data && props.data.length > 0)

const chartData = computed(() => {
  if (!hasData.value) return null

  return {
    labels: props.data.map((item) => item.date),
    datasets: [
      {
        label: 'Income',
        data: props.data.map((item) => item.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expense',
        data: props.data.map((item) => item.expense),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(value)
        },
      },
    },
  },
}
</script>
```

### 6. RecentTransactions Component

- [ ] Create src/components/dashboard/RecentTransactions.vue
- [ ] Display transaction list (last 10)
- [ ] Show transaction type, amount, date, category
- [ ] Add color coding for income/expense
- [ ] Handle empty state
- [ ] Add "View All" link to transactions page

**`src/components/dashboard/RecentTransactions.vue`**

```vue
<template>
  <AppCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <router-link
          to="/transactions"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </router-link>
      </div>
    </template>

    <div v-if="transactions.length === 0" class="py-12 text-center text-gray-500">
      No transactions yet
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="py-3 flex items-center justify-between hover:bg-gray-50 transition-colors px-2 rounded"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'"
          >
            <span
              class="text-lg"
              :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.type === 'INCOME' ? '+' : '-' }}
            </span>
          </div>

          <div>
            <p class="font-medium text-gray-900">{{ transaction.category }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
          </div>
        </div>

        <div class="text-right">
          <p
            class="font-semibold"
            :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}
            {{ formatCurrency(transaction.amount, transaction.currency) }}
          </p>
          <p class="text-xs text-gray-500">{{ transaction.walletName }}</p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/common/AppCard.vue'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

defineProps({
  transactions: {
    type: Array,
    required: true,
  },
})
</script>
```

### 7. WalletFilter Component

- [ ] Create src/components/dashboard/WalletFilter.vue
- [ ] Display dropdown with "All Wallets" option
- [ ] List all user wallets
- [ ] Emit selection event
- [ ] Style selected state

**`src/components/dashboard/WalletFilter.vue`**

```vue
<template>
  <div>
    <label for="wallet-filter" class="block text-sm font-medium text-gray-700 mb-2">
      Filter by Wallet
    </label>
    <select
      id="wallet-filter"
      :value="selectedWalletId"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      @change="handleChange"
    >
      <option :value="null">All Wallets</option>
      <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
        {{ wallet.name }} ({{ wallet.currency }})
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  wallets: {
    type: Array,
    required: true,
  },
  selectedWalletId: {
    type: [Number, String, null],
    default: null,
  },
})

const emit = defineEmits(['update:selectedWalletId'])

function handleChange(event) {
  const value = event.target.value === 'null' ? null : Number(event.target.value)
  emit('update:selectedWalletId', value)
}
</script>
```

---

## Utility Functions

### 8. Date Utilities

- [ ] Create src/utils/date.js
- [ ] Add formatDate function
- [ ] Add formatDateTime function
- [ ] Add relative time function (e.g., "2 hours ago")
- [ ] Use dayjs library

**`src/utils/date.js`**

```javascript
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatDate(date, format = 'MMM D, YYYY') {
  return dayjs(date).format(format)
}

export function formatDateTime(date, format = 'MMM D, YYYY h:mm A') {
  return dayjs(date).format(format)
}

export function formatRelativeTime(date) {
  return dayjs(date).fromNow()
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isThisWeek(date) {
  return dayjs(date).isSame(dayjs(), 'week')
}
```

---

## View Implementation

### 9. DashboardView

- [x] Update src/views/dashboard/DashboardView.vue
- [x] Add balance cards grid (4 cards)
- [x] Add wallet filter dropdown
- [x] Add weekly trend chart
- [x] Add recent transactions list
- [x] Add refresh button
- [x] Implement loading states
- [x] Mobile responsive design

**`src/views/dashboard/DashboardView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <AppButton variant="secondary" :loading="loading" @click="handleRefresh">
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

      <div class="mb-6 max-w-xs">
        <WalletFilter
          :wallets="wallets"
          :selected-wallet-id="selectedWalletId"
          @update:selected-wallet-id="handleWalletFilter"
        />
      </div>

      <AppSkeleton v-if="loading" count="4" height="120px" />

      <div v-else>
        <!-- Balance Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BalanceCard
            label="Total Balance"
            :value="summary.totalBalance"
            currency="IDR"
            type="neutral"
          />

          <BalanceCard
            label="Today's Income"
            :value="summary.todayIncome"
            currency="IDR"
            type="positive"
          />

          <BalanceCard
            label="Today's Expense"
            :value="summary.todayExpense"
            currency="IDR"
            type="negative"
          />

          <BalanceCard
            label="Net Today"
            :value="netToday"
            currency="IDR"
            :type="netToday >= 0 ? 'positive' : 'negative'"
          />
        </div>

        <!-- Weekly Trend Chart -->
        <div class="mb-8">
          <WeeklyTrendChart :data="weeklyTrend" />
        </div>

        <!-- Recent Transactions -->
        <RecentTransactions :transactions="recentTransactions" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import BalanceCard from '@/components/dashboard/BalanceCard.vue'
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import WalletFilter from '@/components/dashboard/WalletFilter.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useWalletStore } from '@/stores/wallet'

const {
  summary,
  weeklyTrend,
  recentTransactions,
  selectedWalletId,
  loading,
  netToday,
  loadDashboard,
  handleRefresh,
  handleWalletFilter,
} = useDashboard()

const walletStore = useWalletStore()
const wallets = walletStore.wallets

onMounted(async () => {
  await walletStore.fetchWallets()
  await loadDashboard()
})
</script>
```

---

## Router Updates

### 10. Update Dashboard Route

- [ ] Ensure dashboard route is set as default
- [ ] Test navigation to dashboard after login

**Verify in `src/router/index.js`:**

```javascript
{
  path: '/',
  redirect: '/dashboard',
},
{
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/DashboardView.vue'),
  meta: { requiresAuth: true },
},
```

---

## UI Store for Toasts

### 11. Create UI Store

- [ ] Create src/stores/ui.js
- [ ] Add toast state and methods
- [ ] Implement showToast action
- [ ] Implement hideToast action

**`src/stores/ui.js`**

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const toast = ref({
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  })

  function showToast({ message, type = 'info', duration = 3000 }) {
    toast.value = {
      show: true,
      message,
      type,
    }

    if (duration > 0) {
      setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  function hideToast() {
    toast.value.show = false
  }

  return {
    toast,
    showToast,
    hideToast,
  }
})
```

### 12. Create AppToast Component

- [ ] Create src/components/common/AppToast.vue
- [ ] Display toast notifications
- [ ] Add auto-dismiss functionality
- [ ] Style based on type (success, error, warning, info)
- [ ] Add to App.vue

**`src/components/common/AppToast.vue`**

```vue
<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed top-4 right-4 z-50 max-w-md"
      >
        <div
          class="flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg"
          :class="toastClass"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              v-if="toast.type === 'success'"
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
            <path
              v-else-if="toast.type === 'error'"
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
            <path
              v-else-if="toast.type === 'warning'"
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
            <path
              v-else
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button
            class="ml-auto flex-shrink-0 hover:opacity-75 transition-opacity"
            @click="hideToast"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const toast = uiStore.toast

const toastClass = computed(() => {
  const classes = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  }
  return classes[toast.value.type] || classes.info
})

function hideToast() {
  uiStore.hideToast()
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
```

---

## Testing Checklist

- [ ] Dashboard loads with all metrics
- [ ] Balance cards display correct data
- [ ] Total balance shows sum of all wallet balances
- [ ] Today's income/expense calculated correctly
- [ ] Weekly trend chart renders with data
- [ ] Chart displays income and expense lines
- [ ] Chart is responsive on mobile
- [ ] Recent transactions list displays last 10 transactions
- [ ] Transaction colors (green for income, red for expense)
- [ ] Wallet filter dropdown populated with user wallets
- [ ] Selecting "All Wallets" shows combined data
- [ ] Selecting specific wallet filters data correctly
- [ ] Refresh button reloads dashboard data
- [ ] Loading skeletons display during data fetch
- [ ] Empty states show when no data available
- [ ] Toast notifications work for errors
- [ ] Date formatting displays correctly
- [ ] Currency formatting displays correctly
- [ ] Mobile responsive layout working

---

## Next Phase

**Phase 4: Categories** - See `phase_4_categories.md`

---

## References

- Main Plan: `frontend_plan.md`
- Phase 1: `phase_1_foundation_auth.md`
- Phase 2: `phase_2_wallet_management.md`
- Chart.js Documentation: https://www.chartjs.org/
- Vue Chart.js: https://vue-chartjs.org/
