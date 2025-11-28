<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-pink/10 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card transition-colors duration-500">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    <div class="flex">
      <AppSidebar :is-open="sidebarOpen" @close="closeSidebar" />
      <main class="flex-1 w-full pt-20 md:pt-24 px-6 md:px-8 lg:px-12 pb-8 md:ml-64 transition-all duration-300 animate-fade-in">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>
