import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import debtService from '@/services/debt.service'
import { DEBT_TYPES, DEBT_STATUS } from '@/config/api.config'

export const useDebtStore = defineStore('debt', () => {
  const debts = ref([])
  const currentDebt = ref(null)
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
    type: null,
    status: null,
    overdue: null,
  })

  // Computed properties
  const hasDebts = computed(() => debts.value.length > 0)

  const totalDebts = computed(() => pagination.value.totalElements)

  const currentPage = computed(() => pagination.value.page)

  const totalPages = computed(() => pagination.value.totalPages)

  const hasMore = computed(() => !pagination.value.last)

  const overdueDebts = computed(() => {
    return debts.value.filter((debt) => debt.isOverdue && debt.status !== DEBT_STATUS.PAID)
  })

  const totalPayable = computed(() => {
    return debts.value
      .filter((debt) => debt.type === DEBT_TYPES.PAYABLE && debt.status !== DEBT_STATUS.PAID)
      .reduce((sum, debt) => sum + debt.remainingAmount, 0)
  })

  const totalReceivable = computed(() => {
    return debts.value
      .filter((debt) => debt.type === DEBT_TYPES.RECEIVABLE && debt.status !== DEBT_STATUS.PAID)
      .reduce((sum, debt) => sum + debt.remainingAmount, 0)
  })

  const netPosition = computed(() => {
    // Positive: you are owed more than you owe
    // Negative: you owe more than you are owed
    return totalReceivable.value - totalPayable.value
  })

  const openDebts = computed(() => {
    return debts.value.filter((debt) => debt.status === DEBT_STATUS.OPEN)
  })

  const partialDebts = computed(() => {
    return debts.value.filter((debt) => debt.status === DEBT_STATUS.PARTIAL)
  })

  const paidDebts = computed(() => {
    return debts.value.filter((debt) => debt.status === DEBT_STATUS.PAID)
  })

  // Actions
  async function fetchDebts(params = {}, append = false) {
    loading.value = true
    error.value = null
    try {
      const requestParams = {
        ...filters.value,
        ...params,
        page: params.page ?? pagination.value.page,
        size: params.size ?? pagination.value.size,
      }

      const data = await debtService.getAllDebts(requestParams)

      if (append) {
        // Append to existing debts for "load more"
        debts.value = [...debts.value, ...data.content]
      } else {
        // Replace debts for new search/filter
        debts.value = data.content
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

  async function loadMoreDebts() {
    if (pagination.value.last) return

    const nextPage = pagination.value.page + 1
    await fetchDebts({ page: nextPage }, true)
  }

  async function fetchDebtById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await debtService.getDebtById(id)
      currentDebt.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createDebt(debtData) {
    loading.value = true
    error.value = null
    try {
      const data = await debtService.createDebt(debtData)
      // Add to the beginning of the list
      debts.value.unshift(data)
      pagination.value.totalElements += 1
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDebt(id, debtData) {
    loading.value = true
    error.value = null
    try {
      const data = await debtService.updateDebt(id, debtData)
      const index = debts.value.findIndex((d) => d.id === id)
      if (index !== -1) {
        debts.value[index] = data
      }
      if (currentDebt.value?.id === id) {
        currentDebt.value = data
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDebt(id) {
    loading.value = true
    error.value = null
    try {
      await debtService.deleteDebt(id)
      debts.value = debts.value.filter((d) => d.id !== id)
      pagination.value.totalElements = Math.max(0, pagination.value.totalElements - 1)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addPaymentToDebt(id, paymentData) {
    loading.value = true
    error.value = null
    try {
      const data = await debtService.addPayment(id, paymentData)

      // Backend returns { payment, updatedDebt }
      // Extract the updatedDebt from response
      const updatedDebt = data.updatedDebt || data

      // Update the debt in the list
      const index = debts.value.findIndex((d) => d.id === id)
      if (index !== -1) {
        debts.value[index] = updatedDebt
      }
      // Update current debt if it's the same
      if (currentDebt.value?.id === id) {
        currentDebt.value = updatedDebt
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function markDebtAsPaid(id) {
    loading.value = true
    error.value = null
    try {
      const data = await debtService.markAsPaid(id)
      // Update the debt in the list
      const index = debts.value.findIndex((d) => d.id === id)
      if (index !== -1) {
        debts.value[index] = data
      }
      // Update current debt if it's the same
      if (currentDebt.value?.id === id) {
        currentDebt.value = data
      }
      return data
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
      type: null,
      status: null,
      overdue: null,
    }
    pagination.value.page = 0
  }

  return {
    debts,
    currentDebt,
    loading,
    error,
    pagination,
    filters,
    hasDebts,
    totalDebts,
    currentPage,
    totalPages,
    hasMore,
    overdueDebts,
    totalPayable,
    totalReceivable,
    netPosition,
    openDebts,
    partialDebts,
    paidDebts,
    fetchDebts,
    loadMoreDebts,
    fetchDebtById,
    createDebt,
    updateDebt,
    deleteDebt,
    addPaymentToDebt,
    markDebtAsPaid,
    setFilters,
    resetFilters,
  }
})
