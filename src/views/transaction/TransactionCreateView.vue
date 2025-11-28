<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Create Transaction
      </h1>

      <AppCard>
        <TransactionForm
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
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { useTransaction } from '@/composables/useTransaction'
import { useWallet } from '@/composables/useWallet'
import { useCategory } from '@/composables/useCategory'

const { loading, handleCreateTransaction } = useTransaction()
const { wallets, loadWallets } = useWallet()
const { categories, loadCategories } = useCategory()

onMounted(async () => {
  // Load wallets and categories for the form dropdowns
  await Promise.all([
    loadWallets(),
    loadCategories(),
  ])
})

async function handleSubmit(transactionData) {
  await handleCreateTransaction(transactionData)
}
</script>
