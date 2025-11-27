# Phase 2: Wallet Management

**Duration:** 2 weeks (Week 3-4)
**Status:** Ready to start after Phase 1
**Dependencies:** Phase 1 (Authentication must be complete)

---

## Overview

This phase implements complete wallet CRUD operations with currency support. Users will be able to create, view, edit, and delete wallets with support for 7 currencies. Free users are limited to 1 wallet.

---

## Week Breakdown

### Week 3: Wallet CRUD
- **Day 1:** Wallet store and service
- **Day 2:** Wallet list view with cards
- **Day 3:** Create wallet form with currency selector
- **Day 4:** Wallet detail view
- **Day 5:** Edit wallet functionality

### Week 4: Wallet Polish
- **Day 1:** Delete wallet with confirmation
- **Day 2:** Free user limitation (1 wallet max)
- **Day 3:** Currency formatting utilities
- **Day 4:** Loading states and error handling
- **Day 5:** Wallet empty state, testing

---

## Deliverables

- ✅ Complete wallet CRUD operations
- ✅ Currency selection (7 currencies: IDR, USD, EUR, GBP, JPY, SGD, MYR)
- ✅ Free user limit enforcement
- ✅ Proper error handling
- ✅ Loading states and empty states

---

## Implementation Checklist

### 1. Wallet Service

- [x] Create src/services/wallet.service.js
- [x] Implement getAllWallets method
- [x] Implement getWalletById method
- [x] Implement createWallet method
- [x] Implement updateWallet method
- [x] Implement deleteWallet method

**`src/services/wallet.service.js`**

```javascript
import api from './api'

export default {
  async getAllWallets() {
    const response = await api.get('/wallets')
    return response.data
  },

  async getWalletById(id) {
    const response = await api.get(`/wallets/${id}`)
    return response.data
  },

  async createWallet(walletData) {
    const response = await api.post('/wallets', walletData)
    return response.data
  },

  async updateWallet(id, walletData) {
    const response = await api.put(`/wallets/${id}`, walletData)
    return response.data
  },

  async deleteWallet(id) {
    const response = await api.delete(`/wallets/${id}`)
    return response.data
  },
}
```

### 2. Wallet Store

- [x] Create src/stores/wallet.js
- [x] Add wallets array state
- [x] Add loading and error states
- [x] Implement fetchWallets action
- [x] Implement fetchWalletById action
- [x] Implement createWallet action
- [x] Implement updateWallet action
- [x] Implement deleteWallet action
- [x] Add computed properties (totalBalance, walletCount, canCreateWallet)

**`src/stores/wallet.js`**

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import walletService from '@/services/wallet.service'
import { useAuthStore } from './auth'

