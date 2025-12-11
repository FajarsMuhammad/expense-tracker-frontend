<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Type Toggle -->
    <div>
      <label class="block text-sm font-medium mb-2">
        {{ $t('transactions.form.type') }} <span class="text-red-500">*</span>
      </label>
      <div class="flex gap-3">
        <button
          type="button"
          @click="setType('INCOME')"
          :disabled="isEditMode"
          class="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300"
          :class="formData.type === 'INCOME'
            ? 'bg-income text-white shadow-lg'
            : 'bg-neutral-100 dark:bg-dark-card text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-surface'"
        >
          + {{ $t('transactions.income') }}
        </button>
        <button
          type="button"
          @click="setType('EXPENSE')"
          :disabled="isEditMode"
          class="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300"
          :class="formData.type === 'EXPENSE'
            ? 'bg-expense text-white shadow-lg'
            : 'bg-neutral-100 dark:bg-dark-card text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-surface'"
        >
          - {{ $t('transactions.expense') }}
        </button>
      </div>
      <p v-if="isEditMode" class="mt-1 text-xs text-muted">
        {{ $t('transactions.form.typeCannotChange') }}
      </p>
      <p v-if="errors.type" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.type }}</p>
    </div>

    <!-- Wallet Selector (custom dropdown) -->
    <div>
      <label for="wallet" class="block text-sm font-medium mb-1">
        {{ $t('transactions.form.wallet') }} <span class="text-red-500">*</span>
      </label>

      <DropdownBase class="relative">
        <!-- Trigger: destructure slot props here -->
        <template #trigger="{ toggle, isOpen }">
          <button
            type="button"
            @click.stop="toggle"
            :aria-expanded="String(isOpen)"
            class="w-full flex items-center justify-between px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-500"
            id="wallet-dropdown"
          >
            <span class="truncate">
              {{ walletLabel }}
            </span>
            <svg class="w-4 h-4 text-neutral-500 ml-2" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
            </svg>
          </button>
        </template>

        <!-- Menu: destructure slot props here -->
        <template #menu="{ close }">
          <div
            class="mt-2 w-full bg-surface-card border border-surface rounded-lg shadow-surface-lg z-50 p-2"
            role="menu"
            aria-labelledby="wallet-dropdown"
            @click.stop
          >
            <!-- optional search -->
            <div class="px-2 pb-2">
              <input
                v-model="walletQuery"
                type="search"
                :placeholder="$t('transactions.form.walletPlaceholder')"
                class="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="max-h-44 overflow-auto">
              <button
                class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-muted"
                :class="!formData.walletId ? 'font-medium' : ''"
                @click.stop.prevent="selectWallet('', close)"
              >
                {{ $t('transactions.form.selectWallet') }}
              </button>

              <template v-for="wallet in filteredWallets" :key="wallet.id">
                <button
                  class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-muted flex items-center justify-between"
                  @click.stop.prevent="selectWallet(wallet.id, close)"
                >
                  <span class="truncate">{{ wallet.name }} ({{ wallet.currency }})</span>
                  <span class="text-xs text-muted">{{ wallet.balance !== undefined ? formatCurrency(wallet.balance, wallet.currency) : '' }}</span>
                </button>
              </template>

              <div v-if="filteredWallets.length === 0" class="px-3 py-2 text-sm text-muted">{{ $t('transactions.form.noWalletsFound') }}</div>
            </div>
          </div>
        </template>
      </DropdownBase>

      <p v-if="errors.walletId" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.walletId }}</p>
    </div>

    <!-- Category Selector (custom dropdown) -->
    <div>
      <label for="category" class="block text-sm font-medium mb-1">
        {{ $t('transactions.form.category') }} <span class="text-red-500">*</span>
      </label>

      <DropdownBase class="relative">
        <template #trigger="{ toggle, isOpen }">
          <button
            type="button"
            @click.stop="toggle"
            :disabled="!formData.type"
            :aria-expanded="String(isOpen)"
            class="w-full flex items-center justify-between px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
            id="category-dropdown"
            :aria-disabled="String(!formData.type)"
          >
            <span class="truncate">
              {{ categoryLabel }}
            </span>
            <svg class="w-4 h-4 text-neutral-500 ml-2" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
            </svg>
          </button>
        </template>

        <template #menu="{ close }">
          <div
            class="mt-2 w-full bg-surface-card border border-surface rounded-lg shadow-surface-lg z-50 p-2"
            role="menu"
            aria-labelledby="category-dropdown"
            @click.stop
          >
            <!-- optional search -->
            <div class="px-2 pb-2">
              <input
                v-model="categoryQuery"
                type="search"
                :placeholder="$t('transactions.form.categoryPlaceholder')"
                class="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                :disabled="!formData.type"
              />
            </div>

            <div class="max-h-44 overflow-auto">
              <button
                class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-muted"
                :class="!formData.categoryId ? 'font-medium' : ''"
                @click.stop.prevent="selectCategory('', close)"
              >
                {{ $t('transactions.form.selectCategory') }}
              </button>

              <template v-for="category in filteredCategoriesByQuery" :key="category.id">
                <button
                  class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-muted flex items-center gap-2"
                  @click.stop.prevent="selectCategory(category.id, close)"
                >
                  <span class="truncate">{{ category.name }}</span>
                  <span class="ml-auto text-xs text-muted">{{ category.type }}</span>
                </button>
              </template>

              <div v-if="filteredCategoriesByQuery.length === 0" class="px-3 py-2 text-sm text-muted">{{ $t('transactions.form.noCategories') }}</div>
            </div>
          </div>
        </template>
      </DropdownBase>

      <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.categoryId }}</p>
    </div>

    <!-- Amount Input -->
    <CurrencyInput
      id="amount"
      v-model="formData.amount"
      :label="$t('transactions.form.amount')"
      placeholder="0"
      required
      :min="1"
      :error="errors.amount"
    />

    <!-- Date Input -->
    <div>
      <label for="date" class="block text-sm font-medium mb-1">
        {{ $t('transactions.form.date') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="date"
        v-model="formData.date"
        type="date"
        :max="maxDate"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        required
      />
      <p v-if="errors.date" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.date }}</p>
    </div>

    <!-- Note Textarea -->
    <div>
      <label for="note" class="block text-sm font-medium mb-1">
        {{ $t('transactions.form.note') }} <span class="text-muted">{{ $t('transactions.form.noteOptional') }}</span>
      </label>
      <textarea
        id="note"
        v-model="formData.note"
        maxlength="500"
        rows="3"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface resize-none"
        :placeholder="$t('transactions.form.notePlaceholder')"
      />
      <p class="mt-1 text-xs text-muted text-right">{{ $t('transactions.form.charactersCount', { count: formData.note?.length || 0 }) }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 md:gap-3 pt-4">
      <AppButton type="submit" :loading="loading" class="flex-1 !py-2 md:!py-2.5 !text-xs md:!text-sm">
        {{ loading ? $t('transactions.form.saving') : $t('transactions.form.save') }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="flex-1 !py-2 md:!py-2.5 !text-xs md:!text-sm">
        {{ $t('transactions.form.cancel') }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import DropdownBase from '@/components/common/DropdownBase.vue'
import CurrencyInput from '@/components/common/CurrencyInput.vue'

const { t: $t } = useI18n()

const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  wallets: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = computed(() => !!props.transaction)

// Get today's date in YYYY-MM-DD format for max date
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Form state
const formData = ref({
  type: '',
  walletId: '',
  categoryId: '',
  amount: null,
  date: '',
  note: '',
})

const errors = ref({})

// small search queries for dropdowns
const walletQuery = ref('')
const categoryQuery = ref('')

// Filter categories based on selected type
const filteredCategories = computed(() => {
  if (!formData.value.type) return []
  return props.categories.filter(c => c.type === formData.value.type)
})

// used by dropdown search
const filteredWallets = computed(() => {
  if (!walletQuery.value) return props.wallets
  const q = walletQuery.value.toLowerCase()
  return props.wallets.filter(w => (w.name || '').toLowerCase().includes(q) || (w.currency || '').toLowerCase().includes(q))
})

const filteredCategoriesByQuery = computed(() => {
  const base = filteredCategories.value
  if (!categoryQuery.value) return base
  const q = categoryQuery.value.toLowerCase()
  return base.filter(c => (c.name || '').toLowerCase().includes(q))
})

// Labels for triggers
const walletLabel = computed(() => {
  if (!formData.value.walletId) return $t('transactions.form.selectWallet')
  const w = props.wallets.find(x => x.id === formData.value.walletId)
  return w ? `${w.name} (${w.currency})` : $t('transactions.form.selectWallet')
})
const categoryLabel = computed(() => {
  if (!formData.value.categoryId) return formData.value.type ? $t('transactions.form.selectCategory') : $t('transactions.form.selectTypeFirst')
  const c = props.categories.find(x => x.id === formData.value.categoryId)
  return c ? c.name : (formData.value.type ? $t('transactions.form.selectCategory') : $t('transactions.form.selectTypeFirst'))
})

// Initialize form with transaction data if in edit mode
watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      // Convert date from ISO to YYYY-MM-DD for date input
      const dateObj = new Date(newTransaction.date)
      const dateStr = dateObj.toISOString().split('T')[0]

      formData.value = {
        type: newTransaction.type || '',
        walletId: newTransaction.walletId || '',
        categoryId: newTransaction.categoryId || '',
        amount: newTransaction.amount || null,
        date: dateStr,
        note: newTransaction.note || '',
      }
    } else {
      // Reset form for create mode, set today's date as default
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      formData.value = {
        type: '',
        walletId: '',
        categoryId: '',
        amount: null,
        date: todayStr,
        note: '',
      }
    }
  },
  { immediate: true }
)

