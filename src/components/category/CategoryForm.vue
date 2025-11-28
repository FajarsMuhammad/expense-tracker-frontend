<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <AppInput
      id="name"
      v-model="formData.name"
      label="Category Name"
      placeholder="e.g., Freelance, Groceries, Transportation"
      required
      :error="errors.name"
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

    <div class="flex gap-3 pt-4">
      <AppButton type="submit" :loading="loading" class="flex-1">
        {{ isEditMode ? 'Update Category' : 'Create Category' }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="flex-1">
        Cancel
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const isEditMode = !!props.category

const formData = ref({
  name: '',
  type: '',
})

const errors = ref({})

onMounted(() => {
  if (props.category) {
    formData.value = {
      name: props.category.name,
      type: props.category.type,
    }
  }
})

function validateForm() {
  errors.value = {}

  if (!formData.value.name?.trim()) {
    errors.value.name = 'Category name is required'
  }

  if (!formData.value.type) {
    errors.value.type = 'Please select a type'
  }

  return Object.keys(errors.value).length === 0
}

function onSubmit() {
  if (!validateForm()) return

  emit('submit', {
    name: formData.value.name.trim(),
    type: formData.value.type,
  })
}
</script>
