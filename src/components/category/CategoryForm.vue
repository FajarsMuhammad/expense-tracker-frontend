<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <AppInput
      id="name"
      v-model="formData.name"
      label="Category Name"
      placeholder="e.g., Freelance, Groceries, Transportation"
      required
      :error="errors.name"
      @blur="validateField('name')"
    />

    <div>
      <label for="type" class="block text-sm font-medium mb-1">
        Type <span class="text-red-500">*</span>
      </label>
      <select
        id="type"
        v-model="formData.type"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        :disabled="isEditMode"
        required
        @blur="validateField('type')"
      >
        <option value="">Select type</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>
      <p v-if="isEditMode" class="mt-1 text-xs text-muted">
        Category type cannot be changed after creation
      </p>
      <p v-if="errors.type" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.type }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 md:gap-3 pt-4">
      <AppButton type="submit" :loading="loading" class="flex-1 !py-2 md:!py-2.5 !text-xs md:!text-sm">
        {{ loading ? 'Saving...' : 'Save' }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="flex-1 !py-2 md:!py-2.5 !text-xs md:!text-sm">
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
  category: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = computed(() => !!props.category)

const formData = ref({
  name: '',
  type: '',
})

const errors = ref({})
const hasAttemptedSubmit = ref(false)
const touchedFields = ref(new Set())

// Watch for category prop changes to update form data
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      formData.value = {
        name: newCategory.name || '',
        type: newCategory.type || '',
      }
    } else {
      // Reset form for create mode
      formData.value = {
        name: '',
        type: '',
      }
    }
    // Reset validation state when category changes
    errors.value = {}
    hasAttemptedSubmit.value = false
    touchedFields.value = new Set()
  },
  { immediate: true }
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
    errors.value.name = 'Category name is required'
  } else if (fieldName === 'type' && !formData.value.type) {
    errors.value.type = 'Please select a type'
  }
}

function validateForm() {
  const newErrors = {}

  if (!formData.value.name?.trim()) {
    newErrors.name = 'Category name is required'
  }

  if (!formData.value.type) {
    newErrors.type = 'Please select a type'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

function onSubmit() {
  hasAttemptedSubmit.value = true

  if (!validateForm()) return

  emit('submit', {
    name: formData.value.name.trim(),
    type: formData.value.type,
  })
}
</script>
