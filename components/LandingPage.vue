<template>
  <div id="landing" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Content Overlay -->
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <!-- Main Heading -->
      <div class="space-y-6">
        <TextType
          as="h1"
          :text="['Sherwin Estrera']"
          :typingSpeed="100"
          :pauseDuration="500"
          :loop="false"
          class="text-5xl md:text-7xl lg:text-8xl font-bold animate-fade-in-up"
        >
          <template #content="{ text, index }">
            <span
              :class="index === 0 ? 'inline bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent' : 'inline bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent'"
            >
              {{ text }}
            </span>
          </template>
        </TextType>

        <TextPressure
          text="Full Stack Developer"
          className="text-2xl md:text-2xl text-gray-300 animate-fade-in-up animation-delay-400"
          textColor="#d1d5db"
          width
          weight
          italic
        />

        <ShinyText text="Creating immersive web experiences with cutting-edge technologies." className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600" />
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-up animation-delay-800">
        <button
          @click="navigateTo('projects')"
          class="btn-primary text-lg px-8 py-4"
        >
          Explore My Work
          <svg class="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        <button
          @click="navigateTo('contact')"
          class="btn-secondary text-lg px-8 py-4 backdrop-blur-sm"
        >
          Get In Touch
        </button>
      </div>

      <!-- PKL Status Indicator -->
      <div class="mt-16 animate-fade-in-up animation-delay-1000">
        <div class="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
            <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
          </div>
          <span class="text-sm text-gray-300 font-medium">
            P.K.L. (Personal Knowledge Link) Online
          </span>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <!-- <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
      <div class="animate-bounce">
        <div class="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div class="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2 text-center">Scroll to explore</p>
    </div> -->

    <!-- Background Effects -->
    <div class="absolute inset-0 z-0">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '~/stores/portfolio'
import TextPressure from '~/components/TextPressure.vue'
import ShinyText from '~/components/ShinyText.vue'
import TextType from '~/components/TextType.vue'

// Store
const portfolioStore = usePortfolioStore()

// Methods
const navigateTo = (section: string) => {
  portfolioStore.setCurrentSection(section as any)

  // Smooth scroll to section
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>

/* Animation delays */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .text-5xl {
    font-size: 2.5rem;
  }
  .text-7xl {
    font-size: 3rem;
  }
  .text-8xl {
    font-size: 3.5rem;
  }
}
</style>