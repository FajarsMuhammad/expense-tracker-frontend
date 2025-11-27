<template>
  <header class="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-10">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Mobile Hamburger Menu -->
        <button
          @click="$emit('toggle-sidebar')"
          class="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 class="text-lg md:text-xl font-bold text-primary-600">{{ appName }}</h1>
      </div>
      <div class="flex items-center gap-2 md:gap-4">
        <span class="text-xs md:text-sm text-gray-700 hidden sm:block">{{ userName }}</span>
        <AppButton variant="ghost" size="sm" @click="handleLogout">
          <span class="hidden sm:inline">Logout</span>
          <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </AppButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuth } from '@/composables/useAuth'

defineEmits(['toggle-sidebar'])

const appName = import.meta.env.VITE_APP_NAME
const { user, handleLogout } = useAuth()
const userName = computed(() => user?.value?.name || '')
</script>
