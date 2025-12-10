<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Name Input -->
    <AppInput
      id="name"
      v-model="formData.name"
      label="Name"
      placeholder="Enter your name"
      required
      :error="errors.name"
      @blur="validateField('name')"
    />

    <!-- Locale Select -->
    <div>
      <label for="locale" class="block text-sm font-medium mb-1">
        Language/Region <span class="text-muted">(Optional)</span>
      </label>
      <select
        id="locale"
        v-model="formData.locale"
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-surface"
        @blur="validateField('locale')"
      >
        <option value="">Select language/region</option>
        <option v-for="locale in locales" :key="locale.value" :value="locale.value">
          {{ locale.label }}
        </option>
      </select>
      <p v-if="errors.locale" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.locale }}</p>
      <p v-else class="mt-1 text-xs text-muted">
        This will affect date, number, and currency formats
      </p>
    </div>

    <!-- Email (Read-only) -->
    <div>
      <label for="email" class="block text-sm font-medium mb-1">
        Email
      </label>
      <input
        id="email"
        :value="profile?.email || ''"
        type="email"
        disabled
        class="w-full px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed opacity-60"
      />
      <p class="mt-1 text-xs text-muted">
        Email cannot be changed
      </p>
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
import { ref, watch } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  profile: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// Supported locales
const locales = [
  { value: 'id_ID', label: 'Indonesia - Bahasa Indonesia' },
  { value: 'en_US', label: 'United States - English' },
  { value: 'en_GB', label: 'United Kingdom - English' },
  { value: 'zh_CN', label: 'China - 简体中文' },
  { value: 'zh_TW', label: 'Taiwan - 繁體中文' },
  { value: 'ja_JP', label: 'Japan - 日本語' },
  { value: 'ko_KR', label: 'Korea - 한국어' },
  { value: 'es_ES', label: 'Spain - Español' },
  { value: 'fr_FR', label: 'France - Français' },
  { value: 'de_DE', label: 'Germany - Deutsch' },
  { value: 'pt_BR', label: 'Brazil - Português' },
  { value: 'ru_RU', label: 'Russia - Русский' },
  { value: 'ar_SA', label: 'Saudi Arabia - العربية' },
  { value: 'hi_IN', label: 'India - हिन्दी' },
]

const formData = ref({
  name: '',
  locale: '',
})

const errors = ref({})

// Watch for profile prop changes
watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      formData.value = {
        name: newProfile.name || '',
        locale: newProfile.locale || '',
      }
    }
  },
  { immediate: true }
)

function validateField(field) {
  errors.value[field] = ''

  if (field === 'name') {
    if (!formData.value.name || formData.value.name.trim().length < 2) {
      errors.value.name = 'Name must be at least 2 characters'
      return false
    }
    if (formData.value.name.length > 100) {
      errors.value.name = 'Name must not exceed 100 characters'
      return false
    }
  }

  if (field === 'locale' && formData.value.locale) {
    const localeRegex = /^[a-z]{2}_[A-Z]{2}$/
    if (!localeRegex.test(formData.value.locale)) {
      errors.value.locale = 'Invalid locale format'
      return false
    }
  }

  return true
}

function validateForm() {
  errors.value = {}
  let isValid = true

  if (!validateField('name')) isValid = false
  if (formData.value.locale && !validateField('locale')) isValid = false

  return isValid
}

function onSubmit() {
  if (!validateForm()) return

  const submitData = {
    name: formData.value.name.trim(),
  }

  // Only include locale if it's selected
  if (formData.value.locale) {
    submitData.locale = formData.value.locale
  }

  emit('submit', submitData)
}
</script>
