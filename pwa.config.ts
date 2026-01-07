export const pwa = {
  registerType: 'autoUpdate',
  manifest: {
    name: 'Sherwin Estrera - Full Stack Developer',
    short_name: 'Sherwin Portfolio',
    description: 'Immersive portfolio showcasing full-stack development skills with 3D graphics, AI integration, and cinematic animations.',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,svg,webp,ico}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'external-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
          }
        }
      }
    ]
  }
}