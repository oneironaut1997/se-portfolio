// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },

  // Image optimization configuration
  image: {
    format: ['webp', 'avif', 'png', 'jpg'],
    quality: 80
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    smtpHost: process.env.NUXT_SMTP_HOST,
    smtpPort: process.env.NUXT_SMTP_PORT,
    smtpUser: process.env.NUXT_SMTP_USER,
    smtpPass: process.env.NUXT_SMTP_PASS,
    smtpFromAddress: process.env.NUXT_SMTP_FROM_ADDRESS,
    recaptchaSecretKey: process.env.NUXT_RECAPTCHA_SECRET_KEY,
    openRouterApiKey: process.env.NUXT_OPENROUTER_API_KEY,

    // Public keys (exposed to client-side)
    public: {
      recaptchaSiteKey: process.env.NUXT_RECAPTCHA_SITE_KEY
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
