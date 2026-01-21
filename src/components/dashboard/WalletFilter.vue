<template>
  <div>
    <DropdownBase class="relative min-w-[240px]">
      <template #trigger="{ toggle, isOpen }">
        <button id="wallet-filter" type="button" @click.stop="toggle" :aria-expanded="String(isOpen)"
          class="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 transition-all duration-200 shadow-soft hover:border-neutral-300 dark:hover:border-neutral-700 group">
          <div class="flex flex-col items-start mr-2">
            <span
              class="text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 mb-0.5">{{
                $t('dashboard.walletFilter.label') }}</span>
            <span class="font-bold text-sm truncate">{{ selectedLabel }}</span>
          </div>
          <svg class="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200"
            :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </template>

      <template #menu="{ close }">
        <div
          class="absolute mt-2 w-full bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl shadow-soft-xl z-50 p-2 animate-scale-in"
          role="menu" aria-labelledby="wallet-filter" @click.stop>
          <!-- Search -->
          <div class="px-2 pb-2">
            <div class="relative">
              <input v-model="walletQuery" type="search" :placeholder="$t('dashboard.walletFilter.searchPlaceholder')"
                class="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-100 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5 dark:focus:ring-neutral-100/5 placeholder:text-neutral-400 dark:placeholder:text-neutral-600" />
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div class="max-h-60 overflow-y-auto hide-scrollbar space-y-1">
            <!-- All Wallets option -->
            <button
              class="w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group"
              :class="selectedWalletId === null
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-dark-hover'"
              @click.stop.prevent="selectWallet(null, close)">
              <span class="font-medium text-sm">{{ $t('dashboard.walletFilter.allWallets') }}</span>
              <svg v-if="selectedWalletId === null" class="w-4 h-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <!-- Wallet List -->
            <button v-for="wallet in filteredWallets" :key="wallet.id"
              class="w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group"
              :class="String(selectedWalletId) === String(wallet.id)
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-dark-hover'"
              @click.stop.prevent="selectWallet(wallet.id, close)">
              <div class="flex flex-col min-w-0">
                <span class="font-medium text-sm truncate">{{ wallet.name }}</span>
                <span class="text-[10px] opacity-70 uppercase tracking-widest">{{ wallet.currency }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs tabular-nums" v-if="wallet.balance !== undefined">
                  {{ formatCurrency(wallet.balance, wallet.currency) }}
                </span>
                <svg v-if="String(selectedWalletId) === String(wallet.id)" class="w-4 h-4" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>

            <div v-if="filteredWallets.length === 0" class="px-3 py-8 text-center">
              <svg class="w-8 h-8 text-neutral-200 dark:text-neutral-800 mx-auto mb-2" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p class="text-xs text-neutral-400 dark:text-neutral-600">{{ $t('dashboard.walletFilter.noWalletsFound')
              }}</p>
            </div>
          </div>
        </div>
      </template>
    </DropdownBase>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DropdownBase from '@/components/common/DropdownBase.vue'
import { formatCurrency } from '@/utils/currency'

const { t } = useI18n()

const props = defineProps({
  wallets: {
    type: Array,
    required: true,
  },
  selectedWalletId: {
    type: [String, Number, null],
    default: null,
  },
})

const emit = defineEmits(['update:selectedWalletId'])

const walletQuery = ref('')

const filteredWallets = computed(() => {
  const q = walletQuery.value.trim().toLowerCase()
  if (!q) return props.wallets
  return props.wallets.filter(w =>
    (w.name || '').toLowerCase().includes(q) ||
    (w.currency || '').toLowerCase().includes(q)
  )
})

const selectedLabel = computed(() => {
  if (props.selectedWalletId === null || props.selectedWalletId === undefined || props.selectedWalletId === '') {
    return t('dashboard.walletFilter.allWallets')
  }
  const found = props.wallets.find(w => String(w.id) === String(props.selectedWalletId))
  return found ? `${found.name} (${found.currency})` : t('dashboard.walletFilter.allWallets')
})

function selectWallet(id, close) {
  if (id === null) {
    emit('update:selectedWalletId', null)
  } else {
    const matched = props.wallets.find(w => String(w.id) === String(id))
    if (matched) {
      emit('update:selectedWalletId', matched.id)
    } else {
      emit('update:selectedWalletId', id)
    }
  }
  if (typeof close === 'function') close()
}
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
