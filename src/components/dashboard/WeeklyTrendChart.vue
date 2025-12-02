<template>
  <AppCard>
    <h3 class="text-lg font-display font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
      Weekly Trend
    </h3>

    <!-- Centered custom legend -->
    <div v-if="hasData" class="flex items-center justify-center gap-6 mb-4">
      <div class="flex items-center gap-2">
        <span class="badge-circle bg-income"></span>
        <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Income</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="badge-circle bg-expense"></span>
        <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Expense</span>
      </div>
    </div>

    <div v-if="!hasData" class="py-12 text-center text-neutral-500 dark:text-neutral-400">
      No transaction data available for the past week
    </div>

    <div v-else class="relative h-64 md:h-80">
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
import { formatDate } from '@/utils/date'

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
    labels: props.data.map((item) => formatDate(item.date, 'MMM D')),
    datasets: [
      {
        label: 'Income',
        data: props.data.map((item) => item.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10b981',
        borderWidth: 2,
      },
      {
        label: 'Expense',
        data: props.data.map((item) => item.expense),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f43f5e',
        borderWidth: 2,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // hide default legend
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) =>
          new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(value),
      },
    },
  },
  elements: {
    line: {
      borderCapStyle: 'round',
      borderJoinStyle: 'round',
    },
    point: {
      pointStyle: 'circle',
    },
  },
}
</script>

<style scoped>
.badge-circle {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  display: inline-block;
}

.bg-income {
  background: linear-gradient(180deg, #34d399, #10b981);
}

.bg-expense {
  background: linear-gradient(180deg, #fb7185, #f43f5e);
}
/* Reuse small utility classes you're already using */
</style>
