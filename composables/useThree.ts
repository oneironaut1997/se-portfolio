import { ref, onMounted, onUnmounted, watchEffect, markRaw, type Ref } from 'vue'
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
  const scene = ref(markRaw(new THREE.Scene()))
  const camera = ref<THREE.PerspectiveCamera>()
  const renderer = ref<THREE.WebGLRenderer>()
  const animationId = ref<number>()

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
    camera.value = markRaw(new THREE.PerspectiveCamera(75, aspect, 0.1, 1000))
    camera.value.position.z = 5

    // Create renderer
    renderer.value = markRaw(new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: defaultConfig.antialias,
      alpha: defaultConfig.alpha,
      powerPreference: defaultConfig.powerPreference,
      stencil: defaultConfig.stencil,
      depth: defaultConfig.depth
    }))

    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Set clear color
    renderer.value.setClearColor(0x000000, 0)

    // Enable shadows (optional, based on performance needs)
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
  }

  // Watch for canvas ref to be available
  watchEffect(() => {
    if (canvas.value) {
      initScene()
    }
  })

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
      color: 0x00BFFF, // Jarvis blue
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      vertexColors: false,
      depthTest: false
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
  private pulseTime: number = 0
  private flickerOffset: number = 0
  private orbitAngles: Float32Array
  private orbitSpeeds: Float32Array
  private orbitRadii: Float32Array
  private orbitOffsets: Float32Array
  private isOrbiting: boolean = false
  private orbitStartTime: number = 0
  private orbitalTransitionProgress: number = 0
  private isTransitioningToOrbit: boolean = false
  private isFormingCenter: boolean = false
  private morphProgressCenter: number = 0
  private centerTargetPositions: Float32Array

  constructor(count: number = 2000) {
    super(count)
    this.targetPositions = new Float32Array(count * 3)
    this.orbitAngles = new Float32Array(count)
    this.orbitSpeeds = new Float32Array(count)
    this.orbitRadii = new Float32Array(count)
    this.orbitOffsets = new Float32Array(count * 3)
    this.centerTargetPositions = new Float32Array(Math.floor(count * 0.25) * 3)

    // Initialize orbital mechanics with truly random paths
    for (let i = 0; i < count; i++) {
      this.orbitAngles[i] = Math.random() * Math.PI * 2
      this.orbitSpeeds[i] = (Math.random() - 0.5) * 0.04 // Random speeds and directions (-0.02 to +0.02)
      this.orbitRadii[i] = 2 + Math.random() * 4 // Random orbital distances (2-6 units)

      // Random orbital offsets for irregular shapes
      this.orbitOffsets[i * 3] = (Math.random() - 0.5) * 2 // X offset
      this.orbitOffsets[i * 3 + 1] = (Math.random() - 0.5) * 2 // Y offset
      this.orbitOffsets[i * 3 + 2] = (Math.random() - 0.5) * 1 // Z offset
    }

    this.generatePKLShape()
  }

  private generatePKLShape() {
    // Generate truly random orbital system: each particle has unique orbital characteristics
    const centerRadius = 0.8 // Glowing center ball
    const centerParticles = Math.floor(this.count * 0.25) // 25% for center

    let particleIndex = 0

    // Center particles start at origin - will form sphere when orbiting
    for (let i = 0; i < centerParticles && particleIndex < this.count; i++) {
      const i3 = particleIndex * 3
      this.targetPositions[i3] = 0
      this.targetPositions[i3 + 1] = 0
      this.targetPositions[i3 + 2] = 0
      particleIndex++
    }

    // Random orbital particles (75% of particles) - each with unique orbital path
    while (particleIndex < this.count) {
      const i3 = particleIndex * 3

      // Each particle gets completely random orbital characteristics
      const baseRadius = 2 + Math.random() * 4 // Random distance from center (2-6 units)
      const eccentricity = Math.random() * 0.8 // Random elliptical factor (0-0.8)
      const inclination = (Math.random() - 0.5) * Math.PI // Random orbital plane tilt
      const longitudeOfAscendingNode = Math.random() * Math.PI * 2 // Random orbital orientation
      const argumentOfPeriapsis = Math.random() * Math.PI * 2 // Random ellipse orientation

      // Create irregular orbital shape using multiple harmonics
      const angle = Math.random() * Math.PI * 2
      const radiusVariation =
        baseRadius *
        (1 + eccentricity * Math.cos(angle)) * // Basic ellipse
        (1 + 0.3 * Math.sin(angle * 3)) * // 3-lobe perturbation
        (1 + 0.2 * Math.sin(angle * 5)) * // 5-lobe perturbation
        (1 + 0.1 * Math.sin(angle * 7))   // 7-lobe perturbation

      // Apply orbital mechanics with full 3D rotation
      const cosInc = Math.cos(inclination)
      const sinInc = Math.sin(inclination)
      const cosLan = Math.cos(longitudeOfAscendingNode)
      const sinLan = Math.sin(longitudeOfAscendingNode)
      const cosAop = Math.cos(argumentOfPeriapsis)
      const sinAop = Math.sin(argumentOfPeriapsis)

      // Position in orbital plane
      const xOrbital = radiusVariation * Math.cos(angle)
      const yOrbital = radiusVariation * Math.sin(angle)
      const zOrbital = 0

      // Rotate to final position
      const xFinal = xOrbital * (cosAop * cosLan - sinAop * sinLan * cosInc) -
                     yOrbital * (sinAop * cosLan + cosAop * sinLan * cosInc)
      const yFinal = xOrbital * (cosAop * sinLan + sinAop * cosLan * cosInc) +
                     yOrbital * (sinAop * sinLan - cosAop * cosLan * cosInc)
      const zFinal = xOrbital * (sinAop * sinInc) + yOrbital * (cosAop * sinInc)

      this.targetPositions[i3] = xFinal
      this.targetPositions[i3 + 1] = yFinal
      this.targetPositions[i3 + 2] = zFinal

      particleIndex++
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
        // Set exact positions to target
        for (let i = 0; i < this.count; i++) {
          const i3 = i * 3
          this.positions[i3] = this.targetPositions[i3]!
          this.positions[i3 + 1] = this.targetPositions[i3 + 1]!
          this.positions[i3 + 2] = this.targetPositions[i3 + 2]!
        }
        this.geometry.attributes.position!.needsUpdate = true
      }
    }
    animate()
  }

  formAvatar(duration: number = 2000) {
    this.animateMorph(this.targetPositions, duration)
  }

  startOrbiting() {
    this.isOrbiting = true
    // Only start transition if we're not already in full orbital mode
    if (!this.isTransitioningToOrbit && this.orbitalTransitionProgress < 1) {
      this.isTransitioningToOrbit = true
      this.orbitalTransitionProgress = 0
    }
    this.orbitStartTime = Date.now()

    // Compute center target positions
    const centerParticles = Math.floor(this.count * 0.25)
    const centerRadius = 0.8
    for (let i = 0; i < centerParticles; i++) {
      const i3 = i * 3
      const y = 1 - (i / (centerParticles - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const goldenAngle = Math.PI * (3 - Math.sqrt(5))
      const theta = goldenAngle * i
      const x = radiusAtY * Math.cos(theta) * centerRadius
      const z = radiusAtY * Math.sin(theta) * centerRadius
      const y_coord = y * centerRadius
      this.centerTargetPositions[i3] = x
      this.centerTargetPositions[i3 + 1] = y_coord
      this.centerTargetPositions[i3 + 2] = z
    }

    // Start forming the center sphere with animation
    this.isFormingCenter = true
    this.morphProgressCenter = 0
    const startTime = Date.now()
    const animateCenter = () => {
      const elapsed = Date.now() - startTime
      this.morphProgressCenter = Math.min(elapsed / 500, 1) // 1 second animation
      if (this.morphProgressCenter < 1) {
        requestAnimationFrame(animateCenter)
      } else {
        this.isFormingCenter = false
      }
    }
    animateCenter()
  }

  stopOrbiting() {
    this.isOrbiting = false
    this.isTransitioningToOrbit = false
    this.orbitalTransitionProgress = 0
  }

  disperseParticles() {
    this.isForming = false
    this.morphProgress = 0
  }

  override update() {
    // Update pulse and flicker timing
    this.pulseTime += 0.02
    this.flickerOffset += 0.05

    // Holographic pulsing effect
    const pulseIntensity = 0.8 + Math.sin(this.pulseTime) * 0.2
    const flicker = Math.sin(this.flickerOffset * 7) * 0.1 + Math.sin(this.flickerOffset * 13) * 0.05

    // Update material opacity for holographic effect
    this.material.opacity = Math.max(0.3, pulseIntensity + flicker)

    if (this.isForming) {
      // Morph positions towards target shape
      for (let i = 0; i < this.count; i++) {
        const i3 = i * 3
        this.positions[i3]! += (this.targetPositions[i3]! - this.positions[i3]!) * 0.1
        this.positions[i3 + 1]! += (this.targetPositions[i3 + 1]! - this.positions[i3 + 1]!) * 0.1
        this.positions[i3 + 2]! += (this.targetPositions[i3 + 2]! - this.positions[i3 + 2]!) * 0.1
      }
    } else if (this.isFormingCenter) {
      // Interpolate center particles towards target sphere
      const centerParticles = Math.floor(this.count * 0.25)
      for (let i = 0; i < centerParticles; i++) {
        const i3 = i * 3
        this.positions[i3] = this.positions[i3] * (1 - this.morphProgressCenter) + this.centerTargetPositions[i3] * this.morphProgressCenter
        this.positions[i3 + 1] = this.positions[i3 + 1] * (1 - this.morphProgressCenter) + this.centerTargetPositions[i3 + 1] * this.morphProgressCenter
        this.positions[i3 + 2] = this.positions[i3 + 2] * (1 - this.morphProgressCenter) + this.centerTargetPositions[i3 + 2] * this.morphProgressCenter
      }
    } else if (this.isOrbiting) {
      // Handle orbital transition animation
      if (this.isTransitioningToOrbit) {
        this.orbitalTransitionProgress += 0.02 // Smooth transition over ~3 seconds (0.02 * 150 frames)
        if (this.orbitalTransitionProgress >= 1) {
          this.isTransitioningToOrbit = false
          this.orbitalTransitionProgress = 1
        }
      }

      // Orbital rotation mode - particles follow their unique orbital paths while maintaining shape
      const centerParticles = Math.floor(this.count * 0.25)
      const orbitElapsed = (Date.now() - this.orbitStartTime) * 0.001 // Convert to seconds

      for (let i = 0; i < this.count; i++) {
        // Update each particle's unique orbital angle
        this.orbitAngles[i] += this.orbitSpeeds[i]

        const i3 = i * 3

        if (i < centerParticles) {
          // Center particles - maintain perfect spherical shape with subtle pulsing
          const centerRadius = 0.8
          const pulseScale = 1 + Math.sin(this.pulseTime * 2) * 0.05 // Subtle pulsing

          // Use the same golden angle distribution as target positions for perfect sphere
          const y = 1 - (i / (centerParticles - 1)) * 2 // y goes from 1 to -1
          const radiusAtY = Math.sqrt(1 - y * y) // radius at y

          const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ~2.4 radians
          const theta = goldenAngle * i // azimuthal angle

          // Add subtle rotation to the sphere
          const rotatedTheta = theta + this.pulseTime * 0.1

          this.positions[i3] = radiusAtY * Math.cos(rotatedTheta) * centerRadius * pulseScale
          this.positions[i3 + 1] = y * centerRadius * pulseScale
          this.positions[i3 + 2] = radiusAtY * Math.sin(rotatedTheta) * centerRadius * pulseScale
        } else {
          // Orbital particles - each follows completely unique 3D path AROUND the target shape
          const angle = this.orbitAngles[i]
          const baseRadius = this.orbitRadii[i]
          const eccentricity = Math.sin(i * 0.1) * 0.3 // Varying eccentricity

          // Create irregular orbital shape with multiple harmonics
          const radiusVariation =
            baseRadius *
            (1 + eccentricity * Math.cos(angle)) * // Basic ellipse
            (1 + 0.2 * Math.sin(angle * 3 + this.pulseTime)) * // Dynamic 3-lobe
            (1 + 0.15 * Math.sin(angle * 5 + this.pulseTime * 1.5)) * // Dynamic 5-lobe
            (1 + 0.1 * Math.sin(angle * 7 + this.pulseTime * 2)) // Dynamic 7-lobe

          // Apply particle-specific offsets for true randomness
          const xBase = Math.cos(angle) * radiusVariation
          const yBase = Math.sin(angle) * radiusVariation
          const zBase = Math.sin(angle * 2 + i * 0.05) * 0.5 // Vertical oscillation

          // Add orbital motion AROUND the target shape position with smooth transition
          const targetX = this.targetPositions[i3]!
          const targetY = this.targetPositions[i3 + 1]!
          const targetZ = this.targetPositions[i3 + 2]!

          // Smooth interpolation from shape position to orbital position
          const transitionFactor = this.isTransitioningToOrbit ? this.orbitalTransitionProgress : 1
          const easedTransition = transitionFactor * transitionFactor * (3 - 2 * transitionFactor) // Smoothstep easing

          this.positions[i3] = targetX + (xBase + this.orbitOffsets[i3]) * easedTransition
          this.positions[i3 + 1] = targetY + (yBase + this.orbitOffsets[i3 + 1]) * easedTransition
          this.positions[i3 + 2] = targetZ + (zBase + this.orbitOffsets[i3 + 2]) * easedTransition
        }
      }
    } else {
      // Static shape mode - particles hold their target positions
      // Particles remain in their formed shape until orbiting is activated
    }

    this.geometry.attributes.position.needsUpdate = true
  }
}