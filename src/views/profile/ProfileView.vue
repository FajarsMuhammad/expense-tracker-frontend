<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ $t('profile.title') }}</h1>
        <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('profile.subtitle') }}
        </p>
      </div>

      <!-- Loading State -->
      <AppSkeleton v-if="loading && !profile" :count="3" height="120px" />

      <!-- Error State -->
      <div
        v-else-if="error && !profile"
        class="rounded-lg bg-red-50 dark:bg-red-900/10 p-4 text-red-700 dark:text-red-300"
      >
        <p>{{ error }}</p>
        <AppButton @click="loadProfile" variant="secondary" class="mt-2">
          {{ $t('profile.retry') }}
        </AppButton>
      </div>

      <!-- Profile Content -->
      <div v-else-if="profile" class="space-y-6">
        <!-- Profile Information Card -->
        <div class="rounded-lg bg-white dark:bg-dark-card shadow-sm border border-neutral-200 dark:border-dark-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {{ $t('profile.accountInfo.title') }}
            </h2>
            <SubscriptionBadge
              :tier="tier"
              :is-premium="isPremium"
              :is-trial="isTrial"
              :trial-days-remaining="trialDaysRemaining"
            />
          </div>

          <div class="space-y-4">
            <!-- User ID -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {{ $t('profile.accountInfo.userId') }}
              </label>
              <p class="text-sm text-neutral-900 dark:text-neutral-100 font-mono bg-neutral-50 dark:bg-neutral-800 rounded px-3 py-2">
                {{ userId }}
              </p>
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {{ $t('profile.accountInfo.name') }}
              </label>
              <p class="text-sm text-neutral-900 dark:text-neutral-100">
                {{ userName || '-' }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {{ $t('profile.accountInfo.email') }}
              </label>
              <p class="text-sm text-neutral-900 dark:text-neutral-100">
                {{ userEmail || '-' }}
              </p>
            </div>

            <!-- Locale -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {{ $t('profile.accountInfo.language') }}
              </label>
              <p class="text-sm text-neutral-900 dark:text-neutral-100">
                {{ getLocaleLabel(userLocale) }}
              </p>
            </div>

            <!-- Member Since -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {{ $t('profile.accountInfo.memberSince') }}
              </label>
              <p class="text-sm text-neutral-900 dark:text-neutral-100">
                {{ formatDate(createdAt) }}
              </p>
            </div>

            <!-- Edit Button -->
            <div class="pt-2">
              <AppButton @click="showEditForm = true" variant="secondary" class="w-full sm:w-auto">
                {{ $t('profile.accountInfo.editProfile') }}
              </AppButton>
            </div>
          </div>
        </div>

        <!-- Subscription Details Card -->
        <div
          v-if="subscription"
          class="rounded-lg bg-white dark:bg-dark-card shadow-sm border border-neutral-200 dark:border-dark-border p-6"
        >
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            {{ $t('profile.subscription.title') }}
          </h2>

          <div class="space-y-4">
            <!-- Subscription Type -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {{ $t('profile.subscription.plan') }}
              </label>
              <div class="flex items-center gap-2">
                <p class="text-sm text-neutral-900 dark:text-neutral-100">
                  {{ tier }}
                </p>
                <SubscriptionBadge
                  :tier="tier"
                  :is-premium="isPremium"
                  :is-trial="isTrial"
                  :trial-days-remaining="trialDaysRemaining"
                />
              </div>
            </div>

            <!-- Trial Message -->
            <div
              v-if="isTrial"
              class="rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 p-4"
            >
              <div class="flex items-start gap-3">
                <ClockIcon class="size-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-orange-900 dark:text-orange-100">
                    {{ getTrialMessage() }}
                  </p>
                  <p class="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    {{ $t('profile.subscription.trialEndsOn', { date: formatDate(subscriptionEndedAt) }) }}
                  </p>
                  <router-link
                    to="/premium"
                    class="inline-block mt-2 text-sm font-medium text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 underline"
                  >
                    {{ $t('profile.subscription.upgradeToPremium') }}
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Premium Active -->
            <div
              v-else-if="isPremium"
              class="rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 p-4"
            >
              <div class="flex items-start gap-3">
                <SparklesIcon class="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-purple-900 dark:text-purple-100">
                    {{ $t('profile.subscription.premiumActive') }}
                  </p>
                  <p class="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    {{ $t('profile.subscription.premiumMessage') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Subscription Dates -->
            <div v-if="subscriptionStartedAt" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {{ $t('profile.subscription.started') }}
                </label>
                <p class="text-sm text-neutral-900 dark:text-neutral-100">
                  {{ formatDate(subscriptionStartedAt) }}
                </p>
              </div>
              <div v-if="subscriptionEndedAt">
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {{ isTrial ? $t('profile.subscription.trialEnds') : $t('profile.subscription.expires') }}
                </label>
                <p class="text-sm text-neutral-900 dark:text-neutral-100">
                  {{ formatDate(subscriptionEndedAt) }}
                </p>
              </div>
            </div>

            <!-- Upgrade Button for Free Users -->
            <div v-if="!isPremium && !isTrial" class="pt-2">
              <router-link
                to="/premium"
                class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-purple-700 hover:to-pink-700"
              >
                <SparklesIcon class="size-4" />
                {{ $t('profile.subscription.upgradeToPremium') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <AppModal v-model="showEditForm" :title="$t('profile.accountInfo.editProfile')" size="md">
        <ProfileForm
          :profile="profile"
          :loading="loading"
          @submit="handleUpdateProfile"
          @cancel="showEditForm = false"
        />
      </AppModal>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ClockIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import SubscriptionBadge from '@/components/profile/SubscriptionBadge.vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import { useProfile } from '@/composables/useProfile'

const { t } = useI18n()

const {
  profile,
  loading,
  error,
  userId,
  userEmail,
  userName,
  userLocale,
  createdAt,
  subscription,
  tier,
  isPremium,
  isTrial,
  trialDaysRemaining,
  subscriptionStartedAt,
  subscriptionEndedAt,
  loadProfile,
  handleUpdateProfile: updateProfile,
  formatDate,
  getTrialMessage,
} = useProfile()

const showEditForm = ref(false)

// Locale labels
const localeLabels = {
  id_ID: 'Indonesia - Bahasa Indonesia',
  en_US: 'United States - English',
  en_GB: 'United Kingdom - English',
  zh_CN: 'China - 简体中文',
  zh_TW: 'Taiwan - 繁體中文',
  ja_JP: 'Japan - 日本語',
  ko_KR: 'Korea - 한국어',
  es_ES: 'Spain - Español',
  fr_FR: 'France - Français',
  de_DE: 'Germany - Deutsch',
  pt_BR: 'Brazil - Português',
  ru_RU: 'Russia - Русский',
  ar_SA: 'Saudi Arabia - العربية',
  hi_IN: 'India - हिन्दी',
}

function getLocaleLabel(locale) {
  return localeLabels[locale] || locale || 'Not set'
}

async function handleUpdateProfile(profileData) {
  try {
    await updateProfile(profileData)
    showEditForm.value = false
  } catch (err) {
    // Error is handled in composable
  }
}

onMounted(async () => {
  await loadProfile()
})
</script>
