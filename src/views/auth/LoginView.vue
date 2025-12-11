<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-100">

        <!-- Header -->
        <div class="px-8 py-6 bg-gradient-to-r from-primary-50 to-white">
          <div class="flex items-center justify-center gap-3">
            <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
              <svg class="w-7 h-7 text-primary-600" viewBox="0 0 24 24" fill="none">
                <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 20v-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>

            <div class="text-center">
              <h1 class="text-xl font-semibold text-gray-900">{{ $t('auth.login.appName') }}</h1>
              <p class="text-sm text-gray-500">{{ $t('auth.login.appTagline') }}</p>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="px-8 py-8">
          <h2 class="text-2xl font-semibold text-gray-900 text-center mb-2">{{ $t('auth.login.title') }}</h2>
          <p class="text-center text-sm text-gray-500 mb-6">{{ $t('auth.login.subtitle') }}</p>

          <!-- Email / Password form -->
          <form @submit.prevent="onSubmit" class="space-y-4">
            <AppInput id="email" v-model="email" type="email" :label="$t('auth.login.email')" :placeholder="$t('auth.login.emailPlaceholder')" required
              :error="errors.email" />

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.login.password') }}</label>
              <div class="relative">
                <AppInput v-model="password" :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.login.passwordPlaceholder')" class="pr-10" :error="errors.password" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.054 10.054 0 012.58-4.01" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3l18 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" v-model="remember" class="h-4 w-4 rounded border-gray-300" />
                {{ $t('auth.login.rememberMe') }}
              </label>

              <router-link to="/forgot-password" class="text-sm text-primary-600 hover:underline">
                {{ $t('auth.login.forgotPassword') }}
              </router-link>
            </div>

            <AppButton type="submit" :loading="loading" full-width class="mt-1">
              {{ $t('auth.login.signIn') }}
            </AppButton>
          </form>
        </div>

        <!-- Footer + OAuth -->
        <div class="px-8 py-6 bg-gray-50">
          <div class="text-center mb-4">
            <p class="text-sm text-gray-600">
              {{ $t('auth.login.noAccount') }}
              <router-link to="/register" class="text-primary-600 font-medium hover:underline ml-1">
                {{ $t('auth.login.createAccount') }}
              </router-link>
            </p>
          </div>

          <div class="flex items-center gap-3 my-4">
            <div class="flex-1 h-px bg-gray-200"></div>
            <div class="text-xs text-gray-400">{{ $t('auth.login.orContinueWith') }}</div>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- ICON-ONLY OAUTH -->
          <div class="flex items-center justify-center gap-4 py-1">

            <!-- Google (inline SVG to avoid import issues) -->
            <button @click="onOAuth('google')"
              class="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:shadow disabled:opacity-60 transition"
              :aria-label="$t('auth.login.loginWithGoogle')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
                <path fill="#EA4335"
                  d="M24 9.5c3.9 0 7.2 1.4 9.9 4l5.6-5.6C35.9 3.7 30.4 1.5 24 1.5 14.6 1.5 6.4 7.6 3.1 15.9l6.8 5.3C11.8 13.8 17.3 9.5 24 9.5z" />
                <path fill="#4285F4"
                  d="M46.5 24c0-1.6-.1-2.8-.4-4H24v8.1h12.7c-.6 3-2.2 5.3-4.7 6.8l7 5.4c4-3.7 6.5-9.2 6.5-16.3z" />
                <path fill="#FBBC05"
                  d="M10.7 28.7A14.6 14.6 0 0 1 9 24c0-1.9.3-3.7 1-5.2l-6.9-5.3C1.2 17 0 20.9 0 24c0 3.2 1.2 7 3.1 10.5l7.6-5.8z" />
                <path fill="#34A853"
                  d="M24 46c6.3 0 11.6-2 15.6-5.8l-7.5-5.8c-2.1 1.4-4.3 2.3-8.1 2.3-5.8 0-10.7-4.8-12.3-11l-7.6 5.8C6.5 40 14.5 46 24 46z" />
              </svg>
            </button>

            <!-- Apple -->
            <button @click="onOAuth('apple')" :disabled="oauthLoading.apple || loading"
              class="w-11 h-11 flex items-center justify-center rounded-full bg-black hover:shadow text-white disabled:opacity-60 transition"
              :aria-label="$t('auth.login.loginWithApple')">
              <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path
                  d="M16.365 1.43c.2 1.06.02 2.19-.53 3.21-.58 1.06-1.48 1.86-2.49 1.86-.14 0-.27-.02-.39-.05-.14-.04-.24-.07-.34-.07-.07 0-.15.02-.22.05a4.9 4.9 0 0 1-.9.09c-1.59 0-3.24.86-4.22 1.64-1.28.99-2.28 2.81-2.28 4.69 0 .64.1 1.36.3 2.03.18.6.39 1.16.64 1.69.46 1 .97 1.93 1.52 2.79.5.8 1.04 1.53 1.6 2.2C9.4 22.3 10.64 23 12 23c1.5 0 2.34-.62 3.36-1.35.8-.56 1.6-1.22 2.36-2 .58-.59 1.1-1.23 1.6-1.9.83-1.12 1.5-2.25 1.9-3.43.47-1.47.55-2.86.32-4.05-.22-1.1-.78-2.06-1.56-2.84-.68-.68-1.62-1.04-2.52-1.04-.59 0-1.06.18-1.42.3-.24.08-.45.18-.63.27a4.4 4.4 0 0 1-.25.1c-.1.04-.18.06-.26.06-.72 0-1.7-.7-2.85-1.72-.82-.77-1.34-1.71-1.39-2.67z" />
              </svg>
            </button>

            <!-- Facebook -->
            <button @click="onOAuth('facebook')" :disabled="oauthLoading.facebook || loading"
              class="w-11 h-11 flex items-center justify-center rounded-full hover:shadow disabled:opacity-60 transition"
              style="background-color: #1877F2;" :aria-label="$t('auth.login.loginWithFacebook')">
              <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path
                  d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.93v-7.03H7.9v-2.9h2.54V9.77c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.76-1.61 1.53v1.84h2.74l-.44 2.9h-2.3v7.03C18.34 21.19 22 17.06 22 12.07z" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuth } from '@/composables/useAuth'

const { t } = useI18n()
const { handleLogin, handleOAuth, loading } = useAuth()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const errors = reactive({
  email: '',
  password: '',
})

const oauthLoading = reactive({
  google: false,
  apple: false,
  facebook: false,
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
     //remember: remember.value,
    })
  } catch (err) {
    console.error(err)
  }
}

async function onOAuth(provider) {
  oauthLoading[provider] = true
  try {
    await handleOAuth(provider)
  } catch (err) {
    console.error(err)
  } finally {
    oauthLoading[provider] = false
  }
}
</script>

<style scoped>
button:focus {
  outline: 3px solid rgba(59, 130, 246, 0.2);
  outline-offset: 2px;
}
</style>
