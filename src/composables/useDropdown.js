// src/composables/useDropdown.js
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * useDropdown - robust dropdown handling
 * - Uses pointerdown for outside detection (avoids click timing races)
 * - Exposes refs to attach to root/trigger/menu
 * - Provides open/close/toggle helpers
 */
export function useDropdown() {
  const isOpen = ref(false)
  const rootRef = ref(null)
  const triggerRef = ref(null)
  const menuRef = ref(null)

  function open() {
    isOpen.value = true
    // focus first focusable in menu after render
    nextTick(() => {
      if (!menuRef.value) return
      const first = menuRef.value.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])')
      if (first && typeof first.focus === 'function') first.focus()
    })
  }

  function close() {
    isOpen.value = false
    nextTick(() => {
      if (triggerRef.value && typeof triggerRef.value.focus === 'function') triggerRef.value.focus()
    })
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  function onPointerDown(e) {
    if (!rootRef.value) return
    // If click/pointer inside root, ignore
    if (rootRef.value.contains(e.target)) return
    // Outside -> close
    if (isOpen.value) close()
  }

  function onKeyDown(e) {
    if (e.key === 'Escape' && isOpen.value) {
      e.preventDefault()
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeyDown)
  })

  return {
    isOpen,
    rootRef,
    triggerRef,
    menuRef,
    open,
    close,
    toggle,
  }
}
