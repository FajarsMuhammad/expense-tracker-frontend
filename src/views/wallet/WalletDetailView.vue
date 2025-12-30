<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <AppSkeleton v-if="loading" :count="1" height="300px" />

      <div v-else-if="currentWallet">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center gap-3 md:gap-4">
            <button
              @click="$router.push('/wallets')"
              class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors flex-shrink-0"
              aria-label="Back to wallets"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 class="text-xl md:text-2xl lg:text-3xl font-bold truncate">
              {{ currentWallet.name }}
            </h1>
          </div>

          <div class="flex gap-2 md:gap-3 w-full sm:w-auto">
            <AppButton
              size="sm"
              variant="secondary"
              @click="$router.push(`/wallets/${currentWallet.id}/edit`)"
              class="flex-1 sm:flex-initial"
            >
              <span class="hidden sm:inline">Edit Wallet</span>
              <span class="sm:hidden">Edit</span>
            </AppButton>
            <AppButton
              v-if="!hasTransactions"
              size="sm"
              variant="danger"
              @click="confirmDelete"
              class="flex-1 sm:flex-initial"
            >
              <span class="hidden sm:inline">Delete Wallet</span>
              <span class="sm:hidden">Delete</span>
            </AppButton>
            <button
              v-else
              @click="showCannotDeleteModal = true"
              class="flex-1 sm:flex-initial px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg font-medium bg-red-100 text-red-700 border-2 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors cursor-not-allowed"
              title="Cannot delete wallet with transaction history"
            >
              <span class="hidden sm:inline">🔒 Cannot Delete</span>
              <span class="sm:hidden">🔒 Locked</span>
            </button>
          </div>
        </div>

        <!-- Cannot Delete Warning (when has transactions) -->
        <div v-if="hasTransactions" class="mb-6 rounded-xl border-2 border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-950/20">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-red-900 dark:text-red-100">
                Wallet Protected
              </p>
              <p class="mt-1 text-xs text-red-700 dark:text-red-300">
                This wallet has transaction history and cannot be deleted. This protection prevents data loss and maintains financial record integrity.
              </p>
            </div>
          </div>
        </div>

        <!-- Balance Card -->
        <AppCard class="mb-6">
          <div class="text-center py-6 md:py-8">
            <p class="text-xs md:text-sm text-muted mb-2">Current Balance</p>
            <p class="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 break-all" :class="balanceColor">
              {{ formattedBalance }}
            </p>
            <p class="text-sm md:text-base">{{ currentWallet.currency }}</p>
          </div>
        </AppCard>

        <!-- Wallet Information -->
        <AppCard>
          <h2 class="text-lg md:text-xl font-semibold mb-4">Wallet Information</h2>
          <div class="space-y-4">
            <div class="flex justify-between py-3 border-b border-neutral-100 dark:border-dark-border">
              <span class="text-muted">Wallet Name</span>
              <span class="font-medium">{{ currentWallet.name }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-neutral-100 dark:border-dark-border">
              <span class="text-muted">Currency</span>
              <span class="font-medium">
                {{ currencyLabel }}
              </span>
            </div>
            <div class="flex justify-between py-3 border-b border-neutral-100 dark:border-dark-border">
              <span class="text-muted">Initial Balance</span>
              <span class="font-medium">
                {{ formatCurrency(currentWallet.initialBalance, currentWallet.currency) }}
              </span>
            </div>
            <div class="flex justify-between py-3 border-b border-neutral-100 dark:border-dark-border">
              <span class="text-muted">Current Balance</span>
              <span class="font-medium" :class="balanceColor">
                {{ formattedBalance }}
              </span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-muted">Created At</span>
              <span class="font-medium">
                {{ formatDate(currentWallet.createdAt) }}
              </span>
            </div>
          </div>
        </AppCard>

        <!-- Delete Confirmation Modal -->
        <AppModal v-model="showDeleteModal" title="Delete Wallet">
          <p>
            Are you sure you want to delete "{{ currentWallet.name }}"? This action cannot be
            undone and will remove all associated transactions.
          </p>
          <template #footer>
            <div class="flex gap-3">
              <AppButton variant="danger" :loading="loading" @click="handleDelete">
                Delete
              </AppButton>
              <AppButton variant="secondary" @click="showDeleteModal = false">
                Cancel
              </AppButton>
            </div>
          </template>
        </AppModal>

        <!-- Cannot Delete Modal -->
        <AppModal v-model="showCannotDeleteModal" title="🔒 Cannot Delete Wallet">
          <div class="space-y-4">
            <div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <h4 class="font-semibold text-red-900 dark:text-red-100 mb-2">
                ⚠️ Wallet Has Transaction History
              </h4>
              <p class="text-sm text-red-700 dark:text-red-300">
                This wallet cannot be deleted because it contains transaction records. Deleting it would:
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-start gap-2">
                <span class="text-red-600 dark:text-red-400">❌</span>
                <p class="text-sm text-neutral-700 dark:text-neutral-300">
                  <strong>Corrupt your financial data</strong> - Transaction history would be permanently lost
                </p>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-red-600 dark:text-red-400">❌</span>
                <p class="text-sm text-neutral-700 dark:text-neutral-300">
                  <strong>Break audit trail</strong> - Financial reports would become inaccurate
                </p>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-red-600 dark:text-red-400">❌</span>
                <p class="text-sm text-neutral-700 dark:text-neutral-300">
                  <strong>Violate data integrity</strong> - Cannot maintain reliable financial records
                </p>
              </div>
            </div>

            <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Alternative Options
              </h4>
              <ul class="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Keep the wallet and stop using it</li>
                <li>• Transfer remaining balance to another wallet</li>
                <li>• Contact support if you need to archive this wallet</li>
              </ul>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3">
              <AppButton variant="primary" @click="showCannotDeleteModal = false">
                I Understand
              </AppButton>
            </div>
          </template>
        </AppModal>
      </div>

      <!-- Error State -->
      <AppEmpty
        v-else
        title="Wallet Not Found"
        description="The wallet you're looking for doesn't exist or has been deleted."
      >
        <AppButton @click="$router.push('/wallets')"> Back to Wallets </AppButton>
      </AppEmpty>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import { useWallet } from '@/composables/useWallet'
import { formatCurrency, SUPPORTED_CURRENCIES } from '@/utils/currency'

const route = useRoute()
const router = useRouter()
const { currentWallet, loading, loadWallet, handleDeleteWallet } = useWallet()

const showDeleteModal = ref(false)
const showCannotDeleteModal = ref(false)

// Check if wallet has transactions (same logic as WalletForm)
const hasTransactions = computed(() => {
  if (!currentWallet.value) return false

  const initial = currentWallet.value.initialBalance || 0
  const current = currentWallet.value.currentBalance || 0

  // If balances differ, wallet has transactions
  return initial !== current
})

onMounted(() => {
  loadWallet(route.params.id)
})

const formattedBalance = computed(() => {
  if (!currentWallet.value) return '0.00'
  const balance = currentWallet.value.currentBalance ?? currentWallet.value.initialBalance ?? 0
  return formatCurrency(balance, currentWallet.value.currency)
})

const balanceColor = computed(() => {
  if (!currentWallet.value) return ''
  const balance = currentWallet.value.currentBalance ?? currentWallet.value.initialBalance ?? 0
  return balance >= 0 ? 'text-income dark:text-income-light' : 'text-expense dark:text-expense-light'
})

const currencyLabel = computed(() => {
  if (!currentWallet.value) return ''
  const currency = SUPPORTED_CURRENCIES.find((c) => c.value === currentWallet.value.currency)
  return currency ? currency.label : currentWallet.value.currency
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function confirmDelete() {
  showDeleteModal.value = true
}

async function handleDelete() {
  await handleDeleteWallet(currentWallet.value.id)
  showDeleteModal.value = false
  router.push('/wallets')
}
</script>
