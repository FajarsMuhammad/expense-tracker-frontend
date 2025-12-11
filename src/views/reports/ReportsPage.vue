<template>
  <AppLayout>
    <!-- Page Header -->
    <div class="mb-3 md:mb-4 lg:mb-6 flex flex-col gap-2 md:gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-base md:text-lg lg:text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {{ $t('reports.title') }}
        </h1>
        <p class="mt-0.5 md:mt-1 text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400">
          {{ $t('reports.subtitle') }}
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
    <div class="mb-3 md:mb-4 lg:mb-5">
      <DateRangePicker
        v-model:start-date="dateRange.startDate"
        v-model:end-date="dateRange.endDate"
        @change="handleDateRangeChange"
      />
    </div>

    <!-- Summary Cards Grid -->
    <div class="mb-4 md:mb-5 lg:mb-6 grid grid-cols-1 gap-2 md:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        :title="$t('reports.summary.totalIncome')"
        :value="totalIncome"
        icon="BanknotesIcon"
        variant="success"
        format="currency"
        :loading="summaryLoading"
      />

      <SummaryCard
        :title="$t('reports.summary.totalExpense')"
        :value="totalExpense"
        icon="BanknotesIcon"
        variant="danger"
        format="currency"
        :loading="summaryLoading"
      />

      <SummaryCard
        :title="$t('reports.summary.netBalance')"
        :value="netBalance"
        icon="ScaleIcon"
        :variant="netBalance >= 0 ? 'success' : 'danger'"
        format="currency"
        :loading="summaryLoading"
      />

      <SummaryCard
        :title="$t('reports.summary.transactions')"
        :value="transactionCount"
        icon="ChartBarIcon"
        variant="primary"
        format="number"
        :loading="summaryLoading"
      />
    </div>

    <!-- Category Breakdown Section -->
    <div v-if="hasCategoryBreakdown" class="mb-4 md:mb-5 lg:mb-6">
      <AppCard>
        <div class="mb-2 md:mb-3 flex items-center justify-between">
          <h2 class="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
            {{ $t('reports.categoryBreakdown.title') }}
          </h2>
        </div>

        <div class="space-y-2 md:space-y-2.5">
          <div
            v-for="category in topCategories"
            :key="category.categoryId"
            class="flex items-center gap-2 md:gap-3"
          >
            <!-- Progress Bar -->
            <div class="flex-1 min-w-0">
              <div class="mb-0.5 md:mb-1 flex items-center justify-between gap-1.5 md:gap-2">
                <span class="text-[10px] md:text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
                  {{ category.categoryName }}
                </span>
                <span class="text-[10px] md:text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex-shrink-0">
                  {{ formatCurrency(category.totalAmount) }}
                </span>
              </div>
              <div class="h-1.5 md:h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
                  :style="{ width: `${category.percentage}%` }"
                ></div>
              </div>
            </div>

            <!-- Percentage -->
            <div class="text-right flex-shrink-0">
              <span class="text-[10px] md:text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {{ category.percentage.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Show all categories link -->
        <div v-if="categoryBreakdown.length > 5" class="mt-2 md:mt-3 text-center">
          <button
            type="button"
            class="text-[10px] md:text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            @click="showAllCategories = !showAllCategories"
          >
            {{ showAllCategories ? $t('reports.categoryBreakdown.showLess') : $t('reports.categoryBreakdown.showAll', { count: categoryBreakdown.length }) }}
          </button>
        </div>
      </AppCard>
    </div>

    <!-- Trend Chart Section (Placeholder) -->
    <div v-if="hasTrendData" class="mb-4 md:mb-5 lg:mb-6">
      <AppCard>
        <div class="mb-2 md:mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-3">
          <h2 class="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
            {{ $t('reports.trend.title') }}
          </h2>

          <!-- Granularity Selector -->
          <div class="flex gap-0.5 rounded-lg border border-neutral-300 p-0.5 dark:border-neutral-600">
            <button
              v-for="gran in granularityOptions"
              :key="gran.value"
              type="button"
              class="rounded px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-medium transition-colors"
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
          <table class="w-full text-[10px] md:text-xs">
            <thead class="border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th class="pb-1.5 md:pb-2 pr-1.5 md:pr-2 text-left font-medium text-neutral-700 dark:text-neutral-300">
                  {{ $t('reports.trend.date') }}
                </th>
                <th class="pb-1.5 md:pb-2 pr-1.5 md:pr-2 text-right font-medium text-neutral-700 dark:text-neutral-300">
                  {{ $t('reports.trend.income') }}
                </th>
                <th class="pb-1.5 md:pb-2 pr-1.5 md:pr-2 text-right font-medium text-neutral-700 dark:text-neutral-300">
                  {{ $t('reports.trend.expense') }}
                </th>
                <th class="pb-1.5 md:pb-2 text-right font-medium text-neutral-700 dark:text-neutral-300">
                  {{ $t('reports.trend.balance') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr
                v-for="(item, index) in trendData.slice(0, 10)"
                :key="index"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td class="py-1.5 md:py-2 pr-1.5 md:pr-2 text-neutral-900 dark:text-neutral-100">
                  {{ formatDate(item.date) }}
                </td>
                <td class="py-1.5 md:py-2 pr-1.5 md:pr-2 text-right font-medium text-green-600 dark:text-green-400">
                  {{ formatCurrency(item.income) }}
                </td>
                <td class="py-1.5 md:py-2 pr-1.5 md:pr-2 text-right font-medium text-red-600 dark:text-red-400">
                  {{ formatCurrency(item.expense) }}
                </td>
                <td class="py-1.5 md:py-2 text-right font-semibold" :class="getNetBalanceColor(item.balance)">
                  {{ formatCurrency(item.balance) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="trendData.length > 10" class="mt-4 text-center">
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('reports.trend.showing', { current: 10, total: trendData.length }) }}
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
        {{ $t('reports.empty.title') }}
      </h3>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('reports.empty.description') }}
      </p>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal
      :is-open="showUpgradeModal"
      title="Premium Feature"
      :message="upgradeMessage"
      :features="[
        'Financial summary reports',
        'Trend analytics & charts',
        'Category breakdown insights',
        'Unlimited export formats (Excel, PDF)',
        'Advanced date range filters',
        'Priority support'
      ]"
      @close="showUpgradeModal = false"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import SummaryCard from '@/components/reports/SummaryCard.vue'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import ExportButton from '@/components/reports/ExportButton.vue'
