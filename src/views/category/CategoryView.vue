<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{{
            $t('categories.title') }}</h1>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {{ $t('categories.subtitle') }}
          </p>
        </div>
        <!-- Desktop Add Button -->
        <router-link to="/categories/create"
          class="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-sm font-bold text-white dark:text-neutral-900 shadow-soft hover:shadow-soft-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-200 active:scale-95">
          <PlusIcon class="size-4 stroke-[3]" />
          {{ $t('categories.add') }}
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link to="/categories/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-neutral-900 dark:bg-neutral-100 rounded-full shadow-soft-2xl transition-all duration-300 hover:scale-110 active:scale-95">
        <PlusIcon class="size-7 text-white dark:text-neutral-900 stroke-[3]" />
      </router-link>

      <!-- Type Filter Tabs -->
      <div class="flex gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-dark-surface w-fit mb-8">
        <button v-for="tab in tabs" :key="tab.value"
          class="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200" :class="selectedTab === tab.value
              ? 'bg-white dark:bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-200 dark:border-transparent'
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
            " @click="selectedTab = tab.value">
          {{ tab.label }}
        </button>
      </div>

      <AppSkeleton v-if="loading" type="list" :count="3" />

      <AppEmpty v-else-if="!loading && filteredCategories.length === 0" :title="$t('categories.empty.title')"
        :description="$t('categories.empty.description')">
        <AppButton @click="$router.push('/categories/create')">
          {{ $t('categories.empty.create') }}
        </AppButton>
      </AppEmpty>

      <CategoryList v-else :categories="filteredCategories" class="animate-fade-in" @edit="editCategory"
        @delete="confirmDelete" />

      <AppConfirmDialog v-model="showDeleteModal" :title="$t('categories.deleteConfirm.title')" :message="deleteMessage"
        variant="danger" :confirm-text="$t('categories.deleteConfirm.confirm')" :loading="loading"
        @confirm="handleDelete" @cancel="showDeleteModal = false" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import CategoryList from '@/components/category/CategoryList.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useCategory } from '@/composables/useCategory'

const router = useRouter()
const { t } = useI18n()
const { categories, loading, loadCategories, handleDeleteCategory } = useCategory()

const tabs = computed(() => [
  { label: t('categories.tabs.all'), value: 'all' },
  { label: t('categories.tabs.income'), value: 'INCOME' },
  { label: t('categories.tabs.expense'), value: 'EXPENSE' },
])

const selectedTab = ref('all')
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)

const filteredCategories = computed(() => {
  const list = categories.value || []
  return selectedTab.value === 'all' ? list : list.filter(c => c.type === selectedTab.value)
})

const deleteMessage = computed(() => {
  if (!categoryToDelete.value) return ''
  return t('categories.deleteConfirm.message', { name: categoryToDelete.value.name })
})

onMounted(() => loadCategories())
onActivated(() => loadCategories())

function editCategory(category) {
  if (!category.isDefault) router.push(`/categories/${category.id}/edit`)
}
function confirmDelete(category) {
  if (!category.isDefault) {
    categoryToDelete.value = category
    showDeleteModal.value = true
  }
}
async function handleDelete() {
  if (categoryToDelete.value) {
    await handleDeleteCategory(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
  }
}
</script>
