<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader title="Create Debt" description="Add a new payable or receivable debt" />

      <!-- Form Card -->
      <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <DebtForm :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDebt } from '@/composables/useDebt'
import AppLayout from '@/components/layout/AppLayout.vue'
import FormHeader from '@/components/common/FormHeader.vue'
import DebtForm from '@/components/debt/DebtForm.vue'

const router = useRouter()
const { loading, handleCreateDebt } = useDebt()

async function handleSubmit(debtData) {
  await handleCreateDebt(debtData)
}

function handleCancel() {
  router.back()
}
</script>
