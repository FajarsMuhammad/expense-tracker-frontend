<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Type Toggle -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Type <span class="text-red-500">*</span>
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
          + Income
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
          - Expense
        </button>
      </div>
      <p v-if="isEditMode" class="mt-1 text-xs text-muted">
        Transaction type cannot be changed after creation
      </p>
      <p v-if="errors.type" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.type }}</p>
    </div>

    <!-- Wallet Selector -->
    <div>
      <label for="wallet" class="block text-sm font-medium mb-1">
        Wallet <span class="text-red-500">*</span>
      </label>
      <select
        id="wallet"
        v-model="formData.walletId"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        required
      >
        <option value="">Select wallet</option>
        <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
          {{ wallet.name }} ({{ wallet.currency }})
        </option>
      </select>
      <p v-if="errors.walletId" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.walletId }}</p>
    </div>

    <!-- Category Selector -->
    <div>
      <label for="category" class="block text-sm font-medium mb-1">
        Category <span class="text-red-500">*</span>
      </label>
      <select
        id="category"
        v-model="formData.categoryId"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        :disabled="!formData.type"
        required
      >
        <option value="">{{ formData.type ? 'Select category' : 'Select type first' }}</option>
        <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.categoryId }}</p>
    </div>

    <!-- Amount Input -->
    <AppInput
      id="amount"
      v-model.number="formData.amount"
      type="number"
      step="0.01"
      min="0.01"
      label="Amount"
      placeholder="0.00"
      required
      :error="errors.amount"
    />

    <!-- Date Input -->
    <div>
      <label for="date" class="block text-sm font-medium mb-1">
        Date <span class="text-red-500">*</span>
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
        Note <span class="text-muted">(Optional)</span>
      </label>
      <textarea
        id="note"
        v-model="formData.note"
        maxlength="500"
        rows="3"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface resize-none"
        placeholder="Add a note about this transaction..."
      />
      <p class="mt-1 text-xs text-muted text-right">{{ formData.note?.length || 0 }}/500</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 pt-4">
      <AppButton type="submit" :loading="loading" class="flex-1">
        {{ isEditMode ? 'Update Transaction' : 'Create Transaction' }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="flex-1">
        Cancel
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

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

// Filter categories based on selected type
const filteredCategories = computed(() => {
  if (!formData.value.type) return []
  return props.categories.filter(c => c.type === formData.value.type)
})

const formData = ref({
  type: '',
  walletId: '',
  categoryId: '',
  amount: null,
  date: '',
  note: '',
})

const errors = ref({})

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

  // Convert date to ISO format for API
  const dateObj = new Date(formData.value.date)
  dateObj.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues
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
