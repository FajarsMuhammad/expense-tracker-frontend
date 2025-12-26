<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-neutral-900 dark:text-neutral-100">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        ref="inputRef"
        v-model="displayValue"
        type="text"
        inputmode="numeric"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="w-full rounded-lg border bg-white px-4 py-2 text-neutral-900 transition-colors focus:outline-none focus:ring-2 dark:bg-dark-surface dark:text-neutral-100"
        :class="[
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-dark-border dark:focus:border-primary-600',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { formatNumber, parseNumber } from '@/utils/currency'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  id: {
    type: String,
    default: () => `currency-input-${Math.random().toString(36).substr(2, 9)}`,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '0',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputRef = ref(null)
const displayValue = ref('')
const isFocused = ref(false)

// Initialize display value from modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    // Only update if not focused (to avoid interrupting user input)
    if (!isFocused.value) {
      if (newValue === null || newValue === undefined || newValue === '') {
        displayValue.value = ''
      } else {
        displayValue.value = formatNumber(newValue)
      }
    }
  },
  { immediate: true }
)

function handleInput(event) {
  const inputValue = event.target.value

  // Allow empty value
  if (inputValue === '') {
    displayValue.value = ''
    emit('update:modelValue', null)
    return
  }

  // Store cursor position before any changes
  const cursorPosition = event.target.selectionStart

  // Remove all dots to get raw number string
  const rawValue = inputValue.replace(/\./g, '')

  // Validate input (only digits after removing dots)
  if (!/^\d*$/.test(rawValue)) {
    // Revert to previous valid value
    event.target.value = displayValue.value
    return
  }

  // Parse to number
  const numberValue = parseInt(rawValue, 10)

  // Validate against min/max
  if (!isNaN(numberValue)) {
    if (props.min !== null && numberValue < props.min) {
      // Allow typing for numbers being built up to min
      // Only block if user is deleting below min
      if (displayValue.value !== '' && numberValue < parseNumber(displayValue.value)) {
        event.target.value = displayValue.value
        return
      }
    }

    if (props.max !== null && numberValue > props.max) {
      // Don't allow exceeding max
      event.target.value = displayValue.value
      return
    }
  }

  // Calculate cursor position relative to digits (ignoring dots)
  const oldRawValue = displayValue.value.replace(/\./g, '')
  const digitsBeforeCursor = inputValue.slice(0, cursorPosition).replace(/\./g, '').length

  // Format the number
  const formatted = formatNumber(rawValue)

  // Update display value
  displayValue.value = formatted

  // Calculate new cursor position
  // Find the position after the same number of digits
  let newPosition = 0
  let digitCount = 0
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] !== '.') {
      digitCount++
    }
    if (digitCount === digitsBeforeCursor) {
      newPosition = i + 1
      break
    }
  }

  // If we haven't reached the digit count, place cursor at end
  if (newPosition === 0) {
    newPosition = formatted.length
  }

  // Use nextTick to ensure DOM is updated before setting cursor
  setTimeout(() => {
    if (event.target === document.activeElement) {
      event.target.setSelectionRange(newPosition, newPosition)
    }
  }, 0)

  // Emit the actual number value
  emit('update:modelValue', isNaN(numberValue) ? null : numberValue)
}

function handleBlur(event) {
  isFocused.value = false

  // Re-format on blur to ensure consistent formatting
  if (displayValue.value !== '') {
    const numberValue = parseNumber(displayValue.value)
    if (numberValue !== null) {
      displayValue.value = formatNumber(numberValue)
    }
  }

  emit('blur', event)
}

function handleFocus(event) {
  isFocused.value = true
  emit('focus', event)
}

// Expose focus method
defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>
