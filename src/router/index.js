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
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/category/CategoryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: () => import('@/views/category/CategoryCreateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: () => import('@/views/category/CategoryEditView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'TransactionList',
    component: () => import('@/views/transaction/TransactionListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/create',
    name: 'TransactionCreate',
    component: () => import('@/views/transaction/TransactionCreateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/:id/edit',
    name: 'TransactionEdit',
    component: () => import('@/views/transaction/TransactionEditView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/debts',
    name: 'DebtList',
    component: () => import('@/views/debt/DebtListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/debts/create',
    name: 'DebtCreate',
    component: () => import('@/views/debt/DebtCreateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/debts/:id',
    name: 'DebtDetail',
    component: () => import('@/views/debt/DebtDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/debts/:id/edit',
    name: 'DebtEdit',
    component: () => import('@/views/debt/DebtEditView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/reports/ReportsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/premium',
    name: 'Premium',
    component: () => import('@/views/premium/PremiumView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/ProfileView.vue'),
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
