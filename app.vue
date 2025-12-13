<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    <!-- PKL Particle Background -->
    <PKLParticleSystem
      v-if="portfolioStore.particleSystemActive"
      class="particle-container"
      :current-section="portfolioStore.currentSection"
    />

    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Header/Navigation -->
      <AppHeader />

      <!-- Main Content Area -->
      <main :class="portfolioStore.currentSection === 'landing' ? '' : 'container mx-auto px-4 py-8'">
        <!-- Landing Section -->
        <section
          id="landing"
          v-show="portfolioStore.currentSection === 'landing'"
          class="h-screen w-full"
        >
          <LandingPage />
        </section>

        <!-- About Section -->
        <section
          id="about"
          v-show="portfolioStore.currentSection === 'about'"
          class="min-h-screen py-16"
        >
          <AboutPage />
        </section>

        <!-- Projects Section -->
        <section
          id="projects"
          v-show="portfolioStore.currentSection === 'projects'"
          class="min-h-screen py-16"
        >
          <ProjectsPage />
        </section>

        <!-- Skills Section -->
        <section
          id="skills"
          v-show="portfolioStore.currentSection === 'skills'"
          class="min-h-screen py-16"
        >
          <SkillsPage />
        </section>

        <!-- Contact Section -->
        <section
          id="contact"
          v-show="portfolioStore.currentSection === 'contact'"
          class="min-h-screen py-16"
        >
          <ContactPage />
        </section>
      </main>

      <!-- Footer -->
      <AppFooter />
    </div>

    <!-- Chat Interface -->
    <ChatInterface
      v-if="portfolioStore.showChat"
      @close="portfolioStore.toggleChat"
      class="fixed bottom-6 right-6 z-50"
    />

    <!-- Chat Toggle Button -->
    <button
      @click="portfolioStore.toggleChat"
      class="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
      :class="{ 'translate-y-16': portfolioStore.showChat }"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>

    <!-- Loading Overlay -->
    <div
      v-if="portfolioStore.isLoading"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-300">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables
import { usePortfolioStore } from '~/stores/portfolio'
import { useEasterEggs } from '~/composables/useEasterEggs'

// Components
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import LandingPage from '~/components/LandingPage.vue'
import AboutPage from '~/components/AboutPage.vue'
import ProjectsPage from '~/components/ProjectsPage.vue'
import SkillsPage from '~/components/SkillsPage.vue'
import ContactPage from '~/components/ContactPage.vue'
import ChatInterface from '~/components/ChatInterface.vue'
import PKLParticleSystem from '~/components/PKLParticleSystem.vue'

// Store
const portfolioStore = usePortfolioStore()

// Easter eggs
const { voiceRecognitionActive } = useEasterEggs()

// Page metadata
useHead({
  title: 'Sherwin Estrera - Full Stack Developer ',
  meta: [
    { name: 'description', content: 'Immersive portfolio showcasing full-stack development skills with 3D graphics, AI integration, and cinematic animations.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { property: 'og:title', content: 'Sherwin Estrera - Full Stack Developer ' },
    { property: 'og:description', content: 'Experience cutting-edge web development with Three.js, Vue.js, and AI integration.' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})

// Initialize portfolio on mount (client-side only)
onMounted(() => {
  // Set initial section
  portfolioStore.setCurrentSection('landing')

  // Add welcome message to chat (client-side only to avoid SSR mismatch)
  portfolioStore.addChatMessage({
    role: 'assistant',
    content: "Welcome to Sherwin's portfolio! I'm P.K.L. (Personal Knowledge Link), his AI assistant. Feel free to explore the different sections or ask me any questions about his work.",
    type: 'text'
  })
})
</script>

<style scoped>
/* Additional component-specific styles can be added here */
</style>