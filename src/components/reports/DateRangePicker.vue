<template>
  <div class="space-y-4">
    <!-- Quick Presets -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.value"
        type="button"
        class="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200"
        :class="
          selectedPreset === preset.value
            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800'
        "
        @click="applyPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
      <button
        type="button"
        class="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200"
        :class="
          selectedPreset === 'custom'
            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800'
        "
        @click="showCustomPicker = !showCustomPicker"
      >
        <CalendarIcon class="mr-1.5 inline size-4" />
        Custom
      </button>
    </div>

    <!-- Custom Date Picker (Shown when Custom is selected) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showCustomPicker"
        class="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-dark-card"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Start Date -->
          <div>
            <label class="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Start Date
            </label>
            <input
              v-model="localStartDate"
              type="date"
              :max="localEndDate || maxDate"
              class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-100 dark:focus:border-primary-600"
              @change="onDateChange"
            />
          </div>

          <!-- End Date -->
          <div>
            <label class="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              End Date
            </label>
            <input
              v-model="localEndDate"
              type="date"
              :min="localStartDate"
              :max="maxDate"
              class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-100 dark:focus:border-primary-600"
              @change="onDateChange"
            />
          </div>
        </div>

        <!-- Apply Button -->
        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:bg-primary-500 dark:hover:bg-primary-600"
            :disabled="!localStartDate || !localEndDate"
            @click="applyCustomRange"
          >
            Apply
          </button>
          <button
            type="button"
            class="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            @click="cancelCustomRange"
          >
            Cancel
          </button>
        </div>
      </div>
    </transition>

    <!-- Selected Range Display -->
    <div
      v-if="startDate && endDate"
      class="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
    >
      <div class="flex items-center gap-2 text-sm">
        <CalendarIcon class="size-4 text-neutral-600 dark:text-neutral-400" />
        <span class="font-medium text-neutral-900 dark:text-neutral-100">
          {{ formatDateRange(startDate, endDate) }}
        </span>
      </div>
      <button
        v-if="allowClear"
        type="button"
        class="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
        @click="clearDates"
      >
        <XMarkIcon class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { CalendarIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  startDate: {
    type: String,
    default: null,
  },
  endDate: {
    type: String,
    default: null,
  },
  allowClear: {
    type: Boolean,
    default: true,
  },
  maxDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  presets: {
    type: Array,
    default: () => [
      { label: '7 Days', value: '7d' },
      { label: '30 Days', value: '30d' },
      { label: 'This Month', value: 'thisMonth' },
      { label: 'Last Month', value: 'lastMonth' },
    ],
  },
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'change'])

const showCustomPicker = ref(false)
const localStartDate = ref(props.startDate)
const localEndDate = ref(props.endDate)
const selectedPreset = ref(null)

// Watch for external changes
watch(
  () => [props.startDate, props.endDate],
  ([newStart, newEnd]) => {
    localStartDate.value = newStart
    localEndDate.value = newEnd
  }
)

/**
 * Apply a preset date range
 */
function applyPreset(preset) {
  selectedPreset.value = preset
  showCustomPicker.value = false

  const today = new Date()
  let startDate, endDate

  endDate = today.toISOString().split('T')[0]

  switch (preset) {
    case '7d':
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 6)
      break
    case '30d':
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 29)
      break
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      break
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    default:
      return
  }

  const formattedStart = startDate.toISOString().split('T')[0]
  const formattedEnd = endDate.toISOString().split('T')[0]

  emit('update:startDate', formattedStart)
  emit('update:endDate', formattedEnd)
  emit('change', { startDate: formattedStart, endDate: formattedEnd })
}

/**
 * Handle date input changes
 */
function onDateChange() {
  // Auto-select custom preset when dates are manually changed
  selectedPreset.value = 'custom'
}

/**
 * Apply custom date range
 */
function applyCustomRange() {
  if (!localStartDate.value || !localEndDate.value) return

  selectedPreset.value = 'custom'
  emit('update:startDate', localStartDate.value)
  emit('update:endDate', localEndDate.value)
  emit('change', { startDate: localStartDate.value, endDate: localEndDate.value })
  showCustomPicker.value = false
}

/**
 * Cancel custom date range selection
 */
function cancelCustomRange() {
  localStartDate.value = props.startDate
  localEndDate.value = props.endDate
  showCustomPicker.value = false
}

/**
 * Clear selected dates
 */
function clearDates() {
  selectedPreset.value = null
  localStartDate.value = null
  localEndDate.value = null
  emit('update:startDate', null)
  emit('update:endDate', null)
  emit('change', { startDate: null, endDate: null })
}

/**
 * Format date range for display
 */
function formatDateRange(start, end) {
  if (!start || !end) return ''

  const startDate = new Date(start)
  const endDate = new Date(end)

  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const formatter = new Intl.DateTimeFormat('id-ID', options)

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
}
</script>
