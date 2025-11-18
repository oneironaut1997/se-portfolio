import { onMounted, onUnmounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'

// GSAP will be dynamically imported to avoid SSR issues
let gsap: any = null
let ScrollTrigger: any = null

export async function initGSAP() {
  if (typeof window === 'undefined') return

  try {
    // Dynamic import of GSAP
    const GSAP = await import('gsap')
    const ScrollTriggerPlugin = await import('gsap/ScrollTrigger')

    gsap = GSAP.default || GSAP
    ScrollTrigger = ScrollTriggerPlugin.default || ScrollTriggerPlugin

    // Register ScrollTrigger plugin
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
    }
  } catch (error) {
    console.warn('GSAP initialization failed:', error)
  }
}

export function useGSAP() {
  const portfolioStore = usePortfolioStore()

  // Animation utilities
  const fadeInUp = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      ...options
    }

    gsap.fromTo(element, { y: 30, opacity: 0 }, defaults)
  }

  const fadeInDown = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      ...options
    }

    gsap.fromTo(element, { y: -30, opacity: 0 }, defaults)
  }

  const slideInLeft = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...options
    }

    gsap.fromTo(element, { x: -50, opacity: 0 }, defaults)
  }

  const slideInRight = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      x: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...options
    }

    gsap.fromTo(element, { x: 50, opacity: 0 }, defaults)
  }

  const scaleIn = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      ...options
    }

    gsap.fromTo(element, { scale: 0.8, opacity: 0 }, defaults)
  }

  const staggerAnimation = (elements: Element[], options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1,
      ...options
    }

    gsap.fromTo(elements, { y: 30, opacity: 0 }, defaults)
  }

  // Scroll-triggered animations
  const scrollTrigger = (element: Element, animation: any, options: any = {}) => {
    if (!gsap || !ScrollTrigger || !portfolioStore.animationsEnabled) return

    const defaults = {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...options
    }

    gsap.set(element, { opacity: 0 })
    gsap.to(element, {
      ...animation,
      scrollTrigger: defaults
    })
  }

  // Cinematic transitions
  const cinematicTransition = (fromElement: Element, toElement: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {},
      ...options
    }

    const tl = gsap.timeline()

    // Fade out current element
    tl.to(fromElement, {
      opacity: 0,
      scale: 0.95,
      duration: defaults.duration * 0.3,
      ease: defaults.ease
    })

    // Fade in new element
    tl.fromTo(toElement,
      { opacity: 0, scale: 1.05, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: defaults.duration * 0.7,
        ease: defaults.ease,
        onComplete: defaults.onComplete
      }
    )

    return tl
  }

  // Particle animation integration
  const animateParticles = (particles: any[], options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.05,
      ...options
    }

    gsap.to(particles, {
      scale: 1.2,
      opacity: 0.8,
      duration: defaults.duration,
      ease: defaults.ease,
      stagger: defaults.stagger,
      yoyo: true,
      repeat: -1
    })
  }

  // PKL avatar animations
  const pklBreathing = (avatar: any, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      scale: 1.05,
      duration: 2,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
      ...options
    }

    gsap.to(avatar.scale, defaults)
  }

  const pklPulse = (avatar: any, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      scale: 1.1,
      duration: 0.5,
      ease: 'power2.out',
      repeat: 1,
      yoyo: true,
      ...options
    }

    gsap.to(avatar.scale, defaults)
  }

  // Page transition animations
  const pageEnter = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      duration: 1,
      ease: 'power2.out',
      ...options
    }

    gsap.fromTo(element,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: defaults.duration, ease: defaults.ease }
    )
  }

  const pageExit = (element: Element, options: any = {}) => {
    if (!gsap || !portfolioStore.animationsEnabled) return

    const defaults = {
      duration: 0.5,
      ease: 'power2.in',
      ...options
    }

    gsap.to(element, {
      opacity: 0,
      y: -30,
      duration: defaults.duration,
      ease: defaults.ease
    })
  }

  // Utility functions
  const killTweensOf = (target: any) => {
    if (gsap) {
      gsap.killTweensOf(target)
    }
  }

  const set = (target: any, properties: any) => {
    if (gsap) {
      gsap.set(target, properties)
    }
  }

  const getById = (id: string) => {
    if (gsap) {
      return gsap.getById(id)
    }
  }

  // Animation state getter
  const isAnimationsEnabled = () => portfolioStore.animationsEnabled

  return {
    // Animation functions
    fadeInUp,
    fadeInDown,
    slideInLeft,
    slideInRight,
    scaleIn,
    staggerAnimation,

    // Scroll and cinematic
    scrollTrigger,
    cinematicTransition,

    // Particle and avatar animations
    animateParticles,
    pklBreathing,
    pklPulse,

    // Page transitions
    pageEnter,
    pageExit,

    // Utilities
    killTweensOf,
    set,
    getById,
    isAnimationsEnabled,

    // GSAP instance (for advanced usage)
    gsap: () => gsap,
    ScrollTrigger: () => ScrollTrigger
  }
}

// Composition function for reactive GSAP usage
export function useGSAPAnimations() {
  let animations: ReturnType<typeof useGSAP> | null = null

  onMounted(async () => {
    await initGSAP()
    animations = useGSAP()
  })

  onUnmounted(() => {
    // Clean up any running animations
    if (animations && gsap) {
      gsap.killAll()
    }
  })

  return {
    animations: () => animations,
    isReady: () => !!animations
  }
}