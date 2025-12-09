<template>
  <!-- Mobile Overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        @click="$emit('close')"
      />
    </Transition>
  </Teleport>

  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white via-primary-50/30 to-white dark:from-dark-surface dark:via-dark-card dark:to-dark-surface backdrop-blur-xl transform transition-all duration-300 shadow-soft-xl md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo Section -->
    <div class="flex items-center gap-3 px-6 h-16 border-b border-neutral-200/50 dark:border-dark-border">
      <div class="w-10 h-10 rounded-2xl bg-gradient-primary shadow-glow-primary flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
        </svg>
      </div>
      <span class="text-lg font-display font-extrabold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
        MoneyTrack
      </span>

      <!-- Mobile close button -->
      <button
        @click="$emit('close')"
        class="md:hidden ml-auto p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-card transition-all duration-300"
        aria-label="Close menu"
      >
        <svg class="w-5 h-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 pt-8 pb-6 space-y-2 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden"
        :class="isActive(item.path)
          ? 'bg-gradient-primary text-white shadow-glow-primary'
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-dark-card hover:text-primary-600 dark:hover:text-primary-400'"
        @click="$emit('close')"
      >
        <!-- Gradient overlay on hover for inactive items -->
        <div
          v-if="!isActive(item.path)"
          class="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
        ></div>

        <component :is="item.icon" class="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        <span class="font-medium relative z-10">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { h } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const route = useRoute()

// Navigation items with icons
const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (props) => h('svg', {
      ...props,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      })
    ])
  },
  {
    path: '/wallets',
    label: 'Wallets',
    icon: (props) => h('svg', {
      ...props,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      })
    ])
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: (props) => h('svg', {
      ...props,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
      })
    ])
  },
  {
    path: '/categories',
    label: 'Categories',
    icon: (props) => h('svg', {
      ...props,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
      })
    ])
  },
  {
    path: '/debts',
    label: 'Debts',
    icon: (props) => h('svg', {
      ...props,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
      })
    ])
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: (props) => h('svg', {
      ...props,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      })
    ])
  }
]

function isActive(path) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
