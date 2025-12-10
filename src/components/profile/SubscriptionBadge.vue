<template>
  <div class="flex items-center gap-2">
    <!-- Tier Badge -->
    <span
      :class="badgeClasses"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200"
    >
      <component :is="badgeIcon" class="size-4" />
      {{ badgeLabel }}
    </span>

    <!-- Trial Countdown -->
    <span
      v-if="isTrial && trialDaysRemaining !== null"
      class="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
      :title="trialMessage"
    >
      <ClockIcon class="size-3.5" />
      {{ trialDaysRemaining }} {{ trialDaysRemaining === 1 ? 'day' : 'days' }} left
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  SparklesIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
  tier: {
    type: String,
    default: 'FREE',
    validator: (value) => ['FREE', 'PREMIUM'].includes(value),
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  isTrial: {
    type: Boolean,
    default: false,
  },
  trialDaysRemaining: {
    type: Number,
    default: null,
  },
})

const badgeClasses = computed(() => {
  const baseClasses = 'shadow-sm'

  if (props.isTrial) {
    return `${baseClasses} bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 dark:from-orange-900/30 dark:to-yellow-900/30 dark:text-orange-300`
  }

  if (props.isPremium) {
    return `${baseClasses} bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300`
  }

  return `${baseClasses} bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`
})

const badgeLabel = computed(() => {
  if (props.isTrial) return 'TRIAL'
  if (props.isPremium) return 'PREMIUM'
  return 'FREE'
})

const badgeIcon = computed(() => {
  if (props.isTrial) return ClockIcon
  if (props.isPremium) return SparklesIcon
  return UserIcon
})

const trialMessage = computed(() => {
  if (!props.isTrial || props.trialDaysRemaining === null) return ''
  const days = props.trialDaysRemaining
  if (days === 0) return 'Your trial ends today'
  if (days === 1) return '1 day left in your trial'
  return `${days} days left in your trial`
})
</script>
