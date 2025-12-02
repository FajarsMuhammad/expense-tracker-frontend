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
    <div class="space-y-2">
      <label for="amount" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Payment Amount <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <span
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500 dark:text-neutral-400"
        >
          Rp
        </span>
        <input
          id="amount"
          v-model.number="formData.amount"
          type="number"
          min="0"
          :max="debt.remainingAmount"
          step="1"
          placeholder="0"
          :class="errors.amount ? inputErrorClass : inputClass"
          class="block w-full rounded-lg py-2.5 pl-12 pr-4 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
        />
      </div>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        Maximum: {{ formatCurrency(debt.remainingAmount) }}
      </p>
      <p v-if="errors.amount" class="text-sm text-red-600 dark:text-red-400">
        {{ errors.amount }}
      </p>
    </div>

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
    <div class="flex gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-700">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 rounded-lg border border-neutral-300 bg-white px-6 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {{ loading ? 'Adding...' : 'Add Payment' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

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

function validateForm() {
  errors.value = {
    amount: '',
    paidAt: '',
  }

  let isValid = true

  if (!formData.value.amount || formData.value.amount <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
    isValid = false
  } else if (formData.value.amount > props.debt.remainingAmount) {
    errors.value.amount = `Amount cannot exceed remaining amount (${formatCurrency(props.debt.remainingAmount)})`
    isValid = false
  }

  if (!formData.value.paidAt) {
    errors.value.paidAt = 'Payment date is required'
    isValid = false
  } else {
    const paymentDate = new Date(formData.value.paidAt)
    const now = new Date()
    if (paymentDate > now) {
      errors.value.paidAt = 'Payment date cannot be in the future'
      isValid = false
    }
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return

  emit('submit', { ...formData.value })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
