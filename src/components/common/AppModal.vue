<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="close"
        @keydown="handleKeydown"
      >
        <div
          ref="modalRef"
          class="bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full mx-4"
          role="dialog"
          aria-modal="true"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                <slot name="title">{{ title }}</slot>
              </h3>
              <button
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                @click="close"
                :aria-label="$t('common.modal.close')"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="px-6 py-4 text-gray-900 dark:text-gray-100">
            <slot />
          </div>

          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
})

const emit = defineEmits(['update:modelValue'])

const modalRef = ref(null)
const previousActiveElement = ref(null)

// Watch for modal open/close to manage focus
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    // Store the element that had focus before modal opened
    previousActiveElement.value = document.activeElement

    // Wait for modal to render
    await nextTick()

    // Focus the first focusable element in modal
    if (modalRef.value) {
      const focusableElements = modalRef.value.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  } else {
    // Return focus to previously focused element when modal closes
    if (previousActiveElement.value && previousActiveElement.value.focus) {
      previousActiveElement.value.focus()
    }
    previousActiveElement.value = null
  }
})

function close() {
  emit('update:modelValue', false)
}

// Handle tab key to trap focus within modal
function handleKeydown(event) {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key !== 'Tab' || !modalRef.value) {
    return
  }

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  if (focusableElements.length === 0) {
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // If shift+tab on first element, go to last
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  }
  // If tab on last element, go to first
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
