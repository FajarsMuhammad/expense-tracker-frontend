<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-primary-600">{{ appName }}</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-700">{{ userName }}</span>
        <AppButton variant="ghost" size="sm" @click="handleLogout">
          Logout
        </AppButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuth } from '@/composables/useAuth'

const appName = import.meta.env.VITE_APP_NAME
const { user, handleLogout } = useAuth()
const userName = computed(() => user?.value?.name || '')
</script>
