/**
 * Portfolio Skills Data
 * Contains all skill entries for the portfolio
 */

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'soft'
  proficiency: number // 1-5 scale
  years: number
  iconUrl?: string
}

export const skills: Skill[] = [
  // Frontend Skills
  { id: 'vue', name: 'Vue.js', category: 'frontend', proficiency: 5, years: 4 },
  { id: 'nuxt', name: 'Nuxt.js', category: 'frontend', proficiency: 5, years: 3 },
  { id: 'react', name: 'React.js', category: 'frontend', proficiency: 4, years: 3 },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', proficiency: 5, years: 4 },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 4, years: 4 },
  { id: 'tailwind', name: 'TailwindCSS', category: 'frontend', proficiency: 5, years: 3 },
  { id: 'shadcn', name: 'Shadcn UI', category: 'frontend', proficiency: 4, years: 2 },
  { id: 'responsive', name: 'Responsive Design', category: 'frontend', proficiency: 5, years: 4 },
  { id: 'spa', name: 'SPAs', category: 'frontend', proficiency: 5, years: 4 },
  { id: 'pwa', name: 'PWAs', category: 'frontend', proficiency: 4, years: 2 },
  { id: 'csp', name: 'CSP', category: 'frontend', proficiency: 3, years: 2 },

  // Backend Skills
  { id: 'laravel', name: 'Laravel', category: 'backend', proficiency: 5, years: 5 },
  { id: 'php', name: 'PHP', category: 'backend', proficiency: 5, years: 4 },
  { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 3, years: 2 },
  { id: 'expressjs', name: 'Express.js', category: 'backend', proficiency: 3, years: 2 },
  { id: 'mysql', name: 'MySQL', category: 'backend', proficiency: 4, years: 5 },
  { id: 'posgresql', name: 'PostgreSQL', category: 'backend', proficiency: 2, years: 2 },
  { id: 'api', name: 'REST APIs', category: 'backend', proficiency: 5, years: 4 },
  { id: 'oauth2', name: 'OAuth2', category: 'backend', proficiency: 4, years: 3 },
  { id: 'jwt', name: 'JWT', category: 'backend', proficiency: 4, years: 3 },
  { id: 'rbac', name: 'RBAC', category: 'backend', proficiency: 4, years: 3 },
  { id: 'security-headers', name: 'Security Headers', category: 'backend', proficiency: 4, years: 3 },

  // Tools & Technologies
  { id: 'git', name: 'Git', category: 'tools', proficiency: 5, years: 5 },
  { id: 'capacitor', name: 'Capacitor', category: 'tools', proficiency: 4, years: 2 },
  { id: 'ionic', name: 'Ionic Framework', category: 'tools', proficiency: 3, years: 1 },
  { id: 'cloudflare', name: 'Cloudflare', category: 'tools', proficiency: 3, years: 2 },
  { id: 'cicd', name: 'CI/CD', category: 'tools', proficiency: 4, years: 3 },
  { id: 'phpunit', name: 'PHPUnit', category: 'tools', proficiency: 4, years: 4 },
  { id: 'jest', name: 'Jest', category: 'tools', proficiency: 2, years: 2 },
  { id: 'playwright', name: 'Playwright', category: 'tools', proficiency: 3, years: 1 },
  { id: 'vulnerability-audits', name: 'Vulnerability Audits', category: 'tools', proficiency: 3, years: 2 },
  { id: 'ai-chatbot', name: 'AI Chatbot Integration', category: 'tools', proficiency: 4, years: 2 },
  { id: 'gsap', name: 'GSAP', category: 'tools', proficiency: 4, years: 2 },
  { id: 'figma', name: 'Figma', category: 'tools', proficiency: 3, years: 3 },

  // Soft Skills
  { id: 'communication', name: 'Communication', category: 'soft', proficiency: 5, years: 5 },
  { id: 'problem-solving', name: 'Problem Solving', category: 'soft', proficiency: 5, years: 5 },
  { id: 'teamwork', name: 'Teamwork', category: 'soft', proficiency: 5, years: 5 },
  { id: 'leadership', name: 'Leadership', category: 'soft', proficiency: 4, years: 3 },
  { id: 'code-review', name: 'Code Review', category: 'soft', proficiency: 5, years: 4 },
  { id: 'mentoring', name: 'Mentoring', category: 'soft', proficiency: 4, years: 3 },
  { id: 'technical-writing', name: 'Technical Writing', category: 'soft', proficiency: 4, years: 3 },
  { id: 'tdd', name: 'TDD', category: 'soft', proficiency: 4, years: 3 },
  { id: 'prompt-eng', name: 'Prompt Engineering', category: 'soft', proficiency: 3, years: 1 }
]
