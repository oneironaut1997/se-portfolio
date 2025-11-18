<template>
  <div class="particle-system-container">
    <canvas
      ref="particleCanvas"
      class="three-js-canvas"
      :aria-label="'Interactive particle system background'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useThreeScene, ParticleSystem as ThreeParticleSystem } from '~/composables/useThree'

// Props
interface Props {
  particleCount?: number
  color?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  particleCount: 1000,
  color: '#3b82f6',
  size: 0.05
})

// Store
const portfolioStore = usePortfolioStore()

// Refs
const particleCanvas = ref<HTMLCanvasElement>()

// Three.js variables
let scene: any = null
let particleSystem: ThreeParticleSystem | null = null
let animationFrame: number | null = null

const initParticleSystem = async () => {
  if (!particleCanvas.value) return

  try {
    // Initialize Three.js scene
    scene = useThreeScene({
      antialias: false, // Disable for performance
      alpha: true
    })

    // Create particle system
    particleSystem = new ThreeParticleSystem(props.particleCount)
    particleSystem.setColor(props.color)
    particleSystem.setSize(props.size)
    scene.scene.add(particleSystem.particles)

    // Position camera for background effect
    scene.camera.position.set(0, 0, 10)
    scene.camera.lookAt(0, 0, 0)

    // Animation loop
    const animate = () => {
      if (particleSystem) {
        particleSystem.update()
      }

      scene.renderer.render(scene.scene, scene.camera)
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

  } catch (error) {
    console.warn('Particle system initialization failed:', error)
  }
}

const cleanup = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  if (scene) {
    scene.dispose()
  }

  if (particleSystem) {
    particleSystem.dispose()
  }
}

// Watch for particle system toggle
watch(() => portfolioStore.particleSystemActive, (active) => {
  if (!active && particleCanvas.value) {
    particleCanvas.value.style.opacity = '0'
  } else if (particleCanvas.value) {
    particleCanvas.value.style.opacity = '1'
  }
})

// Lifecycle
onMounted(() => {
  initParticleSystem()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.particle-system-container {
  @apply fixed inset-0 pointer-events-none;
  z-index: 0;
}

.three-js-canvas {
  @apply w-full h-full;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.particle-system-container.active .three-js-canvas {
  opacity: 1;
}
</style>