<template>
  <div class="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ $t('debts.filtersForm.title') }}</h3>
      <span
        v-if="activeFilterCount > 0"
        class="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
      >
        {{ $t('debts.filtersForm.activeCount', { count: activeFilterCount }) }}
      </span>
    </div>

    <!-- Debt Type Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ $t('debts.filtersForm.debtType') }}</label>
      <div class="grid grid-cols-3 gap-2">
        <button
          @click="localFilters.type = null"
          :class="localFilters.type === null ? activeTabClass : inactiveTabClass"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
        >
          {{ $t('debts.filtersForm.all') }}
        </button>
        <button
          @click="localFilters.type = DEBT_TYPES.PAYABLE"
          :class="localFilters.type === DEBT_TYPES.PAYABLE ? activePayableClass : inactiveTabClass"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
        >
          {{ $t('debts.types.payable') }}
        </button>
        <button
          @click="localFilters.type = DEBT_TYPES.RECEIVABLE"
          :class="localFilters.type === DEBT_TYPES.RECEIVABLE ? activeReceivableClass : inactiveTabClass"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
        >
          {{ $t('debts.types.receivable') }}
        </button>
      </div>
    </div>

    <!-- Status Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ $t('debts.filtersForm.status') }}</label>
      <select
        v-model="localFilters.status"
        class="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-100 dark:focus:border-primary-400"
      >
        <option :value="null">{{ $t('debts.filtersForm.allStatuses') }}</option>
        <option :value="DEBT_STATUS.OPEN">{{ $t('debts.filtersForm.statusOpen') }}</option>
        <option :value="DEBT_STATUS.PARTIAL">{{ $t('debts.filtersForm.statusPartial') }}</option>
        <option :value="DEBT_STATUS.PAID">{{ $t('debts.filtersForm.statusPaid') }}</option>
      </select>
    </div>

    <!-- Overdue Toggle -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ $t('debts.filtersForm.showOnlyOverdue') }}</label>
      <button
        @click="localFilters.overdue = localFilters.overdue === true ? null : true"
        :class="localFilters.overdue === true ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-600'"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        role="switch"
        :aria-checked="localFilters.overdue === true"
      >
        <span
          :class="localFilters.overdue === true ? 'translate-x-5' : 'translate-x-0'"
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        ></span>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
      <button
        @click="handleApply"
        class="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {{ $t('debts.filtersForm.applyFilters') }}
      </button>
      <button
        @click="handleReset"
        class="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {{ $t('debts.filtersForm.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DEBT_TYPES, DEBT_STATUS } from '@/config/api.config'

const { t: $t } = useI18n()

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['apply', 'reset'])

const localFilters = ref({
  type: props.filters.type,
  status: props.filters.status,
  overdue: props.filters.overdue,
})

// Watch for external filter changes
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = {
      type: newFilters.type,
      status: newFilters.status,
      overdue: newFilters.overdue,
    }
  },
  { deep: true }
)

const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.value.type !== null) count++
  if (localFilters.value.status !== null) count++
  if (localFilters.value.overdue === true) count++
  return count
})

const activeTabClass = 'bg-primary-600 text-white dark:bg-primary-500'
const activePayableClass = 'bg-red-600 text-white dark:bg-red-500'
const activeReceivableClass = 'bg-green-600 text-white dark:bg-green-500'
const inactiveTabClass =
  'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'

function handleApply() {
  emit('apply', { ...localFilters.value })
}

function handleReset() {
  localFilters.value = {
    type: null,
    status: null,
    overdue: null,
  }
  emit('reset')
}
</script>
