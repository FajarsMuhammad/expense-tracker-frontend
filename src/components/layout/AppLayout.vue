<template>
  <div class="min-h-screen bg-white dark:bg-dark-bg noise-overlay transition-colors duration-500">
    <!-- Skip link for accessibility -->
    <a href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-neutral-900 dark:focus:bg-neutral-100 focus:text-white dark:focus:text-neutral-900 focus:rounded-xl focus:shadow-soft-lg focus:outline-none">
      Skip to main content
    </a>

    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex">
      <AppSidebar :is-open="sidebarOpen" @close="closeSidebar" />

      <main id="main-content"
        class="flex-1 w-full pt-20 md:pt-24 lg:pt-20 px-4 md:px-6 lg:px-8 pb-8 md:ml-64 transition-all duration-300"
        tabindex="-1">
        <!-- Content wrapper with stagger animation -->
        <div class="animate-fade-in">
          <slot />
        </div>
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
