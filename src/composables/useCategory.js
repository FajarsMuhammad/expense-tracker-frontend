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
      // Load categories first to ensure we have the latest data
      await categoryStore.fetchCategories()

      // Check for duplicate name
      const categories = categoryStore.categories.value || categoryStore.categories
      const duplicate = categories.find(
        (c) => c && c.name && c.name.toLowerCase() === categoryData.name.toLowerCase() && c.type === categoryData.type
      )

      if (duplicate) {
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
      const categories = categoryStore.categories.value || categoryStore.categories
      const category = categories.find((c) => c && c.id === id)

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
