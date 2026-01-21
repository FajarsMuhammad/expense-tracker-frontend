<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close"
        @keydown="handleKeydown">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Modal -->
        <div ref="modalRef"
          class="relative bg-white dark:bg-dark-card rounded-2xl shadow-soft-2xl w-full max-w-md border border-neutral-200/50 dark:border-dark-border animate-scale-in"
          :class="sizeClasses" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-neutral-200/50 dark:border-dark-border">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100">
                <slot name="title">{{ title }}</slot>
              </h3>
              <button
                class="p-2 -mr-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-hover transition-all duration-200"
                @click="close" :aria-label="$t('common.modal.close')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p v-if="subtitle" class="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
              {{ subtitle }}
            </p>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 text-neutral-700 dark:text-neutral-300">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer"
            class="px-6 py-4 border-t border-neutral-200/50 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface rounded-b-2xl">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  subtitle: String,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue'])

const modalRef = ref(null)
const previousActiveElement = ref(null)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }
  return sizes[props.size]
})

// Watch for modal open/close to manage focus
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    // Prevent body scroll
    document.body.style.overflow = 'hidden'

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
    // Restore body scroll
    document.body.style.overflow = ''

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
.modal-enter-active {
  transition: opacity 0.2s ease-out;
}

.modal-leave-active {
  transition: opacity 0.15s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active>div:last-child {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out;
}

.modal-leave-active>div:last-child {
  transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}

.modal-enter-from>div:last-child,
.modal-leave-to>div:last-child {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
