<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold mb-6">Create Category</h1>

      <AppCard>
        <CategoryForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/categories')"
        />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import CategoryForm from '@/components/category/CategoryForm.vue'
import { useCategory } from '@/composables/useCategory'

const { loading, handleCreateCategory } = useCategory()

async function handleSubmit(categoryData) {
  await handleCreateCategory(categoryData)
}
</script>
