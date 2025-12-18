<template>
  <div
    ref="canvasContainer"
    class="pkl-particle-system-container"
  >
    <client-only>
      <canvas
        ref="pklCanvas"
        class="three-js-canvas"
        :aria-label="'Interactive P.K.L. (Personal Knowledge Link) particle system across the site'"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { usePortfolioStore } from '~/stores/portfolio'
import { PKLAvatar } from '~/composables/useThree'

// Props
interface Props {
  currentSection?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentSection: 'landing'
})

// Store
const portfolioStore = usePortfolioStore()

// Refs
const pklCanvas = ref<HTMLCanvasElement>()
const canvasContainer = ref<HTMLDivElement>()

// Event handlers
let handleMouseMove: ((event: MouseEvent) => void) | null = null
let handleMouseLeave: (() => void) | null = null

// Three.js variables
let scene: any = null
let pklAvatar: PKLAvatar | null = null
let animationFrame: number | null = null
let mouse = { x: 0, y: 0 }
let isMouseMoving = false
let mouseTimeout: number | null = null
let isFollowingMouse = false
let isMouseInside = true
let mouseScaleX = 1
let mouseScaleY = 1
let tanHalfFov = Math.tan((75 * Math.PI) / 180 / 2)
let cameraDistance = 15

const initPKLParticleSystem = async () => {
  // console.log('initPKLParticleSystem called, canvas ref:', pklCanvas.value)
  if (!pklCanvas.value) {
    console.warn('PKL canvas ref not available, retrying in next tick')
    await nextTick()
    if (!pklCanvas.value) {
      console.error('Canvas ref still not available after nextTick')
      return
    }
  }

  try {
    // console.log('Initializing PKL particle system...')

    // Initialize Three.js scene directly (not using useThreeScene composable)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: pklCanvas.value,
      antialias: false, // Performance optimization
      alpha: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    scene = {
      scene: new THREE.Scene(),
      camera,
      renderer,
      animate: (callback: () => void) => {
        const animateFrame = () => {
          callback()
          animationFrame = requestAnimationFrame(animateFrame)
        }
        animateFrame()
      },
      resize: () => {
        if (!camera || !renderer) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        mouseScaleX = cameraDistance * tanHalfFov * camera.aspect
        mouseScaleY = cameraDistance * tanHalfFov
      },
      dispose: () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
        if (renderer) {
          renderer.dispose()
        }
        scene.scene.traverse((object: any) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose()
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material: any) => material.dispose())
              } else {
                object.material.dispose()
              }
            }
          }
        })
      }
    }

    // Create PKL avatar with optimized particle count for landing section
    cameraDistance = props.currentSection === 'landing' ? 15 : 17
    const fovRad = (75 * Math.PI) / 180
    tanHalfFov = Math.tan(fovRad / 2)
    mouseScaleX = cameraDistance * tanHalfFov * camera.aspect
    mouseScaleY = cameraDistance * tanHalfFov
    const particleCount = props.currentSection === 'landing' ? 2500 : 2000
    // console.log(`Creating PKL avatar with ${particleCount} particles`)
    pklAvatar = new PKLAvatar(particleCount)
    if (scene.scene && pklAvatar.mesh) {
      scene.scene.add(pklAvatar.mesh)
      // console.log('PKL avatar added to scene')
    }

    // Position camera for background effect - adjusted to show full sphere
    scene.camera.position.set(0, 0, cameraDistance)
    scene.camera.lookAt(0, 0, 0)
    // console.log(`Camera positioned at z=${cameraDistance}`)

    // Add mouse interaction
    handleMouseMove = (event: MouseEvent) => {
      const rect = pklCanvas.value?.getBoundingClientRect()
      if (!rect) return

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      isMouseInside = true
      isMouseMoving = true

      // Clear existing timeout
      if (mouseTimeout) {
        clearTimeout(mouseTimeout)
      }

      // Set timeout to stop mouse movement detection
      mouseTimeout = window.setTimeout(() => {
        isMouseMoving = false
      }, 100)
    }

    handleMouseLeave = () => {
      isMouseInside = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Animation loop
    const animate = () => {
      if (pklAvatar) {
        pklAvatar.update()

        // Interactive behavior based on mouse movement
        if (isMouseMoving) {
          // Make particles react to mouse
          const influence = 0.02
          pklAvatar.particles.rotation.y += mouse.x * influence
          pklAvatar.particles.rotation.x += mouse.y * influence

          // Add some particle attraction to mouse position
          const mouse3D = {
            x: mouse.x * 5,
            y: mouse.y * 5,
            z: 0
          }

          // Subtle particle movement towards mouse
          for (let i = 0; i < Math.min(pklAvatar.count, 100); i++) {
            const i3 = i * 3
            const dx = mouse3D.x - pklAvatar.positions[i3]!
            const dy = mouse3D.y - pklAvatar.positions[i3 + 1]!
            const dz = mouse3D.z - pklAvatar.positions[i3 + 2]!

            pklAvatar.positions[i3]! += dx * 0.01
            pklAvatar.positions[i3 + 1]! += dy * 0.01
            pklAvatar.positions[i3 + 2]! += dz * 0.01
          }
          pklAvatar.geometry.attributes.position.needsUpdate = true
        } else {
          // Gentle floating motion when not interacting
          pklAvatar.particles.rotation.y += 0.002
          pklAvatar.particles.rotation.x += 0.001
        }
      }
    
      if (isFollowingMouse && pklAvatar && pklAvatar.mesh) {
        const targetX = isMouseInside ? mouse.x * mouseScaleX : 0
        const targetY = isMouseInside ? mouse.y * mouseScaleY : 0
        const targetZ = 0
        const lerpFactor = 0.02
        const dx = (targetX - pklAvatar.mesh.position.x) * lerpFactor
        const dy = (targetY - pklAvatar.mesh.position.y) * lerpFactor
        const dz = (targetZ - pklAvatar.mesh.position.z) * lerpFactor
        pklAvatar.mesh.position.x += dx
        pklAvatar.mesh.position.y += dy
        pklAvatar.mesh.position.z += dz
        // Move all particles
        for (let i = 0; i < pklAvatar.count; i++) {
          const i3 = i * 3
          pklAvatar.positions[i3] += dx
          pklAvatar.positions[i3 + 1] += dy
          pklAvatar.positions[i3 + 2] += dz
        }
        pklAvatar.geometry.attributes.position.needsUpdate = true
      }
    
      if (scene.renderer && scene.scene && scene.camera) {
        scene.renderer.render(scene.scene, scene.camera)
      }
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    // Form PKL initially, then start orbiting
    setTimeout(() => {
      if (pklAvatar) {
        // console.log('Forming PKL avatar initially')
        pklAvatar.formAvatar(2000)

        // After formation, start orbital animation
        setTimeout(() => {
          if (pklAvatar) {
            // console.log('Starting orbital animation')
            pklAvatar.startOrbiting()
            // isFollowingMouse = true
          }
        }, 2500) // Start orbiting 2.5 seconds after formation begins
      }
    }, 500)

    // Set canvas opacity to visible after initialization
    if (pklCanvas.value) {
      pklCanvas.value.style.opacity = '1'
      // console.log('Canvas opacity set to 1')
    }

  } catch (error) {
    console.warn('Jarvis particle system initialization failed:', error)
  }
}

