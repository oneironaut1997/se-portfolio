// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // App configuration
  app: {
    head: {
      title: 'Sherwin Estrera - Portfolio',
      titleTemplate: '%s | Full Stack Developer',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sherwin Estrera - Full Stack Developer specializing in Laravel, PHP, Vue.js, Nuxt, Node.js, and modern web technologies. View my portfolio, projects, and skills.' },
        { name: 'keywords', content: 'Sherwin Estrera, Full Stack Developer, Laravel, PHP, Vue.js, Nuxt, Node.js, TypeScript, Portfolio, Web Developer, Philippines' },
        { name: 'author', content: 'Sherwin Estrera' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0f172a' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://sherwin.estrera.online/' },
        { property: 'og:title', content: 'Sherwin Estrera - Full Stack Developer Portfolio' },
        { property: 'og:description', content: 'Full Stack Developer specializing in Laravel, PHP, Vue.js, Nuxt, Node.js, and modern web technologies.' },
        { property: 'og:image', content: 'https://sherwin.estrera.online/profile.png' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@sherwinestrera' },
        { name: 'twitter:creator', content: '@sherwinestrera' },
        { name: 'twitter:title', content: 'Sherwin Estrera - Full Stack Developer Portfolio' },
        { name: 'twitter:description', content: 'Full Stack Developer specializing in Laravel, PHP, Vue.js, Nuxt, Node.js, and modern web technologies.' },
        { name: 'twitter:image', content: 'https://sherwin.estrera.online/profile.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/profile.png' },
        { rel: 'canonical', href: 'https://sherwin.estrera.online/' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Sherwin Estrera',
            jobTitle: 'Full Stack Developer',
            url: 'https://sherwin.estrera.online/',
            sameAs: [
              'https://github.com/oneironaut1997',
              'https://www.linkedin.com/in/sherwin-estrera-95601b242'
            ],
            description: 'Full Stack Developer specializing in Laravel, PHP, Vue.js, Nuxt, Node.js, and modern web technologies.',
            image: 'https://sherwin.estrera.online/profile.png'
          })
        }
      ]
    }
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    'nuxt-gtag',
  ],

  // Sitemap configuration for SEO
  site: {
    url: 'https://sherwin.estrera.online/',
    name: 'Sherwin Estrera Portfolio',
    description: 'Full Stack Developer Portfolio specializing in Vue.js, Nuxt, Node.js',
    defaultLocale: 'en'
  },
  sitemap: {
    sources: [],
    credits: false,
    gzip: true,
    include: ['/'],
    exclude: ['/api/**', '/rss.xml'],
    routes: async () => {
      return [
        '/',
        '/#about',
        '/#projects',
        '/#skills',
        '/#contact'
      ]
    },
    sitemap: {
      hostname: 'https://sherwin.estrera.online/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 1.0
    }
  },

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
