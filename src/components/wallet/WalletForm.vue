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

    <CurrencyInput
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
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import CurrencyInput from '@/components/common/CurrencyInput.vue'
import { SUPPORTED_CURRENCIES } from '@/utils/currency'

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
    console.log('WalletForm: Wallet prop changed:', newWallet)
    if (newWallet) {
      // For edit mode, use currentBalance if available, fallback to initialBalance
      // const balance = newWallet.currentBalance !== undefined
      //   ? newWallet.currentBalance
      //   : newWallet.initialBalance ?? 0
      const balance = newWallet.initialBalance ?? 0

      formData.value = {
        name: newWallet.name || '',
        currency: newWallet.currency || '',
        initialBalance: balance,
      }
      console.log('WalletForm: Form data updated:', formData.value)
    } else {
      // Reset form for create mode
      formData.value = {
        name: '',
        currency: '',
        initialBalance: 0,
      }
      console.log('WalletForm: Form data reset for create mode')
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

  emit('submit', {
    name: formData.value.name.trim(),
    currency: formData.value.currency,
    initialBalance: formData.value.initialBalance || 0,
  })
}
</script>
