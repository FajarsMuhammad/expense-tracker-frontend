import { storeToRefs } from 'pinia'
import { useDebtStore } from '@/stores/debt'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { DEBT_STATUS } from '@/config/api.config'

export function useDebt() {
  const debtStore = useDebtStore()
  const uiStore = useUIStore()
  const router = useRouter()

  // Use storeToRefs to maintain reactivity
  const {
    debts,
    currentDebt,
    loading,
    pagination,
    filters,
    hasDebts,
    totalDebts,
    hasMore,
    overdueDebts,
    totalPayable,
    totalReceivable,
    netPosition,
    openDebts,
    partialDebts,
    paidDebts,
  } = storeToRefs(debtStore)

  async function loadDebts() {
    try {
      await debtStore.fetchDebts()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load debts', type: 'error' })
    }
  }

  async function loadMoreDebts() {
    try {
      await debtStore.loadMoreDebts()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load more debts', type: 'error' })
    }
  }

  async function loadDebt(id) {
    try {
      await debtStore.fetchDebtById(id)
    } catch (error) {
      uiStore.showToast({ message: 'Failed to load debt', type: 'error' })
      router.push('/debts')
    }
  }

  async function handleCreateDebt(debtData) {
    try {
      // Validation
      if (!debtData.type) {
        uiStore.showToast({ message: 'Please select debt type', type: 'warning' })
        return
      }

      if (!debtData.counterpartyName || debtData.counterpartyName.trim() === '') {
        uiStore.showToast({ message: 'Please enter counterparty name', type: 'warning' })
        return
      }

      if (!debtData.totalAmount || debtData.totalAmount <= 0) {
        uiStore.showToast({ message: 'Amount must be greater than 0', type: 'warning' })
        return
      }

      if (!debtData.dueDate) {
        uiStore.showToast({ message: 'Please select a due date', type: 'warning' })
        return
      }

      // Check if due date is in the past
      const dueDate = new Date(debtData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        uiStore.showToast({ message: 'Due date cannot be in the past', type: 'warning' })
        return
      }

      await debtStore.createDebt(debtData)
      uiStore.showToast({ message: 'Debt created successfully!', type: 'success' })
      router.push('/debts')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdateDebt(id, debtData) {
    try {
      // Same validation as create
      if (!debtData.type) {
        uiStore.showToast({ message: 'Please select debt type', type: 'warning' })
        return
      }

      if (!debtData.counterpartyName || debtData.counterpartyName.trim() === '') {
        uiStore.showToast({ message: 'Please enter counterparty name', type: 'warning' })
        return
      }

      if (!debtData.totalAmount || debtData.totalAmount <= 0) {
        uiStore.showToast({ message: 'Amount must be greater than 0', type: 'warning' })
        return
      }

      if (!debtData.dueDate) {
        uiStore.showToast({ message: 'Please select a due date', type: 'warning' })
        return
      }

      await debtStore.updateDebt(id, debtData)
      uiStore.showToast({ message: 'Debt updated successfully!', type: 'success' })
      router.push('/debts')
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeleteDebt(id) {
    try {
      await debtStore.deleteDebt(id)
      uiStore.showToast({ message: 'Debt deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleAddPayment(debtId, paymentData) {
    try {
      // Validation
      if (!paymentData.amount || paymentData.amount <= 0) {
        uiStore.showToast({ message: 'Payment amount must be greater than 0', type: 'warning' })
        return
      }

      // Check if payment amount exceeds remaining amount
      const debt = currentDebt.value
      if (debt && paymentData.amount > debt.remainingAmount) {
        uiStore.showToast({
          message: `Payment amount cannot exceed remaining amount (${debt.remainingAmount})`,
          type: 'warning',
        })
        return
      }

      if (!paymentData.paidAt) {
        uiStore.showToast({ message: 'Please select payment date', type: 'warning' })
        return
      }

      // Check if payment date is in the future
      const paymentDate = new Date(paymentData.paidAt)
      const now = new Date()

      if (paymentDate > now) {
        uiStore.showToast({ message: 'Payment date cannot be in the future', type: 'warning' })
        return
      }

      await debtStore.addPaymentToDebt(debtId, paymentData)
      uiStore.showToast({ message: 'Payment added successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleMarkAsPaid(debtId) {
    try {
      // Check if already paid
      const debt = currentDebt.value
      if (debt && debt.status === DEBT_STATUS.PAID) {
        uiStore.showToast({ message: 'Debt is already marked as paid', type: 'info' })
        return
      }

      await debtStore.markDebtAsPaid(debtId)
      uiStore.showToast({ message: 'Debt marked as paid!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleUpdatePayment(debtId, paymentId, paymentData) {
    try {
      // Validation
      if (!paymentData.amount || paymentData.amount <= 0) {
        uiStore.showToast({ message: 'Payment amount must be greater than 0', type: 'warning' })
        return
      }

      if (!paymentData.paidAt) {
        uiStore.showToast({ message: 'Please select payment date', type: 'warning' })
        return
      }

      // Check if payment date is in the future
      const paymentDate = new Date(paymentData.paidAt)
      const now = new Date()

      if (paymentDate > now) {
        uiStore.showToast({ message: 'Payment date cannot be in the future', type: 'warning' })
        return
      }

      await debtStore.updatePayment(debtId, paymentId, paymentData)
      uiStore.showToast({ message: 'Payment updated successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function handleDeletePayment(debtId, paymentId) {
    try {
      await debtStore.deletePayment(debtId, paymentId)
      uiStore.showToast({ message: 'Payment deleted successfully!', type: 'success' })
    } catch (error) {
      uiStore.showToast({ message: error.message, type: 'error' })
      throw error
    }
  }

  async function applyFilters(newFilters) {
    try {
      debtStore.setFilters(newFilters)
      await debtStore.fetchDebts()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to apply filters', type: 'error' })
    }
  }

  async function resetFilters() {
    try {
      debtStore.resetFilters()
      await debtStore.fetchDebts()
    } catch (error) {
      uiStore.showToast({ message: 'Failed to reset filters', type: 'error' })
    }
  }

  return {
    debts,
    currentDebt,
    loading,
    pagination,
    filters,
    hasDebts,
    totalDebts,
    hasMore,
    overdueDebts,
    totalPayable,
    totalReceivable,
    netPosition,
    openDebts,
    partialDebts,
    paidDebts,
    loadDebts,
    loadMoreDebts,
    loadDebt,
    handleCreateDebt,
    handleUpdateDebt,
    handleDeleteDebt,
    handleAddPayment,
    handleUpdatePayment,
    handleDeletePayment,
    handleMarkAsPaid,
    applyFilters,
    resetFilters,
  }
}
