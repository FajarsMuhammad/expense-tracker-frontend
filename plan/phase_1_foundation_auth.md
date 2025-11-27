# Phase 1: Foundation & Authentication

**Duration:** 2 weeks (Week 1-2)
**Status:** Ready to start
**Dependencies:** None

---

## Overview

This phase establishes the project foundation and implements the complete authentication system. By the end of Phase 1, users should be able to register, login, and access protected routes with JWT authentication.

---

## Week Breakdown

### Week 1: Project Setup
- **Day 1-2:** Initialize project, install dependencies, configure TailwindCSS
- **Day 3-4:** Setup folder structure, API service, router, stores
- **Day 5:** Create common components (Button, Input, Card)

### Week 2: Authentication
- **Day 1-2:** Auth store, service, composable
- **Day 3:** Login page with form validation
- **Day 4:** Register page with validation
- **Day 5:** Layout components (Header, Sidebar), route guards

---

## Deliverables

- ✅ Working login/register flow
- ✅ JWT token management
- ✅ Protected routes
- ✅ Basic layout with navigation

---

## Setup Tasks

### 1. Create Project

- [x] Initialize Vue 3 + Vite project
- [x] Navigate to project directory
- [x] Verify project structure created

```bash
# Initialize Vue 3 + Vite project
npm create vite@latest expense-tracker-frontend -- --template vue

cd expense-tracker-frontend
```

### 2. Install Dependencies

- [x] Install core dependencies (vue-router, pinia, axios)
- [x] Install UI dependencies (tailwindcss, headlessui, heroicons)
- [x] Install form validation (vee-validate, yup)
- [x] Install utilities (@vueuse/core, dayjs)
- [x] Install chart libraries (chart.js, vue-chartjs)
- [x] Install development dependencies (eslint, prettier)

```bash
# Core dependencies
npm install vue-router@4 pinia axios

# UI & Styling
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install @headlessui/vue @heroicons/vue

# Form validation
npm install vee-validate yup

# Utilities
npm install @vueuse/core dayjs

# Charts for dashboard
npm install chart.js vue-chartjs

# Development dependencies
npm install -D eslint prettier eslint-config-prettier eslint-plugin-vue
```

### 3. TailwindCSS Setup

- [x] Initialize TailwindCSS configuration
- [x] Create tailwind.config.js with custom theme
- [x] Create src/assets/main.css with Tailwind directives
- [x] Import main.css in main.js

```bash
npx tailwindcss init -p
```

**`tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
```

**`src/assets/main.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

### 4. Environment Configuration

- [x] Create .env.development file
- [x] Create .env.production file
- [x] Add environment files to .gitignore

**`.env.development`:**
```
VITE_API_BASE_URL=http://localhost:8081
VITE_APP_NAME=Expense Tracker
```

**`.env.production`:**
```
VITE_API_BASE_URL=https://api.expensetracker.com
VITE_APP_NAME=Expense Tracker
```

### 5. ESLint & Prettier Setup

- [x] Create .eslintrc.cjs configuration
- [x] Create .prettierrc configuration
- [x] Add format and lint scripts to package.json

**`.eslintrc.cjs`:**
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
  },
}
```

**`.prettierrc`:**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

### 6. Vite Configuration

- [x] Create vite.config.js with path aliases
- [x] Configure proxy for API calls
- [x] Set development server port

**`vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

---

## Core Implementation

### 1. API Service Layer

- [x] Create src/services/api.js
- [x] Configure Axios instance with base URL
- [x] Add request interceptor for auth token
- [x] Add response interceptor for error handling
- [x] Test API service with sample request

**`src/services/api.js`** - Foundation for all HTTP requests

```javascript
import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    const formattedError = {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      correlationId: error.response?.data?.correlationId,
      validationErrors: error.response?.data?.validationErrors,
    }

    return Promise.reject(formattedError)
  }
)

export default api
```

### 2. Auth Service

- [x] Create src/services/auth.service.js
- [x] Implement login method
- [x] Implement register method
- [x] Implement getCurrentUser method

**`src/services/auth.service.js`**

```javascript
import api from './api'

export default {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },
}
```

### 3. Auth Store

- [x] Create src/stores/auth.js
- [x] Define user and token state
- [x] Implement login action
- [x] Implement register action
- [x] Implement logout action
- [x] Implement initializeAuth method
- [x] Add computed properties (isAuthenticated, userName)

**`src/stores/auth.js`** - Authentication state management

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')

  async function login(credentials) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = {
        id: response.userId,
        email: response.email,
        name: response.name,
      }
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user.value))
      return response
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      const response = await authService.register(userData)
      token.value = response.token
      user.value = {
        id: response.userId,
        email: response.email,
        name: response.name,
      }
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user.value))
      return response
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function initializeAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return { user, token, loading, isAuthenticated, userName, login, register, logout, initializeAuth }
})
```

### 4. Router with Guards

- [x] Create src/router/index.js
- [x] Define routes (login, register, dashboard)
- [x] Add meta fields for authentication
- [x] Implement beforeEach navigation guard
- [x] Test route protection

