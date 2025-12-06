<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">My Wallets</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Manage your financial accounts and balances
          </p>
        </div>
        <button
          v-if="!canCreateWallet"
          disabled
          class="inline-flex items-center gap-2 rounded-lg bg-neutral-400 px-6 py-3 font-medium text-white shadow-sm cursor-not-allowed opacity-60 dark:bg-neutral-600"
        >
          <PlusIcon class="size-5" />
          Create Wallet
        </button>
        <router-link
          v-else
          to="/wallets/create"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <PlusIcon class="size-5" />
          Create Wallet
        </router-link>
      </div>

      <AppSkeleton v-if="loading" :count="3" />

      <AppEmpty
        v-else-if="!loading && wallets.length === 0"
        title="No Wallets Yet"
        description="Create your first wallet to start tracking your expenses"
      >
        <AppButton @click="$router.push('/wallets/create')">
          Create Your First Wallet
        </AppButton>
      </AppEmpty>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WalletCard
          v-for="wallet in wallets"
          :key="wallet.id"
          :wallet="wallet"
          @view="viewWallet"
          @edit="editWallet"
          @delete="confirmDelete"
        />
      </div>

      <AppConfirmDialog
        v-model="showDeleteModal"
        title="Delete Wallet"
        :message="`Are you sure you want to delete &quot;${walletToDelete?.name}&quot;? This action cannot be undone.`"
        variant="danger"
        confirm-text="Delete"
        :loading="loading"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import WalletCard from '@/components/wallet/WalletCard.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useWallet } from '@/composables/useWallet'

const router = useRouter()
const { wallets, loading, canCreateWallet, loadWallets, handleDeleteWallet } = useWallet()

const showDeleteModal = ref(false)
const walletToDelete = ref(null)

onMounted(() => {
  loadWallets()
})

function viewWallet(wallet) {
  router.push(`/wallets/${wallet.id}`)
}

function editWallet(wallet) {
  router.push(`/wallets/${wallet.id}/edit`)
}

function confirmDelete(wallet) {
  walletToDelete.value = wallet
  showDeleteModal.value = true
}

async function handleDelete() {
  if (walletToDelete.value) {
    await handleDeleteWallet(walletToDelete.value.id)
    showDeleteModal.value = false
    walletToDelete.value = null
  }
}
</script>
