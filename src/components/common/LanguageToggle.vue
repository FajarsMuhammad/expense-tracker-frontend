<template>
  <button
    @click="toggleLocale"
    class="relative p-2 rounded-xl bg-neutral-100 dark:bg-dark-surface hover:bg-neutral-200 dark:hover:bg-dark-card transition-all duration-300 group"
    :aria-label="$t('common.locale.switchLanguage')"
  >
    <!-- ID Flag (Indonesian) -->
    <div
      v-if="currentLocale === 'id'"
      class="flex items-center gap-1.5 transition-transform group-hover:scale-110 duration-300"
    >
      <span class="text-lg">🇮🇩</span>
      <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">ID</span>
    </div>

    <!-- EN Flag (English) -->
    <div
      v-else
      class="flex items-center gap-1.5 transition-transform group-hover:scale-110 duration-300"
    >
      <span class="text-lg">🇬🇧</span>
      <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">EN</span>
    </div>
  </button>
</template>

<script setup>
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
const { currentLocale } = localeStore
const { toggleLocale } = localeStore
</script>
