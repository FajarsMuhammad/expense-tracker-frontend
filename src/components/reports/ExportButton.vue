<template>
  <div class="relative">
    <!-- Export Button -->
    <button
      type="button"
      class="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-neutral-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-neutral-800"
      :disabled="disabled || exporting"
      @click="toggleDropdown"
    >
      <ArrowDownTrayIcon class="size-4 sm:size-5" :class="{ 'animate-bounce': exporting }" />
      <span>{{ exporting ? exportingText : 'Export' }}</span>
      <ChevronDownIcon v-if="!exporting" class="size-3 sm:size-4 transition-transform" :class="{ 'rotate-180': showDropdown }" />
    </button>

    <!-- Progress Bar (Shown when exporting) -->
    <div
      v-if="exporting && showProgress"
      class="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-dark-card"
    >
      <div class="mb-2 flex items-center justify-between text-sm">
        <span class="font-medium text-neutral-700 dark:text-neutral-300">Exporting...</span>
        <span class="text-neutral-600 dark:text-neutral-400">{{ progress }}%</span>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          class="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showDropdown && !exporting"
        class="absolute right-0 top-full z-50 mt-2 w-56 sm:w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-dark-card"
      >
        <!-- Dropdown Header -->
        <div class="border-b border-neutral-200 bg-neutral-50 px-3 sm:px-4 py-2 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
          <h4 class="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Select Export Format
          </h4>
          <p class="mt-0.5 text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
            Choose a format to download your data
          </p>
        </div>

        <!-- Format Options -->
        <div class="py-1">
          <button
            v-for="format in formats"
            :key="format.value"
            type="button"
            class="flex w-full items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            :class="{
              'cursor-not-allowed opacity-50': !format.available,
            }"
            :disabled="!format.available"
            @click="handleExport(format.value)"
          >
            <!-- Icon -->
            <div
              class="flex size-8 sm:size-10 flex-shrink-0 items-center justify-center rounded-lg"
              :class="format.iconBg"
            >
              <component :is="format.icon" class="size-4 sm:size-5" :class="format.iconColor" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {{ format.label }}
                </span>
                <span
                  v-if="format.badge"
                  class="rounded-full bg-primary-100 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {{ format.badge }}
                </span>
              </div>
              <p class="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 truncate">
                {{ format.description }}
              </p>
            </div>

            <!-- Check Mark if available -->
            <ChevronRightIcon v-if="format.available" class="size-3 sm:size-4 flex-shrink-0 text-neutral-400" />
            <LockClosedIcon v-else class="size-3 sm:size-4 flex-shrink-0 text-neutral-400" />
          </button>
        </div>

        <!-- Footer Note -->
        <div
          v-if="showQuotaInfo"
          class="border-t border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800/50"
        >
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Free tier: CSV exports only. Upgrade for Excel & PDF.
          </p>
        </div>
      </div>
    </transition>

    <!-- Click Outside Overlay -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  TableCellsIcon,
  DocumentIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'
import { EXPORT_FORMATS } from '@/config/api.config'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  exporting: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
  showProgress: {
    type: Boolean,
    default: true,
  },
  exportingText: {
    type: String,
    default: 'Exporting...',
  },
  availableFormats: {
    type: Array,
    default: () => Object.values(EXPORT_FORMATS),
  },
  showQuotaInfo: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: true, // TODO: Hook up to auth store
  },
})

const emit = defineEmits(['export'])

const showDropdown = ref(false)

// Format configurations
const formats = computed(() => {
  return [
    {
      value: EXPORT_FORMATS.CSV,
      label: 'CSV',
      description: 'Comma-separated values',
      icon: DocumentTextIcon,
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      available: true,
      badge: null,
    },
    {
      value: EXPORT_FORMATS.EXCEL,
      label: 'Excel',
      description: 'Spreadsheet with formatting',
      icon: TableCellsIcon,
      iconBg: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      available: props.isPremium || props.availableFormats.includes(EXPORT_FORMATS.EXCEL),
      badge: !props.isPremium ? 'Premium' : null,
    },
    {
      value: EXPORT_FORMATS.PDF,
      label: 'PDF',
      description: 'Portable document format',
      icon: DocumentIcon,
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      available: props.isPremium || props.availableFormats.includes(EXPORT_FORMATS.PDF),
      badge: !props.isPremium ? 'Premium' : null,
    },
  ].filter((format) => props.availableFormats.includes(format.value))
})

function toggleDropdown() {
  if (props.disabled || props.exporting) return
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function handleExport(format) {
  if (!formats.value.find((f) => f.value === format)?.available) {
    return
  }
  emit('export', format)
  closeDropdown()
}
</script>
