<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <AppCard class="w-full max-w-md" shadow="lg">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-900">Create Account</h2>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <AppInput
          id="name"
          v-model="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          required
          :error="errors.name"
        />

        <AppInput
          id="email"
          v-model="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          required
          :error="errors.email"
        />

        <AppInput
          id="password"
          v-model="password"
          type="password"
          label="Password"
          placeholder="Minimum 6 characters"
          required
          :error="errors.password"
          hint="Password must be at least 6 characters"
        />

        <AppButton type="submit" :loading="loading" full-width>
          Register
        </AppButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
            Login here
          </router-link>
        </p>
      </template>
    </AppCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuth } from '@/composables/useAuth'

const { handleRegister, loading } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const errors = ref({})

async function onSubmit() {
  errors.value = {}

  // Basic validation
  if (!name.value) {
    errors.value.name = 'Name is required'
    return
  }
  if (!email.value) {
    errors.value.email = 'Email is required'
    return
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }
  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return
  }

  try {
    await handleRegister({
      name: name.value,
      email: email.value,
      password: password.value,
    })
  } catch (error) {
    // Error handled in composable
  }
}
</script>
