<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-pink/10 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card transition-colors duration-500">
    <!-- Skip to main content link for keyboard navigation -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>

    <AppHeader @toggle-sidebar="toggleSidebar" />
    <div class="flex">
      <AppSidebar :is-open="sidebarOpen" @close="closeSidebar" />

      <main
        id="main-content"
        class="flex-1 w-full pt-24 md:pt-28 lg:pt-24 px-6 md:px-8 lg:px-12 pb-8 md:ml-64 transition-all duration-300 animate-fade-in"
        tabindex="-1"
      >
        <slot />
      </main>
    </div>

    <AppToast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppToast from '@/components/common/AppToast.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>