// Watch type changes and reset category if it's no longer valid
watch(() => formData.value.type, (newType, oldType) => {
  if (newType !== oldType && formData.value.categoryId) {
    const categoryStillValid = filteredCategories.value.some(c => c.id === formData.value.categoryId)
    if (!categoryStillValid) {
      formData.value.categoryId = ''
    }
  }
})

function setType(type) {
  if (!isEditMode.value) {
    formData.value.type = type
  }
}

function selectWallet(id, close) {
  formData.value.walletId = id || ''
  if (typeof close === 'function') close()
}

function selectCategory(id, close) {
  formData.value.categoryId = id || ''
  if (typeof close === 'function') close()
}

function formatCurrency(amount = 0, currency = '') {
  try {
    // simple formatting, adapt to your needs / i18n
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(amount)
  } catch (e) {
    return amount
  }
}

function validateForm() {
  errors.value = {}

  if (!formData.value.type) {
    errors.value.type = 'Please select transaction type'
  }

  if (!formData.value.walletId) {
    errors.value.walletId = 'Please select a wallet'
  }

  if (!formData.value.categoryId) {
    errors.value.categoryId = 'Please select a category'
  }

  if (!formData.value.amount || formData.value.amount <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
  }

  if (!formData.value.date) {
    errors.value.date = 'Please select a date'
  }

  return Object.keys(errors.value).length === 0
}

function onSubmit() {
  if (!validateForm()) return

  const [year, month, day] = formData.value.date.split('-').map(Number)
  const dateObj = new Date()
  dateObj.setFullYear(year, month - 1, day)

  const isoDate = dateObj.toISOString()

  emit('submit', {
    walletId: formData.value.walletId,
    categoryId: formData.value.categoryId,
    type: formData.value.type,
    amount: formData.value.amount,
    date: isoDate,
    note: formData.value.note?.trim() || undefined,
  })
}
</script>

<style scoped>
/* small tweaks for dropdown content */
.bg-surface-card { background-color: var(--surface-card); }
.border-surface { border-color: var(--border); }
.shadow-surface-lg { box-shadow: var(--shadow-soft-lg); }

/* transition used by DropdownBase; make sure names match your DropdownBase transitions */
.fade-scale-enter-from { opacity: 0; transform: scale(0.98) translateY(-6px); }
.fade-scale-enter-to { opacity: 1; transform: scale(1) translateY(0); }
.fade-scale-leave-from { opacity: 1; transform: scale(1) translateY(0); }
.fade-scale-leave-to { opacity: 0; transform: scale(0.98) translateY(-6px); }
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 140ms ease; }
</style>
