<template>
  <header
    class="fixed top-0 right-0 left-0 md:left-64 z-50 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-dark-border/50 transition-all duration-300">
    <div class="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
      <!-- Mobile menu button -->
      <button @click="$emit('toggle-sidebar')"
        class="md:hidden p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-hover transition-all duration-200 active:scale-95"
        aria-label="Toggle menu">
        <svg class="w-5 h-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Title & Breadcrumb -->
      <div class="flex-1 md:flex-none flex items-center gap-4 ml-3 md:ml-0">
        <div class="flex flex-col">
          <h1 class="text-sm md:text-base font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {{ appName }}
          </h1>
          <span
            class="hidden md:block text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Smart Tracking
          </span>
        </div>
        <slot name="page-context"></slot>
      </div>

      <!-- Right actions -->
      <nav class="flex items-center gap-2">
        <!-- Premium CTA -->
        <router-link to="/premium"
          class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-sm shadow-soft hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent dark:border-neutral-200/10">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <span>Premium</span>
        </router-link>

        <!-- Theme toggle -->
        <ThemeToggle />

        <!-- Profile Menu -->
        <div class="relative" ref="menuRoot">
          <button ref="trigger" :aria-expanded="menuOpen.toString()" aria-haspopup="menu" @click="toggleMenu"
            @keydown.enter.prevent="toggleMenu" @keydown.space.prevent="toggleMenu"
            class="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-dark-hover transition-all duration-200"
            type="button">
            <div
              class="w-8 h-8 rounded-xl overflow-hidden bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center text-sm font-bold ring-2 ring-neutral-200 dark:ring-dark-border shadow-sm">
              <img v-if="avatarUrl" :src="avatarUrl" class="object-cover w-full h-full" @error="avatarError = true"
                v-show="!avatarError" />
              <span v-if="!avatarUrl || avatarError">{{ userInitial }}</span>
            </div>

            <svg class="w-4 h-4 text-neutral-400 transition-transform duration-200" :class="{ 'rotate-180': menuOpen }"
              fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 20 20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 8l4 4 4-4" />
            </svg>
          </button>

          <!-- Dropdown -->
          <transition name="menu-zoom">
            <div v-if="menuOpen" ref="menu"
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-2xl shadow-soft-2xl border border-neutral-200 dark:border-dark-border py-2 z-50 overflow-hidden"
              role="menu">
              <!-- User info -->
              <div
                class="px-4 py-4 border-b border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface/50">
                <p class="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate mb-0.5">
                  {{ userName }}
                </p>
                <p
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-500 truncate uppercase tracking-tight">
                  {{ userEmail }}
                </p>
              </div>

              <!-- Menu Items -->
              <div class="p-1 space-y-0.5">
                <button ref="firstItem" @click="goToProfile" class="menu-item group">
                  <div
                    class="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-dark-surface flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-900 transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  {{ $t('navigation.menu.profile') }}
                </button>

                <button @click="goToSettings" class="menu-item group">
                  <div
                    class="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-dark-surface flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-900 transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  {{ $t('navigation.menu.settings') }}
                </button>
              </div>

              <!-- Separator -->
              <div class="my-2 h-px bg-neutral-100 dark:bg-dark-border mx-4"></div>

              <!-- Language Switcher -->
              <div class="px-4 py-3">
                <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 mb-3 uppercase tracking-widest">
                  {{ $t('common.locale.title') }}
                </p>

                <button @click="toggleLocale"
                  class="w-full h-10 rounded-xl bg-neutral-100 dark:bg-dark-surface flex items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 relative hover:bg-neutral-200 dark:hover:bg-dark-hover"
                  :aria-label="$t('common.locale.switchLanguage')">
                  <div
                    class="absolute w-1/2 h-8 m-1 rounded-lg bg-neutral-900 dark:bg-neutral-100 transition-all duration-300 ease-smooth transform flex items-center justify-center font-bold text-xs text-white dark:text-neutral-900 shadow-sm"
                    :class="currentLocale === 'id' ? 'translate-x-0' : 'translate-x-[calc(100%-0.5rem)]'">
                    {{ currentLocale === 'id' ? 'ID' : 'EN' }}
                  </div>
                  <div class="w-1/2 flex items-center justify-center text-xs font-bold z-10"
                    :class="currentLocale === 'id' ? 'opacity-0' : 'text-neutral-400'">ID</div>
                  <div class="w-1/2 flex items-center justify-center text-xs font-bold z-10"
                    :class="currentLocale === 'en' ? 'opacity-0' : 'text-neutral-400'">EN</div>
                </button>
              </div>

              <!-- Logout -->
              <div class="p-1 mt-1">
                <button @click="logout"
                  class="menu-item group text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-dark-surface rounded-xl">
                  <div
                    class="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-dark-surface flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-900 transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                  </div>
                  {{ $t('navigation.menu.logout') }}
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
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useLocaleStore } from '@/stores/locale'

const router = useRouter()
const { user, handleLogout } = useAuth()
const localeStore = useLocaleStore()
const { currentLocale } = storeToRefs(localeStore)
const { toggleLocale } = localeStore

const userName = computed(() => user?.value?.name || 'User')
const userEmail = computed(() => user?.value?.email || '')
const avatarUrl = computed(() => user?.value?.avatar || '')
const userInitial = computed(() => userName.value[0]?.toUpperCase() ?? 'U')

const appName = import.meta.env.VITE_APP_NAME || 'MoneyTrack'
const avatarError = ref(false)

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
  if (!menuOpen.value || !menuRoot.value || menuRoot.value.contains(e.target) || e.target.closest('.dropdown-base-root')) return
  closeMenu()
}
function handleEscape(e) {
  if (e.key === 'Escape' && menuOpen.value) { e.preventDefault(); closeMenu(); }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

function goToProfile() { closeMenu(); router.push({ name: 'Profile' }).catch(() => { }) }
function goToSettings() { closeMenu(); router.push({ name: 'Settings' }).catch(() => { }) }
async function logout() { closeMenu(); await handleLogout() }
</script>

<style scoped>
.menu-item {
  @apply w-full flex items-center gap-3 px-3 py-2 text-sm font-bold;
  @apply text-neutral-500 dark:text-neutral-400;
  @apply transition-all duration-200;
}

.menu-item:hover {
  @apply text-neutral-900 dark:text-neutral-100;
}

.menu-zoom-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
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
  transform: translateY(-8px) scale(0.98);
}

.menu-zoom-enter-active,
.menu-zoom-leave-active {
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
