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
