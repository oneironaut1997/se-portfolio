<template>
  <div class="min-h-screen py-20">
    <div class="container mx-auto px-4">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About Me
          </span>
        </h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Passionate about creating immersive digital experiences that blend cutting-edge technology with human-centered design.
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Personal Story -->
        <div class="space-y-6">
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 class="text-2xl font-bold text-blue-400 mb-4">My Journey</h2>
            <div class="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Full Stack Developer with 5+ years of experience delivering enterprise-grade web and mobile applications. Specialized in Laravel-based system architecture, API-driven platforms, and cross-platform applications using Nuxt and Capacitor. Proven experience leading development teams, mentoring engineers, and enforcing best practices to ensure scalable, secure, and maintainable systems. Hands-on experience integrating AI-powered solutions (chatbots, workflow automation, internal tools) to improve operational efficiency and user experience. Strong balance of technical leadership and execution, with a track record of shipping production systems on schedule.
              </p>

              <p>
                My journey began with a Bachelor's degree in Information Technology from Pangasinan State University in 2019, and I've since evolved into a tech lead specializing in AI integration and team development.
                When I'm not coding, you'll find me exploring the latest AI advancements, mentoring fellow developers, or pushing the boundaries of what's possible in web development.
              </p>
            </div>
          </div>

          <!-- Tech Philosophy -->
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 class="text-2xl font-bold text-purple-400 mb-4">AI Philosophy</h2>
            <blockquote class="text-gray-300 italic text-lg leading-relaxed border-l-4 border-purple-400 pl-6">
              "AI should augment human intelligence, not replace it.
              I believe in creating AI-powered solutions that enhance creativity, streamline workflows, and empower users to achieve more through intelligent automation and thoughtful integration."
            </blockquote>
          </div>
        </div>

        <!-- Professional Highlights -->
        <div class="space-y-6">
          <!-- Experience Timeline -->
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 class="text-2xl font-bold text-green-400 mb-6">Professional Experience</h2>
            <div class="space-y-6">
              <div class="border-l-2 border-green-400 pl-6 relative">
                <div class="absolute -left-2 top-0 w-4 h-4 bg-green-400 rounded-full"></div>
                <h3 class="text-lg font-semibold text-white">Front-End Developer</h3>
                <p class="text-green-400 font-medium">PRAXXYS Solutions Inc. | March 2020 - May 2021</p>
                <ul class="mt-2 text-gray-300 text-sm space-y-1">
                  <li>• Developed responsive and interactive user interfaces using Vue.js, HTML, CSS, and JavaScript.</li>
                  <li>• Collaborated closely with backend teams to integrate APIs and ensure seamless data flow across applications.</li>
                  <li>• Translated Figma and UI/UX designs into pixel-accurate, production-ready interfaces.</li>
                  <li>• Improved user experience and page performance across multiple client-facing platforms.</li>
                  <li>• Participated in Git-based version control workflows and early CI/CD adoption.</li>
                </ul>
              </div>
              <div class="border-l-2 border-blue-400 pl-6 relative">
                <div class="absolute -left-2 top-0 w-4 h-4 bg-blue-400 rounded-full"></div>
                <h3 class="text-lg font-semibold text-white">Full Stack Developer</h3>
                <p class="text-blue-400 font-medium">PRAXXYS Solutions Inc. | June 2021 - August 2025</p>
                <ul class="mt-2 text-gray-300 text-sm space-y-1">
                  <li>• Led backend architecture for enterprise-grade web and mobile applications using Laravel and Node.js</li>
                  <li>• Integrated AI-powered chatbots and automated workflows to enhance user experience and internal efficiency</li>
                  <li>• Designed and implemented secure RESTful APIs, managing complex database relationships and external integrations</li>
                  <li>• Built responsive and dynamic frontend applications using Vue.js, Nuxt.js, and Capacitor for cross-platform deployment</li>
                  <li>• Conducted code reviews, developer mentorship, and technical evaluations to maintain a high-performance team</li>
                  <li>• Implemented TDD, caching, and performance optimization, reducing load times and improving scalability</li>
                  <li>• Oversaw project scheduling, task assignments, and technical guidance to ensure successful, timely delivery</li>
                  <li>• Strengthened system security through OAuth2, JWT, and security audits</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Key Skills -->
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 class="text-2xl font-bold text-pink-400 mb-6">Core Skills</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <h4 class="font-semibold text-white">Primary Expertise</h4>
                <div class="space-y-2 text-sm text-gray-300">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Backend: Laravel, PHP, Node.js
                  </div>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Frontend: Vue.js, Nuxt.js, TypeScript, JavaScript
                  </div>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Mobile: Capacitor, Ionic Framework
                  </div>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    API Design & Architecture
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <h4 class="font-semibold text-white">Specializations</h4>
                <div class="space-y-2 text-sm text-gray-300">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    AI Integration & Automation
                  </div>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    Databases: MySQL, PostgreSQL
                  </div>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                    Security: OAuth2, JWT, RBAC
                  </div>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                    Testing: PHPUnit, Jest, Playwright, TDD
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 class="text-2xl font-bold text-orange-400 mb-6">Education</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-white">Bachelor of Science in Information Technology</h3>
                <p class="text-orange-400">Pangasinan State University – Lingayen, Pangasinan (2019)</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Drafting Technology</h3>
                <p class="text-orange-400">Pangasinan School of Arts and Trades – Lingayen, Pangasinan (2015)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resume Download Section -->
      <div class="text-center mt-16">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700 mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">Download My Resume</h2>
          <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get a detailed overview of my experience, skills, and qualifications.
          </p>
          <a
            href="/Sherwin_Malogan_Estrera_Resume_2025.pdf"
            download="Sherwin_Malogan_Estrera_Resume_2025.pdf"
            class="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume (PDF)
          </a>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <div class="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-4">Let's Build Something Amazing Together</h2>
          <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always excited to take on new challenges and collaborate on innovative projects.
            Whether you need a full-stack solution, AI integration, or technical leadership, let's connect!
          </p>
          <button
            @click="navigateTo('contact')"
            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '~/stores/portfolio'

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
/* Custom animations and styles */
</style>