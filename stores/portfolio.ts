import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Data interfaces based on TDD specifications
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string | null
  demoUrl?: string | null
  githubUrl?: string | null
  featured: boolean
  category: string
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
      id: 'luxury-clothing-ecommerce',
      title: 'Luxury Clothing E-Commerce Platform',
      description: 'A multi-platform luxury clothing e-commerce solution consisting of a Nuxt-based web storefront, a Laravel-powered admin backend, and two mobile applications. The customer-facing app mirrors the web purchasing experience, while a dedicated sales staff app enables direct chat and video calls with VIP customers to provide personalized service. All product and customer data are fetched from an external database. The platform includes secure online payment integration and supports high-end customer engagement workflows.',
      technologies: [
        'Nuxt.js',
        'Vue.js',
        'Laravel',
        'REST API',
        'Mobile Apps',
        'Online Payment Gateway',
        'Real-time Chat',
        'Video Call Integration',
        'External Database Integration'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'ecommerce'
    },
    {
      id: 'spa-booking-system',
      title: 'Online SPA Booking System',
      description: 'A custom-built online booking system for a SPA business developed using Laravel. The platform supports multiple user roles including customers, front desk staff, and administrators. Features include online payment integration and a fully custom time-slot booking engine designed to handle availability, scheduling rules, and booking conflicts.',
      technologies: [
        'Laravel',
        'Frontend UI',
        'REST API',
        'Online Payment Gateway',
        'Custom Booking Engine',
        'Role-Based Access Control'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'booking'
    },
    {
      id: 'banking-ai-chatbot',
      title: 'Banking Website with AI Chatbot',
      description: 'A modern banking website built with Nuxt for the public-facing web and Laravel as the CMS backend. The platform includes an AI-powered chatbot implemented using Node.js to assist users with inquiries, navigation, and automated responses, enhancing customer engagement and support efficiency.',
      technologies: [
        'Nuxt.js',
        'Vue.js',
        'Laravel',
        'Node.js',
        'AI Chatbot',
        'REST API',
        'CMS Architecture'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'fintech'
    },
    {
      id: 'pharma-ecommerce',
      title: 'Pharmaceutical E-Commerce Platform',
      description: 'A pharmaceutical e-commerce platform built with Nuxt for the web storefront and Laravel for the backend services. The system includes a customer mobile application, secure online payment integration, and an AI-powered feature that flags prescription-only (RX) medications to support validation and compliance workflows.',
      technologies: [
        'Nuxt.js',
        'Vue.js',
        'Laravel',
        'REST API',
        'Mobile App',
        'Online Payment Gateway',
        'AI Integration',
        'Prescription Validation Logic'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'healthcare'
    },
    {
      id: 'stock-trading-platform',
      title: 'Stock Trading Platform',
      description: 'A stock trading web platform developed using Nuxt for the frontend and Laravel for backend services. The system integrates with the Philippine Stock Exchange (PSE) via a custom Node.js data processor that parses and normalizes raw market data into readable and usable formats. The platform also integrates TradingView for real-time charting and market visualization.',
      technologies: [
        'Nuxt.js',
        'Vue.js',
        'Laravel',
        'Node.js',
        'PSE Market Data Integration',
        'Custom Data Processing',
        'TradingView Integration',
        'REST API'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'fintech'
    },
    {
      id: 'lab-test-booking-platform',
      title: 'Laboratory Test Booking and Results Platform',
      description: 'An online healthcare platform for booking laboratory tests and viewing test results. The system includes a custom-built time-slot booking engine and integrates with external laboratory services to handle scheduling, test processing, and result retrieval.',
      technologies: [
        'Laravel',
        'Web Frontend',
        'REST API',
        'Custom Booking Engine',
        'External Service Integration',
        'Healthcare Workflow'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'healthcare'
    },
    {
      id: 'machine-maintenance-system',
      title: 'Machine Maintenance and Parts Management System',
      description: 'A web-based system designed to manage machine maintenance workflows and the procurement of replacement parts. The platform supports tracking maintenance activities, processing purchase requests, managing parts inventory, and integrates with third-party services to support external suppliers, notifications, and operational data exchange.',
      technologies: [
        'Laravel',
        'Web Frontend',
        'REST API',
        'Maintenance Workflow Management',
        'Procurement Processing',
        'Inventory Tracking',
        'Third-Party Service Integration'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'enterprise'
    },
    {
      id: 'networked-ecommerce-platform',
      title: 'Networked E-Commerce Platform',
      description: 'A Laravel-based e-commerce platform for health and wellness products, designed with a hierarchical dealer system to manage upline relationships. The platform supports product purchases, dealer management, sales tracking, and commission calculation, enabling structured distribution and automated reporting workflows.',
      technologies: [
        'Laravel',
        'Web Frontend',
        'REST API',
        'Dealer / Upline Management',
        'E-Commerce Logic',
        'Commission & Sales Tracking'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'ecommerce'
    },
    {
      id: 'lab-results-processing-system',
      title: 'Laboratory Results Processing System',
      description: 'A web-based system designed to process and manage laboratory results. The platform serves laboratory clinics as customers and includes features for doctors to review and validate lab results. It supports secure data handling, role-based access control, and integrates with external laboratory systems for result submission and retrieval.',
      technologies: [
        'Laravel',
        'Web Frontend',
        'REST API',
        'Role-Based Access Control',
        'Data Validation & Review',
        'External Laboratory System Integration'
      ],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      category: 'healthcare'
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
    { id: 'csp', name: 'CSP', category: 'frontend', proficiency: 3, years: 2 },

    // Backend Skills
    { id: 'laravel', name: 'Laravel', category: 'backend', proficiency: 5, years: 5 },
    { id: 'php', name: 'PHP', category: 'backend', proficiency: 5, years: 4 },
    { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 3, years: 2 },
    { id: 'mysql', name: 'MySQL', category: 'backend', proficiency: 4, years: 5 },
    { id: 'posgresql', name: 'PostgreSQL', category: 'backend', proficiency: 2, years: 2 },
    { id: 'api', name: 'REST APIs', category: 'backend', proficiency: 5, years: 4 },
    { id: 'oauth2', name: 'OAuth2', category: 'backend', proficiency: 4, years: 3 },
    { id: 'jwt', name: 'JWT', category: 'backend', proficiency: 4, years: 3 },
    { id: 'rbac', name: 'RBAC', category: 'backend', proficiency: 4, years: 3 },
    { id: 'security-headers', name: 'Security Headers', category: 'backend', proficiency: 4, years: 3 },

    // Tools & Technologies
    { id: 'git', name: 'Git', category: 'tools', proficiency: 5, years: 5 },
    { id: 'capacitor', name: 'Capacitor', category: 'tools', proficiency: 4, years: 2 },
    { id: 'ionic', name: 'Ionic Framework', category: 'tools', proficiency: 3, years: 1 },
    { id: 'cloudflare', name: 'Cloudflare', category: 'tools', proficiency: 3, years: 2 },
    { id: 'cicd', name: 'CI/CD', category: 'tools', proficiency: 4, years: 3 },
    { id: 'phpunit', name: 'PHPUnit', category: 'tools', proficiency: 4, years: 4 },
    { id: 'jest', name: 'Jest', category: 'tools', proficiency: 2, years: 2 },
    { id: 'playwright', name: 'Playwright', category: 'tools', proficiency: 3, years: 1 },
    { id: 'vulnerability-audits', name: 'Vulnerability Audits', category: 'tools', proficiency: 3, years: 2 },
    { id: 'ai-chatbot', name: 'AI Chatbot Integration', category: 'tools', proficiency: 4, years: 2 },
    { id: 'gsap', name: 'GSAP', category: 'tools', proficiency: 4, years: 2 },
    { id: 'figma', name: 'Figma', category: 'tools', proficiency: 3, years: 3 },

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