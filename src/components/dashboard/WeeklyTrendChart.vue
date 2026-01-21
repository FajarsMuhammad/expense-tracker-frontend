<template>
  <AppCard>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center shadow-soft">
          <svg class="w-6 h-6 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Weekly Trend
          </h3>
          <p class="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Income vs
            Expense</p>
        </div>
      </div>
    </div>

    <!-- Custom legend -->
    <div v-if="hasData" class="flex items-center justify-center gap-8 mb-8">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-neutral-900 dark:bg-neutral-100"></span>
        <span class="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-widest">Income</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
        <span class="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Expense</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasData" class="py-16 text-center">
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 dark:bg-dark-surface flex items-center justify-center mb-4 border border-neutral-200 dark:border-dark-border">
        <svg class="w-8 h-8 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p class="text-sm font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">No transaction data
        available</p>
    </div>

    <!-- Chart -->
    <div v-else class="relative h-72 md:h-80">
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
import { formatDate as formatDt } from '@/utils/date'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const hasData = computed(() => props.data && props.data.length > 0)

const isDark = computed(() => document.documentElement.classList.contains('dark'))

const chartData = computed(() => {
  if (!hasData.value) return null

  return {
    labels: props.data.map((item) => formatDt(item.date, 'MMM D')),
    datasets: [
      {
        label: 'Income',
        data: props.data.map((item) => item.income),
        borderColor: isDark.value ? '#f5f5f5' : '#171717',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 250)
          gradient.addColorStop(0, isDark.value ? 'rgba(245, 245, 245, 0.1)' : 'rgba(23, 23, 23, 0.1)')
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: isDark.value ? '#f5f5f5' : '#171717',
        pointBorderColor: isDark.value ? '#141414' : '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: 'Expense',
        data: props.data.map((item) => item.expense),
        borderColor: isDark.value ? '#525252' : '#d4d4d4',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 250)
          gradient.addColorStop(0, 'rgba(115, 115, 115, 0.05)')
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: isDark.value ? '#525252' : '#d4d4d4',
        pointBorderColor: isDark.value ? '#141414' : '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: isDark.value ? '#1c1c1c' : '#171717',
      titleColor: '#ffffff',
      bodyColor: '#a3a3a3',
      borderColor: '#404040',
      borderWidth: 1,
      padding: 16,
      cornerRadius: 12,
      displayColors: true,
      usePointStyle: true,
      titleFont: {
        size: 14,
        weight: '700',
        family: 'Poppins',
      },
      bodyFont: {
        size: 13,
        weight: '600',
      },
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(context.parsed.y)
          }
          return label
        }
      }
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#737373',
        font: {
          size: 12,
          weight: '600',
        },
        padding: 10,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#737373',
        font: {
          size: 12,
          weight: '600',
        },
        padding: 10,
        callback: (value) =>
          new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(value),
      },
    },
  },
}
</script>
