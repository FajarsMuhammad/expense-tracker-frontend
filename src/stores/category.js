import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import categoryService from '@/services/category.service'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const currentCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const incomeCategories = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.filter((c) => c && c.type === 'INCOME')
  })

  const expenseCategories = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.filter((c) => c && c.type === 'EXPENSE')
  })

  const customCategories = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.filter((c) => c && !c.isDefault)
  })

  const defaultCategories = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.filter((c) => c && c.isDefault)
  })

  async function fetchCategories(type = null) {
    loading.value = true
    error.value = null
    try {
      const data = await categoryService.getAllCategories(type)
      categories.value = Array.isArray(data) ? data : []
      return categories.value
    } catch (err) {
      error.value = err.message
      categories.value = []
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
