import { ref, onMounted, onUnmounted, watchEffect, type Ref } from 'vue'
import * as THREE from 'three'

export interface ThreeSceneConfig {
  antialias?: boolean
  alpha?: boolean
  powerPreference?: 'high-performance' | 'low-power' | 'default'
  stencil?: boolean
  depth?: boolean
}

export interface ThreeSceneReturn {
  canvas: Ref<HTMLCanvasElement | undefined>
  scene: Ref<THREE.Scene>
  camera: Ref<THREE.PerspectiveCamera | undefined>
  renderer: Ref<THREE.WebGLRenderer | undefined>
  animate: (callback: () => void) => void
  resize: () => void
  dispose: () => void
}

export function useThreeScene(
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  config: ThreeSceneConfig = {}
): ThreeSceneReturn {
  const canvas = canvasRef
  const scene = ref(new THREE.Scene())
  const camera = ref<THREE.PerspectiveCamera>()
  const renderer = ref<THREE.WebGLRenderer>()
  const animationId = ref<number>()

  // Watch for canvas ref to be available
  watchEffect(() => {
    if (canvas.value) {
      initScene()
    }
  })

  // Default configuration
  const defaultConfig: Required<ThreeSceneConfig> = {
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
    ...config
  }

  const initScene = () => {
    if (!canvas.value) return

    // Create camera
    const aspect = window.innerWidth / window.innerHeight
    camera.value = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.value.position.z = 5

    // Create renderer
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: defaultConfig.antialias,
      alpha: defaultConfig.alpha,
      powerPreference: defaultConfig.powerPreference,
      stencil: defaultConfig.stencil,
      depth: defaultConfig.depth
    })

    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Set clear color
    renderer.value.setClearColor(0x000000, 0)

    // Enable shadows (optional, based on performance needs)
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
  }

  const animate = (callback: () => void) => {
    const animateFrame = () => {
      callback()
      animationId.value = requestAnimationFrame(animateFrame)
    }
    animateFrame()
  }

  const resize = () => {
    if (!camera.value || !renderer.value) return

    // Update camera aspect ratio
    camera.value.aspect = window.innerWidth / window.innerHeight
    camera.value.updateProjectionMatrix()

    // Update renderer size
    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  const dispose = () => {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
    }

    if (renderer.value) {
      renderer.value.dispose()
    }

    // Dispose of geometries, materials, and textures
    scene.value.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
    })
  }

  // Lifecycle hooks
  onMounted(() => {
    // Handle window resize
    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      dispose()
    })
  })

  return {
    canvas,
    scene,
    camera,
    renderer,
    animate,
    resize,
    dispose
  }
}

// Particle system utilities
export class ParticleSystem {
  public particles: THREE.Points
  public geometry: THREE.BufferGeometry
  protected material: THREE.PointsMaterial
  public positions: Float32Array
  protected velocities: Float32Array
  public count: number

  constructor(count: number = 1000) {
    this.count = count
    this.geometry = new THREE.BufferGeometry()
    this.positions = new Float32Array(count * 3)
    this.velocities = new Float32Array(count * 3)

    // Initialize positions and velocities
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      this.positions[i3] = (Math.random() - 0.5) * 20
      this.positions[i3 + 1] = (Math.random() - 0.5) * 20
      this.positions[i3 + 2] = (Math.random() - 0.5) * 20

      this.velocities[i3] = (Math.random() - 0.5) * 0.02
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))

    this.material = new THREE.PointsMaterial({
      color: 0x4f46e5,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      vertexColors: false
    })

    this.particles = new THREE.Points(this.geometry, this.material)
  }

  get mesh(): THREE.Points {
    return this.particles
  }

  update() {
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3

      // Update positions based on velocities
      this.positions[i3] += this.velocities[i3]
      this.positions[i3 + 1] += this.velocities[i3 + 1]
      this.positions[i3 + 2] += this.velocities[i3 + 2]

      // Boundary checks and wrapping
      if (Math.abs(this.positions[i3]!) > 10) this.velocities[i3]! *= -1
      if (Math.abs(this.positions[i3 + 1]!) > 10) this.velocities[i3 + 1]! *= -1
      if (Math.abs(this.positions[i3 + 2]!) > 10) this.velocities[i3 + 2]! *= -1
    }

    this.geometry.attributes.position.needsUpdate = true
  }

  setColor(color: number) {
    this.material.color.setHex(color)
  }

  setSize(size: number) {
    this.material.size = size
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

// PKL avatar particle system
export class PKLAvatar extends ParticleSystem {
  private targetPositions: Float32Array
  private morphProgress: number = 0
  private isForming: boolean = false

  constructor(count: number = 2000) {
    super(count)
    this.targetPositions = new Float32Array(count * 3)
    this.generatePKLShape()
  }

  private generatePKLShape() {
    // Generate a rough circular/oval shape for Jarvis face
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      const angle = (i / this.count) * Math.PI * 2
      const radius = 2 + Math.random() * 0.5

      this.targetPositions[i3] = Math.cos(angle) * radius
      this.targetPositions[i3 + 1] = Math.sin(angle) * radius * 0.7 // Slightly oval
      this.targetPositions[i3 + 2] = (Math.random() - 0.5) * 0.5 // Some depth
    }
  }

  animateMorph(targetPositions: Float32Array, duration: number = 2000) {
    this.targetPositions = targetPositions
    this.isForming = true
    this.morphProgress = 0

    // Simple animation without GSAP dependency for now
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      this.morphProgress = Math.min(elapsed / duration, 1)

      if (this.morphProgress < 1) {
        requestAnimationFrame(animate)
      } else {
        this.isForming = false
      }
    }
    animate()
  }

  formAvatar(duration: number = 2000) {
    this.animateMorph(this.targetPositions, duration)
  }

  disperseParticles() {
    this.isForming = false
    this.morphProgress = 0
  }

  override update() {
    if (this.isForming) {
      // Morph positions towards target shape
      for (let i = 0; i < this.count; i++) {
        const i3 = i * 3
        this.positions[i3]! += (this.targetPositions[i3]! - this.positions[i3]!) * 0.1
        this.positions[i3 + 1]! += (this.targetPositions[i3 + 1]! - this.positions[i3 + 1]!) * 0.1
        this.positions[i3 + 2]! += (this.targetPositions[i3 + 2]! - this.positions[i3 + 2]!) * 0.1
      }
    } else {
      // Normal particle movement
      super.update()
    }

    this.geometry.attributes.position.needsUpdate = true
  }
}