const cleanup = () => {
  isFollowingMouse = false
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
    handleMouseMove = null
  }
  if (handleMouseLeave) {
    window.removeEventListener('mouseleave', handleMouseLeave)
    handleMouseLeave = null
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  if (mouseTimeout) {
    clearTimeout(mouseTimeout)
  }

  if (scene && scene.dispose) {
    scene.dispose()
  }

  if (pklAvatar) {
    pklAvatar.dispose()
  }
}

// Watch for section changes to animate PKL differently
watch(() => props.currentSection, (newSection, oldSection) => {
  if (!pklAvatar) return

  isFollowingMouse = false

  // Stop orbital motion and smoothly transition back to initial shape
  pklAvatar.stopOrbiting()

  pklAvatar.disperseParticles()

  // Smooth transition back to initial shape, then restart orbital motion
  // setTimeout(() => {
    if (pklAvatar) {
      pklAvatar.formAvatar(1500)
      // Restart orbital motion after formation
      setTimeout(() => {
        pklAvatar?.startOrbiting()
        // isFollowingMouse = true
      }, 2000)
    }
  // }, 300) // Small delay for smooth transition
})

// Watch for particle system toggle
watch(() => portfolioStore.particleSystemActive, (active) => {
  if (!pklCanvas.value) return

  if (!active) {
    pklCanvas.value.style.opacity = '0'
  } else {
    pklCanvas.value.style.opacity = '1'
  }
})

// Intersection observer for landing section performance
let intersectionObserver: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (!canvasContainer.value) return

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && props.currentSection === 'landing') {
          // Resume/restart avatar formation when landing section becomes visible
          if (pklAvatar) {
            pklAvatar.formAvatar(2000)
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  intersectionObserver.observe(canvasContainer.value)
}

// Lifecycle
onMounted(async () => {
  // console.log('PKLParticleSystem mounted')
  await nextTick()
  // console.log('After nextTick, canvas ref:', pklCanvas.value)
  initPKLParticleSystem()
  setupIntersectionObserver()
})

onUnmounted(() => {
  cleanup()
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
})
</script>

<style scoped>
.pkl-particle-system-container {
  @apply fixed inset-0 pointer-events-none;
  z-index: 0;
}

.three-js-canvas {
  @apply w-full h-full;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.pkl-particle-system-container.active .three-js-canvas {
  opacity: 1;
}
</style>