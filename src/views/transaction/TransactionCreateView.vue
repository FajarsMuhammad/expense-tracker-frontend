<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader :title="$t('transactions.create.title')" :description="$t('transactions.create.description')" />

      <!-- Form Card -->
      <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <TransactionForm
          :wallets="wallets"
          :categories="categories"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import FormHeader from '@/components/common/FormHeader.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { useTransaction } from '@/composables/useTransaction'
import { useWallet } from '@/composables/useWallet'
import { useCategory } from '@/composables/useCategory'

const router = useRouter()

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

function handleCancel() {
  router.back()
}
</script>
