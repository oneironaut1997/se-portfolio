<template>
  <div id="skills" class="relative min-h-screen py-20">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        <TextPressure text="Skills & Expertise" textColor="transparent" className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text" :minFontSize="60" />
      </h1>
      <ShinyText text="A comprehensive overview of my technical skills and proficiency levels." className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed" />
    </div>

    <!-- Skills Visualization Container -->
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Toggle Button -->
        <div class="text-center mb-8">
          <button
            @click="toggleVisualization"
            class="btn-secondary text-lg px-6 py-3"
          >
            {{ showVisualization ? 'Hide' : 'Show' }} Skills Visualization
            <svg class="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="showVisualization ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'" />
            </svg>
          </button>
        </div>

        <SkillsVisualization v-if="showVisualization" />

        <!-- Skills Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="category in skillsByCategory"
            :key="category.name"
            class="space-y-4"
          >
            <h3 class="text-xl font-bold text-white flex items-center space-x-2">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: getCategoryColor(category.name) }"
              ></div>
              <span class="capitalize">{{ category.name }}</span>
            </h3>

            <div class="space-y-3">
              <SkillBar
                v-for="skill in category.skills"
                :key="skill.id"
                :skill="skill"
                :color="getCategoryColor(category.name)"
              />
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <p class="text-gray-300 mb-6">
            Interested in collaborating? Let's discuss how my skills can help bring your project to life.
          </p>
          <button
            @click="$emit('navigate', 'contact')"
            class="btn-primary text-lg px-8 py-4"
          >
            Start a Conversation
            <svg class="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import SkillBar from '~/components/SkillBar.vue'
import TextPressure from '~/components/TextPressure.vue'
import ShinyText from '~/components/ShinyText.vue'
import SkillsVisualization from '~/components/SkillsVisualization.vue'

// Emits
const emit = defineEmits<{
  navigate: [section: string]
}>()

// Store
const portfolioStore = usePortfolioStore()

// Refs
const showVisualization = ref(false)

// Computed
const skillsByCategory = computed(() => {
  const categories = ['frontend', 'backend', 'tools', 'soft'] as const
  return categories.map(name => ({
    name,
    skills: portfolioStore.skillsByCategory[name] || []
  }))
})

// Methods
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    frontend: '#3b82f6',
    backend: '#10b981',
    tools: '#8b5cf6',
    soft: '#f59e0b'
  }
  return colors[category] || '#6b7280'
}

const toggleVisualization = () => {
  showVisualization.value = !showVisualization.value
}
</script>

<style scoped>
/* Additional styles for skills page */
</style>