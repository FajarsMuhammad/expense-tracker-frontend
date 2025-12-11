import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useTransaction() {
  const transactionStore = useTransactionStore()
  const uiStore = useUIStore()
  const router = useRouter()
  const { t } = useI18n()

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
      uiStore.showToast({ message: t('common.toast.transactionLoadFailed'), type: 'error' })
    }
  }

  async function loadMoreTransactions() {
    try {
      await transactionStore.loadMoreTransactions()
    } catch (error) {
      uiStore.showToast({ message: t('common.toast.transactionLoadMoreFailed'), type: 'error' })
    }
  }

  async function loadTransaction(id) {
    try {
      await transactionStore.fetchTransactionById(id)
    } catch (error) {
      uiStore.showToast({ message: t('common.toast.transactionLoadFailed'), type: 'error' })
      router.push('/transactions')
    }
  }

  async function handleCreateTransaction(transactionData) {
    try {
      // Validation
      if (!transactionData.walletId) {
        uiStore.showToast({ message: t('common.toast.selectWallet'), type: 'warning' })
        return
      }

      if (!transactionData.categoryId) {
        uiStore.showToast({ message: t('common.toast.selectCategory'), type: 'warning' })
        return
      }

      if (!transactionData.type) {
        uiStore.showToast({ message: t('common.toast.selectTransactionType'), type: 'warning' })
        return
      }

      if (!transactionData.amount || transactionData.amount <= 0) {
        uiStore.showToast({ message: t('common.toast.amountMustBePositive'), type: 'warning' })
        return
      }

      if (!transactionData.date) {
        uiStore.showToast({ message: t('common.toast.selectDate'), type: 'warning' })
        return
      }

      // Check if date is in the future
      const transactionDate = new Date(transactionData.date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)

      if (transactionDate > today) {
        uiStore.showToast({ message: t('common.toast.dateCannotBeFuture'), type: 'warning' })
        return
      }

      await transactionStore.createTransaction(transactionData)
      uiStore.showToast({ message: t('common.toast.transactionCreated'), type: 'success' })
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
        uiStore.showToast({ message: t('common.toast.selectWallet'), type: 'warning' })
        return
      }

      if (!transactionData.categoryId) {
        uiStore.showToast({ message: t('common.toast.selectCategory'), type: 'warning' })
        return
      }

      if (!transactionData.type) {
        uiStore.showToast({ message: t('common.toast.selectTransactionType'), type: 'warning' })
        return
      }

      if (!transactionData.amount || transactionData.amount <= 0) {
        uiStore.showToast({ message: t('common.toast.amountMustBePositive'), type: 'warning' })
        return
      }

      if (!transactionData.date) {
        uiStore.showToast({ message: t('common.toast.selectDate'), type: 'warning' })
        return
      }

      const transactionDate = new Date(transactionData.date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)

      if (transactionDate > today) {
        uiStore.showToast({ message: t('common.toast.dateCannotBeFuture'), type: 'warning' })
        return
      }

      await transactionStore.updateTransaction(id, transactionData)
      uiStore.showToast({ message: t('common.toast.transactionUpdated'), type: 'success' })
      router.push('/transactions')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteTransaction(id) {
    try {
      await transactionStore.deleteTransaction(id)
      uiStore.showToast({ message: t('common.toast.transactionDeleted'), type: 'success' })
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
      uiStore.showToast({ message: t('common.toast.filtersFailed'), type: 'error' })
    }
  }

  async function resetFilters() {
    try {
      transactionStore.resetFilters()
      await transactionStore.fetchTransactions()
    } catch (error) {
      uiStore.showToast({ message: t('common.toast.filtersResetFailed'), type: 'error' })
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
