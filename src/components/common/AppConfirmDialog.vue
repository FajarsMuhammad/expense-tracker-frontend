<template>
  <AppModal v-model="isOpen" :title="title">
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        :class="iconBgClass"
      >
        <svg
          class="w-6 h-6"
          :class="iconColorClass"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <!-- Danger Icon -->
          <path
            v-if="variant === 'danger'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
          <!-- Warning Icon -->
          <path
            v-else-if="variant === 'warning'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
          <!-- Info Icon -->
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Message -->
      <div class="flex-1">
        <p class="text-neutral-700 dark:text-neutral-300">{{ message }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <AppButton
          variant="secondary"
          @click="handleCancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </AppButton>
        <AppButton
          :variant="buttonVariant"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { computed } from 'vue'
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'danger',
    validator: (v) => ['danger', 'warning', 'info'].includes(v),
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const iconBgClass = computed(() => {
  const classes = {
    danger: 'bg-red-100 dark:bg-red-900/20',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20',
    info: 'bg-blue-100 dark:bg-blue-900/20',
  }
  return classes[props.variant] || classes.danger
})

const iconColorClass = computed(() => {
  const classes = {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }
  return classes[props.variant] || classes.danger
})

const buttonVariant = computed(() => {
  return props.variant === 'danger' ? 'danger' : 'primary'
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  isOpen.value = false
  emit('cancel')
}
</script>
