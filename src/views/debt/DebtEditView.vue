<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader :title="$t('debts.edit.title')" :description="$t('debts.edit.description')" />

      <!-- Loading Skeleton -->
      <div v-if="loading && !currentDebt" class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <AppSkeleton class="h-96" />
      </div>

      <!-- Form Card -->
      <div v-else-if="currentDebt" class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <DebtForm :debt="currentDebt" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
      </div>

      <!-- Error State -->
      <div
        v-else
        class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/10"
      >
        <p class="text-red-700 dark:text-red-300">Debt not found</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDebt } from '@/composables/useDebt'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import FormHeader from '@/components/common/FormHeader.vue'
import DebtForm from '@/components/debt/DebtForm.vue'

const router = useRouter()
const route = useRoute()
const { currentDebt, loading, loadDebt, handleUpdateDebt } = useDebt()

async function handleSubmit(debtData) {
  await handleUpdateDebt(route.params.id, debtData)
}

function handleCancel() {
  router.back()
}

onMounted(() => {
  loadDebt(route.params.id)
})
</script>
