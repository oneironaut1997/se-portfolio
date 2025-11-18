<template>
  <div class="skill-bar">
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-300 font-medium">{{ skill.name }}</span>
      <div class="flex items-center space-x-2">
        <div class="flex space-x-1">
          <div
            v-for="i in 5"
            :key="i"
            class="w-2 h-2 rounded-full"
            :class="i <= skill.proficiency ? 'bg-current' : 'bg-gray-600'"
          ></div>
        </div>
        <span class="text-gray-400 text-sm">{{ skill.proficiency }}/5</span>
      </div>
    </div>

    <div class="relative">
      <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-1000 ease-out"
          :style="{
            width: `${(skill.proficiency / 5) * 100}%`,
            backgroundColor: color
          }"
        ></div>
      </div>

      <!-- Animated particles along the bar -->
      <div
        v-for="i in 3"
        :key="i"
        class="absolute top-0 h-2 w-1 rounded-full opacity-60 animate-pulse"
        :style="{
          left: `${(skill.proficiency / 5) * 100 * (0.2 + i * 0.3)}%`,
          backgroundColor: color,
          animationDelay: `${i * 0.5}s`,
          animationDuration: '2s'
        }"
      ></div>
    </div>

    <div class="flex justify-between items-center mt-1 text-xs text-gray-500">
      <span>{{ skill.years }} years experience</span>
      <span class="capitalize">{{ skill.category }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from '~/stores/portfolio'

// Props
interface Props {
  skill: Skill
  color: string
}

defineProps<Props>()
</script>

<style scoped>
.skill-bar {
  @apply p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200;
}

.skill-bar:hover {
  transform: scale(1.02);
}

/* Custom animations */
@keyframes skillGlow {
  0%, 100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
  }
}

.skill-bar:hover .skill-level {
  animation: skillGlow 2s ease-in-out infinite;
}
</style>