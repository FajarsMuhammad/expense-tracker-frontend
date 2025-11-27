<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">My Wallets</h1>
        <AppButton
          v-if="canCreateWallet"
          @click="$router.push('/wallets/create')"
          class="w-full sm:w-auto"
        >
          <span class="hidden sm:inline">+ Create Wallet</span>
          <span class="sm:hidden">+ New Wallet</span>
        </AppButton>
        <div v-else class="text-center sm:text-right">
          <p class="text-xs md:text-sm text-gray-600">
            Free users can only have 1 wallet.
            <a href="#" class="text-primary-600 hover:underline block sm:inline mt-1 sm:mt-0">
              Upgrade to Premium
            </a>
          </p>
        </div>
      </div>

      <AppSkeleton v-if="loading" count="3" />

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

      <AppModal v-model="showDeleteModal" title="Delete Wallet">
        <p class="text-gray-600">
          Are you sure you want to delete "{{ walletToDelete?.name }}"? This action cannot be undone.
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
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import WalletCard from '@/components/wallet/WalletCard.vue'
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
