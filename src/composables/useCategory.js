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
