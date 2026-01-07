import { ref, readonly } from 'vue'

export interface ChatResponse {
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const STATIC_RESPONSES = {
  greeting: "Hello! I'm P.K.L. (Personal Knowledge Link), Sherwin's AI assistant. I'm here to help you explore his portfolio featuring enterprise-grade applications, AI integrations, and cross-platform solutions. You can ask me about his projects, skills, or how to navigate the site. What would you like to know?",
  whoami: "I'm P.K.L. (Personal Knowledge Link), Sherwin's AI assistant inspired by his beloved dog Pickles! I'm here to help you learn about Sherwin's work as a Full Stack Developer and Tech Lead. I can tell you about his enterprise projects, AI integrations, and technical expertise.",
  hobbies: "Outside of coding, Sherwin enjoys eating delicious food, playing online games, watching movies, and riding motorcycles. He's passionate gaming sessions, movie marathons, and hitting the road on his motorcycle for some fresh air and adventure!",
  projects: "Sherwin has delivered many enterprise projects including luxury e-commerce platforms, AI-powered banking website, pharmaceutical platforms with prescription validation, stock trading systems with PSE integration, and healthcare laboratory management solutions. His work spans Nuxt.js frontends, Laravel backends, mobile apps, and AI chatbot integrations. Would you like me to show you his project portfolio?",
  skills: "Sherwin excels in full-stack development with 5+ years leading Laravel-based architectures and AI integrations. His expertise includes Vue.js/Nuxt.js, TypeScript, PHP/Laravel, Node.js, REST APIs, OAuth2/JWT security, cross-platform mobile (Capacitor/Ionic), and AI chatbot development. He also leads teams, mentors developers, and implements TDD practices.",
  contact: "You can reach Sherwin through the contact form on this site. As a tech lead with extensive experience in enterprise systems and AI integration, he's always interested in discussing new opportunities, technical leadership roles, or innovative projects that push the boundaries of web and mobile development.",
  about: "Sherwin is a Full Stack Developer with 5+ years delivering enterprise-grade applications, from AI-powered banking platforms to cross-platform e-commerce solutions. He specializes in Laravel architecture, Vue.js/Nuxt.js frontends, AI integrations, and team leadership. With a Bachelor's in IT from Pangasinan State University, he combines technical excellence with mentoring and innovative problem-solving."
}

export function useOpenRouter() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Note: OpenRouter client is now handled server-side via /api/chat

  const generateResponse = async (userMessage: string, context?: string[]): Promise<ChatResponse> => {
    isLoading.value = true
    error.value = null

    try {
      // Check for static responses first
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return { message: STATIC_RESPONSES.greeting }
      }

      if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || lowerMessage.includes('who is pkl') || lowerMessage.includes('what is pkl')) {
        return { message: STATIC_RESPONSES.whoami }
      }

      if (lowerMessage.includes('hobby') || lowerMessage.includes('hobbies') || lowerMessage.includes('interest') || lowerMessage.includes('fun') || lowerMessage.includes('outside work')) {
        return { message: STATIC_RESPONSES.hobbies }
      }

      if (lowerMessage.includes('project')) {
        return { message: STATIC_RESPONSES.projects }
      }

      if (lowerMessage.includes('skill')) {
        return { message: STATIC_RESPONSES.skills }
      }

      if (lowerMessage.includes('contact')) {
        return { message: STATIC_RESPONSES.contact }
      }

      if (lowerMessage.includes('about')) {
        return { message: STATIC_RESPONSES.about }
      }

      // For more complex queries, use server-side API
      try {
        const response = await $fetch('/api/chat', {
          method: 'POST',
          body: { message: userMessage, context }
        })
        return response as ChatResponse
      } catch (apiError) {
        console.error('Server API error:', apiError)
        // Fallback response when API fails
        return {
          message: "I'm experiencing some technical difficulties, but I'd still love to help you explore Sherwin's portfolio! Feel free to navigate through the different sections to see his work."
        }
      }

    } catch (err) {
      console.error('Chat generation error:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'

      // Return fallback response
      return {
        message: "I'm experiencing some technical difficulties, but I'd still love to help you explore Sherwin's portfolio! Feel free to navigate through the different sections to see his work."
      }
    } finally {
      isLoading.value = false
    }
  }

  const checkAPIStatus = async (): Promise<boolean> => {
    try {
      // Test server API availability with a simple request
      await $fetch('/api/chat', {
        method: 'POST',
        body: { message: 'test' }
      })
      return true
    } catch {
      return false
    }
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    generateResponse,
    checkAPIStatus
  }
}

// Utility functions for portfolio-specific interactions
export const parsePortfolioCommand = (message: string): string | null => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('show projects') || lowerMessage.includes('projects')) {
    return 'projects'
  }

  if (lowerMessage.includes('show skills') || lowerMessage.includes('skills')) {
    return 'skills'
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('contact me')) {
    return 'contact'
  }

  if (lowerMessage.includes('about') || lowerMessage.includes('about me')) {
    return 'about'
  }

  return null
}

export const getPortfolioResponse = (section: string): string => {
  switch (section) {
    case 'projects':
      return STATIC_RESPONSES.projects
    case 'skills':
      return STATIC_RESPONSES.skills
    case 'contact':
      return STATIC_RESPONSES.contact
    case 'about':
      return STATIC_RESPONSES.about
    default:
      return STATIC_RESPONSES.greeting
  }
}