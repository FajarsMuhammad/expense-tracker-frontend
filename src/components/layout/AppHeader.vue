<template>
  <header
    class="fixed top-0 right-0 left-0 md:left-64 z-50 backdrop-blur-md bg-white/85 dark:bg-dark-surface/85 shadow-md transition-all duration-300"
  >
    <div class="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
      <!-- Mobile menu button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-card transition transform active:scale-95"
        aria-label="Toggle menu"
        title="Toggle sidebar"
      >
        <svg class="w-6 h-6 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Title / breadcrumb area -->
      <div class="flex-1 md:flex-none flex items-center gap-4">
        <h1 class="text-base md:text-lg font-display font-semibold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
          {{ appName }}
        </h1>

        <!-- optional subtitle / page context slot (keeps header compact) -->
        <slot name="page-context"></slot>
      </div>

      <!-- Right actions -->
      <nav class="flex items-center gap-3" aria-label="Primary actions">
        <!-- CTA: Premium -->
        <router-link
          to="/premium"
          class="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-primary text-white font-semibold text-sm shadow-sm hover:shadow-lg transform transition"
          title="Explore premium"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <span class="sr-only sm:not-sr-only">Premium</span>
        </router-link>

        <!-- Theme toggle sits in header -->
        <ThemeToggle />

        <!-- Notifications placeholder (optional) -->
        <!--
        <button class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-card" aria-label="Notifications">
          <BellIcon />
        </button>
        -->

        <!-- Profile / user menu -->
        <div class="relative" ref="menuRoot">
          <!-- Avatar trigger -->
          <button
            ref="trigger"
            :aria-expanded="isOpen.toString()"
            aria-haspopup="menu"
            @click="toggle"
            @keydown.enter.prevent="toggle"
            @keydown.space.prevent="toggle"
            @keydown.arrow-down.prevent="onArrowDown"
            @keydown.arrow-up.prevent="onArrowUp"
            class="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-neutral-100 dark:hover:bg-dark-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 transition transform"
            type="button"
            title="Open user menu"
          >
            <!-- Avatar with image fallback -->
            <div class="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-gradient-primary text-white text-sm font-semibold shrink-0">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="Avatar"
                class="object-cover w-full h-full"
                @error="avatarError = true"
                v-show="!avatarError"
              />
              <span v-if="!avatarUrl || avatarError">{{ userInitial }}</span>
            </div>

            <!-- name on md+ -->
            <div class="hidden md:flex flex-col leading-tight">
              <span class="text-sm font-medium text-neutral-800 dark:text-neutral-100">{{ userName }}</span>
              <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ userRole || 'Member' }}</span>
            </div>

            <!-- caret -->
            <svg class="w-4 h-4 text-neutral-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 8l4 4 4-4" />
            </svg>
          </button>

          <!-- Dropdown -->
          <transition name="menu-zoom" appear>
            <div
              v-if="isOpen"
              ref="menu"
              class="absolute right-0 mt-3 w-64 bg-white dark:bg-dark-card rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/6 py-2 z-50"
              role="menu"
              aria-orientation="vertical"
              aria-label="User menu"
              @keydown.tab.prevent="onTab"
            >
              <!-- Profile preview -->
              <div class="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-gradient-primary text-white flex items-center justify-center text-base font-semibold">
                    <img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      alt="Avatar"
                      class="object-cover w-full h-full"
                      @error="avatarError = true"
                      v-show="!avatarError"
                    />
                    <span v-if="!avatarUrl || avatarError">{{ userInitial }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{{ userName }}</div>
                    <div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">{{ userEmail }}</div>
                  </div>
                  <button @click="goToProfile" class="ml-2 px-2 py-1 text-xs bg-neutral-100 dark:bg-dark-card rounded-md hover:bg-neutral-200 transition">
                    View
                  </button>
                </div>
              </div>

              <!-- Menu actions -->
              <div class="py-1">
                <button
                  ref="firstItem"
                  @click="goToProfile"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-dark-card/60 transition"
                  role="menuitem"
                >
                  <!-- icon -->
                  <svg class="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Profile
                </button>

                <button
                  @click="goToSettings"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-dark-card/60 transition"
                  role="menuitem"
                >
                  <svg class="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 6.7a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H11a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09c.23.47.6.86 1.08 1.15" />
                  </svg>
                  Settings
                </button>

                <!-- optionally toggle theme inside menu -->
                <div class="px-4 py-2">
                  <div class="flex items-center justify-between gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                    <div class="flex items-center gap-3">
                      <svg class="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Dark mode</span>
                    </div>
                    <ThemeToggle small />
                  </div>
                </div>

                <div class="border-t border-neutral-100 dark:border-neutral-700 my-1"></div>

                <button
                  @click="confirmLogout"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 transition"
                  role="menuitem"
                >
                  <svg class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8v8" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </transition>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
/**
 * Polished header with accessible dropdown and profile preview.
 * Adjust routes and composable names to match your app if needed.
 */

import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const { user, handleLogout } = useAuth()

const appName = import.meta.env.VITE_APP_NAME || 'Expense Tracker'
const avatarUrl = computed(() => user?.value?.avatar || '') // optional
const userName = computed(() => user?.value?.name || 'User')
const userEmail = computed(() => user?.value?.email || '')
const userRole = computed(() => user?.value?.role || '')

const userInitial = computed(() => {
  const name = userName.value || ''
  return (name.charAt(0) || 'U').toUpperCase()
})

/* dropdown state */
const isOpen = ref(false)
const avatarError = ref(false)
const menuRoot = ref(null)
const trigger = ref(null)
const menu = ref(null)
const firstItem = ref(null)

function open() {
  isOpen.value = true
  nextTick(() => firstItem.value?.focus())
}

function close() {
  isOpen.value = false
  nextTick(() => trigger.value?.focus())
}

function toggle() {
  isOpen.value ? close() : open()
}

function onArrowDown() {
  if (!isOpen.value) return open()
  nextTick(() => firstItem.value?.focus())
}
function onArrowUp() {
  if (!isOpen.value) return open()
  // focus last item if you want; here just focus first for simplicity
  nextTick(() => firstItem.value?.focus())
}

/* keyboard/tab trap (simple) - keep focus inside dropdown when open */
function onTab(e) {
  // allow standard tab behavior; this function reserved for more advanced traps
}

/* navigation */
function goToProfile() {
  close()
  router.push({ name: 'Profile' }).catch(() => {})
}
function goToSettings() {
  close()
  router.push({ name: 'Settings' }).catch(() => {})
}

/* confirm logout (modal optional). For now call handleLogout directly */
async function confirmLogout() {
  close()
  try {
    await handleLogout()
  } catch (err) {
    console.error('Logout failed', err)
  }
}

/* click outside & escape */
function onDocClick(e) {
  if (!menuRoot.value) return
  if (!menuRoot.value.contains(e.target)) close()
}
function onDocKey(e) {
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onDocKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onDocKey)
})
</script>

<style scoped>
/* subtle zoom fade for menu */
.menu-zoom-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.menu-zoom-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.menu-zoom-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.menu-zoom-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.menu-zoom-enter-active,
.menu-zoom-leave-active {
  transition: transform 160ms cubic-bezier(.2, .8, .2, 1), opacity 160ms ease;
}

/* ensure avatar img covers container */
img[alt="Avatar"] {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
