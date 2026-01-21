<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-expense ml-0.5">*</span>
    </label>
    <div class="relative">
      <!-- Leading icon slot -->
      <div v-if="$slots.leading"
        class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-400 dark:text-neutral-600">
        <slot name="leading" />
      </div>

      <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
        :required="required" :class="inputClasses" @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')" />

      <!-- Trailing icon slot -->
      <div v-if="$slots.trailing"
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 dark:text-neutral-600">
        <slot name="trailing" />
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-expense flex items-center gap-1">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-neutral-500 dark:text-neutral-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  id: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
})

defineEmits(['update:modelValue', 'blur'])

const slots = useSlots()

const inputClasses = computed(() => {
  const base = 'w-full rounded-xl bg-neutral-50 dark:bg-dark-surface border text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 transition-all duration-200'

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3.5 text-lg',
  }

  const state = props.error
    ? 'border-expense focus:ring-expense/20 focus:border-expense'
    : 'border-neutral-200 dark:border-dark-border focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:border-neutral-400 dark:focus:border-neutral-600'

  const disabledStyle = props.disabled ? 'bg-neutral-100 dark:bg-dark-hover cursor-not-allowed opacity-60' : ''

  const leadingPadding = slots.leading ? 'pl-12' : ''
  const trailingPadding = (slots.trailing || props.type === 'password') ? 'pr-12' : ''

  return [base, sizes[props.size], state, disabledStyle, leadingPadding, trailingPadding].filter(Boolean).join(' ')
})
</script>
