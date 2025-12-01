<template>
  <header
    class="fixed top-0 right-0 left-0 md:left-64 z-50 backdrop-blur-md bg-white/85 dark:bg-dark-surface/85 shadow-md transition-all duration-300">
    <div class="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">

      <!-- Mobile menu button -->
      <button @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-card transition transform active:scale-95"
        aria-label="Toggle menu">
        <svg class="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Title -->
      <div class="flex-1 md:flex-none flex items-center gap-4">
        <h1
          class="text-base md:text-lg font-display font-semibold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
          {{ appName }}
        </h1>

        <slot name="page-context"></slot>
      </div>

      <!-- Right actions -->
      <nav class="flex items-center gap-3">

        <!-- Premium CTA -->
        <router-link to="/premium"
          class="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-primary text-white font-semibold text-sm shadow-sm hover:shadow-lg transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <span class="sr-only sm:not-sr-only">Premium</span>
        </router-link>

        <!-- Theme toggle -->
        <ThemeToggle />

        <!-- Profile Menu -->
        <div class="relative" ref="menuRoot">
          <button ref="trigger" :aria-expanded="menuOpen.toString()" aria-haspopup="menu" @click="toggleMenu"
            @keydown.enter.prevent="toggleMenu" @keydown.space.prevent="toggleMenu"
            class="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-neutral-100 dark:hover:bg-dark-card focus:outline-none transition"
            type="button">
            <div
              class="w-9 h-9 rounded-full overflow-hidden bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold">
              <img v-if="avatarUrl" :src="avatarUrl" class="object-cover w-full h-full" @error="avatarError = true"
                v-show="!avatarError" />
              <span v-if="!avatarUrl || avatarError">{{ userInitial }}</span>
            </div>

            <div class="hidden md:flex flex-col leading-tight">
              <span class="text-sm font-medium">{{ userName }}</span>
              <span class="text-xs text-neutral-500">{{ userRole || 'Member' }}</span>
            </div>

            <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" stroke-width="1.8"
              viewBox="0 0 20 20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 8l4 4 4-4" />
            </svg>
          </button>

          <!-- Dropdown -->
          <!-- Dropdown -->
          <transition name="menu-zoom">
            <div v-if="menuOpen" ref="menu"
              class="absolute right-0 mt-3 w-64 bg-white dark:bg-dark-card rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-2 z-50 no-borders"
              role="menu">

              <!-- Profile Summary -->
              <div class="px-4 py-3 flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full overflow-hidden bg-gradient-primary text-white flex items-center justify-center">
                  <img v-if="avatarUrl" :src="avatarUrl" @error="avatarError = true"
                    class="object-cover w-full h-full" />
                  <span v-if="!avatarUrl || avatarError">{{ userInitial }}</span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ userName }}</div>
                  <div class="text-xs text-neutral-500 truncate">{{ userEmail }}</div>
                </div>

                <button @click="goToProfile"
                  class="px-2 py-1 text-xs bg-neutral-100 dark:bg-dark-surface rounded-md hover:bg-neutral-200">
                  View
                </button>
              </div>

              <!-- Separator BEFORE Profile -->
              <div class="menu-separator"></div>

              <!-- Profile -->
              <button ref="firstItem" @click="goToProfile" class="menu-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Profile
              </button>

              <!-- Settings -->
              <button @click="goToSettings" class="menu-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 8v4l3 3m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Settings
              </button>

              <!-- Separator BEFORE Logout -->
              <div class="menu-separator my-1"></div>

              <!-- Logout -->
              <button @click="logout" class="menu-item text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
                </svg>
                Log out
              </button>

            </div>
          </transition>
        </div>

      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

/* AUTH */
const router = useRouter()
const { user, handleLogout } = useAuth()

const userName = computed(() => user?.value?.name || 'User')
const userEmail = computed(() => user?.value?.email || '')
const userRole = computed(() => user?.value?.role || '')
const avatarUrl = computed(() => user?.value?.avatar || '')
const userInitial = computed(() => userName.value[0]?.toUpperCase() ?? 'U')

const appName = import.meta.env.VITE_APP_NAME || 'Expense Tracker'
const avatarError = ref(false)

/* DROPDOWN STATE */
const menuOpen = ref(false)
const menuRoot = ref(null)
const trigger = ref(null)
const menu = ref(null)
const firstItem = ref(null)

function openMenu() {
  menuOpen.value = true
  nextTick(() => firstItem.value?.focus())
}
function closeMenu() {
  menuOpen.value = false
  nextTick(() => trigger.value?.focus())
}
function toggleMenu() {
  menuOpen.value ? closeMenu() : openMenu()
}

function handleClickOutside(e) {
  if (!menuOpen.value) return
  if (!menuRoot.value) return
  if (menuRoot.value.contains(e.target)) return
  if (e.target.closest('.dropdown-base-root')) return
  closeMenu()
}

function handleEscape(e) {
  if (e.key === 'Escape' && menuOpen.value) {
    e.preventDefault()
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

function goToProfile() {
  closeMenu()
  router.push({ name: 'Profile' }).catch(() => { })
}
function goToSettings() {
  closeMenu()
  router.push({ name: 'Settings' }).catch(() => { })
}
async function logout() {
  closeMenu()
  await handleLogout()
}
</script>

<style scoped>
/* Panel keeps border */
.no-borders {
  border: 1px solid rgba(0,0,0,0.08);
}
:deep(.dark) .no-borders {
  border: 1px solid rgba(255,255,255,0.12);
}

/* Remove inner borders but keep outer */
.no-borders * {
  border: none !important;
  box-shadow: none !important;
}

/* Menu items */
.menu-item {
  @apply w-full flex items-center gap-3 px-4 py-2 text-sm 
         text-neutral-700 dark:text-neutral-200 
         hover:bg-neutral-50 dark:hover:bg-dark-card/60 
         transition rounded-md;
}

/* GLOBAL separator style */
.menu-separator {
  height: 1px;
  background: rgba(0,0,0,0.08);
}
:deep(.dark) .menu-separator {
  background: rgba(255,255,255,0.12);
}

/* Smooth animation */
.menu-zoom-enter-from { opacity: 0; transform: translateY(-6px) scale(0.97); }
.menu-zoom-enter-to { opacity: 1; transform: translateY(0) scale(1); }
.menu-zoom-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.menu-zoom-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
.menu-zoom-enter-active,
.menu-zoom-leave-active { transition: all 150ms ease; }
</style>