**`src/router/index.js`**

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
```

### 5. Auth Composable

- [x] Create src/composables/useAuth.js
- [x] Implement handleLogin function
- [x] Implement handleRegister function
- [x] Implement handleLogout function
- [x] Return user state and methods

**`src/composables/useAuth.js`**

```javascript
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const uiStore = useUIStore()

  async function handleLogin(credentials) {
    try {
      await authStore.login(credentials)
      uiStore.showToast({ message: 'Login successful!', type: 'success' })
      router.push('/dashboard')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleRegister(userData) {
    try {
      await authStore.register(userData)
      uiStore.showToast({ message: 'Registration successful!', type: 'success' })
      router.push('/dashboard')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  function handleLogout() {
    authStore.logout()
    uiStore.showToast({ message: 'Logged out successfully', type: 'info' })
    router.push('/login')
  }

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    loading: authStore.loading,
    handleLogin,
    handleRegister,
    handleLogout,
  }
}
```

---

## Common Components

### AppButton Component

- [x] Create src/components/common/AppButton.vue
- [x] Add variant props (primary, secondary, danger, ghost)
- [x] Add size props (sm, md, lg)
- [x] Add loading state with spinner
- [x] Add disabled state styling

**`src/components/common/AppButton.vue`**

```vue
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  fullWidth: Boolean,
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  const width = props.fullWidth ? 'w-full' : ''
  const disabled = props.disabled || props.loading ? 'opacity-60 cursor-not-allowed' : ''
  return [base, variants[props.variant], sizes[props.size], width, disabled].join(' ')
})
</script>
```

### AppInput Component

- [x] Create src/components/common/AppInput.vue
- [x] Add v-model support
- [x] Add label, placeholder, hint props
- [x] Add error state styling
- [x] Add disabled state

**`src/components/common/AppInput.vue`**

```vue
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
```

### AppCard Component

- [x] Create src/components/common/AppCard.vue
- [x] Add header, body, footer slots
- [x] Add padding and shadow props
- [x] Add border styling

**`src/components/common/AppCard.vue`**

```vue
<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: { type: Boolean, default: true },
  shadow: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v) },
})

const cardClasses = computed(() => {
  const base = 'bg-white rounded-lg border border-gray-200'
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }
  return [base, shadows[props.shadow]].join(' ')
})

const bodyClasses = computed(() => {
  return props.padding ? 'px-6 py-4' : ''
})
</script>
```

---

## Layout Components

### AppLayout Component

- [x] Create src/components/layout/AppLayout.vue
- [x] Add header and sidebar components
- [x] Add main content area with slot
- [x] Add responsive layout

**`src/components/layout/AppLayout.vue`**

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>
```

### AppHeader Component

- [x] Create src/components/layout/AppHeader.vue
- [x] Add app name/logo
- [x] Add user name display
- [x] Add logout button
- [x] Style with border and padding

**`src/components/layout/AppHeader.vue`**

```vue
<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-primary-600">{{ appName }}</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-700">{{ userName }}</span>
        <AppButton variant="ghost" size="sm" @click="handleLogout">
          Logout
        </AppButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuth } from '@/composables/useAuth'

const appName = import.meta.env.VITE_APP_NAME
const { user, handleLogout } = useAuth()
const userName = computed(() => user.value?.name || '')
</script>
```

---

## View Components

### LoginView

- [x] Create src/views/auth/LoginView.vue
- [x] Add email and password inputs
- [x] Add form validation
- [x] Add submit button with loading state
- [x] Add link to register page
- [x] Test login flow

**`src/views/auth/LoginView.vue`**

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <AppCard class="w-full max-w-md" shadow="lg">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-900">Login to Expense Tracker</h2>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-4">
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
          placeholder="Enter your password"
          required
          :error="errors.password"
        />

        <AppButton type="submit" :loading="loading" full-width>
          Login
        </AppButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
            Register here
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

const { handleLogin, loading } = useAuth()

const email = ref('')
const password = ref('')
const errors = ref({})

async function onSubmit() {
  errors.value = {}

  // Basic validation
  if (!email.value) {
    errors.value.email = 'Email is required'
    return
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }

  try {
    await handleLogin({
      email: email.value,
      password: password.value,
    })
  } catch (error) {
    // Error handled in composable
  }
}
</script>
```

---

## Testing Checklist

- [ ] Project setup completed with all dependencies installed
- [ ] TailwindCSS working correctly
- [ ] API service with interceptors functioning
- [ ] Login page renders correctly
- [ ] Login form validation working
- [ ] Login API call successful
- [ ] JWT token stored in localStorage
- [ ] Register page renders correctly
- [ ] Register form validation working
- [ ] Register API call successful
- [ ] Protected routes redirect to login when not authenticated
- [ ] Guest routes redirect to dashboard when authenticated
- [ ] Header displays user name
- [ ] Logout functionality working
- [ ] Layout components render correctly

---

## Next Phase

**Phase 2: Wallet Management** - See `phase_2_wallet_management.md`

---

## References

- Main Plan: `frontend_plan.md`
- Backend API Documentation: Check backend repository
- Vue 3 Composition API: https://vuejs.org/guide/
- Pinia Documentation: https://pinia.vuejs.org/
