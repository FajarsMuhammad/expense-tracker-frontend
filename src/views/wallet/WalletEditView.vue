<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader :title="$t('wallets.editForm.title')" :description="$t('wallets.editForm.description')" />

      <!-- Loading Skeleton -->
      <div v-if="loading && !currentWallet" class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <AppSkeleton class="h-96" />
      </div>

      <!-- Form Card -->
      <div v-else-if="currentWallet" class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <WalletForm
          :wallet="currentWallet"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>

      <!-- Error State -->
      <div v-else class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/10">
        <p class="text-red-700 dark:text-red-300">Wallet not found</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import FormHeader from '@/components/common/FormHeader.vue'
import WalletForm from '@/components/wallet/WalletForm.vue'
import { useWallet } from '@/composables/useWallet'

const router = useRouter()
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

function handleCancel() {
  router.back()
}
</script>
