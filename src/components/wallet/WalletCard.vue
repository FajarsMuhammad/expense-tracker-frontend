<template>
  <AppCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$emit('view', wallet)">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ wallet.name }}</h3>
        <p class="text-sm text-gray-500">{{ wallet.currency }}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold" :class="balanceColor">
          {{ formattedBalance }}
        </p>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <AppButton size="sm" variant="secondary" @click.stop="$emit('edit', wallet)">
        Edit
      </AppButton>
      <AppButton size="sm" variant="danger" @click.stop="$emit('delete', wallet)">
        Delete
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  wallet: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'edit', 'delete'])

const formattedBalance = computed(() => {
  return formatCurrency(props.wallet.currentBalance || 0, props.wallet.currency)
})

const balanceColor = computed(() => {
  return (props.wallet.currentBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
})
</script>
