<template>
  <AppCard>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Weekly Trend</h3>

    <div v-if="!hasData" class="py-12 text-center text-gray-500">
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
            notation: 'compact',
            compactDisplay: 'short',
          }).format(value)
        },
      },
    },
  },
}
</script>
