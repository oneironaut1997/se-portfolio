<template>
  <div id="contact" class="relative min-h-screen py-20">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        <TextPressure text="Get In Touch" textColor="transparent" className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text" :minFontSize=60 />
      </h1>
      <ShinyText text="Ready to collaborate? Let's discuss how we can bring your ideas to life together." className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed" />
    </div>

    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="space-y-6">
            <StarBorder class="w-full">
              <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                <h3 class="text-2xl font-bold text-white mb-6">Send a Message</h3>

                <form @submit.prevent="submitForm" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        class="input-field w-full"
                        placeholder="Your full name"
                        :disabled="isSubmitting"
                      />
                    </div>

                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        class="input-field w-full"
                        placeholder="your.email@example.com"
                        :disabled="isSubmitting"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      id="subject"
                      v-model="form.subject"
                      type="text"
                      required
                      class="input-field w-full"
                      placeholder="What's this about?"
                      :disabled="isSubmitting"
                    />
                  </div>

                  <div>
                    <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      v-model="form.message"
                      required
                      rows="6"
                      class="input-field w-full resize-none"
                      placeholder="Tell me about your project or idea..."
                      :disabled="isSubmitting"
                    ></textarea>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="!isFormValid || isSubmitting"
                    class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span v-if="isSubmitting">
                      <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span v-else>
                      Send Message
                    </span>
                  </button>
                </form>

                <!-- Success/Error Messages -->
                <div v-if="submitStatus" class="mt-6">
                  <div
                    :class="[
                      'p-4 rounded-lg',
                      submitStatus.type === 'success'
                        ? 'bg-green-900/50 border border-green-700 text-green-300'
                        : 'bg-red-900/50 border border-red-700 text-red-300'
                    ]"
                  >
                    <div class="flex items-center space-x-2">
                      <svg
                        v-if="submitStatus.type === 'success'"
                        class="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ submitStatus.message }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </StarBorder>
          </div>

          <!-- Contact Info & Social -->
          <div class="space-y-6">
            <!-- Contact Information -->
            <StarBorder class="w-full">
              <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                <h3 class="text-2xl font-bold text-white mb-6">Contact Information</h3>

                <div class="space-y-4">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-300 font-medium">Email</p>
                      <p class="text-gray-300">se.estrera@gmail.com</p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-300 font-medium">Location</p>
                      <p class="text-gray-300">Quezon City, Philippines</p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-300 font-medium">Response Time</p>
                      <p class="text-gray-300">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </StarBorder>

            <!-- Social Links -->
            <StarBorder class="w-full">
              <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                <h3 class="text-2xl font-bold text-white mb-6">Connect With Me</h3>

                <div class="grid grid-cols-3 gap-4">
                  <a
                    v-for="social in socialLinks"
                    :key="social.name"
                    :href="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <span class="text-gray-300 group-hover:text-white font-medium">{{ social.name }}</span>
                  </a>
                </div>
              </div>
            </StarBorder>

            <!-- Availability Status -->
            <StarBorder class="w-full">
              <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-white font-medium">Available for Projects</span>
                  </div>
                  <span class="text-gray-300 text-sm">Open to opportunities</span>
                </div>
              </div>
            </StarBorder>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TextPressure from '~/components/TextPressure.vue'
import ShinyText from '~/components/ShinyText.vue'
import StarBorder from '~/components/StarBorder.vue'

// Reactive state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Computed properties
const isFormValid = computed(() => {
  return form.value.name.trim() &&
         form.value.email.trim() &&
         form.value.subject.trim() &&
         form.value.message.trim() &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
})

// Social links
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/sherwinestrera',
    icon: 'IconGithub'
  },
  {
    name: 'LinkedIn',
    url: 'www.linkedin.com/in/sherwin-estrera-95601b242',
    icon: 'IconLinkedin'
  },
  {
    name: 'Email',
    url: 'mailto:contact@se.estrera@gmail.com',
    icon: 'IconMail'
  }
]

// Methods
const submitForm = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true
  submitStatus.value = null

  try {
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Success
    submitStatus.value = {
      type: 'success',
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.'
    }

    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

  } catch (error) {
    submitStatus.value = {
      type: 'error',
      message: 'Something went wrong. Please try again or contact me directly.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Icon components
const IconGithub = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  `
}

const IconLinkedin = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  `
}

const IconTwitter = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  `
}

const IconMail = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  `
}
</script>

<style scoped>
/* Additional contact page styles */
</style>