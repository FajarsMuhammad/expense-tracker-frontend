# Phase 4: Categories

**Duration:** 1 week (Week 7)
**Status:** Post-MVP (Optional for initial release)
**Dependencies:** Phase 1 (Authentication)

---

## Overview

This phase implements category management for transactions. Users can view default categories and create custom categories for both income and expense types. Categories help organize transactions and provide better financial insights.

---

## Week Breakdown

### Week 7: Category Management
- **Day 1-2:** Category store, service, composable
- **Day 3:** Category list with type filtering
- **Day 4:** Create/edit category form
- **Day 5:** Delete category, default vs custom handling

---

## Deliverables

- ✅ View all categories (default + custom)
- ✅ Filter categories by type (INCOME/EXPENSE)
- ✅ Create custom categories
- ✅ Edit custom categories
- ✅ Delete custom categories (default categories cannot be deleted)
- ✅ Category icons/colors support
- ✅ Validation for duplicate category names

---

## Implementation Checklist

### 1. Category Service

- [x] Create src/services/category.service.js
- [x] Implement getAllCategories method
- [x] Implement getCategoryById method
- [x] Implement createCategory method
- [x] Implement updateCategory method
- [x] Implement deleteCategory method
- [x] Add type filter support (INCOME/EXPENSE)

**`src/services/category.service.js`**

```javascript
import api from './api'

export default {
  async getAllCategories(type = null) {
    const params = type ? { type } : {}
    const response = await api.get('/categories', { params })
    return response.data
  },

  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData)
    return response.data
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}
```

### 2. Category Store

- [x] Create src/stores/category.js
- [x] Add categories array state
- [x] Add loading and error states
- [x] Implement fetchCategories action
- [x] Implement createCategory action
- [x] Implement updateCategory action
- [x] Implement deleteCategory action
- [x] Add computed properties (incomeCategories, expenseCategories, customCategories)

