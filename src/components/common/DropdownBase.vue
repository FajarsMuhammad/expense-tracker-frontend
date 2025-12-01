<!-- src/components/common/DropdownBase.vue -->
<template>
  <div ref="rootRef" class="dropdown-root relative w-full">
    
    <!-- Trigger -->
    <div 
      ref="triggerRef" 
      @click.stop="toggle" 
      class="cursor-pointer w-full"
    >
      <slot 
        name="trigger"
        :isOpen="isOpen"
        :toggle="toggle"
      />
    </div>

    <!-- Menu -->
    <transition name="fade-scale">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="dropdown-panel absolute left-0 top-full mt-2 w-full rounded-lg shadow-xl z-[9999] bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border"
        @click.stop
      >
        <slot name="menu" :close="close" />
      </div>
    </transition>

  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useDropdown } from '@/composables/useDropdown'

const {
  isOpen,
  toggle,
  close,
  rootRef,
  triggerRef,
  menuRef,
} = useDropdown()

/* CLOSE ON OUTSIDE CLICK */
function onClickOutside(e) {
  if (!rootRef.value) return

  // If click is inside dropdown → ignore
  if (rootRef.value.contains(e.target)) return

  close()
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<style scoped>
/* Dropdown animation */
.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
.fade-scale-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fade-scale-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 140ms ease;
}
</style>
