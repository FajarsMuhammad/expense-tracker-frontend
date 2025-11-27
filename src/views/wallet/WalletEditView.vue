<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Edit Wallet</h1>

      <AppSkeleton v-if="loading" count="1" />

      <AppCard v-else-if="currentWallet">
        <WalletForm
          :wallet="currentWallet"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/wallets')"
        />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import WalletForm from '@/components/wallet/WalletForm.vue'
import { useWallet } from '@/composables/useWallet'

const route = useRoute()
const { currentWallet, loading, loadWallet, handleUpdateWallet } = useWallet()

// Watch route params to reload wallet data when ID changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadWallet(newId)
    }
  },
  { immediate: true }
)

async function handleSubmit(walletData) {
  await handleUpdateWallet(route.params.id, walletData)
}
</script>
