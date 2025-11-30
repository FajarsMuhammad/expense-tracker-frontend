<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl md:text-3xl font-bold">Categories</h1>
        <AppButton @click="$router.push('/categories/create')">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Category
        </AppButton>
      </div>

      <!-- Type Filter Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="
            selectedTab === tab.value
              ? 'bg-primary-600 text-white'
              : 'bg-neutral-100 dark:bg-dark-surface text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-card'
          "
          @click="selectedTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <AppSkeleton v-if="loading" :count="6" height="80px" />

      <AppEmpty
        v-else-if="!loading && filteredCategories.length === 0"
        title="No Categories"
        description="Create your first custom category to organize your transactions"
      >
        <AppButton @click="$router.push('/categories/create')">
          Create Category
        </AppButton>
      </AppEmpty>

      <CategoryList
        v-else
        :categories="filteredCategories"
        @edit="editCategory"
        @delete="confirmDelete"
      />

      <AppModal v-model="showDeleteModal" title="Delete Category">
        <p>
          Are you sure you want to delete "{{ categoryToDelete?.name }}"? This action cannot be
          undone.
        </p>
        <template #footer>
          <div class="flex gap-3">
            <AppButton variant="danger" :loading="loading" @click="handleDelete">
              Delete
            </AppButton>
            <AppButton variant="secondary" @click="showDeleteModal = false">
              Cancel
            </AppButton>
          </div>
        </template>
      </AppModal>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import CategoryList from '@/components/category/CategoryList.vue'
import { useCategory } from '@/composables/useCategory'

const router = useRouter()
const { categories, loading, loadCategories, handleDeleteCategory } = useCategory()

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
]

const selectedTab = ref('all')
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)

const filteredCategories = computed(() => {
  console.log('=== FILTERED CATEGORIES DEBUG ===')
  console.log('categories (ref):', categories)
  console.log('categories.value:', categories.value)

  const categoryList = categories.value || []
  console.log('categoryList:', categoryList)
  console.log('categoryList.length:', categoryList.length)
  console.log('selectedTab.value:', selectedTab.value)

  if (selectedTab.value === 'all') {
    console.log('Returning all categories:', categoryList.length)
    return categoryList
  }

  const filtered = categoryList.filter((c) => c && c.type === selectedTab.value)
  console.log('Filtered categories:', filtered.length)
  return filtered
})

onMounted(async () => {
  console.log('=== ONMOUNTED ===')
  console.log('Before load - categories:', categories)
  console.log('Before load - loading:', loading)

  await loadCategories()

  console.log('After load - categories:', categories)
  console.log('After load - loading:', loading)
})

onActivated(async () => {
  console.log('=== ONACTIVATED ===')
  await loadCategories()
})

function editCategory(category) {
  if (category.isDefault) {
    return
  }
  router.push(`/categories/${category.id}/edit`)
}

function confirmDelete(category) {
  if (category.isDefault) {
    return
  }
  categoryToDelete.value = category
  showDeleteModal.value = true
}

async function handleDelete() {
  if (categoryToDelete.value) {
    await handleDeleteCategory(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
  }
}
</script>
