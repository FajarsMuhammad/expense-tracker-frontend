<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader title="Create Wallet" description="Add a new wallet to track your finances" />

      <!-- Form Card -->
      <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <WalletForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import FormHeader from '@/components/common/FormHeader.vue'
import WalletForm from '@/components/wallet/WalletForm.vue'
import { useWallet } from '@/composables/useWallet'

const router = useRouter()

const { loading, handleCreateWallet } = useWallet()

async function handleSubmit(walletData) {
  await handleCreateWallet(walletData)
}

function handleCancel() {
  router.back()
}
</script>
