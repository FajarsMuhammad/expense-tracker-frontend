<template>
  <!-- Mobile Overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" @click="$emit('close')" />
    </Transition>
  </Teleport>

  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-surface border-r border-neutral-200/50 dark:border-dark-border transform transition-all duration-300 shadow-xl md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
    <!-- Logo Section -->
    <div class="flex items-center gap-3 px-6 h-16 border-b border-neutral-200/50 dark:border-dark-border">
      <div class="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg">
        <svg class="w-6 h-6 text-white dark:text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fill-rule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clip-rule="evenodd" />
        </svg>
      </div>
      <span class="text-xl font-display font-bold text-neutral-900 dark:text-white tracking-tight">
        MoneyTrack
      </span>

      <!-- Mobile close button -->
      <button @click="$emit('close')"
        class="md:hidden ml-auto p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-card transition-all duration-300"
        aria-label="Close menu">
        <svg class="w-5 h-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 pt-8 pb-6 space-y-2 overflow-y-auto">
      <router-link v-for="item in navItems" :key="item.path" :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
        :class="isActive(item.path)
          ? 'bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900'
          : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-dark-card hover:text-neutral-900 dark:hover:text-neutral-200'"
        @click="$emit('close')">
        <component :is="item.icon"
          class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
        <span class="font-bold text-sm relative z-10">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { h, computed } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const route = useRoute()
const { t } = useI18n()

// Navigation items with icons - using computed for reactive translations
const navItems = computed(() => [
  {
    path: '/dashboard',
    label: t('navigation.sidebar.dashboard'),
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
    label: t('navigation.sidebar.wallets'),
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
    label: t('navigation.sidebar.transactions'),
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
    label: t('navigation.sidebar.categories'),
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
    label: t('navigation.sidebar.debts'),
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
    label: t('navigation.sidebar.reports'),
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
  },
  {
    path: '/profile',
    label: t('navigation.sidebar.profile'),
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
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      })
    ])
  }
])

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
