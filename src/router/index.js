import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
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
  {
    path: '/wallets',
    name: 'WalletList',
    component: () => import('@/views/wallet/WalletListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wallets/create',
    name: 'WalletCreate',
    component: () => import('@/views/wallet/WalletCreateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wallets/:id',
    name: 'WalletDetail',
    component: () => import('@/views/wallet/WalletDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wallets/:id/edit',
    name: 'WalletEdit',
    component: () => import('@/views/wallet/WalletEditView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage if not already done
  if (!authStore.token && !authStore.user) {
    authStore.initializeAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
