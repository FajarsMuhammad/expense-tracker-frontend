<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{{
            $t('wallets.title') }}</h1>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {{ $t('wallets.subtitle') }}
          </p>
        </div>
        <!-- Desktop Add Button -->
        <button v-if="!canCreateWallet" disabled
          class="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-bold text-neutral-400 cursor-not-allowed border border-neutral-200 dark:bg-dark-surface dark:border-dark-border">
          <PlusIcon class="size-4 stroke-[3]" />
          {{ $t('wallets.add') }}
        </button>
        <router-link v-else to="/wallets/create"
          class="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-sm font-bold text-white dark:text-neutral-900 shadow-soft transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:shadow-soft-lg active:scale-95">
          <PlusIcon class="size-4 stroke-[3]" />
          {{ $t('wallets.add') }}
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link v-if="canCreateWallet" to="/wallets/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-neutral-900 dark:bg-neutral-100 rounded-full shadow-soft-2xl transition-all duration-300 hover:scale-110 active:scale-95">
        <PlusIcon class="size-7 text-white dark:text-neutral-900 stroke-[3]" />
      </router-link>

      <AppSkeleton v-if="loading" type="list" :count="3" />

      <AppEmpty v-else-if="!loading && wallets.length === 0" :title="$t('wallets.empty.title')"
        :description="$t('wallets.empty.description')">
        <AppButton @click="$router.push('/wallets/create')">
          {{ $t('wallets.empty.createFirst') }}
        </AppButton>
      </AppEmpty>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <WalletCard v-for="(wallet, index) in wallets" :key="wallet.id" :wallet="wallet"
          :style="{ animationDelay: `${index * 100}ms` }" class="animate-fade-in-up" @view="viewWallet"
          @edit="editWallet" @delete="confirmDelete" @cannotDelete="showCannotDeleteWarning" />
      </div>

      <AppConfirmDialog v-model="showDeleteModal" :title="$t('wallets.deleteConfirm.title')" :message="deleteMessage"
        variant="danger" :confirm-text="$t('wallets.deleteConfirm.confirm')" :loading="loading" @confirm="handleDelete"
        @cancel="showDeleteModal = false" />

      <!-- Cannot Delete Modal (Monochrome) -->
      <AppModal v-model="showCannotDeleteModal" :title="$t('wallets.cannotDeleteModal.title')" size="md">
        <div class="space-y-6">
          <div
            class="rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface p-5">
            <h4 class="font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <svg class="size-5 text-neutral-900 dark:text-neutral-100" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ $t('wallets.cannotDeleteModal.warningTitle') }}
            </h4>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('wallets.cannotDeleteModal.warningDescription') }}
            </p>
          </div>

          <div class="space-y-4 px-1">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center flex-shrink-0 text-white dark:text-neutral-900 text-xs font-bold">
                1</div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 pt-1.5">
                <strong>{{ $t('wallets.cannotDeleteModal.reason1Title') }}</strong> — {{
                  $t('wallets.cannotDeleteModal.reason1Desc') }}
              </p>
            </div>
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center flex-shrink-0 text-white dark:text-neutral-900 text-xs font-bold">
                2</div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 pt-1.5">
                <strong>{{ $t('wallets.cannotDeleteModal.reason2Title') }}</strong> — {{
                  $t('wallets.cannotDeleteModal.reason2Desc') }}
              </p>
            </div>
          </div>

          <div
            class="p-5 rounded-xl border-t border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface/50">
            <h4 class="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
              {{ $t('wallets.cannotDeleteModal.alternativesTitle') }}
            </h4>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <svg class="size-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ $t('wallets.cannotDeleteModal.alternative1') }}
              </li>
              <li class="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <svg class="size-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ $t('wallets.cannotDeleteModal.alternative2') }}
              </li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3 w-full">
            <AppButton variant="primary" fullWidth @click="showCannotDeleteModal = false">
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
  try {
    await subscriptionStore.fetchSubscription()
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
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
function showCannotDeleteWarning() {
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