**`src/stores/category.js`**

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import categoryService from '@/services/category.service'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const currentCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const incomeCategories = computed(() => {
    return categories.value.filter((c) => c.type === 'INCOME')
  })

  const expenseCategories = computed(() => {
    return categories.value.filter((c) => c.type === 'EXPENSE')
  })

  const customCategories = computed(() => {
    return categories.value.filter((c) => !c.isDefault)
  })

  const defaultCategories = computed(() => {
    return categories.value.filter((c) => c.isDefault)
  })

  async function fetchCategories(type = null) {
    loading.value = true
    error.value = null
    try {
      const data = await categoryService.getAllCategories(type)
      categories.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await categoryService.getCategoryById(id)
      currentCategory.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCategory(categoryData) {
    loading.value = true
    error.value = null
    try {
      const data = await categoryService.createCategory(categoryData)
      categories.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id, categoryData) {
    loading.value = true
    error.value = null
    try {
      const data = await categoryService.updateCategory(id, categoryData)
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        categories.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id) {
    loading.value = true
    error.value = null
    try {
      await categoryService.deleteCategory(id)
      categories.value = categories.value.filter((c) => c.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    currentCategory,
    loading,
    error,
    incomeCategories,
    expenseCategories,
    customCategories,
    defaultCategories,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
```

### 3. Category Composable

- [x] Create src/composables/useCategory.js
- [x] Implement loadCategories function
- [x] Implement handleCreateCategory function
- [x] Implement handleUpdateCategory function
- [x] Implement handleDeleteCategory function
- [x] Add validation for duplicate names

**`src/composables/useCategory.js`**

```javascript
import { useCategoryStore } from '@/stores/category'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'

export function useCategory() {
  const categoryStore = useCategoryStore()
  const uiStore = useUIStore()
  const router = useRouter()

  async function loadCategories(type = null) {
    try {
      await categoryStore.fetchCategories(type)
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load categories', type: 'error' })
    }
  }

  async function loadCategory(id) {
    try {
      await categoryStore.fetchCategoryById(id)
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load category', type: 'error' })
      router.push('/categories')
    }
  }

  async function handleCreateCategory(categoryData) {
    try {
      // Check for duplicate name
      const duplicate = categoryStore.categories.find(
        (c) => c.name.toLowerCase() === categoryData.name.toLowerCase() && c.type === categoryData.type
      )

      if (duplicate) {
        uiStore.showToast({
          message: `A ${categoryData.type.toLowerCase()} category with this name already exists`,
          type: 'error',
        })
        return
      }

      await categoryStore.createCategory(categoryData)
      uiStore.showToast({ message: 'Category created successfully!', type: 'success' })
      router.push('/categories')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdateCategory(id, categoryData) {
    try {
      await categoryStore.updateCategory(id, categoryData)
      uiStore.showToast({ message: 'Category updated successfully!', type: 'success' })
      router.push('/categories')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteCategory(id) {
    try {
      const category = categoryStore.categories.find((c) => c.id === id)

      if (category?.isDefault) {
        uiStore.showToast({
          message: 'Cannot delete default categories',
          type: 'error',
        })
        return
      }

      await categoryStore.deleteCategory(id)
      uiStore.showToast({ message: 'Category deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  return {
    categories: categoryStore.categories,
    incomeCategories: categoryStore.incomeCategories,
    expenseCategories: categoryStore.expenseCategories,
    customCategories: categoryStore.customCategories,
    currentCategory: categoryStore.currentCategory,
    loading: categoryStore.loading,
    loadCategories,
    loadCategory,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  }
}
```

---

## Component Implementation

### 4. CategoryBadge Component

- [x] Create src/components/category/CategoryBadge.vue
- [x] Display category name with icon/color
- [x] Support different sizes
- [x] Add type indicator (income/expense)

**`src/components/category/CategoryBadge.vue`**

```vue
<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
    :class="badgeClass"
  >
    <span
      v-if="showIcon"
      class="w-2 h-2 rounded-full"
      :style="{ backgroundColor: category.color || '#6b7280' }"
    />
    {{ category.name }}
    <span v-if="showType" class="text-xs opacity-75">({{ category.type }})</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  showType: {
    type: Boolean,
    default: false,
  },
})

const badgeClass = computed(() => {
  if (props.category.type === 'INCOME') {
    return 'bg-green-100 text-green-800'
  }
  return 'bg-red-100 text-red-800'
})
</script>
```

### 5. CategoryForm Component

- [x] Create src/components/category/CategoryForm.vue
- [x] Add name input field
- [x] Add type selector (INCOME/EXPENSE)
- [x] Add color picker (optional)
- [x] Add icon selector (optional)
- [x] Add form validation
- [x] Support both create and edit modes

**`src/components/category/CategoryForm.vue`**

```vue
<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <AppInput
      id="name"
      v-model="formData.name"
      label="Category Name"
      placeholder="e.g., Freelance, Groceries, Transportation"
      required
      :error="errors.name"
    />

    <div>
      <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
        Type <span class="text-red-500">*</span>
      </label>
      <select
        id="type"
        v-model="formData.type"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        :disabled="isEditMode"
        required
      >
        <option value="">Select type</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>
      <p v-if="isEditMode" class="mt-1 text-xs text-gray-500">
        Category type cannot be changed after creation
      </p>
      <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
    </div>

    <div>
      <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
        Color (Optional)
      </label>
      <div class="flex items-center gap-3">
        <input
          id="color"
          v-model="formData.color"
          type="color"
          class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
        />
        <span class="text-sm text-gray-600">{{ formData.color }}</span>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <AppButton type="submit" :loading="loading" full-width>
        {{ isEditMode ? 'Update Category' : 'Create Category' }}
      </AppButton>
      <AppButton type="button" variant="secondary" full-width @click="$emit('cancel')">
        Cancel
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  category: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = !!props.category

const formData = ref({
  name: '',
  type: '',
  color: '#6b7280',
})

const errors = ref({})

onMounted(() => {
  if (props.category) {
    formData.value = {
      name: props.category.name,
      type: props.category.type,
      color: props.category.color || '#6b7280',
    }
  }
})

function validateForm() {
  errors.value = {}

  if (!formData.value.name?.trim()) {
    errors.value.name = 'Category name is required'
  }

  if (!formData.value.type) {
    errors.value.type = 'Please select a type'
  }

  return Object.keys(errors.value).length === 0
}

function onSubmit() {
  if (!validateForm()) return

  emit('submit', {
    name: formData.value.name.trim(),
    type: formData.value.type,
    color: formData.value.color,
  })
}
</script>
```

### 6. CategoryList Component

- [x] Create src/components/category/CategoryList.vue
- [x] Display categories in a list/grid
- [x] Show default vs custom badge
- [x] Add edit/delete buttons (only for custom)
- [x] Group by type (income/expense)

**`src/components/category/CategoryList.vue`**

```vue
<template>
  <div class="space-y-6">
    <div v-if="incomeCategories.length > 0">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Income Categories</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard
          v-for="category in incomeCategories"
          :key="category.id"
          class="hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full flex-shrink-0"
                :style="{ backgroundColor: category.color || '#10b981' }"
              />
              <div>
                <p class="font-medium text-gray-900">{{ category.name }}</p>
                <p v-if="category.isDefault" class="text-xs text-gray-500">Default</p>
              </div>
            </div>

            <div v-if="!category.isDefault" class="flex gap-2">
              <button
                class="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                @click="$emit('edit', category)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                @click="$emit('delete', category)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <div v-if="expenseCategories.length > 0">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Expense Categories</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard
          v-for="category in expenseCategories"
          :key="category.id"
          class="hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full flex-shrink-0"
                :style="{ backgroundColor: category.color || '#ef4444' }"
              />
              <div>
                <p class="font-medium text-gray-900">{{ category.name }}</p>
                <p v-if="category.isDefault" class="text-xs text-gray-500">Default</p>
              </div>
            </div>

            <div v-if="!category.isDefault" class="flex gap-2">
              <button
                class="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                @click="$emit('edit', category)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                @click="$emit('delete', category)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const incomeCategories = computed(() => {
  return props.categories.filter((c) => c.type === 'INCOME')
})

const expenseCategories = computed(() => {
  return props.categories.filter((c) => c.type === 'EXPENSE')
})
</script>
```

---

## View Implementation

### 7. CategoryView

- [x] Create src/views/category/CategoryView.vue
- [x] Display all categories grouped by type
- [x] Add "Create Category" button
- [x] Implement delete confirmation modal
- [x] Add loading and empty states
- [x] Add type filter tabs (All/Income/Expense)

**`src/views/category/CategoryView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
        <AppButton @click="$router.push('/categories/create')">
          + Create Category
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
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
          @click="selectedTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <AppSkeleton v-if="loading" count="6" height="80px" />

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
        <p class="text-gray-600">
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
import { ref, computed, onMounted } from 'vue'
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
  if (selectedTab.value === 'all') {
    return categories.value
  }
  return categories.value.filter((c) => c.type === selectedTab.value)
})

onMounted(() => {
  loadCategories()
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
```

### 8. CategoryCreateView

- [x] Create src/views/category/CategoryCreateView.vue
- [x] Display CategoryForm component
- [x] Handle form submission

**`src/views/category/CategoryCreateView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Create Category</h1>

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
```

### 9. CategoryEditView

- [x] Create src/views/category/CategoryEditView.vue
- [x] Load category data by ID
- [x] Display CategoryForm with pre-filled data
- [x] Handle form submission

**`src/views/category/CategoryEditView.vue`**

```vue
<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Edit Category</h1>

      <AppSkeleton v-if="loading" count="1" />

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
```

---

## Router Updates

### 10. Add Category Routes

- [x] Add category routes to src/router/index.js
- [x] Add route protection (requiresAuth)

**Add to `src/router/index.js`:**

```javascript
{
  path: '/categories',
  name: 'Categories',
  component: () => import('@/views/category/CategoryView.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/categories/create',
  name: 'CategoryCreate',
  component: () => import('@/views/category/CategoryCreateView.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/categories/:id/edit',
  name: 'CategoryEdit',
  component: () => import('@/views/category/CategoryEditView.vue'),
  meta: { requiresAuth: true },
},
```

---

## Sidebar Navigation Update

### 11. Update AppSidebar

- [x] Add categories link to sidebar navigation
- [x] Add active state styling

**Update `src/components/layout/AppSidebar.vue`:**

```vue
<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
    <nav class="p-4 space-y-2">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
        :class="isActive('/dashboard') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </router-link>

      <router-link
        to="/wallets"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
        :class="isActive('/wallets') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Wallets
      </router-link>

      <router-link
        to="/categories"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
        :class="isActive('/categories') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Categories
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path) {
  return route.path.startsWith(path)
}
</script>
```

---

## Testing Checklist

- [x] Category list displays all categories
- [x] Categories grouped by type (income/expense)
- [x] Default categories shown with "Default" badge
- [x] Create category form validation works
- [x] Duplicate category name validation works
- [x] Create category API call successful
- [x] Color picker works and persists
- [x] Edit category loads existing data
- [x] Edit category updates successfully
- [x] Category type cannot be changed in edit mode
- [x] Delete button only shown for custom categories
- [x] Delete confirmation modal works
- [x] Delete category API call successful
- [x] Cannot delete default categories
- [x] Type filter tabs work correctly
- [x] Loading states display correctly
- [x] Empty state displays when no categories
- [x] Sidebar navigation includes categories link
- [x] Mobile responsiveness working
- [x] Dark mode support across all components
- [x] Global color system integration
- [x] Toast notifications for all CRUD operations

---

## Next Phase

**Phase 5: Polish & Enhancement** - See `phase_5_polish_enhancement.md`

---

## References

- Main Plan: `frontend_plan.md`
- Phase 1: `phase_1_foundation_auth.md`
- Phase 2: `phase_2_wallet_management.md`
- Phase 3: `phase_3_dashboard.md`
