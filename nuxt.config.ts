// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,

    // Public keys (exposed to client-side)
    public: {
      openaiApiKey: process.env.NUXT_PUBLIC_OPENAI_API_KEY
    }
  },

  // Build configuration
  build: {
    transpile: ['three']
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // SSR configuration
  ssr: true,

  // Nitro configuration for API routes
  nitro: {
    experimental: {
      wasm: true
    }
  },

  // Vite configuration for Three.js
  vite: {
    optimizeDeps: {
      include: ['three']
    }
  }
})
