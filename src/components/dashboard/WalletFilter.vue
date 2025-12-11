<template>
  <div>
    <label for="wallet-filter" class="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
      {{ $t('dashboard.walletFilter.label') }}
    </label>
    <DropdownBase class="relative">
      <template #trigger="{ toggle, isOpen }">
        <button
          id="wallet-filter"
          type="button"
          @click.stop="toggle"
          :aria-expanded="String(isOpen)"
          class="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-dark-card border border-neutral-300 dark:border-dark-border rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
        >
          <span class="truncate">{{ selectedLabel }}</span>
          <svg class="w-4 h-4 text-neutral-500 ml-2" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
          </svg>
        </button>
      </template>

      <template #menu="{ close }">
        <div
          class="mt-2 w-full bg-surface-card border border-surface rounded-lg shadow-surface-lg z-50 p-2"
          role="menu"
          aria-labelledby="wallet-filter"
          @click.stop
        >
          <!-- optional search -->
          <div class="px-2 pb-2">
            <input
              v-model="walletQuery"
              type="search"
              :placeholder="$t('dashboard.walletFilter.searchPlaceholder')"
              class="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div class="max-h-44 overflow-auto">
            <!-- All Wallets option -->
            <button
              class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-muted"
              :class="selectedWalletId === null ? 'font-medium' : ''"
              @click.stop.prevent="selectWallet(null, close)"
            >
              {{ $t('dashboard.walletFilter.allWallets') }}
            </button>

            <template v-for="wallet in filteredWallets" :key="wallet.id">
              <button
                class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-muted flex items-center justify-between"
                @click.stop.prevent="selectWallet(wallet.id, close)"
              >
                <span class="truncate">{{ wallet.name }} ({{ wallet.currency }})</span>
                <span class="text-xs text-muted" v-if="wallet.balance !== undefined">{{ formatCurrency(wallet.balance, wallet.currency) }}</span>
              </button>
            </template>

            <div v-if="filteredWallets.length === 0" class="px-3 py-2 text-sm text-muted">{{ $t('dashboard.walletFilter.noWalletsFound') }}</div>
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

const { t } = useI18n()

const props = defineProps({
  wallets: {
    type: Array,
    required: true,
  },
  // allow null, string or number
  selectedWalletId: {
    type: [String, Number, null],
    default: null,
  },
})

const emit = defineEmits(['update:selectedWalletId'])

const walletQuery = ref('')

// filter wallets by query
const filteredWallets = computed(() => {
  const q = walletQuery.value.trim().toLowerCase()
  if (!q) return props.wallets
  return props.wallets.filter(w =>
    (w.name || '').toLowerCase().includes(q) ||
    (w.currency || '').toLowerCase().includes(q)
  )
})

// friendly label shown in trigger
const selectedLabel = computed(() => {
  if (props.selectedWalletId === null || props.selectedWalletId === undefined || props.selectedWalletId === '') {
    return t('dashboard.walletFilter.allWallets')
  }
  const found = props.wallets.find(w => String(w.id) === String(props.selectedWalletId))
  return found ? `${found.name} (${found.currency})` : t('dashboard.walletFilter.allWallets')
})

function selectWallet(id, close) {
  // emit the same type as wallet.id if possible
  if (id === null) {
    emit('update:selectedWalletId', null)
  } else {
    // if wallets have numeric ids, convert; otherwise keep string
    const matched = props.wallets.find(w => String(w.id) === String(id))
    if (matched) {
      emit('update:selectedWalletId', matched.id)
    } else {
      // fallback: emit raw id
      emit('update:selectedWalletId', id)
    }
  }
  if (typeof close === 'function') close()
}


function handleChange(event) {
  const value = event.target.value === '' || event.target.value === 'null' ? null : event.target.value
  emit('update:selectedWalletId', value)
}
</script>

<style scoped>
/* reuse small surface utility variables you're already using */
.bg-surface-card { background-color: var(--surface-card); }
.border-surface { border-color: var(--border); }
.shadow-surface-lg { box-shadow: var(--shadow-soft-lg); }
</style>
