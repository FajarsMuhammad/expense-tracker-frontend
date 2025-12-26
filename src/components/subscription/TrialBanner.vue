<template>
  <div
    v-if="isTrial && daysRemaining > 0"
    class="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 p-6 shadow-lg mb-6"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full"></div>
      <div class="absolute -left-4 -bottom-4 w-24 h-24 bg-white rounded-full"></div>
    </div>

    <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <!-- Left: Trial Info -->
      <div class="flex items-start gap-4">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.88-.97-7-5.17-7-9V8.3l7-3.11 7 3.11V11c0 3.83-3.12 8.03-7 9z"/>
            <path d="M9.5 11L8 12.5l3 3 6-6-1.5-1.5-4.5 4.5z"/>
          </svg>
        </div>

        <!-- Text -->
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-white mb-1">
            {{ $t('premium.trialBanner.title') }}
          </h3>
          <p class="text-white/90 text-sm sm:text-base">
            <span class="font-semibold">{{ $t('premium.trialBanner.daysRemaining', { count: daysRemaining }) }}</span> {{ $t('premium.trialBanner.remaining') }}
            {{ $t('premium.trialBanner.until', { date: formatEndDate }) }}
          </p>
          <p class="text-white/80 text-xs sm:text-sm mt-1">
            {{ $t('premium.trialBanner.enjoying') }}
          </p>
        </div>
      </div>

      <!-- Right: CTA Button -->
      <div class="flex-shrink-0 w-full sm:w-auto">
        <router-link
          to="/premium"
          class="block w-full sm:w-auto px-6 py-3 bg-white hover:bg-neutral-50 text-yellow-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-center"
        >
          {{ $t('premium.trialBanner.subscribeButton') }}
        </router-link>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="relative z-10 mt-4">
      <div class="h-2 bg-white/30 rounded-full overflow-hidden">
        <div
          class="h-full bg-white rounded-full transition-all duration-500"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <p class="text-white/70 text-xs mt-1 text-right">
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
