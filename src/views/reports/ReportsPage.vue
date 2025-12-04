<template>
  <AppLayout>
    <!-- Page Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Financial Reports
        </h1>
        <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          View your financial summary and export data
        </p>
      </div>

      <!-- Export Button -->
      <ExportButton
        :exporting="isExporting"
        :progress="exportProgress"
        @export="handleExport"
      />
    </div>

    <!-- Date Range Picker -->
    <div class="mb-6">
      <DateRangePicker
        v-model:start-date="dateRange.startDate"
        v-model:end-date="dateRange.endDate"
        @change="handleDateRangeChange"
      />
    </div>

    <!-- Summary Cards Grid -->
    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Income"
        :value="totalIncome"
        icon="BanknotesIcon"
        variant="success"
        format="currency"
        :loading="summaryLoading"
      />

      <SummaryCard
        title="Total Expense"
        :value="totalExpense"
        icon="BanknotesIcon"
        variant="danger"
        format="currency"
        :loading="summaryLoading"
      />

      <SummaryCard
        title="Net Balance"
        :value="netBalance"
        icon="ScaleIcon"
        :variant="netBalance >= 0 ? 'success' : 'danger'"
        format="currency"
        :loading="summaryLoading"
      />

      <SummaryCard
        title="Transactions"
        :value="transactionCount"
        icon="ChartBarIcon"
        variant="primary"
        format="number"
        :loading="summaryLoading"
      />
    </div>

    <!-- Category Breakdown Section -->
    <div v-if="hasCategoryBreakdown" class="mb-8">
      <AppCard>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Category Breakdown
          </h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="category in topCategories"
            :key="category.categoryId"
            class="flex items-center gap-4"
          >
            <!-- Progress Bar -->
            <div class="flex-1">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {{ category.categoryName }}
                </span>
                <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ formatCurrency(category.totalAmount) }}
                </span>
              </div>
              <div class="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
                  :style="{ width: `${category.percentage}%` }"
                ></div>
              </div>
            </div>

            <!-- Percentage -->
            <div class="text-right">
              <span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {{ category.percentage.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Show all categories link -->
        <div v-if="categoryBreakdown.length > 5" class="mt-4 text-center">
          <button
            type="button"
            class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            @click="showAllCategories = !showAllCategories"
          >
            {{ showAllCategories ? 'Show Less' : `Show All ${categoryBreakdown.length} Categories` }}
          </button>
        </div>
      </AppCard>
    </div>

    <!-- Trend Chart Section (Placeholder) -->
    <div v-if="hasTrendData" class="mb-8">
      <AppCard>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Income vs Expense Trend
          </h2>

          <!-- Granularity Selector -->
          <div class="flex gap-1 rounded-lg border border-neutral-300 p-1 dark:border-neutral-600">
            <button
              v-for="gran in granularityOptions"
              :key="gran.value"
              type="button"
              class="rounded px-3 py-1 text-xs font-medium transition-colors"
              :class="
                filters.granularity === gran.value
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              "
              @click="changeGranularity(gran.value)"
            >
              {{ gran.label }}
            </button>
          </div>
        </div>

        <!-- Simple Table View (Placeholder for chart) -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th class="pb-3 pr-4 text-left font-medium text-neutral-700 dark:text-neutral-300">
                  Date
                </th>
                <th class="pb-3 pr-4 text-right font-medium text-neutral-700 dark:text-neutral-300">
                  Income
                </th>
                <th class="pb-3 pr-4 text-right font-medium text-neutral-700 dark:text-neutral-300">
                  Expense
                </th>
                <th class="pb-3 text-right font-medium text-neutral-700 dark:text-neutral-300">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr
                v-for="(item, index) in trendData.slice(0, 10)"
                :key="index"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td class="py-3 pr-4 text-neutral-900 dark:text-neutral-100">
                  {{ formatDate(item.date) }}
                </td>
                <td class="py-3 pr-4 text-right font-medium text-green-600 dark:text-green-400">
                  {{ formatCurrency(item.income) }}
                </td>
                <td class="py-3 pr-4 text-right font-medium text-red-600 dark:text-red-400">
                  {{ formatCurrency(item.expense) }}
                </td>
                <td class="py-3 text-right font-semibold" :class="getNetBalanceColor(item.balance)">
                  {{ formatCurrency(item.balance) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="trendData.length > 10" class="mt-4 text-center">
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              Showing 10 of {{ trendData.length }} entries
            </p>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && !hasSummary"
      class="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-12 text-center dark:border-neutral-700 dark:bg-neutral-900/20"
    >
      <ChartBarIcon class="mx-auto size-12 text-neutral-400" />
      <h3 class="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        No Data Available
      </h3>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Select a date range to view your financial reports
      </p>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import SummaryCard from '@/components/reports/SummaryCard.vue'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import ExportButton from '@/components/reports/ExportButton.vue'
import { useReports } from '@/composables/useReports'
import { useExport } from '@/composables/useExport'
import { useExportStore } from '@/stores/export'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { GRANULARITY } from '@/config/api.config'

// Composables
const {
  summary,
  categoryBreakdown,
  trendData,
  filters,
  hasSummary,
  totalIncome,
  totalExpense,
  netBalance,
  transactionCount,
  hasCategoryBreakdown,
  topCategories,
  hasTrendData,
  summaryLoading,
  loadAllReports,
  formatCurrency,
  getNetBalanceColor,
  changeGranularity,
} = useReports()

const { exportTransactions } = useExport()
const exportStore = useExportStore()
const { exporting: isExporting, exportProgress } = storeToRefs(exportStore)

// Local state
const dateRange = ref({
  startDate: null,
  endDate: null,
})

const showAllCategories = ref(false)

const granularityOptions = [
  { label: 'Daily', value: GRANULARITY.DAILY },
  { label: 'Weekly', value: GRANULARITY.WEEKLY },
  { label: 'Monthly', value: GRANULARITY.MONTHLY },
]

// Methods
async function handleDateRangeChange({ startDate, endDate }) {
  dateRange.value = { startDate, endDate }
  await loadAllReports({ startDate, endDate })
}

async function handleExport(format) {
  await exportTransactions(format, {
    startDate: dateRange.value.startDate,
    endDate: dateRange.value.endDate,
  })
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// Lifecycle
onMounted(() => {
  // Set default to last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)

  dateRange.value = {
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  }

  loadAllReports({
    startDate: dateRange.value.startDate,
    endDate: dateRange.value.endDate,
  })
})
</script>
