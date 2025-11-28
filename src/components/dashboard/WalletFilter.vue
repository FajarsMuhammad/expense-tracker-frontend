<template>
  <div>
    <label for="wallet-filter" class="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
      Filter by Wallet
    </label>
    <select
      id="wallet-filter"
      :value="selectedWalletId"
      class="w-full px-4 py-2 bg-white dark:bg-dark-card border border-neutral-300 dark:border-dark-border rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
      @change="handleChange"
    >
      <option :value="null">All Wallets</option>
      <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
        {{ wallet.name }} ({{ wallet.currency }})
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  wallets: {
    type: Array,
    required: true,
  },
  selectedWalletId: {
    type: [Number, String, null],
    default: null,
  },
})

const emit = defineEmits(['update:selectedWalletId'])

function handleChange(event) {
  const value = event.target.value === '' || event.target.value === 'null' ? null : event.target.value
  emit('update:selectedWalletId', value)
}
</script>
