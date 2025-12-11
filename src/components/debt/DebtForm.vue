<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Debt Type -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('debts.form.debtType') }} <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-2 gap-4">
        <button
          type="button"
          @click="formData.type = DEBT_TYPES.PAYABLE"
          :class="formData.type === DEBT_TYPES.PAYABLE ? selectedPayableClass : unselectedClass"
          class="flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-4 font-medium transition-all"
        >
          <ArrowUpCircleIcon class="size-6" />
          <div class="text-left">
            <div class="font-bold">{{ $t('debts.types.payable') }}</div>
            <div class="text-xs opacity-90">{{ $t('debts.types.youOweMoney') }}</div>
          </div>
        </button>
        <button
          type="button"
          @click="formData.type = DEBT_TYPES.RECEIVABLE"
          :class="formData.type === DEBT_TYPES.RECEIVABLE ? selectedReceivableClass : unselectedClass"
          class="flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-4 font-medium transition-all"
        >
          <ArrowDownCircleIcon class="size-6" />
          <div class="text-left">
            <div class="font-bold">{{ $t('debts.types.receivable') }}</div>
            <div class="text-xs opacity-90">{{ $t('debts.types.youAreOwedMoney') }}</div>
          </div>
        </button>
      </div>
      <p v-if="errors.type" class="text-sm text-red-600 dark:text-red-400">
        {{ errors.type }}
      </p>
    </div>

    <!-- Counterparty Name -->
    <div class="space-y-2">
      <label for="counterpartyName" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('debts.form.counterpartyName') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="counterpartyName"
        v-model="formData.counterpartyName"
        type="text"
        :placeholder="$t('debts.form.counterpartyPlaceholder')"
        :class="errors.counterpartyName ? inputErrorClass : inputClass"
        class="block w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
      />
      <p v-if="errors.counterpartyName" class="text-sm text-red-600 dark:text-red-400">
        {{ errors.counterpartyName }}
      </p>
    </div>

    <!-- Total Amount -->
    <CurrencyInput
      id="totalAmount"
      v-model="formData.totalAmount"
      :label="$t('debts.form.totalAmount')"
      placeholder="0"
      required
      :min="1"
      :error="errors.totalAmount"
    />

    <!-- Due Date -->
    <div class="space-y-2">
      <label for="dueDate" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('debts.form.dueDate') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="dueDate"
        v-model="formData.dueDate"
        type="date"
        :min="minDate"
        :class="errors.dueDate ? inputErrorClass : inputClass"
        class="block w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
      />
      <p v-if="errors.dueDate" class="text-sm text-red-600 dark:text-red-400">
        {{ errors.dueDate }}
      </p>
    </div>

    <!-- Note -->
    <div class="space-y-2">
      <label for="note" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('debts.form.note') }} <span class="text-neutral-400">{{ $t('debts.form.noteOptional') }}</span>
      </label>
      <textarea
        id="note"
        v-model="formData.note"
        rows="4"
        maxlength="500"
        :placeholder="$t('debts.form.notePlaceholder')"
        :class="inputClass"
        class="block w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2"
      ></textarea>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        {{ $t('debts.form.charactersCount', { count: formData.note?.length || 0 }) }}
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 md:gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 rounded-lg bg-primary-600 px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {{ loading ? $t('debts.form.saving') : $t('debts.form.save') }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 rounded-lg border border-neutral-300 bg-white px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {{ $t('debts.form.cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/vue/24/outline'
import { DEBT_TYPES } from '@/config/api.config'
import CurrencyInput from '@/components/common/CurrencyInput.vue'

const { t } = useI18n()

const props = defineProps({
  debt: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = computed(() => !!props.debt)

const formData = ref({
  type: null,
  counterpartyName: '',
  totalAmount: null,
  dueDate: '',
  note: '',
})

const errors = ref({
  type: '',
  counterpartyName: '',
  totalAmount: '',
  dueDate: '',
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Class constants
const inputClass =
  'border-neutral-300 bg-white text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-dark-bg dark:text-neutral-100 dark:focus:border-primary-400'
const inputErrorClass =
  'border-red-500 bg-white text-neutral-900 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-dark-bg dark:text-neutral-100'
const selectedPayableClass =
  'border-red-600 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300'
const selectedReceivableClass =
  'border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300'
const unselectedClass =
  'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-600 dark:bg-dark-card dark:text-neutral-300 dark:hover:border-neutral-500'

// Watch for debt prop changes (edit mode)
watch(
  () => props.debt,
  (newDebt) => {
    if (newDebt) {
      formData.value = {
        type: newDebt.type,
        counterpartyName: newDebt.counterpartyName,
        totalAmount: newDebt.totalAmount,
        dueDate: newDebt.dueDate.split('T')[0], // Convert ISO to YYYY-MM-DD
        note: newDebt.note || '',
      }
    }
  },
  { immediate: true }
)

function validateForm() {
  errors.value = {
    type: '',
    counterpartyName: '',
    totalAmount: '',
    dueDate: '',
  }

  let isValid = true

  if (!formData.value.type) {
    errors.value.type = t('debts.form.typeRequired')
    isValid = false
  }

  if (!formData.value.counterpartyName || formData.value.counterpartyName.trim() === '') {
    errors.value.counterpartyName = t('debts.form.counterpartyRequired')
    isValid = false
  }

  if (!formData.value.totalAmount || formData.value.totalAmount <= 0) {
    errors.value.totalAmount = t('debts.form.amountRequired')
    isValid = false
  }

  if (!formData.value.dueDate) {
    errors.value.dueDate = t('debts.form.dueDateRequired')
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return

  // Convert due date to end of day (23:59:59)
  const dueDateWithTime = `${formData.value.dueDate}T23:59:59`

  emit('submit', {
    ...formData.value,
    dueDate: dueDateWithTime,
  })
}
</script>
