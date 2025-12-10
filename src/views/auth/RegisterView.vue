<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <AppCard class="w-full max-w-md" shadow="lg">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-900">Create Account</h2>
        <!-- Trial Badge -->
        <div class="mt-3 inline-flex items-center justify-center w-full">
          <div class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <p class="text-white text-sm font-bold flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              Get 14-Day FREE Premium Trial
            </p>
          </div>
        </div>
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

      <!-- Trial Benefits -->
      <div class="mt-6 space-y-2">
        <p class="text-xs text-gray-500 text-center font-semibold mb-3">What you'll get for 14 days:</p>
        <div class="space-y-2">
          <div class="flex items-start gap-2 text-xs text-gray-600">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Unlimited wallets & debt tracking</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-600">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Financial reports & analytics</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-600">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Excel & PDF export</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-600">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
        </div>
      </div>

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
