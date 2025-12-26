<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ $t('categories.title') }}</h1>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('categories.subtitle') }}
          </p>
        </div>
        <!-- Desktop Add Button -->
        <router-link
          to="/categories/create"
          class="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <PlusIcon class="size-4" />
          {{ $t('categories.add') }}
        </router-link>
      </div>

      <!-- Mobile Floating Action Button -->
      <router-link
        to="/categories/create"
        class="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-2xl shadow-primary-500/50 transition-all duration-300 hover:shadow-primary-500/70 hover:scale-110 active:scale-95"
      >
        <PlusIcon class="size-7 text-white stroke-[3]" />
      </router-link>

      <!-- Type Filter Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="
            selectedTab === tab.value
              ? 'bg-primary-600 text-white'
              : 'bg-neutral-100 dark:bg-dark-surface text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-card'
          "
          @click="selectedTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <AppSkeleton v-if="loading" :count="6" height="80px" />

      <AppEmpty
        v-else-if="!loading && filteredCategories.length === 0"
        :title="$t('categories.empty.title')"
        :description="$t('categories.empty.description')"
      >
        <AppButton @click="$router.push('/categories/create')">
          {{ $t('categories.empty.create') }}
        </AppButton>
      </AppEmpty>

      <CategoryList
        v-else
        :categories="filteredCategories"
        @edit="editCategory"
        @delete="confirmDelete"
      />

      <AppConfirmDialog
        v-model="showDeleteModal"
        :title="$t('categories.deleteConfirm.title')"
        :message="deleteMessage"
        variant="danger"
        :confirm-text="$t('categories.deleteConfirm.confirm')"
        :loading="loading"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
      />
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

  const categoryList = categories.value || []

  if (selectedTab.value === 'all') {
    return categoryList
  }

  const filtered = categoryList.filter((c) => c && c.type === selectedTab.value)
  return filtered
})

const deleteMessage = computed(() => {
  if (!categoryToDelete.value) return ''
  return t('categories.deleteConfirm.message', { name: categoryToDelete.value.name })
})

onMounted(async () => {
  await loadCategories()
})

onActivated(async () => {
  await loadCategories()
})

function editCategory(category) {
  if (category.isDefault) {
    return
  }
  router.push(`/categories/${category.id}/edit`)
}

function confirmDelete(category) {
  if (category.isDefault) {
    return
  }
  categoryToDelete.value = category
  showDeleteModal.value = true
}

async function handleDelete() {
  if (categoryToDelete.value) {
    await handleDeleteCategory(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
  }
}
</script>
