<template>
  <div v-if="isTrial && daysRemaining > 0"
    class="relative overflow-hidden rounded-2xl bg-neutral-900 dark:bg-neutral-100 p-6 shadow-soft-xl mb-8">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5 dark:opacity-10">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-white dark:bg-neutral-900 rounded-full"></div>
      <div class="absolute -left-4 -bottom-4 w-24 h-24 bg-white dark:bg-neutral-900 rounded-full"></div>
    </div>

    <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <!-- Left: Trial Info -->
      <div class="flex items-start gap-4">
        <!-- Icon -->
        <div
          class="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 dark:bg-neutral-900/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-white dark:text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.88-.97-7-5.17-7-9V8.3l7-3.11 7 3.11V11c0 3.83-3.12 8.03-7 9z" />
            <path d="M9.5 11L8 12.5l3 3 6-6-1.5-1.5-4.5 4.5z" />
          </svg>
        </div>

        <!-- Text -->
        <div>
          <h3 class="text-lg sm:text-xl font-display font-bold text-white dark:text-neutral-900 mb-1">
            {{ $t('premium.trialBanner.title') }}
          </h3>
          <p class="text-white/80 dark:text-neutral-700 text-sm sm:text-base">
            <span class="font-semibold text-white dark:text-neutral-900">{{ $t('premium.trialBanner.daysRemaining', {
              count: daysRemaining }) }}</span>
            {{ $t('premium.trialBanner.remaining') }}
            {{ $t('premium.trialBanner.until', { date: formatEndDate }) }}
          </p>
          <p class="text-white/60 dark:text-neutral-600 text-xs sm:text-sm mt-1">
            {{ $t('premium.trialBanner.enjoying') }}
          </p>
        </div>
      </div>

      <!-- Right: CTA Button -->
      <div class="flex-shrink-0 w-full sm:w-auto">
        <router-link to="/premium"
          class="block w-full sm:w-auto px-6 py-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-bold rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 text-center">
          {{ $t('premium.trialBanner.subscribeButton') }}
        </router-link>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="relative z-10 mt-5">
      <div class="h-1.5 bg-white/20 dark:bg-neutral-900/20 rounded-full overflow-hidden">
        <div class="h-full bg-white dark:bg-neutral-900 rounded-full transition-all duration-500"
          :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <p class="text-white/50 dark:text-neutral-500 text-xs mt-2 text-right">
        {{ $t('premium.trialBanner.progressUsed', { percent: progressPercentage.toFixed(0) }) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSubscriptionStore } from '@/stores/subscription'

const { t } = useI18n()

const subscriptionStore = useSubscriptionStore()
const { subscription, isTrial, daysRemaining } = storeToRefs(subscriptionStore)

const formatEndDate = computed(() => {
  if (!subscription.value?.endedAt) return ''

  const date = new Date(subscription.value.endedAt)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
})

const progressPercentage = computed(() => {
  // Trial is 14 days total
  const totalDays = 14
  const usedDays = totalDays - daysRemaining.value
  return (usedDays / totalDays) * 100
})
</script>
