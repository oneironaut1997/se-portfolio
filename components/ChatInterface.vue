<template>
  <div class="chat-interface fixed bottom-6 right-6 w-80 h-96 bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl z-50 flex flex-col overflow-hidden">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">P</span>
        </div>
        <div>
          <h3 class="text-white font-semibold text-sm">P.K.L.</h3>
          <p class="text-gray-400 text-xs">(Personal Knowledge Link)</p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-white transition-colors duration-200 p-1"
        aria-label="Close chat"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Messages Container -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in visibleMessages"
        :key="message.id"
        :class="[
          'flex',
          message.role === 'user' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-xs px-4 py-2 rounded-2xl text-sm',
            message.role === 'user'
              ? 'chat-bubble-user'
              : 'chat-bubble-ai'
          ]"
        >
          {{ message.content }}
          <div v-if="message.role === 'assistant' && isTyping && message === visibleMessages[visibleMessages.length - 1]" class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Typing indicator for new messages -->
      <div v-if="isTyping && !hasNewMessage" class="flex justify-start">
        <div class="chat-bubble-ai">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-gray-700">
      <form @submit.prevent="sendMessage" class="flex space-x-2">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Ask PKL anything..."
          class="input-field flex-1 text-sm"
          :disabled="isTyping"
          @keydown.enter.prevent="sendMessage"
        />
        <button
          type="submit"
          :disabled="!inputMessage.trim() || isTyping"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-label="Send message"
        >
          <svg v-if="!isTyping" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <div v-else class="w-4 h-4 flex items-center justify-center">
            <div class="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </button>
      </form>

      <!-- Quick Commands -->
      <div class="flex flex-wrap gap-2 mt-3">
        <button
          v-for="command in quickCommands"
          :key="command.id"
          @click="sendQuickCommand(command)"
          class="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full transition-colors duration-200"
        >
          {{ command.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useOpenAI, parsePortfolioCommand, getPortfolioResponse } from '~/composables/useOpenAI'

// Emits
const emit = defineEmits<{
  close: []
}>()

// Store
const portfolioStore = usePortfolioStore()

// Composables
const { generateResponse, isLoading } = useOpenAI()

// Reactive state
const inputMessage = ref('')
const isTyping = ref(false)
const hasNewMessage = ref(false)

// Computed properties
const visibleMessages = computed(() =>
  portfolioStore.recentMessages.slice(-20) // Show last 20 messages
)

// Quick commands
const quickCommands = [
  { id: 'projects', label: 'Show Projects' },
  { id: 'skills', label: 'My Skills' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'about', label: 'About Me' }
]

// Refs
const messagesContainer = ref<HTMLDivElement>()

// Methods
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''

  // Add user message
  portfolioStore.addChatMessage({
    role: 'user',
    content: message,
    type: 'text'
  })

  // Check for portfolio commands
  const command = parsePortfolioCommand(message)
  if (command) {
    // Handle portfolio navigation
    portfolioStore.setCurrentSection(command as any)

    // Add AI response
    portfolioStore.addChatMessage({
      role: 'assistant',
      content: getPortfolioResponse(command),
      type: 'command'
    })

    scrollToBottom()
    return
  }

  // Generate AI response
  isTyping.value = true
  hasNewMessage.value = false

  try {
    const response = await generateResponse(message, portfolioStore.chatContext.userProfile.interactionHistory)

    portfolioStore.addChatMessage({
      role: 'assistant',
      content: response.message,
      type: 'text'
    })

    hasNewMessage.value = true
  } catch (error) {
    console.error('Chat error:', error)
    portfolioStore.addChatMessage({
      role: 'assistant',
      content: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.',
      type: 'text'
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const sendQuickCommand = (command: typeof quickCommands[0]) => {
  inputMessage.value = command.label.toLowerCase()
  sendMessage()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages to scroll
watch(visibleMessages, scrollToBottom)

// Auto-scroll when typing starts/stops
watch(isTyping, scrollToBottom)
</script>

<style scoped>
.chat-bubble-user {
  @apply bg-blue-600 text-white;
}

.chat-bubble-ai {
  @apply bg-gray-700 text-gray-100;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-700;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>