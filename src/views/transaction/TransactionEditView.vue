<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Edit Transaction
      </h1>

      <AppSkeleton v-if="loading" :count="1" height="400px" />

      <AppCard v-else-if="currentTransaction">
        <TransactionForm
          :transaction="currentTransaction"
          :wallets="wallets"
          :categories="categories"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/transactions')"
        />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { useTransaction } from '@/composables/useTransaction'
import { useWallet } from '@/composables/useWallet'
import { useCategory } from '@/composables/useCategory'

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
</script>
