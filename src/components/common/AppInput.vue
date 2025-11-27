<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
})

defineEmits(['update:modelValue', 'blur'])

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors'
  const state = props.error
    ? 'border-red-300 focus:ring-red-500'
    : 'border-gray-300 focus:ring-primary-500'
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
  return [base, state, disabled].join(' ')
})
</script>
