<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <AppInput
      id="name"
      v-model="formData.name"
      :label="$t('wallets.form.name')"
      :placeholder="$t('wallets.form.namePlaceholder')"
      required
      :error="errors.name"
      @blur="validateField('name')"
    />

    <div>
      <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ $t('wallets.form.currency') }} <span class="text-red-500">*</span>
      </label>
      <select
        id="currency"
        v-model="formData.currency"
        class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100"
        required
        @blur="validateField('currency')"
      >
        <option value="">{{ $t('wallets.form.selectCurrency') }}</option>
        <option v-for="curr in currencies" :key="curr.value" :value="curr.value">
          {{ curr.label }}
        </option>
      </select>
      <p v-if="errors.currency" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.currency }}</p>
    </div>

    <!-- Balance Locked Warning (Only in edit mode with transactions) -->
    <div v-if="isEditMode && hasTransactions" class="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 rounded-lg bg-amber-100 p-2 dark:bg-amber-900/40">
          <LockClosedIcon class="size-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-amber-900 dark:text-amber-100">
            {{ $t('wallets.form.balanceLocked') }}
          </p>
          <p class="mt-1 text-xs text-amber-700 dark:text-amber-300">
            {{ $t('wallets.form.balanceLockedDescSimple') }}
          </p>
          <div class="mt-3 flex items-center gap-2">
            <div class="flex-1">
              <p class="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                {{ $t('wallets.form.currentBalance') }}
              </p>
              <p class="text-lg font-bold text-amber-900 dark:text-amber-100">
                {{ formatCurrency(formData.initialBalance) }}
              </p>
            </div>
          </div>
          <p class="mt-3 text-xs text-amber-600 dark:text-amber-400">
            💡 {{ $t('wallets.form.balanceAdjustmentHint') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Balance Input (Create mode OR Edit mode without transactions) -->
    <CurrencyInput
      v-if="!isEditMode || (isEditMode && !hasTransactions)"
      id="initialBalance"
      v-model="formData.initialBalance"
      :label="isEditMode ? $t('wallets.form.balance') : $t('wallets.form.initialBalance')"
      :placeholder="$t('wallets.form.balancePlaceholder')"
      :hint="isEditMode ? $t('wallets.form.balanceHint') : $t('wallets.form.initialBalanceHint')"
      :error="errors.initialBalance"
      @blur="validateField('initialBalance')"
    />

    <!-- Action Buttons -->
    <div class="flex gap-2 md:gap-3 pt-4">
      <AppButton type="submit" :loading="loading" class="flex-1 !py-2 md:!py-2.5 !text-xs md:!text-sm">
        {{ loading ? $t('wallets.form.saving') : $t('wallets.form.save') }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="flex-1 !py-2 md:!py-2.5 !text-xs md:!text-sm">
        {{ $t('wallets.form.cancel') }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LockClosedIcon } from '@heroicons/vue/24/outline'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import CurrencyInput from '@/components/common/CurrencyInput.vue'
import { SUPPORTED_CURRENCIES, formatCurrency } from '@/utils/currency'

const { t } = useI18n()

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
const isEditMode = computed(() => !!props.wallet)

// Check if wallet has transactions
// Strategy: If currentBalance != initialBalance, then wallet has been used for transactions
const hasTransactions = computed(() => {
  if (!props.wallet) return false

  const initial = props.wallet.initialBalance || 0
  const current = props.wallet.currentBalance || 0

  // If balances differ, wallet has transactions
  return initial !== current
})

const transactionCount = computed(() => {
  // Since API doesn't return count, we show a generic message
  // or we could make an API call to get transaction count
  return hasTransactions.value ? '?' : 0
})

const formData = ref({
  name: '',
  currency: '',
  initialBalance: 0,
})

const errors = ref({})
const hasAttemptedSubmit = ref(false)
const touchedFields = ref(new Set())

// Watch for wallet prop changes and update form data
watch(
  () => props.wallet,
  (newWallet) => {
    if (newWallet) {
      // For edit mode, use currentBalance (actual balance from transactions)
      // This ensures we show the real-time balance
      const balance = newWallet.currentBalance !== undefined
        ? newWallet.currentBalance
        : newWallet.initialBalance ?? 0

      formData.value = {
        name: newWallet.name || '',
        currency: newWallet.currency || '',
        initialBalance: balance,
      }
    } else {
      // Reset form for create mode
      formData.value = {
        name: '',
        currency: '',
        initialBalance: 0,
      }
    }
  },
  { immediate: true, deep: true }
)

function validateField(fieldName) {
  // Only validate on blur if user has attempted submit OR field was previously touched
  if (!hasAttemptedSubmit.value && !touchedFields.value.has(fieldName)) {
    return
  }

  // Mark field as touched
  touchedFields.value.add(fieldName)

  // Clear previous error for this field
  if (errors.value[fieldName]) {
    delete errors.value[fieldName]
  }

  // Validate specific field
  if (fieldName === 'name' && !formData.value.name?.trim()) {
    errors.value.name = t('wallets.form.nameRequired')
  } else if (fieldName === 'currency' && !formData.value.currency) {
    errors.value.currency = t('wallets.form.currencyRequired')
  }
}

function validateForm() {
  const newErrors = {}

  if (!formData.value.name?.trim()) {
    newErrors.name = t('wallets.form.nameRequired')
  }

  if (!formData.value.currency) {
    newErrors.currency = t('wallets.form.currencyRequired')
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

function onSubmit() {
  hasAttemptedSubmit.value = true

  if (!validateForm()) return

  const submitData = {
    name: formData.value.name.trim(),
    currency: formData.value.currency,
  }

  // Only include initialBalance if wallet has no transactions
  // This prevents overwriting calculated balance
  if (!hasTransactions.value) {
    submitData.initialBalance = formData.value.initialBalance || 0
  }

  emit('submit', submitData)
}
</script>
