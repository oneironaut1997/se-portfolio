/**
 * Portfolio Projects Data
 * Contains all project entries for the portfolio
 */

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string | null
  demoUrl?: string | null
  githubUrl?: string | null
  featured: boolean
  category: string
}

export const projects: Project[] = [
  // Professional Projects
  {
    id: 'luxury-clothing-ecommerce',
    title: 'Luxury Clothing E-Commerce Platform',
    description: 'A multi-platform luxury clothing e-commerce solution consisting of a Nuxt-based web storefront, a Laravel-powered admin backend, and two mobile applications. The customer-facing app mirrors the web purchasing experience, while a dedicated sales staff app enables direct chat and video calls with VIP customers to provide personalized service. All product and customer data are fetched from an external database. The platform includes secure online payment integration and supports high-end customer engagement workflows.',
    technologies: [
      'Nuxt.js',
      'Vue.js',
      'Laravel',
      'REST API',
      'Mobile Apps',
      'Online Payment Gateway',
      'Real-time Chat',
      'Video Call Integration',
      'External Database Integration'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'ecommerce'
  },
  {
    id: 'spa-booking-system',
    title: 'Online SPA Booking System',
    description: 'A custom-built online booking system for a SPA business developed using Laravel. The platform supports multiple user roles including customers, front desk staff, and administrators. Features include online payment integration and a fully custom time-slot booking engine designed to handle availability, scheduling rules, and booking conflicts.',
    technologies: [
      'Laravel',
      'Frontend UI',
      'REST API',
      'Online Payment Gateway',
      'Custom Booking Engine',
      'Role-Based Access Control'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'booking'
  },
  {
    id: 'banking-ai-chatbot',
    title: 'Banking Website with AI Chatbot',
    description: 'A modern banking website built with Nuxt for the public-facing web and Laravel as the CMS backend. The platform includes an AI-powered chatbot implemented using Node.js to assist users with inquiries, navigation, and automated responses, enhancing customer engagement and support efficiency.',
    technologies: [
      'Nuxt.js',
      'Vue.js',
      'Laravel',
      'Node.js',
      'AI Chatbot',
      'REST API',
      'CMS Architecture'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'fintech'
  },
  {
    id: 'pharma-ecommerce',
    title: 'Pharmaceutical E-Commerce Platform',
    description: 'A pharmaceutical e-commerce platform built with Nuxt for the web storefront and Laravel for the backend services. The system includes a customer mobile application, secure online payment integration, and an AI-powered feature that flags prescription-only (RX) medications to support validation and compliance workflows.',
    technologies: [
      'Nuxt.js',
      'Vue.js',
      'Laravel',
      'REST API',
      'Mobile App',
      'Online Payment Gateway',
      'AI Integration',
      'Prescription Validation Logic'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'healthcare'
  },
  {
    id: 'stock-trading-platform',
    title: 'Stock Trading Platform',
    description: 'A stock trading web platform developed using Nuxt for the frontend and Laravel for backend services. The system integrates with the Philippine Stock Exchange (PSE) via a custom Node.js data processor that parses and normalizes raw market data into readable and usable formats. The platform also integrates TradingView for real-time charting and market visualization.',
    technologies: [
      'Nuxt.js',
      'Vue.js',
      'Laravel',
      'Node.js',
      'PSE Market Data Integration',
      'Custom Data Processing',
      'TradingView Integration',
      'REST API'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'fintech'
  },
  {
    id: 'lab-test-booking-platform',
    title: 'Laboratory Test Booking and Results Platform',
    description: 'An online healthcare platform for booking laboratory tests and viewing test results. The system includes a custom-built time-slot booking engine and integrates with external laboratory services to handle scheduling, test processing, and result retrieval.',
    technologies: [
      'Laravel',
      'Web Frontend',
      'REST API',
      'Custom Booking Engine',
      'External Service Integration',
      'Healthcare Workflow'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'healthcare'
  },
  {
    id: 'machine-maintenance-system',
    title: 'Machine Maintenance and Parts Management System',
    description: 'A web-based system designed to manage machine maintenance workflows and the procurement of replacement parts. The platform supports tracking maintenance activities, processing purchase requests, managing parts inventory, and integrates with third-party services to support external suppliers, notifications, and operational data exchange.',
    technologies: [
      'Laravel',
      'Web Frontend',
      'REST API',
      'Maintenance Workflow Management',
      'Procurement Processing',
      'Inventory Tracking',
      'Third-Party Service Integration'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'enterprise'
  },
  {
    id: 'networked-ecommerce-platform',
    title: 'Networked E-Commerce Platform',
    description: 'A Laravel-based e-commerce platform for health and wellness products, designed with a hierarchical dealer system to manage upline relationships. The platform supports product purchases, dealer management, sales tracking, and commission calculation, enabling structured distribution and automated reporting workflows.',
    technologies: [
      'Laravel',
      'Web Frontend',
      'REST API',
      'Dealer / Upline Management',
      'E-Commerce Logic',
      'Commission & Sales Tracking'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'ecommerce'
  },
  {
    id: 'lab-results-processing-system',
    title: 'Laboratory Results Processing System',
    description: 'A web-based system designed to process and manage laboratory results. The platform serves laboratory clinics as customers and includes features for doctors to review and validate lab results. It supports secure data handling, role-based access control, and integrates with external laboratory systems for result submission and retrieval.',
    technologies: [
      'Laravel',
      'Web Frontend',
      'REST API',
      'Role-Based Access Control',
      'Data Validation & Review',
      'External Laboratory System Integration'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'healthcare'
  },
  // Freelance Projects
  {
    id: "eskwela-ar-education-platform",
    title: "E-Skwela AR - Augmented Reality Education Platform",
    description: "A comprehensive educational platform that brings augmented reality to elementary school education. The system consists of a Laravel-powered admin dashboard for content management and a cross-platform mobile application (built with Capacitor and Vue.js) that enables students to scan QR codes from textbooks to trigger immersive AR learning experiences. Features include interactive 3D models, audio narration, interactive quizzes with progress tracking, and content offline capability. The platform supports both Android and iOS devices, making AR education accessible to students on any device.",
    technologies: [
      "Laravel",
      "Vue.js",
      "Inertia.js",
      "TypeScript",
      "Tailwind CSS",
      "Capacitor",
      "REST API",
      "AR.js",
      "Three.js",
      "WebXR",
      "QR Code Scanning",
      "Chart.js",
      "SQLite/MySQL",
      "Mobile Apps",
      "Cross-Platform Development"
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: "education"
  },
  {
    id: 'ar-navigation-polong-nhs',
    title: 'AR Navigation System for Polong National High School',
    description: 'A comprehensive augmented reality navigation and facility management solution designed for Polong National High School. The system comprises a cross-platform mobile application providing AR-based wayfinding with real-time overlays, interactive 2D/3D maps, POI search, and offline capability. The Laravel-powered admin panel enables administrators to manage Points of Interest (POIs), floor plans, buildings, user analytics, and staff assignments. The platform supports indoor navigation without GPS, accessibility features for inclusive navigation, and includes a communication system for notifications and emergency alerts.',
    technologies: [
      'Laravel 12',
      'Vue.js 3',
      'TypeScript',
      'Ionic Framework',
      'Capacitor',
      'ARCore',
      'ARKit',
      'Inertia.js',
      'Tailwind CSS',
      'REST API',
      'MySQL/PostgreSQL'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'navigation'
  },
  {
    id: 'ar-pintapin',
    title: 'AR Pintapin - E-Commerce Platform with AR',
    description: 'A modern e-commerce platform specializing in art and custom paintings with augmented reality (AR) capabilities. The platform serves three primary user roles: customers (art buyers), sellers/artists (content creators), and administrators (platform managers). The system enables seamless art discovery, purchase, and custom order fulfillment through an integrated mobile app (iOS/Android via Capacitor), web admin panel (Vue 3 + TypeScript), and robust Laravel backend API. Key features include AR-powered 3D product visualization using Three.js and WebXR, commission and wallet management for artists, custom order requests with progress tracking, multi-channel notifications, and comprehensive financial reporting. The platform supports multiple payment methods including PayMongo, Maya, and Cash on Delivery (COD), with a 10% configurable platform commission structure.',
    technologies: [
      'Laravel 10.x',
      'Vue.js 3',
      'TypeScript',
      'Capacitor',
      'Three.js',
      'WebXR',
      'REST API',
      'MySQL 8.0',
      'Redis',
      'Laravel Sanctum',
      'PayMongo',
      'Maya Payment Gateway',
      'COD',
      'Laravel Echo',
      'Socket.io',
      'Real-time Notifications'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'ecommerce'
  },
  {
    id: 'gigmo',
    title: 'GIGMO - Local Gig-Matching Platform',
    description: 'A comprehensive mobile and web-based platform designed to connect performers and venues in Pangasinan, Philippines. The system consists of a Laravel-powered admin backend, a Vue.js/Capacitor mobile app for organizers/venues, and a dedicated performer mobile app. It features a social feed for gig postings, chat-based booking negotiation with automated responses, advanced performer search filters, integrated PayMongo payment processing with escrow system, calendar management for both parties, ratings and reviews, booking history tracking, analytics dashboard for organizers, and push notifications. The platform simplifies the fragmented local entertainment booking process through centralized talent discovery, secure payment workflows, and comprehensive dispute resolution.',
    technologies: [
      'Vue.js',
      'Laravel',
      'Capacitor',
      'REST API',
      'Mobile Apps',
      'PayMongo Payment Gateway',
      'Real-time Chat',
      'Firebase Cloud Messaging',
      'MySQL Database',
      'JWT Authentication',
      'Role-based Access Control'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'gig-platform'
  },
  {
    id: 'provincial-disease-reporting-outbreak-alert-system',
    title: 'Provincial Disease Reporting and Outbreak Alert System - Pangasinan',
    description: 'A comprehensive public health surveillance platform for Pangasinan Province, Philippines. The system enables multi-tiered disease case reporting from barangay level up to provincial management, featuring real-time outbreak alerts, early warnings, case validation workflows, and geographic disease mapping. Includes a Laravel-powered admin dashboard with role-based access control (Barangay Reporter, Municipal Admin, Provincial Admin) and a mobile application for citizens to view announcements, outbreak alerts, health facility locations on interactive maps, and submit feedback. The platform supports offline-capable mobile functionality, audit logging for compliance, and notification management across multiple delivery channels.',
    technologies: [
      'Laravel',
      'Vue.js',
      'Inertia.js',
      'TypeScript',
      'Capacitor',
      'REST API',
      'Role-Based Access Control (RBAC)',
      'Offline-First Mobile Architecture',
      'Geographic Information System (GIS)',
      'Push Notifications',
      'Email Notifications',
      'MySQL Database',
      'Playwright Testing',
      'Vitest'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'healthcare'
  },
  {
    id: 'university-accomplishment-planning-system',
    title: 'University Accomplishment Planning System (UAPS)',
    description: 'A comprehensive web-based institutional planning, monitoring, and reporting platform for universities. The system enables multi-campus administration with strategic goal management, Key Result Areas (KRAs), and Key Performance Indicators (KPIs) tracking. Features include dynamic form creation and submission workflows with approval processes, real-time analytics dashboards with interactive charts and drill-down capabilities, comprehensive audit logging for compliance, role-based access control with five permission levels, and a notification system with deadline reminders. The platform supports data import/export with manifest validation, file attachments with cloud storage integration, and two-factor authentication for enhanced security.',
    technologies: [
      'Laravel 10+',
      'Vue.js 3',
      'TypeScript',
      'Inertia.js',
      'Tailwind CSS',
      'shadcn/ui',
      'Pinia',
      'REST API',
      'Laravel Fortify',
      'Two-Factor Authentication',
      'MySQL/PostgreSQL',
      'Redis',
      'WebSockets/SSE'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'enterprise'
  },
  {
    id: 'matheraphy',
    title: 'MATHERAPY - Gamified Therapeutic Solution for Kids with Dyscalculia',
    description: 'A comprehensive multi-platform educational system designed specifically to help children with dyscalculia develop mathematical skills through gamified therapeutic activities. The platform consists of a Vue.js mobile application for student engagement and a Laravel-powered admin panel for content management. The mobile app features adaptive difficulty levels that adjust based on student performance, a star reward system with achievements and streaks, avatar customization, and offline-first capabilities with cloud sync. Students progress through grade-appropriate math topics (Grades 1-6) organized by quarters, with 80% mastery required to unlock new content. The admin panel enables educators to create and manage interactive quizzes with multiple question types, media attachments, and configurable rewards. The platform includes comprehensive accessibility features such as high contrast mode, adjustable font sizes, reduced motion options, and audio feedback, while complying with COPPA and GDPR regulations for child data privacy.',
    technologies: [
      'Vue.js 3',
      'Capacitor',
      'Laravel 12',
      'Inertia.js',
      'TypeScript',
      'Pinia',
      'REST API',
      'IndexedDB',
      'SQLite',
      'Laravel Fortify',
      'Ionic Vue',
      'Tailwind CSS',
      'shadcn/ui',
      'Chart.js',
      'Adaptive Learning',
      'Offline-first Architecture',
      'COPPA Compliant',
      'AES-256 Encryption'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'education'
  },
  {
    id: 'stall-management-crms',
    title: 'Commercial Real Estate Management System (CRMS)',
    description: 'A comprehensive web-based platform for managing commercial real estate operations at the Labrador Pangasinan Commercial Complex. The system provides centralized management of stall reservations, tenant onboarding, rent collection, property administration, and building management through role-based access control. Features include an interactive stall browser with map and 3D visualization, multi-stall reservation system with shopping cart functionality, automated payment processing with delinquency management, tenant community features with business profiles, AI-powered stall recommendations, and a Progressive Web App (PWA) enabled admin dashboard with offline capabilities.',
    technologies: [
      'Laravel',
      'Vue.js',
      'Inertia.js',
      'Tailwind CSS',
      'MySQL',
      'REST API',
      'Laravel Sanctum',
      'Three.js',
      'Leaflet.js',
      'PWA',
      'Email Notifications',
      'SMS Notifications'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'business-management'
  },
  {
    id: 'derivative-damath',
    title: 'Derivative Damath - Educational Math Board Game',
    description: 'A Flutter-based educational board game that combines the traditional Filipino board game "Damath" with calculus derivatives. Players learn mathematical concepts while competing in an engaging strategy game featuring two game modes: Player vs Computer (PvC) and local multiplayer (PvP). The game includes a timer option, derivative mechanics where players compute polynomial derivatives to score points, a smart capture system with chain captures, and Dama (King) promotion with enhanced movement abilities. The platform supports cross-platform deployment including Android, iOS, Web, Windows, and Linux with immersive sound effects and move history tracking.',
    technologies: [
      'Flutter',
      'Dart',
      'Riverpod',
      'math_expressions',
      'audioplayers',
      'Clean Architecture',
      'Cross-platform Mobile',
      'Cross-platform Desktop',
      'Web Application',
      'AI Game Logic'
    ],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
    featured: true,
    category: 'educational-game'
  },
]
