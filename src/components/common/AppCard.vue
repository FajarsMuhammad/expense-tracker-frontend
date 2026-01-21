<template>
  <div :class="cardClasses" class="group">
    <div v-if="$slots.header" class="px-5 py-4 border-b border-neutral-200/50 dark:border-dark-border">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer"
      class="px-5 py-4 border-t border-neutral-200/50 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: { type: Boolean, default: true },
  shadow: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg', 'xl', 'none'].includes(v) },
  hover: { type: Boolean, default: false },
  interactive: { type: Boolean, default: false },
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-dark-card rounded-2xl border border-neutral-200/60 dark:border-dark-border transition-all duration-300'

  const shadows = {
    none: '',
    sm: 'shadow-card',
    md: 'shadow-soft',
    lg: 'shadow-soft-lg',
    xl: 'shadow-soft-xl',
  }

  const hoverEffect = props.hover ? 'hover:shadow-soft-lg hover:-translate-y-0.5' : ''
  const interactiveEffect = props.interactive ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-soft-xl active:translate-y-0 active:shadow-soft' : ''

  return [base, shadows[props.shadow], hoverEffect, interactiveEffect].filter(Boolean).join(' ')
})

const bodyClasses = computed(() => {
  return props.padding ? 'px-5 py-4' : ''
})
</script>
