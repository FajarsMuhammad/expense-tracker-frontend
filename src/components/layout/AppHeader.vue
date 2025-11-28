<template>
  <header class="fixed top-0 right-0 left-0 md:left-64 z-40 backdrop-blur-md bg-white/80 dark:bg-dark-surface/80 shadow-soft transition-all duration-300">
    <div class="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
      <!-- Mobile menu button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-card transition-all duration-300 hover:scale-105"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Page title -->
      <div class="flex-1 md:flex-none">
        <h2 class="text-lg md:text-xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
          {{ appName }}
        </h2>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <!-- Explore Premium Button -->
        <router-link
          to="/premium"
          class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-primary text-white font-semibold text-sm hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          Explore Premium
        </router-link>

        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- User menu -->
        <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-soft dark:bg-dark-card hover:shadow-soft transition-all duration-300 cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-300">
            {{ userInitial }}
          </div>
          <span class="hidden md:block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {{ userName }}
          </span>
        </div>

        <!-- Logout button -->
        <button
          @click="handleLogout"
          class="p-2 rounded-xl text-expense-dark dark:text-expense hover:bg-expense-light/20 dark:hover:bg-expense/10 transition-all duration-300 hover:scale-105"
          aria-label="Logout"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

defineEmits(['toggle-sidebar'])

const appName = import.meta.env.VITE_APP_NAME || 'Expense Tracker'
const { user, handleLogout } = useAuth()
const userName = computed(() => user?.value?.name || 'User')
const userInitial = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})
</script>