export const useWalletStore = defineStore('wallet', () => {
  const wallets = ref([])
  const currentWallet = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const walletCount = computed(() => wallets.value.length)

  const totalBalance = computed(() => {
    return wallets.value.reduce((sum, wallet) => sum + wallet.balance, 0)
  })

  const canCreateWallet = computed(() => {
    const authStore = useAuthStore()
    const isPremium = authStore.user?.subscriptionPlan === 'PREMIUM'
    return isPremium || walletCount.value < 1
  })

  async function fetchWallets() {
    loading.value = true
    error.value = null
    try {
      const data = await walletService.getAllWallets()
      wallets.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchWalletById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await walletService.getWalletById(id)
      currentWallet.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createWallet(walletData) {
    loading.value = true
    error.value = null
    try {
      const data = await walletService.createWallet(walletData)
      wallets.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateWallet(id, walletData) {
    loading.value = true
    error.value = null
    try {
      const data = await walletService.updateWallet(id, walletData)
      const index = wallets.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        wallets.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteWallet(id) {
    loading.value = true
    error.value = null
    try {
      await walletService.deleteWallet(id)
      wallets.value = wallets.value.filter((w) => w.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    wallets,
    currentWallet,
    loading,
    error,
    walletCount,
    totalBalance,
    canCreateWallet,
    fetchWallets,
    fetchWalletById,
    createWallet,
    updateWallet,
    deleteWallet,
  }
})
```

### 3. Wallet Composable

- [x] Create src/composables/useWallet.js
- [x] Implement loadWallets function
- [x] Implement loadWallet function
- [x] Implement handleCreateWallet function
- [x] Implement handleUpdateWallet function
- [x] Implement handleDeleteWallet function
- [x] Add toast notifications for success/error

**`src/composables/useWallet.js`**

```javascript
import { useWalletStore } from '@/stores/wallet'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'

export function useWallet() {
  const walletStore = useWalletStore()
  const uiStore = useUIStore()
  const router = useRouter()

  async function loadWallets() {
    try {
      await walletStore.fetchWallets()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load wallets', type: 'error' })
    }
  }

  async function loadWallet(id) {
    try {
      await walletStore.fetchWalletById(id)
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load wallet', type: 'error' })
      router.push('/wallets')
    }
  }

  async function handleCreateWallet(walletData) {
    try {
      if (!walletStore.canCreateWallet) {
        uiStore.showToast({
          message: 'Free users can only create 1 wallet. Upgrade to Premium for unlimited wallets.',
          type: 'warning',
        })
        return
      }

      await walletStore.createWallet(walletData)
      uiStore.showToast({ message: 'Wallet created successfully!', type: 'success' })
      router.push('/wallets')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdateWallet(id, walletData) {
    try {
      await walletStore.updateWallet(id, walletData)
      uiStore.showToast({ message: 'Wallet updated successfully!', type: 'success' })
      router.push('/wallets')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteWallet(id) {
    try {
      await walletStore.deleteWallet(id)
      uiStore.showToast({ message: 'Wallet deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  return {
    wallets: walletStore.wallets,
    currentWallet: walletStore.currentWallet,
    loading: walletStore.loading,
    canCreateWallet: walletStore.canCreateWallet,
    walletCount: walletStore.walletCount,
    loadWallets,
    loadWallet,
    handleCreateWallet,
    handleUpdateWallet,
    handleDeleteWallet,
  }
}
```

### 4. Currency Utilities

- [x] Create src/utils/currency.js
- [x] Add CURRENCY_FORMATS constant
- [x] Add SUPPORTED_CURRENCIES constant
- [x] Implement formatCurrency function
- [x] Test with different currencies

**`src/utils/currency.js`**

```javascript
const CURRENCY_FORMATS = {
  IDR: { locale: 'id-ID', symbol: 'Rp', decimals: 2 },
  USD: { locale: 'en-US', symbol: '$', decimals: 2 },
  EUR: { locale: 'de-DE', symbol: '€', decimals: 2 },
  GBP: { locale: 'en-GB', symbol: '£', decimals: 2 },
  JPY: { locale: 'ja-JP', symbol: '¥', decimals: 0 },
  SGD: { locale: 'en-SG', symbol: 'S$', decimals: 2 },
  MYR: { locale: 'ms-MY', symbol: 'RM', decimals: 2 },
}

export function formatCurrency(amount, currency = 'IDR') {
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.IDR
  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: format.decimals,
    maximumFractionDigits: format.decimals,
  }).format(amount)
}

export const SUPPORTED_CURRENCIES = [
  { value: 'IDR', label: 'Indonesian Rupiah (Rp)', symbol: 'Rp' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
  { value: 'MYR', label: 'Malaysian Ringgit (RM)', symbol: 'RM' },
]

export function getCurrencySymbol(currency) {
  const curr = SUPPORTED_CURRENCIES.find((c) => c.value === currency)
  return curr?.symbol || ''
}
```

---

## Component Implementation

### 5. WalletCard Component

- [x] Create src/components/wallet/WalletCard.vue
- [x] Display wallet name and balance
- [x] Display currency with proper formatting
- [x] Add action buttons (view, edit, delete)
- [x] Add hover effects
- [x] Add responsive design

**`src/components/wallet/WalletCard.vue`**

```vue
<template>
  <AppCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$emit('view', wallet)">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ wallet.name }}</h3>
        <p class="text-sm text-gray-500">{{ wallet.currency }}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold" :class="balanceColor">
          {{ formattedBalance }}
        </p>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <AppButton size="sm" variant="secondary" @click.stop="$emit('edit', wallet)">
        Edit
      </AppButton>
      <AppButton size="sm" variant="danger" @click.stop="$emit('delete', wallet)">
        Delete
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  wallet: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'edit', 'delete'])

const formattedBalance = computed(() => {
  return formatCurrency(props.wallet.balance, props.wallet.currency)
})

const balanceColor = computed(() => {
  return props.wallet.balance >= 0 ? 'text-green-600' : 'text-red-600'
})
</script>
```

### 6. WalletForm Component

- [x] Create src/components/wallet/WalletForm.vue
- [x] Add name input field
- [x] Add currency selector dropdown
- [x] Add initial balance input (optional)
- [x] Add form validation
- [x] Add submit and cancel buttons
- [x] Support both create and edit modes

**`src/components/wallet/WalletForm.vue`**

```vue
<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <AppInput
      id="name"
      v-model="formData.name"
      label="Wallet Name"
      placeholder="e.g., Cash Wallet, Bank Account"
      required
      :error="errors.name"
    />

    <div>
      <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">
        Currency <span class="text-red-500">*</span>
      </label>
      <select
        id="currency"
        v-model="formData.currency"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
      >
        <option value="">Select currency</option>
        <option v-for="curr in currencies" :key="curr.value" :value="curr.value">
          {{ curr.label }}
        </option>
      </select>
      <p v-if="errors.currency" class="mt-1 text-sm text-red-600">{{ errors.currency }}</p>
    </div>

    <AppInput
      id="initialBalance"
      v-model.number="formData.initialBalance"
      type="number"
      step="0.01"
      label="Initial Balance"
      placeholder="0.00"
      hint="Optional: Leave blank for 0 balance"
      :error="errors.initialBalance"
    />

    <div class="flex gap-3 pt-4">
      <AppButton type="submit" :loading="loading" full-width>
        {{ isEditMode ? 'Update Wallet' : 'Create Wallet' }}
      </AppButton>
      <AppButton type="button" variant="secondary" full-width @click="$emit('cancel')">
        Cancel
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { SUPPORTED_CURRENCIES } from '@/utils/currency'

const props = defineProps({
  wallet: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const currencies = SUPPORTED_CURRENCIES
const isEditMode = !!props.wallet

const formData = ref({
  name: '',
  currency: '',
  initialBalance: 0,
})

const errors = ref({})

onMounted(() => {
  if (props.wallet) {
    formData.value = {
      name: props.wallet.name,
      currency: props.wallet.currency,
      initialBalance: props.wallet.balance || 0,
    }
  }
})

function validateForm() {
  errors.value = {}

  if (!formData.value.name?.trim()) {
    errors.value.name = 'Wallet name is required'
  }

  if (!formData.value.currency) {
    errors.value.currency = 'Please select a currency'
  }

  return Object.keys(errors.value).length === 0
}

function onSubmit() {
  if (!validateForm()) return

  emit('submit', {
    name: formData.value.name.trim(),
    currency: formData.value.currency,
    initialBalance: formData.value.initialBalance || 0,
  })
}
</script>
```

### 7. CurrencySelector Component

- [ ] Create src/components/wallet/CurrencySelector.vue
- [ ] Display all supported currencies
- [ ] Show currency symbol and name
- [ ] Add search/filter functionality
- [ ] Make it reusable

**`src/components/wallet/CurrencySelector.vue`**

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      :class="error ? 'border-red-300' : 'border-gray-300'"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="currency in currencies" :key="currency.value" :value="currency.value">
        {{ currency.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { SUPPORTED_CURRENCIES } from '@/utils/currency'

defineProps({
  id: String,
  modelValue: String,
  label: { type: String, default: 'Currency' },
  placeholder: { type: String, default: 'Select currency' },
  required: Boolean,
  error: String,
})

defineEmits(['update:modelValue'])

const currencies = SUPPORTED_CURRENCIES
</script>
```

---

## View Implementation

### 8. WalletListView

- [x] Create src/views/wallet/WalletListView.vue
- [x] Fetch and display all wallets
- [x] Show wallet cards in grid layout
- [x] Add "Create Wallet" button
- [x] Handle empty state (no wallets)
- [x] Add loading state
- [x] Implement delete confirmation modal

**`src/views/wallet/WalletListView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">My Wallets</h1>
        <AppButton
          v-if="canCreateWallet"
          @click="$router.push('/wallets/create')"
        >
          + Create Wallet
        </AppButton>
        <div v-else>
          <p class="text-sm text-gray-600">
            Free users can only have 1 wallet.
            <router-link to="/premium" class="text-primary-600 hover:underline">
              Upgrade to Premium
            </router-link>
          </p>
        </div>
      </div>

      <AppSkeleton v-if="loading" count="3" />

      <AppEmpty
        v-else-if="!loading && wallets.length === 0"
        title="No Wallets Yet"
        description="Create your first wallet to start tracking your expenses"
      >
        <AppButton @click="$router.push('/wallets/create')">
          Create Your First Wallet
        </AppButton>
      </AppEmpty>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WalletCard
          v-for="wallet in wallets"
          :key="wallet.id"
          :wallet="wallet"
          @view="viewWallet"
          @edit="editWallet"
          @delete="confirmDelete"
        />
      </div>

      <AppModal v-model="showDeleteModal" title="Delete Wallet">
        <p class="text-gray-600">
          Are you sure you want to delete "{{ walletToDelete?.name }}"? This action cannot be undone.
        </p>
        <template #footer>
          <div class="flex gap-3">
            <AppButton variant="danger" :loading="loading" @click="handleDelete">
              Delete
            </AppButton>
            <AppButton variant="secondary" @click="showDeleteModal = false">
              Cancel
            </AppButton>
          </div>
        </template>
      </AppModal>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import WalletCard from '@/components/wallet/WalletCard.vue'
import { useWallet } from '@/composables/useWallet'

const router = useRouter()
const { wallets, loading, canCreateWallet, loadWallets, handleDeleteWallet } = useWallet()

const showDeleteModal = ref(false)
const walletToDelete = ref(null)

onMounted(() => {
  loadWallets()
})

function viewWallet(wallet) {
  router.push(`/wallets/${wallet.id}`)
}

function editWallet(wallet) {
  router.push(`/wallets/${wallet.id}/edit`)
}

function confirmDelete(wallet) {
  walletToDelete.value = wallet
  showDeleteModal.value = true
}

async function handleDelete() {
  if (walletToDelete.value) {
    await handleDeleteWallet(walletToDelete.value.id)
    showDeleteModal.value = false
    walletToDelete.value = null
  }
}
</script>
```

### 9. WalletCreateView

- [x] Create src/views/wallet/WalletCreateView.vue
- [x] Display WalletForm component
- [x] Handle form submission
- [x] Check user wallet limit before creating
- [x] Redirect to wallet list on success

**`src/views/wallet/WalletCreateView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Wallet</h1>

      <AppCard>
        <WalletForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/wallets')"
        />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import WalletForm from '@/components/wallet/WalletForm.vue'
import { useWallet } from '@/composables/useWallet'

const { loading, handleCreateWallet } = useWallet()

async function handleSubmit(walletData) {
  await handleCreateWallet(walletData)
}
</script>
```

### 10. WalletEditView

- [x] Create src/views/wallet/WalletEditView.vue
- [x] Load wallet data by ID
- [x] Display WalletForm with pre-filled data
- [x] Handle form submission
- [x] Redirect to wallet list on success

**`src/views/wallet/WalletEditView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Edit Wallet</h1>

      <AppSkeleton v-if="loading" count="1" />

      <AppCard v-else-if="currentWallet">
        <WalletForm
          :wallet="currentWallet"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/wallets')"
        />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import WalletForm from '@/components/wallet/WalletForm.vue'
import { useWallet } from '@/composables/useWallet'

const route = useRoute()
const { currentWallet, loading, loadWallet, handleUpdateWallet } = useWallet()

onMounted(() => {
  loadWallet(route.params.id)
})

async function handleSubmit(walletData) {
  await handleUpdateWallet(route.params.id, walletData)
}
</script>
```

---

## Router Updates

### 11. Add Wallet Routes

- [x] Add wallet routes to src/router/index.js
- [x] Add route protection (requiresAuth)
- [x] Test navigation between routes

**Add to `src/router/index.js`:**

```javascript
{
  path: '/wallets',
  name: 'WalletList',
  component: () => import('@/views/wallet/WalletListView.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/wallets/create',
  name: 'WalletCreate',
  component: () => import('@/views/wallet/WalletCreateView.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/wallets/:id',
  name: 'WalletDetail',
  component: () => import('@/views/wallet/WalletDetailView.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/wallets/:id/edit',
  name: 'WalletEdit',
  component: () => import('@/views/wallet/WalletEditView.vue'),
  meta: { requiresAuth: true },
},
```

---

## Additional Components Needed

### 12. AppModal Component

- [x] Create src/components/common/AppModal.vue
- [x] Add overlay and modal container
- [x] Add header, body, footer slots
- [x] Add close button
- [x] Handle ESC key to close
- [x] Add v-model support for visibility

**`src/components/common/AppModal.vue`**

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="close"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                <slot name="title">{{ title }}</slot>
              </h3>
              <button
                class="text-gray-400 hover:text-gray-600 transition-colors"
                @click="close"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="px-6 py-4">
            <slot />
          </div>

          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
```

### 13. AppSkeleton Component

- [x] Create src/components/common/AppSkeleton.vue
- [x] Add animated loading effect
- [x] Support count prop for multiple skeletons
- [x] Support height prop

**`src/components/common/AppSkeleton.vue`**

```vue
<template>
  <div class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="animate-pulse bg-gray-200 rounded-lg"
      :style="{ height: height }"
    />
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 1 },
  height: { type: String, default: '100px' },
})
</script>
```

### 14. AppEmpty Component

- [x] Create src/components/common/AppEmpty.vue
- [x] Display empty state icon
- [x] Display title and description
- [x] Add default slot for action buttons

**`src/components/common/AppEmpty.vue`**

```vue
<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <svg
      class="w-24 h-24 text-gray-300 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 text-center mb-6 max-w-sm">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: String,
})
</script>
```

---

## Testing Checklist

- [ ] Wallet list page displays all user wallets
- [ ] Create wallet form validation works
- [ ] Create wallet API call successful
- [ ] Currency formatting displays correctly for all 7 currencies
- [ ] Edit wallet loads existing data
- [ ] Edit wallet updates successfully
- [ ] Delete wallet shows confirmation modal
- [ ] Delete wallet API call successful
- [ ] Free user limit enforced (max 1 wallet)
- [ ] Premium users can create unlimited wallets
- [ ] Loading states display correctly
- [ ] Empty state displays when no wallets
- [ ] Error messages display for failed operations
- [ ] All routes navigate correctly
- [ ] Mobile responsiveness working

---

## Next Phase

**Phase 3: Dashboard** - See `phase_3_dashboard.md`

---

## References

- Main Plan: `frontend_plan.md`
- Phase 1: `phase_1_foundation_auth.md`
- Currency Utility Documentation: src/utils/currency.js
