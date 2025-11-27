<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <AppCard>
        <div class="text-center py-12">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Welcome to Expense Tracker!</h2>
          <p class="text-gray-600">Your dashboard is ready. More features coming soon...</p>
        </div>
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
</script>
