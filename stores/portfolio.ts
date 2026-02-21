import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projects as projectsData, type Project } from './data/projects'
import { skills as skillsData, type Skill } from './data/skills'

// Re-export types for backward compatibility with existing components
export type { Project, Skill }

// Chat message interface
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: 'text' | 'command' | 'error'
}

// Section type
export type Section = 'landing' | 'about' | 'projects' | 'skills' | 'contact'

export const usePortfolioStore = defineStore('portfolio', () => {
  // State - using imported data
  const currentSection = ref<Section>('landing')
  const previousSection = ref<Section>('landing')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const projects = ref<Project[]>(projectsData)
  const skills = ref<Skill[]>(skillsData)

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
  const miniAvatarUrl = ref('/profile.png')

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
    miniAvatarUrl,

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
