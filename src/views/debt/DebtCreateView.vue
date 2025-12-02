<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <div class="flex items-center gap-4">
        <button
          @click="router.back()"
          class="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <ArrowLeftIcon class="size-6" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Create Debt</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Add a new payable or receivable debt
          </p>
        </div>
      </div>

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
import DebtForm from '@/components/debt/DebtForm.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { loading, handleCreateDebt } = useDebt()

async function handleSubmit(debtData) {
  await handleCreateDebt(debtData)
}

function handleCancel() {
  router.back()
}
</script>
