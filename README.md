# Sherwin Estrera - Portfolio v1

An immersive portfolio website showcasing full-stack development skills with 3D graphics, AI integration, and cinematic animations.

## Features

- **Typing Animation**: Dynamic typing effect on the main header text for an engaging landing experience
- **3D Particle Systems**: Interactive background particle effects powered by Three.js
- **AI Chat Interface**: Integrated OpenAI-powered assistant for portfolio interaction
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Easter Eggs**: Hidden features and voice recognition capabilities
- **Performance Optimized**: Efficient rendering with proper memory management

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, TypeScript
- **3D Graphics**: Three.js with custom shaders
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **AI Integration**: OpenAI API
- **Animations**: GSAP

## Project Structure

```
se/
├── components/          # Vue components
│   ├── ParticleSystem.vue # Background particles
│   └── PKLParticleSystem.vue # PKL avatar particles
├── composables/         # Vue composables
│   ├── useThree.ts      # Three.js utilities and classes
│   ├── useOpenAI.ts     # AI chat functionality
│   └── useEasterEggs.ts # Easter egg features
├── stores/              # Pinia stores
└── pages/               # Nuxt pages
```

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
