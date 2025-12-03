<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header with Back Button -->
      <FormHeader title="Create Category" description="Add a new category to organize your transactions" />

      <!-- Form Card -->
      <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-card sm:p-8">
        <CategoryForm
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
import CategoryForm from '@/components/category/CategoryForm.vue'
import { useCategory } from '@/composables/useCategory'

const router = useRouter()

const { loading, handleCreateCategory } = useCategory()

async function handleSubmit(categoryData) {
  await handleCreateCategory(categoryData)
}

function handleCancel() {
  router.back()
}
</script>
