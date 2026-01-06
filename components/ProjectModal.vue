<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click="closeModal"
    >
      <!-- Modal Container -->
      <div
        class="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 rounded-xl shadow-2xl border border-gray-700"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-800"
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="p-8">
          <!-- Project Image/Preview -->
          <div class="relative h-64 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <svg class="w-20 h-20 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p class="text-lg text-gray-300 font-medium">{{ project.title }}</p>
              </div>
            </div>

            <!-- Featured badge -->
            <div v-if="project.featured" class="absolute top-4 right-4">
              <span class="px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-full">
                Featured
              </span>
            </div>
          </div>

          <!-- Project Title -->
          <h2 class="text-3xl font-bold text-white mb-4">{{ project.title }}</h2>

          <!-- Project Description -->
          <p class="text-gray-300 text-lg leading-relaxed mb-6">{{ project.description }}</p>

          <!-- Technologies -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-white mb-3">Technologies Used</h3>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-3 py-2 bg-blue-900/50 text-blue-300 text-sm rounded-lg border border-blue-700/50"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Project Links -->
          <div class="flex flex-wrap gap-4 mb-6">
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live Demo
            </a>
          </div>

          <!-- Category -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-700">
            <span class="px-4 py-2 bg-blue-900/50 text-blue-300 text-sm rounded-full capitalize border border-blue-700/50">
              {{ project.category }}
            </span>
            <button
              @click="closeModal"
              class="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Project } from '~/stores/portfolio'

// Props
interface Props {
  project: Project
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Methods
const closeModal = () => {
  emit('close')
}

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom scrollbar for modal content */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>