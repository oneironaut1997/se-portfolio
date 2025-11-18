<template>
  <div id="skills" class="relative min-h-screen py-20">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Skills & Expertise
        </span>
      </h2>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto">
        A comprehensive overview of my technical skills and proficiency levels
      </p>
    </div>

    <!-- Skills Visualization Container -->
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- 3D Skills Visualization -->
        <div class="relative h-96 mb-16 bg-gray-800/30 rounded-2xl overflow-hidden">
          <client-only>
            <canvas
              ref="skillsCanvas"
              class="w-full h-full"
              :aria-label="'3D skills visualization'"
            />
          </client-only>

          <!-- Skills Legend -->
          <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div v-for="category in skillCategories" :key="category.id" class="flex items-center space-x-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-gray-300 capitalize">{{ category.name }}</span>
              </div>
            </div>
          </div>
        </div>

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

        <!-- Additional Skills -->
        <div class="mt-16 text-center">
          <h3 class="text-2xl font-bold text-white mb-8">Additional Expertise</h3>
          <div class="flex flex-wrap justify-center gap-3">
            <span
              v-for="skill in additionalSkills"
              :key="skill"
              class="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 rounded-full text-sm hover:from-gray-600 hover:to-gray-500 transition-all duration-200"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <p class="text-gray-400 mb-6">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useThreeScene, ParticleSystem } from '~/composables/useThree'
import SkillBar from '~/components/SkillBar.vue'

// Emits
const emit = defineEmits<{
  navigate: [section: string]
}>()

// Store
const portfolioStore = usePortfolioStore()

// Refs
const skillsCanvas = ref<HTMLCanvasElement>()

// Three.js variables
let scene: any = null
let skillParticles: ParticleSystem[] = []
let animationFrame: number | null = null

// Computed properties
const skillsByCategory = computed(() => {
  const categories = ['frontend', 'backend', 'tools', 'soft'] as const
  return categories.map(name => ({
    name,
    skills: portfolioStore.skillsByCategory[name] || []
  }))
})

const skillCategories = [
  { id: 'frontend', name: 'frontend', color: '#3b82f6' },
  { id: 'backend', name: 'backend', color: '#10b981' },
  { id: 'tools', name: 'tools', color: '#8b5cf6' },
  { id: 'soft', name: 'soft skills', color: '#f59e0b' }
]

const additionalSkills = [
  'Agile Development', 'CI/CD', 'Docker', 'AWS', 'Git', 'REST APIs',
  'GraphQL', 'WebSockets', 'Progressive Web Apps', 'SEO Optimization',
  'Performance Optimization', 'Code Review', 'Mentoring', 'Technical Writing'
]

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

const initSkillsVisualization = async () => {
  if (!skillsCanvas.value) return

  try {
    // Initialize Three.js scene
    scene = useThreeScene({
      antialias: true,
      alpha: true
    })

    // Create particle systems for each skill category
    const categories = ['frontend', 'backend', 'tools', 'soft']
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

    categories.forEach((category, index) => {
      const particleSystem = new ParticleSystem(200)
      particleSystem.setColor(colors[index])
      particleSystem.setSize(0.03)

      // Position different categories in different areas
      const angle = (index / categories.length) * Math.PI * 2
      const radius = 3
      particleSystem.particles.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        0
      )

      if (scene.scene) {
        scene.scene.add(particleSystem.particles)
      }
      skillParticles.push(particleSystem)
    })

    // Position camera
    scene.camera.position.set(0, 0, 8)
    scene.camera.lookAt(0, 0, 0)

    // Animation loop
    const animate = () => {
      skillParticles.forEach(particles => particles.update())
      if (scene.renderer && scene.scene && scene.camera) {
        scene.renderer.render(scene.scene, scene.camera)
      }
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

  } catch (error) {
    console.warn('Skills visualization initialization failed:', error)
  }
}

const cleanup = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  if (scene && scene.dispose) {
    scene.dispose()
  }

  skillParticles.forEach(particles => particles.dispose())
  skillParticles = []
}

// Lifecycle
onMounted(() => {
  initSkillsVisualization()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* Additional styles for skills page */
</style>