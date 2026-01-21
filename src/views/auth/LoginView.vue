<template>
  <div
    class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg py-8 px-4 transition-colors duration-300">
    <div class="w-full max-w-md">
      <!-- Glass Card -->
      <div
        class="bg-white dark:bg-dark-card rounded-3xl shadow-soft-xl border border-neutral-200/60 dark:border-dark-border overflow-hidden">

        <!-- Header -->
        <div
          class="px-8 py-8 bg-neutral-50 dark:bg-dark-surface border-b border-neutral-200/50 dark:border-dark-border">
          <div class="flex items-center justify-center gap-4">
            <!-- Logo -->
            <div
              class="w-14 h-14 flex items-center justify-center rounded-2xl bg-neutral-900 dark:bg-neutral-100 shadow-soft">
              <svg class="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div class="text-left">
              <h1 class="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {{ $t('auth.login.appName') }}
              </h1>
              <p class="text-sm text-neutral-500 dark:text-neutral-500">
                {{ $t('auth.login.appTagline') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="px-8 py-8">
          <h2
            class="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2 tracking-tight">
            {{ $t('auth.login.title') }}
          </h2>
          <p class="text-center text-sm text-neutral-500 dark:text-neutral-500 mb-8">
            {{ $t('auth.login.subtitle') }}
          </p>

          <!-- Form -->
          <form @submit.prevent="onSubmit" class="space-y-5">
            <!-- Email -->
            <AppInput id="email" v-model="email" type="email" :label="$t('auth.login.email')"
              :placeholder="$t('auth.login.emailPlaceholder')" required :error="errors.email">
              <template #leading>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </template>
            </AppInput>

            <!-- Password -->
            <AppInput id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
              :label="$t('auth.login.password')" :placeholder="$t('auth.login.passwordPlaceholder')" required
              :error="errors.password">
              <template #leading>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </template>
              <template #trailing>
                <button type="button" @click="showPassword = !showPassword"
                  class="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.054 10.054 0 012.58-4.01" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3l18 18" />
                  </svg>
                </button>
              </template>
            </AppInput>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <label
                class="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer group">
                <input type="checkbox" v-model="remember"
                  class="w-4 h-4 rounded border-neutral-300 dark:border-dark-border text-neutral-900 dark:text-neutral-100 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition" />
                <span class="group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                  {{ $t('auth.login.rememberMe') }}
                </span>
              </label>

              <router-link to="/forgot-password"
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                {{ $t('auth.login.forgotPassword') }}
              </router-link>
            </div>

            <!-- Submit -->
            <AppButton type="submit" :loading="loading" full-width size="lg" class="mt-2">
              {{ $t('auth.login.signIn') }}
            </AppButton>
          </form>
        </div>

        <!-- Footer -->
        <div
          class="px-8 py-6 bg-neutral-50 dark:bg-dark-surface border-t border-neutral-200/50 dark:border-dark-border">
          <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('auth.login.noAccount') }}
            <router-link to="/register"
              class="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 ml-1">
              {{ $t('auth.login.createAccount') }}
            </router-link>
          </p>
        </div>
      </div>

      <!-- Branding -->
      <p class="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
        © {{ new Date().getFullYear() }} MoneyTrack. Smart expense tracking.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import { useAuth } from '@/composables/useAuth'

const { t } = useI18n()
const { handleLogin, loading } = useAuth()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const errors = reactive({
  email: '',
  password: '',
})

async function onSubmit() {
  errors.email = ''
  errors.password = ''

  if (!email.value) {
    errors.email = t('auth.login.emailRequired')
    return
  }
  if (!password.value) {
    errors.password = t('auth.login.passwordRequired')
    return
  }

  try {
    await handleLogin({
      email: email.value,
      password: password.value,
    })
  } catch (err) {
    console.error(err)
  }
}
</script>