import UpgradeModal from '@/components/subscription/UpgradeModal.vue'
import { useReports } from '@/composables/useReports'
import { useExport } from '@/composables/useExport'
import { useExportStore } from '@/stores/export'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { GRANULARITY } from '@/config/api.config'

const { t } = useI18n()

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
const showUpgradeModal = ref(false)
const upgradeMessage = ref('')

const granularityOptions = computed(() => [
  { label: t('reports.granularity.daily'), value: GRANULARITY.DAILY },
  { label: t('reports.granularity.weekly'), value: GRANULARITY.WEEKLY },
  { label: t('reports.granularity.monthly'), value: GRANULARITY.MONTHLY },
])

// Methods
async function handleDateRangeChange({ startDate, endDate }) {
  dateRange.value = { startDate, endDate }
  const result = await loadAllReports({ startDate, endDate })

  // Check if reports require premium
  if (result?.error === 'PREMIUM_REQUIRED') {
    upgradeMessage.value = result.message
    showUpgradeModal.value = true
  }
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
onMounted(async () => {
  // Set default to last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)

  dateRange.value = {
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  }

  const result = await loadAllReports({
    startDate: dateRange.value.startDate,
    endDate: dateRange.value.endDate,
  })

  // Check if reports require premium on initial load
  if (result?.error === 'PREMIUM_REQUIRED') {
    upgradeMessage.value = result.message
    showUpgradeModal.value = true
  }
})
</script>
