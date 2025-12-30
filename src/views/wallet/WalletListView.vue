<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ $t('wallets.title') }}</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('wallets.subtitle') }}
          </p>
        </div>
        <!-- Desktop Add Button -->
        <button
          v-if="!canCreateWallet"
          disabled
          class="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-neutral-400 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-not-allowed opacity-60 dark:bg-neutral-600"
        >
          <PlusIcon class="size-4" />
          {{ $t('wallets.add') }}
        </button>
        <router-link
          v-else
          to="/wallets/create"
          class="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <PlusIcon class="size-4" />
          {{ $t('wallets.add') }}
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <button
        v-if="!canCreateWallet"
        disabled
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-neutral-400 rounded-full shadow-2xl cursor-not-allowed opacity-60"
      >
        <PlusIcon class="size-7 text-white stroke-[3]" />
      </button>
      <router-link
        v-else
        to="/wallets/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-2xl shadow-primary-500/50 transition-all duration-300 hover:shadow-primary-500/70 hover:scale-110 active:scale-95"
      >
        <PlusIcon class="size-7 text-white stroke-[3]" />
      </router-link>

      <AppSkeleton v-if="loading" :count="3" />

      <AppEmpty
        v-else-if="!loading && wallets.length === 0"
        :title="$t('wallets.empty.title')"
        :description="$t('wallets.empty.description')"
      >
        <AppButton @click="$router.push('/wallets/create')">
          {{ $t('wallets.empty.createFirst') }}
        </AppButton>
      </AppEmpty>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WalletCard
          v-for="wallet in wallets"
          :key="wallet.id"
          :wallet="wallet"
          @view="viewWallet"
          @edit="editWallet"
          @delete="confirmDelete"
          @cannotDelete="showCannotDeleteWarning"
        />
      </div>

      <AppConfirmDialog
        v-model="showDeleteModal"
        :title="$t('wallets.deleteConfirm.title')"
        :message="deleteMessage"
        variant="danger"
        :confirm-text="$t('wallets.deleteConfirm.confirm')"
        :loading="loading"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
      />

      <!-- Cannot Delete Modal -->
      <AppModal v-model="showCannotDeleteModal" :title="$t('wallets.cannotDeleteModal.title')">
        <div class="space-y-4">
          <div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <h4 class="font-semibold text-red-900 dark:text-red-100 mb-2">
              {{ $t('wallets.cannotDeleteModal.warningTitle') }}
            </h4>
            <p class="text-sm text-red-700 dark:text-red-300">
              {{ $t('wallets.cannotDeleteModal.warningDescription') }}
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <span class="text-red-600 dark:text-red-400">❌</span>
              <p class="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>{{ $t('wallets.cannotDeleteModal.reason1Title') }}</strong> - {{ $t('wallets.cannotDeleteModal.reason1Desc') }}
              </p>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-red-600 dark:text-red-400">❌</span>
              <p class="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>{{ $t('wallets.cannotDeleteModal.reason2Title') }}</strong> - {{ $t('wallets.cannotDeleteModal.reason2Desc') }}
              </p>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-red-600 dark:text-red-400">❌</span>
              <p class="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>{{ $t('wallets.cannotDeleteModal.reason3Title') }}</strong> - {{ $t('wallets.cannotDeleteModal.reason3Desc') }}
              </p>
            </div>
          </div>

          <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {{ $t('wallets.cannotDeleteModal.alternativesTitle') }}
            </h4>
            <ul class="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• {{ $t('wallets.cannotDeleteModal.alternative1') }}</li>
              <li>• {{ $t('wallets.cannotDeleteModal.alternative2') }}</li>
              <li>• {{ $t('wallets.cannotDeleteModal.alternative3') }}</li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <AppButton variant="primary" @click="showCannotDeleteModal = false">
              {{ $t('wallets.cannotDeleteModal.understand') }}
            </AppButton>
          </div>
        </template>
      </AppModal>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import WalletCard from '@/components/wallet/WalletCard.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useWallet } from '@/composables/useWallet'
import { useSubscriptionStore } from '@/stores/subscription'

const { t } = useI18n()
const router = useRouter()
const subscriptionStore = useSubscriptionStore()
const { wallets, loading, canCreateWallet, loadWallets, handleDeleteWallet } = useWallet()

const showDeleteModal = ref(false)
const showCannotDeleteModal = ref(false)
const walletToDelete = ref(null)

const deleteMessage = computed(() => {
  if (!walletToDelete.value) return ''
  return t('wallets.deleteConfirm.message', { name: walletToDelete.value.name })
})

onMounted(async () => {
  // Fetch subscription first to ensure canCreateWallet is accurate
  // This prevents button being disabled for premium users
  try {
    await subscriptionStore.fetchSubscription()
  } catch (error) {
    console.error('Failed to fetch subscription, continuing with wallet load:', error)
    // Continue loading wallets even if subscription fetch fails
  }
  await loadWallets()
})

function viewWallet(wallet) {
  router.push(`/wallets/${wallet.id}`)
}

function editWallet(wallet) {
  router.push(`/wallets/${wallet.id}/edit`)
}

function confirmDelete(wallet) {
  walletToDelete.value = wallet
  showDeleteModal.value = true
}

function showCannotDeleteWarning(wallet) {
  showCannotDeleteModal.value = true
}

async function handleDelete() {
  if (walletToDelete.value) {
    await handleDeleteWallet(walletToDelete.value.id)
    showDeleteModal.value = false
    walletToDelete.value = null
  }
}
</script>
