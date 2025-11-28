<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold mb-6">Edit Category</h1>

      <AppSkeleton v-if="loading" count="1" height="300px" />

      <AppCard v-else-if="currentCategory">
        <CategoryForm
          :category="currentCategory"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="$router.push('/categories')"
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
import CategoryForm from '@/components/category/CategoryForm.vue'
import { useCategory } from '@/composables/useCategory'

const route = useRoute()
const { currentCategory, loading, loadCategory, handleUpdateCategory } = useCategory()

onMounted(() => {
  loadCategory(route.params.id)
})

async function handleSubmit(categoryData) {
  await handleUpdateCategory(route.params.id, categoryData)
}
</script>
