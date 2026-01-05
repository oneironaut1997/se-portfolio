import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Data interfaces based on TDD specifications
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  category: 'web' | 'mobile' | 'ai' | 'other'
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'soft'
  proficiency: number // 1-5 scale
  years: number
  iconUrl?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: 'text' | 'command' | 'error'
}

export type Section = 'landing' | 'about' | 'projects' | 'skills' | 'contact'

export const usePortfolioStore = defineStore('portfolio', () => {
  // State
  const currentSection = ref<Section>('landing')
  const previousSection = ref<Section>('landing')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const projects = ref<Project[]>([
    {
      id: 'cinematic-portfolio',
      title: 'Cinematic AI Portfolio',
      description: 'An immersive 3D portfolio website featuring AI chat integration, particle systems, and cinematic animations built with Three.js, Vue.js, and GSAP.',
      technologies: ['Vue.js', 'Three.js', 'GSAP', 'OpenAI API', 'TailwindCSS', 'Nuxt.js'],
      imageUrl: '/images/projects/cinematic-portfolio.jpg',
      demoUrl: 'https://sherwinestrera.dev',
      githubUrl: 'https://github.com/sherwinestrera/portfolio',
      featured: true,
      category: 'web'
    },
    {
      id: 'laravel-ecommerce',
      title: 'Laravel E-commerce Platform',
      description: 'Full-featured e-commerce platform with payment integration, inventory management, and admin dashboard built with Laravel and Vue.js.',
      technologies: ['Laravel', 'Vue.js', 'MySQL', 'Stripe API', 'TailwindCSS'],
      imageUrl: '/images/projects/laravel-ecommerce.jpg',
      demoUrl: 'https://example-ecommerce.com',
      githubUrl: 'https://github.com/sherwinestrera/laravel-ecommerce',
      featured: true,
      category: 'web'
    },
    {
      id: 'ai-chatbot',
      title: 'AI Customer Support Chatbot',
      description: 'Intelligent chatbot system using natural language processing for automated customer support with learning capabilities.',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React', 'PostgreSQL'],
      imageUrl: '/images/projects/ai-chatbot.jpg',
      demoUrl: 'https://ai-chatbot-demo.com',
      githubUrl: 'https://github.com/sherwinestrera/ai-chatbot',
      featured: true,
      category: 'ai'
    },
    {
      id: 'mobile-fitness',
      title: 'Cross-Platform Fitness App',
      description: 'Mobile fitness tracking application with workout plans, progress tracking, and social features built with React Native.',
      technologies: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
      imageUrl: '/images/projects/mobile-fitness.jpg',
      demoUrl: 'https://fitness-app-demo.com',
      githubUrl: 'https://github.com/sherwinestrera/fitness-app',
      featured: false,
      category: 'mobile'
    }
  ])

  const skills = ref<Skill[]>([
    // Frontend Skills
    { id: 'vue', name: 'Vue.js', category: 'frontend', proficiency: 5, years: 4 },
    { id: 'nuxt', name: 'Nuxt.js', category: 'frontend', proficiency: 5, years: 3 },
    { id: 'javascript', name: 'JavaScript', category: 'frontend', proficiency: 5, years: 4 },
    { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 4, years: 4 },
    { id: 'tailwind', name: 'TailwindCSS', category: 'frontend', proficiency: 5, years: 3 },
    { id: 'shadcn', name: 'Shadcn UI', category: 'frontend', proficiency: 4, years: 2 },
    { id: 'responsive', name: 'Responsive Design', category: 'frontend', proficiency: 5, years: 4 },
    { id: 'spa', name: 'SPAs', category: 'frontend', proficiency: 5, years: 4 },
    { id: 'pwa', name: 'PWAs', category: 'frontend', proficiency: 4, years: 2 },

    // Backend Skills
    { id: 'laravel', name: 'Laravel', category: 'backend', proficiency: 5, years: 5 },
    { id: 'php', name: 'PHP', category: 'backend', proficiency: 5, years: 4 },
    { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 4, years: 4 },
    { id: 'mysql', name: 'MySQL', category: 'backend', proficiency: 4, years: 5 },
    { id: 'posgresql', name: 'PostgreSQL', category: 'backend', proficiency: 2.5, years: 2 },
    { id: 'api', name: 'REST APIs', category: 'backend', proficiency: 5, years: 4 },
    { id: 'oauth2', name: 'OAuth2', category: 'backend', proficiency: 4, years: 3 },
    { id: 'jwt', name: 'JWT', category: 'backend', proficiency: 4, years: 3 },
    { id: 'rbac', name: 'RBAC', category: 'backend', proficiency: 4, years: 3 },
    { id: 'security-headers', name: 'Security Headers', category: 'backend', proficiency: 4, years: 3 },
    { id: 'csp', name: 'CSP', category: 'backend', proficiency: 4, years: 3 },

    // Tools & Technologies
    { id: 'git', name: 'Git', category: 'tools', proficiency: 5, years: 5 },
    { id: 'capacitor', name: 'Capacitor', category: 'tools', proficiency: 4, years: 2 },
    { id: 'ionic', name: 'Ionic Framework', category: 'tools', proficiency: 3, years: 1 },
    { id: 'cloudflare', name: 'Cloudflare', category: 'tools', proficiency: 3, years: 2 },
    { id: 'cicd', name: 'CI/CD', category: 'tools', proficiency: 4, years: 3 },
    { id: 'phpunit', name: 'PHPUnit', category: 'tools', proficiency: 4, years: 4 },
    { id: 'jest', name: 'Jest', category: 'tools', proficiency: 4, years: 3 },
    { id: 'playwright', name: 'Playwright', category: 'tools', proficiency: 3, years: 1 },
    { id: 'vulnerability-audits', name: 'Vulnerability Audits', category: 'tools', proficiency: 3, years: 2 },
    { id: 'ai-chatbot', name: 'AI Chatbot Integration', category: 'tools', proficiency: 4, years: 2 },
    { id: 'gsap', name: 'GSAP', category: 'tools', proficiency: 4, years: 2 },
    { id: 'figma', name: 'Figma', category: 'tools', proficiency: 4, years: 3 },

    // Soft Skills
    { id: 'communication', name: 'Communication', category: 'soft', proficiency: 5, years: 5 },
    { id: 'problem-solving', name: 'Problem Solving', category: 'soft', proficiency: 5, years: 5 },
    { id: 'teamwork', name: 'Teamwork', category: 'soft', proficiency: 5, years: 5 },
    { id: 'leadership', name: 'Leadership', category: 'soft', proficiency: 4, years: 3 },
    { id: 'code-review', name: 'Code Review', category: 'soft', proficiency: 5, years: 4 },
    { id: 'mentoring', name: 'Mentoring', category: 'soft', proficiency: 4, years: 3 },
    { id: 'technical-writing', name: 'Technical Writing', category: 'soft', proficiency: 4, years: 3 },
    { id: 'tdd', name: 'TDD', category: 'soft', proficiency: 4, years: 3 },
    { id: 'prompt-eng', name: 'Prompt Engineering', category: 'soft', proficiency: 3, years: 1 }
  ])

  const chatContext = ref({
    conversationId: '',
    messages: [] as ChatMessage[],
    userProfile: {
      currentSection: 'landing' as Section,
      interactionHistory: [] as string[]
    }
  })

  // Initialize conversation ID (client-side only to avoid SSR mismatch)
  if (typeof window !== 'undefined' && !chatContext.value.conversationId) {
    chatContext.value.conversationId = Date.now().toString()
  }

  const showChat = ref(false)
  const particleSystemActive = ref(false)
  const animationsEnabled = ref(true)
  const backgroundEffect = ref<'particles' | 'galaxy'>('galaxy')
  const isTransitioning = ref(false)
  const transitionProgress = ref(0)

  // Getters
  const featuredProjects = computed(() =>
    projects.value.filter(project => project.featured)
  )

  const skillsByCategory = computed(() => {
    const categories = ['frontend', 'backend', 'tools', 'soft'] as const
    const result: Record<string, Skill[]> = {}

    categories.forEach(category => {
      result[category] = skills.value.filter(skill => skill.category === category)
    })

    return result
  })

  const recentMessages = computed(() =>
    chatContext.value.messages.slice(-20)
  )

  // Actions
  const setCurrentSection = (section: Section) => {
    if (currentSection.value !== section) {
      previousSection.value = currentSection.value
      isTransitioning.value = true
      transitionProgress.value = 0
      currentSection.value = section
      chatContext.value.userProfile.currentSection = section

      // Animate transition progress
      const duration = 1000 // 1 seconds
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        transitionProgress.value = progress

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          isTransitioning.value = false
          transitionProgress.value = 0
        }
      }
      requestAnimationFrame(animate)
    }
  }

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    chatContext.value.messages.push(newMessage)

    // Update interaction history
    if (message.role === 'user') {
      chatContext.value.userProfile.interactionHistory.push(message.content)
      // Keep only last 10 interactions
      if (chatContext.value.userProfile.interactionHistory.length > 10) {
        chatContext.value.userProfile.interactionHistory.shift()
      }
    }
  }

  const clearChat = () => {
    chatContext.value.messages = []
    chatContext.value.conversationId = Date.now().toString()
  }

  const toggleChat = () => {
    showChat.value = !showChat.value
  }

  const toggleParticles = () => {
    particleSystemActive.value = !particleSystemActive.value
  }

  const toggleAnimations = () => {
    animationsEnabled.value = !animationsEnabled.value
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const setBackgroundEffect = (effect: 'particles' | 'galaxy') => {
    backgroundEffect.value = effect
    particleSystemActive.value = effect === 'particles'
  }


  return {
    // State
    currentSection,
    previousSection,
    isLoading,
    error,
    projects,
    skills,
    chatContext,
    showChat,
    particleSystemActive,
    animationsEnabled,
    backgroundEffect,
    isTransitioning,
    transitionProgress,

    // Getters
    featuredProjects,
    skillsByCategory,
    recentMessages,

    // Actions
    setCurrentSection,
    addChatMessage,
    clearChat,
    toggleChat,
    toggleParticles,
    toggleAnimations,
    setLoading,
    setError,
    setBackgroundEffect
  }
})