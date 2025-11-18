<template>
  <header class="fixed top-0 left-0 right-0 z-30 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-2 cursor-pointer" @click="navigateTo('landing')">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">SE</span>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sherwin Estrera
          </span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateTo(item.id)"
            class="nav-link relative px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            :class="{ 'text-blue-400': currentSection === item.id }"
          >
            {{ item.label }}
            <span
              v-if="currentSection === item.id"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            ></span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
          :aria-expanded="showMobileMenu"
          aria-label="Toggle navigation menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!showMobileMenu"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <div
        v-show="showMobileMenu"
        class="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4"
      >
        <div class="flex flex-col space-y-2">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateTo(item.id)"
            class="nav-link-mobile px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
            :class="{ 'text-blue-400 bg-blue-900/20': currentSection === item.id }"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'

// Store
const portfolioStore = usePortfolioStore()

// Reactive state
const showMobileMenu = ref(false)

// Computed properties
const currentSection = computed(() => portfolioStore.currentSection)

// Navigation items
const navItems = [
  { id: 'landing', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' }
]

// Methods
const navigateTo = (section: string) => {
  portfolioStore.setCurrentSection(section as any)
  showMobileMenu.value = false

  // Smooth scroll to section
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Close mobile menu on route change or outside click
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.mobile-menu') && !target.closest('button[aria-label="Toggle navigation menu"]')) {
    showMobileMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  position: relative;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link-mobile {
  transition: all 0.2s ease;
}

.nav-link-mobile:hover {
  transform: translateX(4px);
}

/* Accessibility improvements */
.nav-link:focus-visible,
.nav-link-mobile:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900;
}
</style>