import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import transactionService from '@/services/transaction.service'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const currentTransaction = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Pagination state
  const pagination = ref({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  })

  // Filter state
  const filters = ref({
    walletId: null,
    categoryId: null,
    type: null,
    dateFrom: null,
    dateTo: null,
  })

  // Computed properties
  const hasTransactions = computed(() => transactions.value.length > 0)

  const totalTransactions = computed(() => pagination.value.totalElements)

  const currentPage = computed(() => pagination.value.page)

  const totalPages = computed(() => pagination.value.totalPages)

  const hasMore = computed(() => !pagination.value.last)

  const incomeTotal = computed(() => {
    return transactions.value
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const expenseTotal = computed(() => {
    return transactions.value
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  // Actions
  async function fetchTransactions(params = {}, append = false) {
    loading.value = true
    error.value = null
    try {
      const requestParams = {
        ...filters.value,
        ...params,
        page: params.page ?? pagination.value.page,
        size: params.size ?? pagination.value.size,
      }

      const data = await transactionService.getAllTransactions(requestParams)

      if (append) {
        // Append to existing transactions for "load more"
        transactions.value = [...transactions.value, ...data.content]
      } else {
        // Replace transactions for new search/filter
        transactions.value = data.content
      }

      // Update pagination info
      pagination.value = {
        page: data.pageable.pageNumber,
        size: data.pageable.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      }

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadMoreTransactions() {
    if (pagination.value.last) return

    const nextPage = pagination.value.page + 1
    await fetchTransactions({ page: nextPage }, true)
  }

  async function fetchTransactionById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await transactionService.getTransactionById(id)
      currentTransaction.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(transactionData) {
    loading.value = true
    error.value = null
    try {
      const data = await transactionService.createTransaction(transactionData)
      // Add to the beginning of the list
      transactions.value.unshift(data)
      pagination.value.totalElements += 1
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id, transactionData) {
    loading.value = true
    error.value = null
    try {
      const data = await transactionService.updateTransaction(id, transactionData)
      const index = transactions.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        transactions.value[index] = data
      }
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTransaction(id) {
    loading.value = true
    error.value = null
    try {
      await transactionService.deleteTransaction(id)
      transactions.value = transactions.value.filter((t) => t.id !== id)
      pagination.value.totalElements = Math.max(0, pagination.value.totalElements - 1)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    // Reset to page 0 when filters change
    pagination.value.page = 0
  }

  function resetFilters() {
    filters.value = {
      walletId: null,
      categoryId: null,
      type: null,
      dateFrom: null,
      dateTo: null,
    }
    pagination.value.page = 0
  }

  return {
    transactions,
    currentTransaction,
    loading,
    error,
    pagination,
    filters,
    hasTransactions,
    totalTransactions,
    currentPage,
    totalPages,
    hasMore,
    incomeTotal,
    expenseTotal,
    fetchTransactions,
    loadMoreTransactions,
    fetchTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    resetFilters,
  }
})
