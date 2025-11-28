<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-lavender p-8 md:p-16 mb-12 shadow-glow-primary">
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

          <!-- CTA Button -->
          <button
            class="px-12 py-5 bg-white hover:bg-neutral-50 text-primary-600 font-display font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            @click="handleUpgrade"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
            Get Premium Now
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Budget Alerts
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Set custom budget limits and receive real-time notifications when you're approaching them.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center py-12">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Ready to upgrade?
        </h2>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are taking control of their finances with Premium
        </p>
        <button
          class="px-12 py-5 bg-gradient-primary hover:shadow-glow-primary text-white font-display font-bold text-xl rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
          @click="handleUpgrade"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          Get Started with Premium
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

function handleUpgrade() {
  // TODO: Navigate to payment/checkout page
  console.log('Upgrade to premium clicked')
  // router.push('/premium/checkout')
}
</script>
