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
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Edit Debt</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Update debt information</p>
        </div>
      </div>

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
import DebtForm from '@/components/debt/DebtForm.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

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
