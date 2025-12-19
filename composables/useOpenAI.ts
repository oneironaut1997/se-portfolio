import { ref, readonly } from 'vue'
import OpenAI from 'openai'

export interface ChatResponse {
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Portfolio-specific prompts and responses
const SYSTEM_PROMPT = `You are P.K.L. (Personal Knowledge Link), an AI assistant for Sherwin Estrera's portfolio website. You are helpful, professional, and knowledgeable about Sherwin's background as a Full Stack Developer .

Key information about Sherwin:
- Full Stack Developer with expertise in Vue.js, Nuxt.js, Laravel, Three.js, and AI integration
- Specializes in creating immersive web experiences with 3D graphics and animations
- Has experience with modern web technologies including TypeScript, TailwindCSS, and GSAP
- Passionate about combining technology with creative design

Your responses should be:
- Concise but informative (under 150 words)
- Professional yet friendly
- Focused on Sherwin's skills and projects
- Encouraging user interaction with the portfolio

Available commands users can trigger:
- "show projects" or "projects" - Navigate to projects section
- "show skills" or "skills" - Navigate to skills section
- "contact" or "contact me" - Navigate to contact section
- "about" or "about me" - Navigate to about section

When users ask about projects, highlight the cinematic AI portfolio as the main project.`

const STATIC_RESPONSES = {
  greeting: "Hello! I'm P.K.L. (Personal Knowledge Link), Sherwin's AI assistant. I'm here to help you explore his portfolio. You can ask me about his projects, skills, or how to navigate the site. What would you like to know?",
  projects: "Sherwin has worked on several exciting projects, including this cinematic AI portfolio you're currently viewing! It showcases his expertise in Three.js, Vue.js, and AI integration. Would you like me to show you his other projects?",
  skills: "Sherwin specializes in full-stack development with a focus on modern JavaScript frameworks. His key skills include Vue.js/Nuxt.js, Laravel, Three.js for 3D graphics, TypeScript, and AI integration. He's also proficient with animation libraries like GSAP.",
  contact: "You can reach Sherwin through the contact form on this site. He's always interested in discussing new opportunities, collaborations, or just connecting with fellow developers and creators.",
  about: "Sherwin is a passionate Full Stack Developer  who loves creating immersive web experiences. He combines technical expertise with creative design to build applications that not only function well but also provide engaging user experiences."
}

export function useOpenAI() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize OpenAI client (will be configured with runtime config)
  const getOpenAIClient = () => {
    // For now, use environment variable directly
    const apiKey = process.env.NUXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.warn('OpenAI API key not configured')
      return null
    }
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through server-side
    })
  }

  const generateResponse = async (userMessage: string, context?: string[]): Promise<ChatResponse> => {
    isLoading.value = true
    error.value = null

    try {
      // Check for static responses first
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return { message: STATIC_RESPONSES.greeting }
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

      // For more complex queries, use OpenAI if available
      const client = getOpenAIClient()
      if (!client) {
        // Fallback response when API is not configured
        return {
          message: "I'd love to tell you more about Sherwin's work! This portfolio demonstrates his expertise in creating immersive 3D web experiences. Feel free to explore the different sections to learn more about his projects and skills."
        }
      }

      const messages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ]

      // Add context from previous interactions if available
      if (context && context.length > 0) {
        const contextMessage = `Previous conversation context: ${context.slice(-3).join(' | ')}`
        messages.splice(1, 0, { role: 'system', content: contextMessage })
      }

      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 150,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      const response = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response right now.'

      return {
        message: response,
        usage: completion.usage ? {
          prompt_tokens: completion.usage.prompt_tokens,
          completion_tokens: completion.usage.completion_tokens,
          total_tokens: completion.usage.total_tokens
        } : undefined
      }

    } catch (err) {
      console.error('OpenAI API error:', err)
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
      const client = getOpenAIClient()
      if (!client) return false

      // Simple test call
      await client.models.list()
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