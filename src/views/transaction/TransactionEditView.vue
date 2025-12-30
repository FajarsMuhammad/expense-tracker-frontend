<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader :title="$t('transactions.edit.title')" :description="$t('transactions.edit.description')" />

      <!-- Loading Skeleton -->
      <div v-if="loading && !currentTransaction" class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <AppSkeleton class="h-96" />
      </div>

      <!-- Form Card -->
      <div v-else-if="currentTransaction" class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <TransactionForm
          :transaction="currentTransaction"
          :wallets="wallets"
          :categories="categories"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>

      <!-- Error State -->
      <div v-else class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/10">
        <p class="text-red-700 dark:text-red-300">Transaction not found</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import FormHeader from '@/components/common/FormHeader.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { useTransaction } from '@/composables/useTransaction'
import { useWallet } from '@/composables/useWallet'
import { useCategory } from '@/composables/useCategory'

const router = useRouter()
const route = useRoute()
const { currentTransaction, loading, loadTransaction, handleUpdateTransaction } = useTransaction()
const { wallets, loadWallets } = useWallet()
const { categories, loadCategories } = useCategory()

onMounted(async () => {
  // Load wallets, categories, and the transaction to edit
  await Promise.all([
    loadWallets(),
    loadCategories(),
    loadTransaction(route.params.id),
  ])
})

async function handleSubmit(transactionData) {
  await handleUpdateTransaction(route.params.id, transactionData)
}

function handleCancel() {
  router.back()
}
</script>
