<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <AppSkeleton v-if="loading" count="1" height="300px" />

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
              size="sm"
              variant="danger"
              @click="confirmDelete"
              class="flex-1 sm:flex-initial"
            >
              <span class="hidden sm:inline">Delete Wallet</span>
              <span class="sm:hidden">Delete</span>
            </AppButton>
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
