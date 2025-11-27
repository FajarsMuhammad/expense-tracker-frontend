<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
    <nav class="p-4 space-y-2">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
        :class="isActive('/dashboard') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </router-link>

      <router-link
        to="/wallets"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
        :class="isActive('/wallets') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Wallets
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path) {
  return route.path.startsWith(path)
}
</script>
