import { ref, onMounted, onUnmounted, readonly } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useGSAPAnimations } from '~/composables/useGSAP'

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// Types
interface KeyboardShortcut {
  key: string
  action: () => void
  description: string
}

interface VoiceCommand {
  keywords: string[]
  action: () => void
  response: string
}

export function useEasterEggs() {
  const portfolioStore = usePortfolioStore()
  const { animations, isReady } = useGSAPAnimations()

  // Reactive state
  const idleTime = ref(0)
  const isIdle = ref(false)
  const voiceRecognitionActive = ref(false)

  // Keyboard shortcuts
  const keyboardShortcuts: KeyboardShortcut[] = [
    {
      key: 'p',
      action: () => portfolioStore.setCurrentSection('projects'),
      description: 'Navigate to Projects section'
    },
    {
      key: 's',
      action: () => portfolioStore.setCurrentSection('skills'),
      description: 'Navigate to Skills section'
    },
    {
      key: 'c',
      action: () => portfolioStore.setCurrentSection('contact'),
      description: 'Navigate to Contact section'
    },
    {
      key: 'a',
      action: () => portfolioStore.setCurrentSection('about'),
      description: 'Navigate to About section (same as landing)'
    },
    {
      key: 'h',
      action: () => portfolioStore.setCurrentSection('landing'),
      description: 'Navigate to Home/Landing section'
    },
    {
      key: 'j',
      action: () => toggleChat(),
      description: 'Toggle PKL chat interface'
    },
    {
      key: 'Escape',
      action: () => closeChat(),
      description: 'Close chat interface'
    }
  ]

  // Voice commands
  const voiceCommands: VoiceCommand[] = [
    {
      keywords: ['show projects', 'projects', 'project'],
      action: () => portfolioStore.setCurrentSection('projects'),
      response: 'Opening the projects section. Here you can see some of my recent work!'
    },
    {
      keywords: ['show skills', 'skills', 'skill', 'expertise'],
      action: () => portfolioStore.setCurrentSection('skills'),
      response: 'Let me show you my skills and expertise. I specialize in full-stack development with a focus on modern technologies.'
    },
    {
      keywords: ['contact', 'contact me', 'reach out', 'get in touch'],
      action: () => portfolioStore.setCurrentSection('contact'),
      response: 'I\'d love to hear from you! The contact form is ready for your message.'
    },
    {
      keywords: ['about', 'about me', 'who are you', 'introduce'],
      action: () => portfolioStore.setCurrentSection('landing'),
      response: 'Welcome! I\'m Sherwin Estrera, a Full Stack Developer . Let me show you around my portfolio.'
    },
    {
      keywords: ['help', 'what can you do', 'commands'],
      action: () => showHelp(),
      response: 'I can help you navigate the portfolio. Try saying "show projects", "show skills", or "contact me". You can also use keyboard shortcuts like P for projects, S for skills.'
    }
  ]

  // Idle animations
  let idleTimer: number | null = null
  let idleAnimations: number[] = []

  const startIdleTimer = () => {
    idleTime.value = 0
    idleTimer = window.setInterval(() => {
      idleTime.value += 1

      // Trigger idle animations at different intervals
      if (idleTime.value === 30) { // 30 seconds
        triggerIdleAnimation('wink')
      } else if (idleTime.value === 60) { // 1 minute
        triggerIdleAnimation('pulse')
      } else if (idleTime.value === 120) { // 2 minutes
        triggerIdleAnimation('hint')
      }
    }, 1000)
  }

  const resetIdleTimer = () => {
    idleTime.value = 0
    isIdle.value = false
    if (idleTimer) {
      clearInterval(idleTimer)
      startIdleTimer()
    }
  }

  const triggerIdleAnimation = (type: 'wink' | 'pulse' | 'hint') => {
    if (!isReady() || !animations() || !animations()!.isAnimationsEnabled()) return

    isIdle.value = true

    switch (type) {
      case 'wink':
        // PKL winks (subtle scale animation)
        if (portfolioStore.currentSection === 'landing') {
          animations()!.pklPulse?.({}, { scale: 1.05, duration: 0.3 })
        }
        break

      case 'pulse':
        // Particle system pulse
        if (portfolioStore.particleSystemActive) {
          animations()!.animateParticles?.([], { scale: 1.2, duration: 1, yoyo: true })
        }
        break

      case 'hint':
        // Show helpful hint in chat
        if (!portfolioStore.showChat) {
          portfolioStore.addChatMessage({
            role: 'assistant',
            content: '👋 Still exploring? Try saying "show projects" or use keyboard shortcuts like "P" for projects!',
            type: 'text'
          })
        }
        break
    }
  }

  // Voice recognition
  let recognition: any = null

  const initVoiceRecognition = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Voice recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      voiceRecognitionActive.value = true
    }

    recognition.onend = () => {
      voiceRecognitionActive.value = false
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      processVoiceCommand(transcript)
    }

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error)
      voiceRecognitionActive.value = false
    }
  }

  const processVoiceCommand = (transcript: string) => {
    // Check if command starts with "pkl" or similar wake word
    if (!transcript.includes('pkl') && !transcript.includes('hey') && !transcript.includes('hi')) {
      return
    }

    // Remove wake word and find matching command
    const command = transcript.replace(/^(pkl|hey|hi)\s*/, '').trim()

    for (const voiceCommand of voiceCommands) {
      const matched = voiceCommand.keywords.some(keyword =>
        command.includes(keyword.toLowerCase())
      )

      if (matched) {
        voiceCommand.action()

        // Add response to chat
        portfolioStore.addChatMessage({
          role: 'assistant',
          content: voiceCommand.response,
          type: 'command'
        })

        break
      }
    }
  }

  const startVoiceRecognition = () => {
    if (recognition && !voiceRecognitionActive.value) {
      try {
        recognition.start()
      } catch (error) {
        console.error('Failed to start voice recognition:', error)
      }
    }
  }

  // Keyboard shortcuts
  const handleKeyPress = (event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    const shortcut = keyboardShortcuts.find(s => s.key.toLowerCase() === event.key.toLowerCase())
    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }

  // Helper functions
  const toggleChat = () => {
    portfolioStore.toggleChat()
  }

  const closeChat = () => {
    portfolioStore.showChat = false
  }

  const showHelp = () => {
    const helpMessage = `
Here are some things I can help you with:
• "Show projects" - View my recent work
• "Show skills" - See my technical expertise
• "Contact me" - Open the contact form
• "Help" - Show this help message

Keyboard shortcuts:
• P - Projects
• S - Skills
• C - Contact
• H - Home
• J - Toggle chat
• Escape - Close chat
    `.trim()

    portfolioStore.addChatMessage({
      role: 'assistant',
      content: helpMessage,
      type: 'text'
    })
  }

  // Mouse movement tracking for activity
  const handleMouseMove = () => {
    resetIdleTimer()
  }

  const handleClick = () => {
    resetIdleTimer()
  }

  const handleScroll = () => {
    resetIdleTimer()
  }

  // Lifecycle
  onMounted(() => {
    // Initialize voice recognition
    initVoiceRecognition()

    // Start idle timer
    startIdleTimer()

    // Add event listeners
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchstart', handleClick) // Mobile touch
  })

  onUnmounted(() => {
    // Clean up
    if (idleTimer) {
      clearInterval(idleTimer)
    }

    if (recognition) {
      recognition.stop()
    }

    // Remove event listeners
    window.removeEventListener('keydown', handleKeyPress)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('touchstart', handleClick)
  })

  return {
    // State
    idleTime: readonly(idleTime),
    isIdle: readonly(isIdle),
    voiceRecognitionActive: readonly(voiceRecognitionActive),

    // Methods
    startVoiceRecognition,
    showHelp,
    keyboardShortcuts: readonly(keyboardShortcuts),
    voiceCommands: readonly(voiceCommands)
  }
}