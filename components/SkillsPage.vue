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
        <!-- 3D Skills Visualization -->
        <div class="relative h-96 mb-16 bg-gray-800/30 rounded-2xl overflow-hidden backdrop-blur-sm">
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
                  class="w-3 h-3"
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
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import * as THREE from 'three'
import { usePortfolioStore } from '~/stores/portfolio'
import { useThreeScene, ParticleSystem } from '~/composables/useThree'
import SkillBar from '~/components/SkillBar.vue'
import TextPressure from '~/components/TextPressure.vue'
import ShinyText from '~/components/ShinyText.vue'

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
let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()

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

// Methods
const onMouseMove = (event: MouseEvent) => {
  if (!skillsCanvas.value || !scene) return

  const rect = skillsCanvas.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, scene.camera.value)

  // Get mouse position in 3D world space (approximately at z=0 plane)
  const mouseWorldPos = new THREE.Vector3()
  raycaster.ray.at(5, mouseWorldPos) // Intersect with plane at z=0

  // Apply repulsion force to nearby particles
  skillParticles.forEach((particleSystem) => {
    const positions = particleSystem.positions
    const velocities = particleSystem.velocities
    const particleCount = particleSystem.count

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const particlePos = new THREE.Vector3(
        positions[i3]!,
        positions[i3 + 1]!,
        positions[i3 + 2]!
      )

      const distance = raycaster.ray.distanceToPoint(particlePos)
      if (distance < 2.0 && distance > 0.1) { // Repulsion range
        const repulsionForce = 0.05 / (distance * distance) // Inverse square law
        const closestPoint = new THREE.Vector3()
        raycaster.ray.closestPointToPoint(particlePos, closestPoint)
        const repulsionVector = new THREE.Vector3()
          .subVectors(particlePos, closestPoint)
          .normalize()
          .multiplyScalar(repulsionForce)

        velocities[i3]! += repulsionVector.x
        velocities[i3 + 1]! += repulsionVector.y
        velocities[i3 + 2]! += repulsionVector.z

        // Dampen velocities to prevent runaway
        velocities[i3]! *= 0.95
        velocities[i3 + 1]! *= 0.95
        velocities[i3 + 2]! *= 0.95
      }
    }
  })
}

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

  try {
    // Initialize Three.js scene
    scene = useThreeScene(skillsCanvas, {
      antialias: true,
      alpha: true
    })

    // Create particle systems for each skill category
    const categories = ['frontend', 'backend', 'tools', 'soft']
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

    categories.forEach((category, index) => {
      const particleSystem = new ParticleSystem(10)
      particleSystem.setColor(parseInt(colors[index]!.slice(1), 16))
      particleSystem.setSize(1.0)

      // Position different categories in different areas
      const angle = (index / categories.length) * Math.PI * 2
      const radius = 3
      particleSystem.particles.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        0
      )

      if (scene.scene.value) {
        scene.scene.value.add(particleSystem.particles)
      }
      skillParticles.push(particleSystem)
    })

    // Position camera
    scene.camera.value.position.set(0, 0, 8)
    scene.camera.value.lookAt(0, 0, 0)

    // Animation loop
    const animate = () => {
      skillParticles.forEach(particles => particles.update())
      if (scene.renderer.value && scene.scene.value && scene.camera.value) {
        scene.renderer.value.render(scene.scene.value, scene.camera.value)
      }
      animationFrame = requestAnimationFrame(animate)
    }

    // Add mouse interaction
    const canvas = skillsCanvas.value
    if (canvas) {
      canvas.addEventListener('mousemove', onMouseMove)
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

  if (skillsCanvas.value) {
    skillsCanvas.value.removeEventListener('mousemove', onMouseMove)
  }

  if (scene && scene.dispose) {
    scene.dispose()
  }

  skillParticles.forEach(particles => particles.dispose())
  skillParticles = []
}

// Lifecycle
onMounted(() => {
  // Watch for canvas to be available (due to client-only)
  watchEffect(() => {
    if (skillsCanvas.value) {
      initSkillsVisualization()
    }
  })
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* Additional styles for skills page */
</style>