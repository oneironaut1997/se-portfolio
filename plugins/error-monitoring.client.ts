export default defineNuxtPlugin(() => {
  // Global error handler for client-side errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // In production, send to error tracking service
  })

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // In production, send to error tracking service
  })
})