<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="flex min-h-full items-center justify-center p-4">
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              class="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full p-8"
              @click.stop
            >
              <!-- Close Button -->
              <button
                @click="close"
                class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Icon -->
              <div class="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 shadow-glow-primary">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>

              <!-- Title -->
              <h3 class="text-2xl font-display font-bold text-center text-neutral-900 dark:text-neutral-100 mb-3">
                {{ displayTitle }}
              </h3>

              <!-- Message -->
              <p class="text-center text-neutral-600 dark:text-neutral-400 mb-6">
                {{ displayMessage }}
              </p>

              <!-- Features List -->
              <div class="space-y-3 mb-8">
                <div
                  v-for="feature in displayFeatures"
                  :key="feature"
                  class="flex items-start gap-3"
                >
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-neutral-700 dark:text-neutral-300">{{ feature }}</span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-col gap-3">
                <router-link
                  to="/premium"
                  @click="close"
                  class="w-full px-6 py-4 bg-gradient-primary hover:shadow-glow-primary text-white font-bold text-lg rounded-xl transition-all text-center"
                >
                  {{ $t('premium.upgradeModal.upgradeButton') }}
                </router-link>
                <button
                  @click="close"
                  class="w-full px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl transition-colors"
                >
                  {{ $t('premium.upgradeModal.maybeLater') }}
                </button>
              </div>

              <!-- Pricing -->
              <p class="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4" v-html="$t('premium.upgradeModal.pricing')"></p>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  features: {
    type: Array,
    default: null,
  },
})

// Computed props with i18n fallbacks
const displayTitle = computed(() => props.title || t('premium.upgradeModal.defaultTitle'))
const displayMessage = computed(() => props.message || t('premium.upgradeModal.defaultMessage'))
const displayFeatures = computed(() => props.features || t('premium.upgradeModal.defaultFeatures'))

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
