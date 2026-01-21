<template>
  <AppLayout>
    <!-- Page Header -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-down">
      <div>
        <h1 class="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {{ $t('reports.title') }}
        </h1>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('reports.subtitle') }}
        </p>
      </div>

      <!-- Export Button -->
      <ExportButton :exporting="isExporting" :progress="exportProgress" @export="handleExport" />
    </div>

    <!-- Date Range Picker -->
    <div class="mb-8 p-1 bg-neutral-100 dark:bg-dark-surface rounded-2xl w-fit">
      <DateRangePicker v-model:start-date="dateRange.startDate" v-model:end-date="dateRange.endDate"
        @change="handleDateRangeChange" />
    </div>

    <!-- Summary Cards Grid -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      <SummaryCard :title="$t('reports.summary.totalIncome')" :value="totalIncome" icon="BanknotesIcon"
        variant="neutral" format="currency" :loading="summaryLoading" />

      <SummaryCard :title="$t('reports.summary.totalExpense')" :value="totalExpense" icon="BanknotesIcon"
        variant="neutral" format="currency" :loading="summaryLoading" />

      <SummaryCard :title="$t('reports.summary.netBalance')" :value="netBalance" icon="ScaleIcon" variant="neutral"
        format="currency" :loading="summaryLoading" />

      <SummaryCard :title="$t('reports.summary.transactions')" :value="transactionCount" icon="ChartBarIcon"
        variant="neutral" format="number" :loading="summaryLoading" />
    </div>

    <!-- Category Breakdown Section (Stacked) -->
    <div v-if="hasCategoryBreakdown" class="mb-8 animate-fade-in-up animation-delay-300">
      <AppCard class="p-6">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {{ $t('reports.categoryBreakdown.title') }}
          </h2>
        </div>

        <div class="space-y-6">
          <div v-for="category in topCategories" :key="category.categoryId" class="group">
            <!-- Progress Bar -->
            <div class="flex-1 min-w-0">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                  {{ category.categoryName }}
                </span>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                    {{ category.percentage.toFixed(1) }}%
                  </span>
                  <span class="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {{ formatCurrency(category.totalAmount) }}
                  </span>
                </div>
              </div>
              <div
                class="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-dark-surface p-0.5 border border-neutral-200/50 dark:border-dark-border/50">
                <div
                  class="h-full rounded-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-1000 ease-smooth shadow-sm"
                  :style="{ width: `${category.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Show all categories link -->
        <div v-if="categoryBreakdown.length > 5"
          class="mt-8 text-center border-t border-neutral-100 dark:border-dark-border pt-4">
          <button type="button"
            class="text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 uppercase tracking-widest transition-colors"
            @click="showAllCategories = !showAllCategories">
            {{ showAllCategories ? $t('reports.categoryBreakdown.showLess') :
              $t('reports.categoryBreakdown.showAll', {
                count: categoryBreakdown.length
              }) }}
          </button>
        </div>
      </AppCard>
    </div>

    <!-- Trend Chart Section (Stacked) -->
    <div v-if="hasTrendData" class="mb-8 animate-fade-in-up animation-delay-400">
      <AppCard class="p-6">
        <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 class="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {{ $t('reports.trend.title') }}
          </h2>

          <!-- Granularity Selector -->
          <div class="flex gap-1 p-1 bg-neutral-100 dark:bg-dark-surface rounded-xl">
            <button v-for="gran in granularityOptions" :key="gran.value" type="button"
              class="rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200"
              :class="filters.granularity === gran.value
                ? 'bg-white dark:bg-neutral-100 text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
                " @click="changeGranularity(gran.value)">
              {{ gran.label }}
            </button>
          </div>
        </div>

        <!-- Monochrome Table View -->
        <div class="overflow-hidden border border-neutral-200 dark:border-dark-border rounded-xl">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-neutral-50 dark:bg-dark-surface">
                <th
                  class="px-5 py-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                  {{ $t('reports.trend.date') }}
                </th>
                <th
                  class="px-5 py-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right">
                  {{ $t('reports.trend.income') }}
                </th>
                <th
                  class="px-5 py-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right">
                  {{ $t('reports.trend.expense') }}
                </th>
                <th
                  class="px-5 py-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right">
                  {{ $t('reports.trend.balance') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-dark-border">
              <tr v-for="(item, index) in trendData.slice(0, 10)" :key="index"
                class="hover:bg-neutral-50 dark:hover:bg-dark-surface/50 transition-colors">
                <td class="px-5 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {{ formatDate(item.date) }}
                </td>
                <td class="px-5 py-3 text-sm font-bold text-right text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {{ formatCurrency(item.income) }}
                </td>
                <td class="px-5 py-3 text-sm font-bold text-right text-neutral-400 dark:text-neutral-500 tabular-nums">
                  {{ formatCurrency(item.expense) }}
                </td>
                <td class="px-5 py-3 text-sm font-bold text-right tabular-nums"
                  :class="item.balance >= 0 ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600'">
                  {{ formatCurrency(item.balance) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- Empty State -->
    <div v-if="!summaryLoading && !hasSummary"
      class="rounded-2xl border-2 border-dashed border-neutral-200 bg-white py-16 text-center dark:border-dark-border dark:bg-dark-card mt-6">
      <div
        class="w-16 h-16 bg-neutral-100 dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <ChartBarIcon class="size-8 text-neutral-400" />
      </div>
      <h3 class="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
        {{ $t('reports.empty.title') }}
      </h3>
      <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
        {{ $t('reports.empty.description') }}
      </p>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal :is-open="showUpgradeModal" title="Premium Feature" :message="upgradeMessage"
      @close="showUpgradeModal = false" />
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

const {
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
  changeGranularity,
} = useReports()

const { exportTransactions } = useExport()
const exportStore = useExportStore()
const { exporting: isExporting, exportProgress } = storeToRefs(exportStore)

const dateRange = ref({ startDate: null, endDate: null })
const showAllCategories = ref(false)
const showUpgradeModal = ref(false)
const upgradeMessage = ref('')

const granularityOptions = computed(() => [
  { label: t('reports.granularity.daily'), value: GRANULARITY.DAILY },
  { label: t('reports.granularity.weekly'), value: GRANULARITY.WEEKLY },
  { label: t('reports.granularity.monthly'), value: GRANULARITY.MONTHLY },
])

async function handleDateRangeChange({ startDate, endDate }) {
  dateRange.value = { startDate, endDate }
  const result = await loadAllReports({ startDate, endDate })
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
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString))
}

onMounted(async () => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)

  dateRange.value = {
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  }

  const result = await loadAllReports(dateRange.value)
  if (result?.error === 'PREMIUM_REQUIRED') {
    upgradeMessage.value = result.message
    showUpgradeModal.value = true
  }
})
</script>
