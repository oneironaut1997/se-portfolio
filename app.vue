<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    <!-- Galaxy Background -->
    <Galaxy
      v-if="portfolioStore.backgroundEffect === 'galaxy'"
      :speed="1 + 2 * Math.sin(portfolioStore.transitionProgress * Math.PI)"
      :star-speed="0.5 + 1 * Math.sin(portfolioStore.transitionProgress * Math.PI)"
      :rotation-speed="0.1 + 0.2 * Math.sin(portfolioStore.transitionProgress * Math.PI)"
    />

    <!-- Hyperspeed Effect -->
    <div
      v-show="portfolioStore.isTransitioning"
      :style="{ opacity: Math.sin(portfolioStore.transitionProgress * Math.PI) }"
      class="transition-opacity duration-75"
    >
      <Hyperspeed :effect-options="hyperspeedPresets.one" />
    </div>

    <!-- Splash Cursor Effect -->
    <SplashCursor />

    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Header/Navigation -->
      <AppHeader />

      <!-- Main Content Area -->
      <main class="container mx-auto px-4 py-8">
        <!-- Landing Section -->
        <section
          id="landing"
          v-show="(portfolioStore.currentSection === 'landing' && !portfolioStore.isTransitioning) || (portfolioStore.previousSection === 'landing' && portfolioStore.isTransitioning)"
          class="min-h-screen py-16"
        >
          <LandingPage />
        </section>

        <!-- About Section -->
        <section
          id="about"
          v-show="(portfolioStore.currentSection === 'about' && !portfolioStore.isTransitioning) || (portfolioStore.previousSection === 'about' && portfolioStore.isTransitioning)"
          class="min-h-screen py-16"
        >
          <AboutPage />
        </section>

        <!-- Projects Section -->
        <section
          id="projects"
          v-show="(portfolioStore.currentSection === 'projects' && !portfolioStore.isTransitioning) || (portfolioStore.previousSection === 'projects' && portfolioStore.isTransitioning)"
          class="min-h-screen py-16"
        >
          <ProjectsPage />
        </section>

        <!-- Skills Section -->
        <section
          id="skills"
          v-show="(portfolioStore.currentSection === 'skills' && !portfolioStore.isTransitioning) || (portfolioStore.previousSection === 'skills' && portfolioStore.isTransitioning)"
          class="min-h-screen py-16"
        >
          <SkillsPage />
        </section>

        <!-- Contact Section -->
        <section
          id="contact"
          v-show="(portfolioStore.currentSection === 'contact' && !portfolioStore.isTransitioning) || (portfolioStore.previousSection === 'contact' && portfolioStore.isTransitioning)"
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
import { defineAsyncComponent } from 'vue'

// Composables
import { usePortfolioStore } from '~/stores/portfolio'
import { hyperspeedPresets } from '~/components/hyperspeedPresets'

// Components
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import LandingPage from '~/components/LandingPage.vue'
import AboutPage from '~/components/AboutPage.vue'
import ProjectsPage from '~/components/ProjectsPage.vue'
import SkillsPage from '~/components/SkillsPage.vue'
import ContactPage from '~/components/ContactPage.vue'
const ChatInterface = defineAsyncComponent(() => import('~/components/ChatInterface.vue'))
const Galaxy = defineAsyncComponent(() => import('~/components/Galaxy.vue'))
const Hyperspeed = defineAsyncComponent(() => import('~/components/Hyperspeed.vue'))
import SplashCursor from '~/components/SplashCursor.vue'

// Store
const portfolioStore = usePortfolioStore()

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
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preload', href: '/profile.png', as: 'image' },
    { rel: 'dns-prefetch', href: 'https://openrouter.ai' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Sherwin Estrera',
        jobTitle: 'Full Stack Developer',
        description: 'Full Stack Developer with 5+ years of experience delivering enterprise-grade web and mobile applications.',
        url: 'https://se.estrera.com',
        sameAs: [
          'https://github.com/oneironaut1997',
          'https://linkedin.com/in/sherwin-estrera-95601b242'
        ],
        knowsAbout: [
          'JavaScript',
          'TypeScript',
          'Vue.js',
          'Nuxt.js',
          'Node.js',
          'Laravel',
          'Three.js',
          'AI Integration'
        ]
      })
    }
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