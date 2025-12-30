<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Remaining Amount Info -->
    <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-blue-700 dark:text-blue-300">{{ $t('debts.paymentForm.remainingAmount') }}</p>
          <p class="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
            {{ formatCurrency(debt.remainingAmount) }}
          </p>
        </div>
        <InformationCircleIcon class="size-8 text-blue-400" />
      </div>
    </div>

    <!-- Pay Full Amount Toggle -->
    <div class="rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/30 p-4 dark:border-primary-800 dark:bg-primary-950/20">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 rounded-lg bg-primary-100 p-2 dark:bg-primary-900/40">
            <BanknotesIcon class="size-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">{{ $t('debts.paymentForm.payFullAmount') }}</p>
            <p class="text-xs text-primary-700 dark:text-primary-300">{{ $t('debts.paymentForm.payFullAmountDesc') }}</p>
          </div>
        </div>

        <!-- Toggle Switch -->
        <button
          type="button"
          @click="togglePayFullAmount"
          :class="[
            'relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            payFullAmount ? 'bg-primary-600 dark:bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'
          ]"
          role="switch"
          :aria-checked="payFullAmount"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              payFullAmount ? 'translate-x-5' : 'translate-x-0'
            ]"
          >
            <span
              :class="[
                'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                payFullAmount ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
              ]"
            >
              <svg class="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 12 12">
                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span
              :class="[
                'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                payFullAmount ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
              ]"
            >
              <svg class="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Payment Amount -->
    <CurrencyInput
      id="amount"
      v-model="formData.amount"
      :label="$t('debts.paymentForm.paymentAmount')"
      placeholder="0"
      required
      :min="1"
      :max="debt.remainingAmount"
      :hint="$t('debts.paymentForm.maximumHint', { amount: formatCurrency(debt.remainingAmount) })"
      :error="errors.amount"
      :disabled="payFullAmount"
    />

    <!-- Payment Date/Time -->
    <div class="space-y-2">
      <label for="paidAt" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('debts.paymentForm.paymentDateTime') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="paidAt"
        v-model.lazy="formData.paidAt"
        type="datetime-local"
        :max="maxDateTime"
        :class="errors.paidAt ? inputErrorClass : inputClass"
        class="block w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
      />
      <p v-if="errors.paidAt" class="text-sm text-red-600 dark:text-red-400">
        {{ errors.paidAt }}
      </p>
    </div>

    <!-- Note -->
    <div class="space-y-2">
      <label for="note" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('debts.paymentForm.note') }} <span class="text-neutral-400">{{ $t('debts.paymentForm.noteOptional') }}</span>
      </label>
      <textarea
        id="note"
        v-model="formData.note"
        rows="3"
        maxlength="200"
        :placeholder="$t('debts.paymentForm.notePlaceholder')"
        :class="inputClass"
        class="block w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
      ></textarea>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        {{ $t('debts.paymentForm.charactersCount', { count: formData.note?.length || 0 }) }}
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 md:gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 rounded-lg bg-primary-600 px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {{ loading ? $t('debts.paymentForm.saving') : isEditMode ? $t('debts.paymentForm.updatePayment') : $t('debts.paymentForm.addPayment') }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 rounded-lg border border-neutral-300 bg-white px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {{ $t('debts.paymentForm.cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { InformationCircleIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
import CurrencyInput from '@/components/common/CurrencyInput.vue'
import { formatCurrency } from '@/utils/currency'
import { useUIStore } from '@/stores/ui'

const { t: $t } = useI18n()
const uiStore = useUIStore()

const props = defineProps({
  debt: {
    type: Object,
    required: true,
  },
  payment: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = computed(() => !!props.payment)
const payFullAmount = ref(false)

const formData = ref({
  amount: props.payment?.amount || null,
  paidAt: props.payment?.paidAt || getCurrentDateTime(),
  note: props.payment?.note || '',
})

// Toggle Pay Full Amount
function togglePayFullAmount() {
  payFullAmount.value = !payFullAmount.value
  if (payFullAmount.value) {
    formData.value.amount = props.debt.remainingAmount
  } else {
    formData.value.amount = null
  }
}

// Watch payFullAmount to keep amount in sync
watch(payFullAmount, (newVal) => {
  if (newVal) {
    formData.value.amount = props.debt.remainingAmount
  }
})

// Watch for payment prop changes (when editing different payments)
watch(
  () => props.payment,
  (newPayment) => {
    if (newPayment) {
      formData.value = {
        amount: newPayment.amount,
        paidAt: newPayment.paidAt,
        note: newPayment.note || '',
      }
    } else {
      formData.value = {
        amount: null,
        paidAt: getCurrentDateTime(),
        note: '',
      }
    }
  }
)

const errors = ref({
  amount: '',
  paidAt: '',
})

const maxDateTime = computed(() => {
  const now = new Date()
  return now.toISOString().slice(0, 16)
})

// Class constants
const inputClass =
  'border-neutral-300 bg-white text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-100 dark:focus:border-primary-400'
const inputErrorClass =
  'border-red-500 bg-white text-neutral-900 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-dark-bg dark:text-neutral-100'

function getCurrentDateTime() {
  const now = new Date()
  return now.toISOString().slice(0, 16)
}

// Watch for amount changes and show toast if exceeds remaining amount
watch(
  () => formData.value.amount,
  (newAmount) => {
    // Convert to number if it's a string
    const amountValue = typeof newAmount === 'string'
      ? parseFloat(newAmount.replace(/\./g, ''))
      : newAmount

    if (amountValue && amountValue > props.debt.remainingAmount) {
      uiStore.showToast({
        type: 'error',
        message: `Payment amount cannot exceed remaining amount (${formatCurrency(props.debt.remainingAmount)})`,
      })
      errors.value.amount = `Cannot exceed ${formatCurrency(props.debt.remainingAmount)}`
    } else if (errors.value.amount && amountValue && amountValue <= props.debt.remainingAmount) {
      // Clear error when amount is valid again
      errors.value.amount = ''
    }
  }
)

function validateForm() {
  errors.value = {
    amount: '',
    paidAt: '',
  }

  let isValid = true

  // Convert amount to number if it's a string
  const amountValue = typeof formData.value.amount === 'string'
    ? parseFloat(formData.value.amount.replace(/\./g, ''))
    : formData.value.amount

  if (!amountValue || amountValue <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
    uiStore.showToast({
      type: 'warning',
      message: 'Payment amount must be greater than 0',
    })
    isValid = false
  } else if (amountValue > props.debt.remainingAmount) {
    errors.value.amount = `Amount cannot exceed remaining amount (${formatCurrency(props.debt.remainingAmount)})`
    uiStore.showToast({
      type: 'error',
      message: `Payment amount cannot exceed remaining amount (${formatCurrency(props.debt.remainingAmount)})`,
    })
    isValid = false
  }

  if (!formData.value.paidAt) {
    errors.value.paidAt = 'Payment date is required'
    uiStore.showToast({
      type: 'warning',
      message: 'Payment date is required',
    })
    isValid = false
  } else {
    const paymentDate = new Date(formData.value.paidAt)
    const now = new Date()
    if (paymentDate > now) {
      errors.value.paidAt = 'Payment date cannot be in the future'
      uiStore.showToast({
        type: 'warning',
        message: 'Payment date cannot be in the future',
      })
      isValid = false
    }
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return

  emit('submit', { ...formData.value })
}
</script>
