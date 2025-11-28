import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'

export function useTransaction() {
  const transactionStore = useTransactionStore()
  const uiStore = useUIStore()
  const router = useRouter()

  // Use storeToRefs to maintain reactivity
  const {
    transactions,
    currentTransaction,
    loading,
    pagination,
    filters,
    hasTransactions,
    totalTransactions,
    hasMore,
    incomeTotal,
    expenseTotal,
  } = storeToRefs(transactionStore)

  async function loadTransactions() {
    try {
      await transactionStore.fetchTransactions()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load transactions', type: 'error' })
    }
  }

  async function loadMoreTransactions() {
    try {
      await transactionStore.loadMoreTransactions()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load more transactions', type: 'error' })
    }
  }

  async function loadTransaction(id) {
    try {
      await transactionStore.fetchTransactionById(id)
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load transaction', type: 'error' })
      router.push('/transactions')
    }
  }

  async function handleCreateTransaction(transactionData) {
    try {
      // Validation
      if (!transactionData.walletId) {
        uiStore.showToast({ message: 'Please select a wallet', type: 'warning' })
        return
      }

      if (!transactionData.categoryId) {
        uiStore.showToast({ message: 'Please select a category', type: 'warning' })
        return
      }

      if (!transactionData.type) {
        uiStore.showToast({ message: 'Please select transaction type', type: 'warning' })
        return
      }

      if (!transactionData.amount || transactionData.amount <= 0) {
        uiStore.showToast({ message: 'Amount must be greater than 0', type: 'warning' })
        return
      }

      if (!transactionData.date) {
        uiStore.showToast({ message: 'Please select a date', type: 'warning' })
        return
      }

      // Check if date is in the future
      const transactionDate = new Date(transactionData.date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)

      if (transactionDate > today) {
        uiStore.showToast({ message: 'Transaction date cannot be in the future', type: 'warning' })
        return
      }

      await transactionStore.createTransaction(transactionData)
      uiStore.showToast({ message: 'Transaction created successfully!', type: 'success' })
      router.push('/transactions')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdateTransaction(id, transactionData) {
    try {
      // Same validation as create
      if (!transactionData.walletId) {
        uiStore.showToast({ message: 'Please select a wallet', type: 'warning' })
        return
      }

      if (!transactionData.categoryId) {
        uiStore.showToast({ message: 'Please select a category', type: 'warning' })
        return
      }

      if (!transactionData.type) {
        uiStore.showToast({ message: 'Please select transaction type', type: 'warning' })
        return
      }

      if (!transactionData.amount || transactionData.amount <= 0) {
        uiStore.showToast({ message: 'Amount must be greater than 0', type: 'warning' })
        return
      }

      if (!transactionData.date) {
        uiStore.showToast({ message: 'Please select a date', type: 'warning' })
        return
      }

      const transactionDate = new Date(transactionData.date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)

      if (transactionDate > today) {
        uiStore.showToast({ message: 'Transaction date cannot be in the future', type: 'warning' })
        return
      }

      await transactionStore.updateTransaction(id, transactionData)
      uiStore.showToast({ message: 'Transaction updated successfully!', type: 'success' })
      router.push('/transactions')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteTransaction(id) {
    try {
      await transactionStore.deleteTransaction(id)
      uiStore.showToast({ message: 'Transaction deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function applyFilters(newFilters) {
    try {
      transactionStore.setFilters(newFilters)
      await transactionStore.fetchTransactions()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to apply filters', type: 'error' })
    }
  }

  async function resetFilters() {
    try {
      transactionStore.resetFilters()
      await transactionStore.fetchTransactions()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to reset filters', type: 'error' })
    }
  }

  return {
    transactions,
    currentTransaction,
    loading,
    pagination,
    filters,
    hasTransactions,
    totalTransactions,
    hasMore,
    incomeTotal,
    expenseTotal,
    loadTransactions,
    loadMoreTransactions,
    loadTransaction,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    applyFilters,
    resetFilters,
  }
}
