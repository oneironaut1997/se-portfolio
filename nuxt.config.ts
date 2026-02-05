// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    'nuxt-gtag',
  ],

  // GTag configuration
  gtag: {
    id: 'G-9FQEPSSTL6'
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },

  // Image optimization configuration
  image: {
    format: ['webp', 'avif', 'png', 'jpg'],
    quality: 80,
    provider: 'none'
  },

  // Route rules for security headers
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://res.cloudinary.com; connect-src 'self' https://openrouter.ai https://api.openrouter.ai https://www.google-analytics.com https://se-portfolio-psau.onrender.com; frame-src 'self' https://www.google.com;"
      }
    }
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
      recaptchaSiteKey: process.env.NUXT_RECAPTCHA_SITE_KEY,
      apiBaseUrl: process.env.NUXT_API_BASE_URL
    }
  },

  // Build configuration
  build: {
    transpile: ['three'],
    sourcemap: true
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // SSR configuration
  ssr: false,
  target: 'static',

  // Nitro configuration for API routes
  nitro: {
    experimental: {
      wasm: true
    },
    compressPublicAssets: true,
    serveStatic: true,
    cors: true,
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    },
    publicAssets: [
      {
        baseURL: '/',
        dir: '.output/public',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      }
    ]
  },

  // Vite configuration for Three.js
  vite: {
    optimizeDeps: {
      include: ['three']
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            ogl: ['ogl'],
            gsap: ['gsap']
          }
        }
      }
    }
  }
})
