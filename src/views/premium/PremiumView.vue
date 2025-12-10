<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <!-- Current Subscription Status -->
      <div v-if="!loading && subscription" class="mb-8">
        <!-- Premium Active -->
        <div v-if="isPremium && isActive" class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 p-6 shadow-glow-income">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <span class="text-white font-bold">Premium Active</span>
              </div>
              <p class="text-white/90">Valid until: {{ formatDate(subscriptionEndDate) }}</p>
              <p class="text-white text-sm">{{ daysRemaining }} days remaining</p>
            </div>
          </div>
        </div>

        <!-- Trial Period -->
        <div v-else-if="isPremium && isTrial" class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 shadow-glow-income">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <span class="text-white font-bold">Trial Period Active</span>
              </div>
              <p class="text-white/90">{{ daysRemaining }} days remaining</p>
              <p class="text-white text-sm">Enjoy all premium features for free!</p>
            </div>
            <button
              @click="handleUpgrade"
              :disabled="upgrading"
              class="px-6 py-3 bg-white text-yellow-600 font-bold rounded-lg shadow-lg hover:bg-neutral-50 transition-all disabled:opacity-50"
            >
              {{ upgrading ? 'Processing...' : 'Subscribe Now - IDR 25,000/month' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Hero Section (shown for free users) -->
      <div v-if="isFree" class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-lavender p-8 md:p-16 mb-12 shadow-glow-primary">
        <!-- Background decoration -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-white rounded-full"></div>
          <div class="absolute -left-8 -bottom-8 w-48 h-48 bg-white rounded-full"></div>
          <div class="absolute right-1/3 top-1/4 w-32 h-32 bg-white rounded-full"></div>
        </div>

        <div class="relative z-10 text-center">
          <!-- Badge -->
          <div class="flex items-center justify-center gap-2 mb-6">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.88-.97-7-5.17-7-9V8.3l7-3.11 7 3.11V11c0 3.83-3.12 8.03-7 9z"/>
              <path d="M9.5 11L8 12.5l3 3 6-6-1.5-1.5-4.5 4.5z"/>
            </svg>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Upgrade to Premium
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Unlock unlimited features and take control of your finances like never before
          </p>

          <!-- Pricing -->
          <div class="mb-8">
            <p class="text-3xl md:text-4xl font-bold text-white">IDR 25,000</p>
            <p class="text-white/90">per month</p>
          </div>

          <!-- CTA Button -->
          <button
            class="px-12 py-5 bg-white hover:bg-neutral-50 text-primary-600 font-display font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 disabled:opacity-50"
            @click="handleUpgrade"
            :disabled="upgrading || loading"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
            {{ upgrading ? 'Processing...' : loading ? 'Loading...' : 'Subscribe to Premium' }}
          </button>
          <p class="text-white/80 text-sm mt-4">Only IDR 25,000/month · Cancel anytime</p>
        </div>
      </div>

      <!-- Trial Info Banner (for free users) -->
      <div v-if="isFree" class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mb-8">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Did you know?
            </h3>
            <p class="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
              New users automatically get a <span class="font-bold text-yellow-600 dark:text-yellow-400">14-day FREE trial</span> of all Premium features when they register!
              Experience unlimited wallets, advanced reports, and Excel/PDF export before deciding to subscribe.
            </p>
          </div>
        </div>
      </div>

      <!-- Features Comparison Table -->
      <div class="bg-white dark:bg-dark-card rounded-2xl shadow-soft-lg p-8 mb-12">
        <h2 class="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center">
          Feature Comparison
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neutral-200 dark:border-neutral-700">
                <th class="px-6 py-4 text-left text-sm font-bold text-neutral-900 dark:text-neutral-100">Feature</th>
                <th class="px-6 py-4 text-center text-sm font-bold text-neutral-600 dark:text-neutral-400">Free</th>
                <th class="px-6 py-4 text-center text-sm font-bold text-primary-600 dark:text-primary-400">Premium</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Wallets</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">1</td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Categories</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">10</td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Export Format</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">CSV (100 records)</td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400 font-bold">CSV, Excel, PDF (10,000 records)</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Date Range</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">90 days</td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400 font-bold">365 days</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Advanced Reports</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">
                  <svg class="w-5 h-5 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400">
                  <svg class="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Cloud Backup</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">
                  <svg class="w-5 h-5 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400">
                  <svg class="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-neutral-900 dark:text-neutral-100">Priority Support</td>
                <td class="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">
                  <svg class="w-5 h-5 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="px-6 py-4 text-center text-primary-600 dark:text-primary-400">
                  <svg class="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Upgrade Button in Table -->
        <div v-if="isFree" class="mt-8 text-center">
          <button
            @click="handleUpgrade"
            :disabled="upgrading || loading"
            class="px-8 py-4 bg-gradient-primary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-glow-primary transition-all hover:scale-105 disabled:opacity-50"
          >
            {{ upgrading ? 'Processing...' : 'Upgrade to Premium' }}
          </button>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Feature 1 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-8 shadow-soft-lg hover:shadow-glow-primary transition-all duration-300 hover:scale-105">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow-primary">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Unlimited Wallets
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Create as many wallets as you need to organize your personal, business, and savings finances separately.
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-8 shadow-soft-lg hover:shadow-glow-income transition-all duration-300 hover:scale-105">
          <div class="absolute top-0 right-0 w-32 h-32 bg-income opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-income flex items-center justify-center mb-4 shadow-glow-income">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Advanced Analytics
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Get detailed insights with custom reports, spending patterns, and financial forecasting tools.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-8 shadow-soft-lg hover:shadow-glow-expense transition-all duration-300 hover:scale-105">
          <div class="absolute top-0 right-0 w-32 h-32 bg-expense opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-expense flex items-center justify-center mb-4 shadow-glow-expense">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Unlimited Categories
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Create custom categories and subcategories to track every aspect of your spending habits.
            </p>
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-8 shadow-soft-lg hover:shadow-glow-primary transition-all duration-300 hover:scale-105">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow-primary">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Priority Support
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Get help when you need it with dedicated priority support and faster response times.
            </p>
          </div>
        </div>

        <!-- Feature 5 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-8 shadow-soft-lg hover:shadow-glow-income transition-all duration-300 hover:scale-105">
          <div class="absolute top-0 right-0 w-32 h-32 bg-income opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-income flex items-center justify-center mb-4 shadow-glow-income">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Data Export
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Export your financial data in multiple formats (CSV, PDF, Excel) for your records and analysis.
            </p>
          </div>
        </div>

        <!-- Feature 6 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-8 shadow-soft-lg hover:shadow-glow-expense transition-all duration-300 hover:scale-105">
          <div class="absolute top-0 right-0 w-32 h-32 bg-expense opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-expense flex items-center justify-center mb-4 shadow-glow-expense">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Cloud Backup
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Automatic cloud backup to keep your financial data safe and accessible from anywhere.
            </p>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div v-if="isFree || isTrial" class="text-center py-12 bg-gradient-to-r from-primary-50 to-accent-lavender/20 dark:from-dark-surface dark:to-dark-card rounded-2xl">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Ready to upgrade?
        </h2>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
          {{ isTrial ? 'Subscribe now to continue enjoying premium features after your trial ends' : 'Join thousands of users who are taking control of their finances with Premium' }}
        </p>
        <button
          class="px-12 py-5 bg-gradient-primary hover:shadow-glow-primary text-white font-display font-bold text-xl rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 disabled:opacity-50"
          @click="handleUpgrade"
          :disabled="upgrading || loading"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          {{ upgrading ? 'Processing...' : isTrial ? 'Subscribe Now - IDR 25,000/month' : 'Get Started with Premium' }}
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useSubscription } from '@/composables/useSubscription'

const {
  subscription,
  loading,
  isPremium,
  isFree,
  isTrial,
  isActive,
  daysRemaining,
  subscriptionEndDate,
  loadSubscription,
  upgradeToPremium,
  formatDate,
} = useSubscription()

const upgrading = ref(false)

onMounted(async () => {
  await loadSubscription()
})

async function handleUpgrade() {
  if (upgrading.value) return

  upgrading.value = true
  try {
    const result = await upgradeToPremium(1)
    console.log('Upgrade result:', result)

    // Refresh subscription data
    if (result.success) {
      await loadSubscription()
    }
  } catch (error) {
    console.error('Upgrade failed:', error)
  } finally {
    upgrading.value = false
  }
}
</script>
