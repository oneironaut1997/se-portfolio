<template>
  <div
    class="card group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="openProject"
  >
    <!-- Project Image/Preview -->
    <div class="relative overflow-hidden rounded-t-xl h-48 bg-gradient-to-br from-gray-700 to-gray-800">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>

      <!-- Placeholder for project image -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p class="text-sm text-gray-300">{{ project.title }}</p>
        </div>
      </div>

      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-8 h-8 mx-auto text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <p class="text-white text-sm font-medium">View Project</p>
        </div>
      </div>

      <!-- Featured badge -->
      <div v-if="project.featured" class="absolute top-4 right-4">
        <span class="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
          Featured
        </span>
      </div>
    </div>

    <!-- Project Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
          {{ project.title }}
        </h3>
        <div class="flex space-x-2">
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-300 hover:text-white transition-colors duration-200"
            @click.stop
            aria-label="View on GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            v-if="project.demoUrl"
            :href="project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-300 hover:text-white transition-colors duration-200"
            @click.stop
            aria-label="View live demo"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <p class="text-gray-300 text-sm mb-4 leading-relaxed">
        {{ project.description }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.technologies.slice(0, 4)"
          :key="tech"
          class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 4"
          class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
        >
          +{{ project.technologies.length - 4 }} more
        </span>
      </div>

      <!-- Category badge -->
      <div class="flex items-center justify-between">
        <span class="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full capitalize">
          {{ project.category }}
        </span>
        <div class="text-gray-500 text-xs">
          Click to explore
        </div>
      </div>
    </div>

    <!-- Project Modal -->
    <ProjectModal
      :project="project"
      :is-open="showModal"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '~/stores/portfolio'
import ProjectModal from '~/components/ProjectModal.vue'

// Props
interface Props {
  project: Project
}

const props = defineProps<Props>()

// Reactive state
const isHovered = ref(false)
const showModal = ref(false)

// Methods
const onMouseEnter = () => {
  isHovered.value = true
}

const onMouseLeave = () => {
  isHovered.value = false
}

const openProject = () => {
  console.log('Opening project:', props.project.title)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<style scoped>
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
</style>