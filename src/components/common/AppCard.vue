<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-neutral-200 dark:border-dark-border">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: { type: Boolean, default: true },
  shadow: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v) },
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-dark-card rounded-2xl border border-neutral-200/50 dark:border-dark-border transition-colors duration-300'
  const shadows = {
    sm: 'shadow-soft',
    md: 'shadow-soft-lg',
    lg: 'shadow-soft-xl',
    xl: 'shadow-soft-xl',
  }
  return [base, shadows[props.shadow]].join(' ')
})

const bodyClasses = computed(() => {
  return props.padding ? 'px-6 py-4' : ''
})
</script>
