# Expense Tracker Frontend Implementation Plan

> **Generated Plan**: Comprehensive implementation guide for building a Vue 3 frontend application

## Executive Summary

Build a modern Vue 3 web application for the Expense Tracker backend API. This plan provides a comprehensive, production-ready implementation guide with code patterns, architecture decisions, and realistic timelines.

**Project Specifications:**
- **Tech Stack**: Vue 3 (Composition API), Vite, Pinia, Vue Router, TailwindCSS, Axios
- **Repository**: Separate from backend (dedicated frontend repo)
- **MVP Scope**: Authentication + Wallets + Dashboard
- **Timeline**: 9-10 weeks (single developer)
- **Backend API**: http://localhost:8081 (Spring Boot with JWT)

---

## Table of Contents

1. [Project Setup & Initialization](#1-project-setup--initialization)
2. [Project Structure](#2-project-structure)
3. [Core Architecture](#3-core-architecture)
4. [Implementation Details](#4-implementation-details)
5. [Implementation Phases](#5-implementation-phases)
6. [Development Workflow](#6-development-workflow)
7. [Best Practices](#7-best-practices)
8. [Testing Strategy](#8-testing-strategy)
9. [Future Enhancements](#9-future-enhancements)
10. [Key Decisions & Rationale](#10-key-decisions--rationale)
11. [Timeline Summary](#13-timeline-summary)

---

## 1. Project Setup & Initialization

### 1.1 Create Project

```bash
# Initialize Vue 3 + Vite project
npm create vite@latest expense-tracker-frontend -- --template vue

cd expense-tracker-frontend
```

### 1.2 Install Dependencies

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

### 1.3 TailwindCSS Setup

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

### 1.4 Environment Configuration

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

### 1.5 ESLint & Prettier Setup

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

---

## 2. Project Structure

```
expense-tracker-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── main.css
│   │   └── logo.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppButton.vue
│   │   │   ├── AppInput.vue
│   │   │   ├── AppCard.vue
│   │   │   ├── AppModal.vue
│   │   │   ├── AppToast.vue
│   │   │   ├── AppSkeleton.vue
│   │   │   └── AppEmpty.vue
│   │   ├── layout/
│   │   │   ├── AppLayout.vue
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppFooter.vue
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   ├── wallet/
│   │   │   ├── WalletCard.vue
│   │   │   ├── WalletForm.vue
│   │   │   ├── WalletList.vue
│   │   │   └── CurrencySelector.vue
│   │   ├── dashboard/
│   │   │   ├── BalanceCard.vue
│   │   │   ├── WeeklyTrendChart.vue
│   │   │   ├── RecentTransactions.vue
│   │   │   └── WalletFilter.vue
│   │   └── category/
│   │       ├── CategoryList.vue
│   │       ├── CategoryForm.vue
│   │       └── CategoryBadge.vue
│   ├── composables/
│   │   ├── useAuth.js
│   │   ├── useWallet.js
│   │   ├── useCategory.js
│   │   ├── useDashboard.js
│   │   ├── useToast.js
│   │   └── useApi.js
│   ├── router/
│   │   ├── index.js
│   │   └── guards.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── wallet.service.js
│   │   ├── category.service.js
│   │   └── dashboard.service.js
│   ├── stores/
│   │   ├── auth.js
│   │   ├── wallet.js
│   │   ├── category.js
│   │   ├── dashboard.js
│   │   └── ui.js
│   ├── utils/
│   │   ├── currency.js
│   │   ├── date.js
│   │   ├── validation.js
│   │   └── storage.js
│   ├── views/
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── dashboard/
│   │   │   └── DashboardView.vue
│   │   ├── wallet/
│   │   │   ├── WalletListView.vue
│   │   │   ├── WalletCreateView.vue
│   │   │   ├── WalletDetailView.vue
│   │   │   └── WalletEditView.vue
│   │   └── category/
│   │       └── CategoryView.vue
│   ├── App.vue
│   └── main.js
├── .env.development
├── .env.production
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 3. Core Architecture

### 3.1 Architecture Layers

```
┌─────────────────────────────────────┐
│         View Components             │  User interface
├─────────────────────────────────────┤
│         Composables                 │  Business logic, state access
├─────────────────────────────────────┤
│         Pinia Stores                │  State management
├─────────────────────────────────────┤
│         Services                    │  API abstraction
├─────────────────────────────────────┤
│         Axios Instance              │  HTTP client
├─────────────────────────────────────┤
│         Backend API                 │  Spring Boot REST API
└─────────────────────────────────────┘
```

### 3.2 Data Flow

**Read Operations:**
```
Component → Composable → Store (getter) → Service → API → Backend
```

**Write Operations:**
```
Component → Composable → Store (action) → Service → API → Backend → Store (update) → Component (reactive update)
```

---

## 4. Implementation Details

### 4.1 API Service Layer

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

### 4.2 Pinia Stores

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

  return { user, token, loading, isAuthenticated, userName, login, logout, initializeAuth }
})
```

### 4.3 Router with Guards

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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  // ... other routes
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

### 4.4 Composables

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
    handleLogout,
  }
}
```

### 4.5 Utility Functions

**`src/utils/currency.js`**

```javascript
const CURRENCY_FORMATS = {
  IDR: { locale: 'id-ID', symbol: 'Rp', decimals: 2 },
  USD: { locale: 'en-US', symbol: '$', decimals: 2 },
  EUR: { locale: 'de-DE', symbol: '€', decimals: 2 },
  GBP: { locale: 'en-GB', symbol: '£', decimals: 2 },
  JPY: { locale: 'ja-JP', symbol: '¥', decimals: 0 },
  SGD: { locale: 'en-SG', symbol: 'S$', decimals: 2 },
  MYR: { locale: 'ms-MY', symbol: 'RM', decimals: 2 },
}

export function formatCurrency(amount, currency = 'IDR') {
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.IDR
  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: format.decimals,
    maximumFractionDigits: format.decimals,
  }).format(amount)
}

export const SUPPORTED_CURRENCIES = [
  { value: 'IDR', label: 'Indonesian Rupiah (Rp)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'SGD', label: 'Singapore Dollar (S$)' },
  { value: 'MYR', label: 'Malaysian Ringgit (RM)' },
]
```

### 4.6 Component Examples

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

---

## 5. Implementation Phases

### Phase 1: Foundation & Authentication (Week 1-2)

**Week 1: Project Setup**
- Day 1-2: Initialize project, install dependencies, configure TailwindCSS
- Day 3-4: Setup folder structure, API service, router, stores
- Day 5: Create common components (Button, Input, Card)

**Week 2: Authentication**
- Day 1-2: Auth store, service, composable
- Day 3: Login page with form validation
- Day 4: Register page with validation
- Day 5: Layout components (Header, Sidebar), route guards

**Deliverables:**
- Working login/register flow
- JWT token management
- Protected routes
- Basic layout with navigation

### Phase 2: Wallet Management (Week 3-4)

**Week 3: Wallet CRUD**
- Day 1: Wallet store and service
- Day 2: Wallet list view with cards
- Day 3: Create wallet form with currency selector
- Day 4: Wallet detail view
- Day 5: Edit wallet functionality

**Week 4: Wallet Polish**
- Day 1: Delete wallet with confirmation
- Day 2: Free user limitation (1 wallet max)
- Day 3: Currency formatting utilities
- Day 4: Loading states and error handling
- Day 5: Wallet empty state, testing

**Deliverables:**
- Complete wallet CRUD operations
- Currency selection (7 currencies)
- Free user limit enforcement
- Proper error handling

### Phase 3: Dashboard (Week 5-6)

**Week 5: Dashboard Core**
- Day 1: Dashboard store and service
- Day 2: Balance cards (wallet balance, today income/expense)
- Day 3: Weekly trend chart (Chart.js integration)
- Day 4: Recent transactions list
- Day 5: Wallet filter dropdown

**Week 6: Dashboard Polish**
- Day 1: Chart customization and responsiveness
- Day 2: Refresh functionality
- Day 3: Loading skeletons
- Day 4: Empty states for no data
- Day 5: Dashboard testing and refinements

**Deliverables:**
- Dashboard with 4 key metrics
- Interactive weekly trend chart
- Recent transactions display
- Wallet filtering

### Phase 4: Categories (Week 7) - Post-MVP

**Week 7: Category Management**
- Day 1-2: Category store, service, composable
- Day 3: Category list with type filtering
- Day 4: Create/edit category form
- Day 5: Delete category, default vs custom handling

### Phase 5: Polish & Enhancement (Week 8-9)

**Week 8: UX Improvements**
- Day 1: Loading states across all pages
- Day 2: Skeleton loaders
- Day 3: Empty states for all list views
- Day 4: Toast notification system
- Day 5: Modal system for confirmations

**Week 9: Responsive Design**
- Day 1-2: Mobile responsiveness for all pages
- Day 3: Tablet responsiveness
- Day 4: Accessibility improvements (ARIA labels, keyboard nav)
- Day 5: Cross-browser testing

### Phase 6: Testing & Deployment (Week 10)

**Week 10: Final Testing**
- Day 1-2: End-to-end testing of all features
- Day 3: Bug fixes
- Day 4: Performance optimization
- Day 5: Production build and deployment

---

## 6. Development Workflow

### 6.1 Git Workflow

**Branch Strategy:**
```
main (production)
  └── develop (integration)
        ├── feature/auth-login
        ├── feature/wallet-crud
        ├── feature/dashboard-charts
        └── feature/category-management
```

**Commit Message Convention:**
```
feat: Add wallet creation form
fix: Fix currency formatting for JPY
refactor: Extract wallet card component
docs: Update README with setup instructions
```

### 6.2 Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix",
    "format": "prettier --write src/"
  }
}
```

---

## 7. Best Practices

### 7.1 Security

- Store JWT in localStorage (MVP) or httpOnly cookies (production)
- Vue auto-escapes content (XSS prevention)
- Validate inputs on both frontend and backend
- Implement token refresh mechanism

### 7.2 Performance

- Lazy load route components: `component: () => import('@/views/...')`
- Use computed properties for derived state
- Debounce search inputs
- Code splitting for optimal bundle size

### 7.3 Accessibility

- Use semantic HTML elements
- Add ARIA labels to icon buttons
- Ensure keyboard navigation
- Maintain focus management in modals
- Color contrast ratio >= 4.5:1

---

## 8. Testing Strategy

### 8.1 Unit Tests (Optional)

```bash
npm install -D vitest @vue/test-utils
```

**Example Test:**
```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '@/components/common/AppButton.vue'

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Click me' }
    })
    expect(wrapper.text()).toBe('Click me')
  })
})
```

---

## 9. Future Enhancements

### 9.1 Transaction Management (When Backend Ready)

- Transaction CRUD with filtering
- Date range picker
- Pagination
- Export to CSV
- **Estimated Time**: 2-3 weeks

### 9.2 Advanced Features

- Dark mode with TailwindCSS
- Internationalization (i18n)
- PWA with offline support
- Advanced charts and analytics
- Budget tracking

---

## 10. Key Decisions & Rationale

### 10.1 Why Separate Repository?
- Independent deployment cycles
- Smaller, focused codebase
- Different CI/CD pipelines

### 10.2 Why Composition API?
- Better TypeScript support
- Reusable composables
- Smaller bundle size

### 10.3 Why Pinia?
- Simpler API than Vuex
- Official Vue 3 recommendation
- Better TypeScript support

### 10.4 Why TailwindCSS?
- Rapid UI development
- Consistent design system
- Small production bundle

---

## 13. Timeline Summary

**Total: 9-10 weeks (1 developer)**

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Foundation & Auth | 2 weeks | Login, Register, Route Guards |
| Phase 2: Wallet Management | 2 weeks | Wallet CRUD, Currency Support |
| Phase 3: Dashboard | 2 weeks | Summary, Charts, Transactions |
| Phase 4: Categories | 1 week | Category Management |
| Phase 5: Polish | 2 weeks | Responsive, Loading States, UX |
| Phase 6: Testing | 1 week | Bug Fixes, Optimization |

**MVP (Phase 1-3): 6 weeks**

---

## Appendix: Complete Dependencies

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0",
    "@vueuse/core": "^10.7.0",
    "@headlessui/vue": "^1.7.0",
    "@heroicons/vue": "^2.1.0",
    "chart.js": "^4.4.0",
    "vue-chartjs": "^5.3.0",
    "vee-validate": "^4.12.0",
    "yup": "^1.3.0",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-plugin-vue": "^9.20.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.0"
  }
}
```

---

## Vite Configuration

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

## Next Steps

1. **Set up frontend repository** in a separate location
2. **Install dependencies** following this guide
3. **Start with Phase 1** - Foundation & Authentication
4. **Follow the timeline** and adjust based on progress
5. **Refer back to code examples** when implementing features

---

**End of Frontend Implementation Plan**
