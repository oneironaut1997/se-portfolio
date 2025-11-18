<template>
  <div class="projects-carousel">
    <div
      ref="carouselContainer"
      class="relative h-96 overflow-hidden"
      :aria-label="'3D projects carousel'"
    >
      <client-only>
        <canvas
          ref="carouselCanvas"
          class="w-full h-full"
          :aria-label="'Interactive 3D project showcase'"
        />
      </client-only>

      <!-- Carousel Controls -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          @click="previousProject"
          class="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
          :aria-label="'Previous project'"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex space-x-2">
          <button
            v-for="(project, index) in projects"
            :key="project.id"
            @click="goToProject(index)"
            class="w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            :class="index === currentIndex ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'"
            :aria-label="`Go to project ${index + 1}: ${project.title}`"
          ></button>
        </div>

        <button
          @click="nextProject"
          class="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
          :aria-label="'Next project'"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Project Info Overlay -->
      <div
        v-if="currentProject"
        class="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-4"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white mb-2">{{ currentProject.title }}</h3>
            <p class="text-gray-300 text-sm mb-3 line-clamp-2">{{ currentProject.description }}</p>
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tech in currentProject.technologies.slice(0, 3)"
                :key="tech"
                class="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-md"
              >
                {{ tech }}
              </span>
              <span
                v-if="currentProject.technologies.length > 3"
                class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
              >
                +{{ currentProject.technologies.length - 3 }} more
              </span>
            </div>
          </div>

          <div class="flex space-x-2 ml-4">
            <button
              v-if="currentProject.githubUrl"
              @click="openUrl(currentProject.githubUrl)"
              class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
              :aria-label="'View ${currentProject.title} on GitHub'"
            >
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>

            <button
              v-if="currentProject.demoUrl"
              @click="openUrl(currentProject.demoUrl)"
              class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
              :aria-label="'View ${currentProject.title} live demo'"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>

            <button
              @click="$emit('viewDetails', currentProject)"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useThreeScene } from '~/composables/useThree'
import { useGSAPAnimations } from '~/composables/useGSAP'
import type { Project } from '~/stores/portfolio'
import * as THREE from 'three'

// Emits
const emit = defineEmits<{
  viewDetails: [project: Project]
}>()

// Store
const portfolioStore = usePortfolioStore()

// GSAP
const { animations, isReady } = useGSAPAnimations()

// Refs
const carouselContainer = ref<HTMLDivElement>()
const carouselCanvas = ref<HTMLCanvasElement>()

// Reactive state
const currentIndex = ref(0)
const isAnimating = ref(false)

// Three.js variables
let scene: any = null
let projectCards: any[] = []
let animationFrame: number | null = null
let rotationAngle = 0

// Computed properties
const projects = computed(() => portfolioStore.projects)
const currentProject = computed(() => projects.value[currentIndex.value])

// Methods
const initCarousel = async () => {
  if (!carouselCanvas.value) return

  try {
    // Initialize Three.js scene
    scene = useThreeScene({
      antialias: true,
      alpha: true
    })

    // Create project cards in 3D space
    createProjectCards()

    // Position camera
    scene.camera.position.set(0, 0, 8)
    scene.camera.lookAt(0, 0, 0)

    // Animation loop
    const animate = () => {
      rotationAngle += 0.005

      // Rotate the entire carousel slowly
      projectCards.forEach((card, index) => {
        const angle = (index / projectCards.length) * Math.PI * 2 + rotationAngle
        const radius = 4
        card.position.x = Math.cos(angle) * radius
        card.position.z = Math.sin(angle) * radius

        // Scale based on distance from center (front-facing card is larger)
        const distance = Math.abs(angle % (Math.PI * 2) - Math.PI)
        const scale = Math.max(0.5, 1 - distance / Math.PI)
        card.scale.setScalar(scale)

        // Opacity based on scale
        if (card.material) {
          card.material.opacity = Math.max(0.3, scale * 0.8)
        }
      })

      if (scene.renderer && scene.scene && scene.camera) {
        scene.renderer.render(scene.scene, scene.camera)
      }
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

  } catch (error) {
    console.warn('3D carousel initialization failed:', error)
  }
}

const createProjectCards = () => {
  projects.value.forEach((project, index) => {
    // Create a simple card geometry
    const geometry = new THREE.PlaneGeometry(2, 1.2)
    const material = new THREE.MeshBasicMaterial({
      color: 0x1f2937,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    })

    const card = new THREE.Mesh(geometry, material)

    // Add text texture (simplified - in production, use proper text rendering)
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(project.title, 10, 30)
    ctx.font = '12px Arial'
    ctx.fillText(project.description.substring(0, 50) + '...', 10, 50)

    const texture = new THREE.CanvasTexture(canvas)
    material.map = texture

    projectCards.push(card)
    if (scene.scene) {
      scene.scene.add(card)
    }
  })
}

const nextProject = () => {
  if (isAnimating.value) return
  currentIndex.value = (currentIndex.value + 1) % projects.value.length
  animateToProject()
}

const previousProject = () => {
  if (isAnimating.value) return
  currentIndex.value = currentIndex.value === 0 ? projects.value.length - 1 : currentIndex.value - 1
  animateToProject()
}

const goToProject = (index: number) => {
  if (isAnimating.value || index === currentIndex.value) return
  currentIndex.value = index
  animateToProject()
}

const animateToProject = () => {
  if (!isReady() || !animations() || !animations()!.isAnimationsEnabled()) return

  isAnimating.value = true

  // Calculate target rotation
  const targetAngle = (currentIndex.value / projects.value.length) * Math.PI * 2

  // Animate rotation
  animations()!.set({ rotationAngle }, {
    rotationAngle: targetAngle,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      isAnimating.value = false
    }
  })
}

const openUrl = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Watch for project changes
watch(() => projects.value.length, (newLength) => {
  if (newLength > 0 && projectCards.length === 0) {
    createProjectCards()
  }
})

// Lifecycle
onMounted(() => {
  initCarousel()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  if (scene && scene.dispose) {
    scene.dispose()
  }

  projectCards.forEach(card => {
    if (card.geometry) card.geometry.dispose()
    if (card.material) card.material.dispose()
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>