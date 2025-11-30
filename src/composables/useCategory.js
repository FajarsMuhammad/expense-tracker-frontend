import { useCategoryStore } from '@/stores/category'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

export function useCategory() {
  const categoryStore = useCategoryStore()
  const uiStore = useUIStore()
  const router = useRouter()

  const {
    categories,
    incomeCategories,
    expenseCategories,
    customCategories,
    currentCategory,
    loading,
    error,
  } = storeToRefs(categoryStore)

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
      // Load categories first to ensure we have the latest data
      await categoryStore.fetchCategories()

      const normalizedName = (categoryData.name ?? '').toString().trim().toLowerCase()
      const normalizedType = (categoryData.type ?? '').toString().toUpperCase()
      // Check for duplicate name
      const list = categories.value || []
      console.log('=== DUPLICATE CHECK DEBUG ===')
      console.log('Existing categories:', list)
      console.log('New category:', categoryData)

      const duplicate = list.some((c) => {
      if (!c || !c.name) return false

      const existingName = c.name.toString().trim().toLowerCase()
      const existingType = (c.type ?? '').toString().toUpperCase()

      return existingName === normalizedName && existingType === normalizedType
    })

      if (duplicate) {
        console.log('DUPLICATE FOUND!') // cek di console
        uiStore.showToast({
          message: `A ${categoryData.type.toLowerCase()} category with this name already exists`,
          type: 'error',
        })
        return false
      }

      await categoryStore.createCategory(categoryData)
      uiStore.showToast({ message: 'Category created successfully!', type: 'success' })

      // Reload categories before redirecting
      await categoryStore.fetchCategories()
      router.push('/categories')
      return true
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
      const list = categories.value || []
      const category = list.find((c) => c && c.id === id)

      if (category?.isDefault) {
        uiStore.showToast({
          message: 'Cannot delete default categories',
          type: 'error',
        })
        return
      }

      // ❗ this will update categories.value in the store
      await categoryStore.deleteCategory(id)

      uiStore.showToast({ message: 'Category deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  return {
    // refs
    categories,
    incomeCategories,
    expenseCategories,
    customCategories,
    currentCategory,
    loading,
    error,
    // actions
    loadCategories,
    loadCategory,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  }
}
