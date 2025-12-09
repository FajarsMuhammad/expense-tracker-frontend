<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Remaining Amount Info -->
    <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-blue-700 dark:text-blue-300">Remaining Amount</p>
          <p class="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
            {{ formatCurrency(debt.remainingAmount) }}
          </p>
        </div>
        <InformationCircleIcon class="size-8 text-blue-400" />
      </div>
    </div>

    <!-- Payment Amount -->
    <CurrencyInput
      id="amount"
      v-model="formData.amount"
      label="Payment Amount"
      placeholder="0"
      required
      :min="1"
      :max="debt.remainingAmount"
      :hint="`Maximum: ${formatCurrency(debt.remainingAmount)}`"
      :error="errors.amount"
    />

    <!-- Payment Date/Time -->
    <div class="space-y-2">
      <label for="paidAt" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Payment Date & Time <span class="text-red-500">*</span>
      </label>
      <input
        id="paidAt"
        v-model="formData.paidAt"
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
        Note <span class="text-neutral-400">(Optional)</span>
      </label>
      <textarea
        id="note"
        v-model="formData.note"
        rows="3"
        maxlength="200"
        placeholder="Add a note about this payment..."
        :class="inputClass"
        class="block w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
      ></textarea>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        {{ formData.note?.length || 0 }}/200 characters
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 md:gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 rounded-lg bg-primary-600 px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 rounded-lg border border-neutral-300 bg-white px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import CurrencyInput from '@/components/common/CurrencyInput.vue'
import { formatCurrency } from '@/utils/currency'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const props = defineProps({
  debt: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  amount: null,
  paidAt: getCurrentDateTime(),
  note: '',
})

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
    if (newAmount && newAmount > props.debt.remainingAmount) {
      uiStore.showToast({
        type: 'error',
        message: `Payment amount cannot exceed remaining amount (${formatCurrency(props.debt.remainingAmount)})`,
      })
      errors.value.amount = `Cannot exceed ${formatCurrency(props.debt.remainingAmount)}`
    } else if (errors.value.amount && newAmount <= props.debt.remainingAmount) {
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

  if (!formData.value.amount || formData.value.amount <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
    uiStore.showToast({
      type: 'warning',
      message: 'Payment amount must be greater than 0',
    })
    isValid = false
  } else if (formData.value.amount > props.debt.remainingAmount) {
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
