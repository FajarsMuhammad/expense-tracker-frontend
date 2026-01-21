<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses" @click="$emit('click', $event)">
    <!-- Loading spinner -->
    <span v-if="loading" class="flex items-center justify-center">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>

    <!-- Icon slot -->
    <slot name="icon" v-if="!loading" />

    <!-- Content -->
    <span v-if="!loading || !iconOnly">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
  },
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  fullWidth: Boolean,
  iconOnly: Boolean,
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]'

  const variants = {
    primary: 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 shadow-soft hover:shadow-soft-lg',
    secondary: 'bg-neutral-100 dark:bg-dark-surface text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-dark-border hover:bg-neutral-200 dark:hover:bg-dark-hover focus-visible:ring-neutral-500',
    danger: 'bg-expense text-white hover:bg-expense-dark focus-visible:ring-expense shadow-soft',
    ghost: 'bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface focus-visible:ring-neutral-500',
    outline: 'bg-transparent border-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-900 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-neutral-900 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100',
  }

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconOnlySizes = {
    xs: 'w-7 h-7 p-0',
    sm: 'w-8 h-8 p-0',
    md: 'w-10 h-10 p-0',
    lg: 'w-12 h-12 p-0',
  }

  const width = props.fullWidth ? 'w-full' : ''
  const disabled = props.disabled || props.loading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
  const sizeClass = props.iconOnly ? iconOnlySizes[props.size] : sizes[props.size]

  return [base, variants[props.variant], sizeClass, width, disabled].filter(Boolean).join(' ')
})
</script>
