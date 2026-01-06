import { ref, readonly } from 'vue'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export interface ChatResponse {
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Portfolio-specific prompts and responses
const SYSTEM_PROMPT = `You are P.K.L. (Personal Knowledge Link), an AI assistant for Sherwin Estrera's portfolio website. You are helpful, professional, and knowledgeable about Sherwin's background as a Full Stack Developer with 5+ years of experience.

Key information about Sherwin:
- Full Stack Developer specializing in Laravel-based system architecture, API-driven platforms, and cross-platform applications using Nuxt.js and Capacitor
- Extensive experience leading development teams, mentoring engineers, and integrating AI-powered solutions (chatbots, workflow automation)
- Bachelor's degree in Information Technology from Pangasinan State University (2019)
- Tech lead with proven track record in shipping enterprise-grade web and mobile applications
- Expert in modern web technologies: Vue.js, Nuxt.js, TypeScript, TailwindCSS, Laravel, PHP, Node.js, MySQL, PostgreSQL
- Strong focus on AI integration, security (OAuth2, JWT, RBAC), and performance optimization
- Experience with cross-platform mobile development using Capacitor and Ionic

Notable Projects:
- Luxury Clothing E-Commerce Platform: Multi-platform solution with Nuxt storefront, Laravel backend, mobile apps, real-time chat/video for VIP customers
- Banking Website with AI Chatbot: Nuxt/Laravel platform with Node.js AI chatbot for customer support
- Pharmaceutical E-Commerce Platform: Nuxt/Laravel system with AI-powered prescription validation
- Stock Trading Platform: Nuxt/Laravel with PSE market data integration and TradingView charts
- Online SPA Booking System: Laravel with custom time-slot booking engine
- Laboratory Test Booking Platform: Healthcare platform with external lab integration
- Machine Maintenance System: Enterprise solution with procurement and inventory management
- Networked E-Commerce Platform: Laravel with hierarchical dealer system and commission tracking

Key Skills:
- Frontend: Vue.js, Nuxt.js, JavaScript, TypeScript, TailwindCSS, Responsive Design, SPAs, PWAs
- Backend: Laravel, PHP, Node.js, REST APIs, OAuth2, JWT, RBAC, Security Headers
- Tools: Git, Capacitor, Ionic, Cloudflare, CI/CD, PHPUnit, Jest, Playwright, GSAP, Figma
- AI & Integration: AI Chatbot development, workflow automation, prompt engineering
- Soft Skills: Team leadership, mentoring, code review, technical writing, TDD

Your responses should be:
- Concise but informative (under 150 words)
- Professional yet friendly
- Focused on Sherwin's actual skills, experience, and projects
- Encouraging user interaction with the portfolio
- Accurate to the information provided

Available commands users can trigger:
- "show projects" or "projects" - Navigate to projects section
- "show skills" or "skills" - Navigate to skills section
- "contact" or "contact me" - Navigate to contact section
- "about" or "about me" - Navigate to about section

When discussing projects, highlight Sherwin's expertise in AI integration, enterprise systems, and cross-platform development.`

const STATIC_RESPONSES = {
  greeting: "Hello! I'm P.K.L. (Personal Knowledge Link), Sherwin's AI assistant. I'm here to help you explore his portfolio featuring enterprise-grade applications, AI integrations, and cross-platform solutions. You can ask me about his projects, skills, or how to navigate the site. What would you like to know?",
  projects: "Sherwin has delivered 9+ enterprise projects including luxury e-commerce platforms, AI-powered banking systems, pharmaceutical platforms with prescription validation, stock trading systems with PSE integration, and healthcare laboratory management solutions. His work spans Nuxt.js frontends, Laravel backends, mobile apps, and AI chatbot integrations. Would you like me to show you his project portfolio?",
  skills: "Sherwin excels in full-stack development with 5+ years leading Laravel-based architectures and AI integrations. His expertise includes Vue.js/Nuxt.js, TypeScript, PHP/Laravel, Node.js, REST APIs, OAuth2/JWT security, cross-platform mobile (Capacitor/Ionic), and AI chatbot development. He also leads teams, mentors developers, and implements TDD practices.",
  contact: "You can reach Sherwin through the contact form on this site. As a tech lead with extensive experience in enterprise systems and AI integration, he's always interested in discussing new opportunities, technical leadership roles, or innovative projects that push the boundaries of web and mobile development.",
  about: "Sherwin is a Full Stack Developer with 5+ years delivering enterprise-grade applications, from AI-powered banking platforms to cross-platform e-commerce solutions. He specializes in Laravel architecture, Vue.js/Nuxt.js frontends, AI integrations, and team leadership. With a Bachelor's in IT from Pangasinan State University, he combines technical excellence with mentoring and innovative problem-solving."
}

export function useOpenRouter() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize OpenRouter client (will be configured with runtime config)
  const getOpenRouterClient = () => {
    // For now, use environment variable directly
    const apiKey = process.env.NUXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.warn('OpenRouter API key not configured')
      return null
    }
    return new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
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

      // For more complex queries, use OpenRouter if available
      const client = getOpenRouterClient()
      if (!client) {
        // Fallback response when API is not configured
        return {
          message: "I'd love to tell you more about Sherwin's work! This portfolio demonstrates his expertise in creating immersive 3D web experiences. Feel free to explore the different sections to learn more about his projects and skills."
        }
      }

      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ]

      // Add context from previous interactions if available
      if (context && context.length > 0) {
        const contextMessage = `Previous conversation context: ${context.slice(-3).join(' | ')}`
        messages.splice(1, 0, { role: 'system', content: contextMessage })
      }

      const completion = await client.chat.completions.create({
        model: 'openai/gpt-3.5-turbo',
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
      const client = getOpenRouterClient()
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