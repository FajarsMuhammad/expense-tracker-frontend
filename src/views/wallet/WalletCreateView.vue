<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Create New Wallet</h1>

      <AppCard>
        <WalletForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/wallets')"
        />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import WalletForm from '@/components/wallet/WalletForm.vue'
import { useWallet } from '@/composables/useWallet'

const { loading, handleCreateWallet } = useWallet()

async function handleSubmit(walletData) {
  await handleCreateWallet(walletData)
}
</script>
