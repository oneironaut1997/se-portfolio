<template>
  <div id="projects" class="relative min-h-screen py-20">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl mb-4">
        <TextPressure text="Featured Projects" textColor="transparent" className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text" :minFontSize=60 />
      </h1>
      <ShinyText text="A showcase of my recent work combining cutting-edge technologies (WIP)." className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed" />
    </div>

    <!-- 3D Projects Carousel -->
    <!-- <div class="container mx-auto px-4 mb-16">
      <ProjectsCarousel @viewDetails="viewProjectDetails" />
    </div> -->

    <!-- Projects Grid (Fallback/Additional) -->
    <!-- <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project.id"
          :project="project"
          class="animate-fade-in-up"
        />
      </div>

      <div class="text-center mt-12">
        <button class="btn-secondary">
          View All Projects
          <svg class="ml-2 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import ProjectCard from '~/components/ProjectCard.vue'
import ProjectsCarousel from '~/components/ProjectsCarousel.vue'
import TextPressure from '~/components/TextPressure.vue'
import ShinyText from '~/components/ShinyText.vue'
import type { Project } from '~/stores/portfolio'

// Store
const portfolioStore = usePortfolioStore()

// Computed properties
const featuredProjects = computed(() =>
  portfolioStore.projects.filter(project => project.featured)
)

// Methods
const viewProjectDetails = (project: Project) => {
  // TODO: Implement project detail modal or navigation
  console.log('Viewing project details:', project.title)
  alert(`Project: ${project.title}\n\n${project.description}\n\nTechnologies: ${project.technologies.join(', ')}`)
}

// Methods
const getShapeClass = (index: number) => {
  const shapes = [
    'w-32 h-32 bg-blue-500 rounded-full',
    'w-24 h-24 bg-purple-500 rotate-45',
    'w-20 h-20 bg-pink-500 rounded-lg',
    'w-28 h-28 bg-green-500 rounded-full',
    'w-16 h-16 bg-yellow-500 rotate-12',
    'w-36 h-36 bg-indigo-500 rounded-lg',
    'w-22 h-22 bg-red-500 rotate-45',
    'w-18 h-18 bg-cyan-500 rounded-full'
  ]
  return shapes[index % shapes.length]
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(-15px) rotate(240deg);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animations */
.animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
.animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
.animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
.animate-fade-in-up:nth-child(4) { animation-delay: 0.4s; }
</style>