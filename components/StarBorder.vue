<template>
  <component
    :is="as || 'div'"
    :class="`star-border-container ${className || ''}`"
    :style="{ padding: `${thickness}px 0` }"
  >
    <div
      class="border-gradient-bottom"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"
    ></div>
    <div
      class="border-gradient-top"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"
    ></div>
    <div class="inner-content">
      <slot></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  as?: string;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
}

withDefaults(defineProps<Props>(), {
  as: 'div',
  className: '',
  color: 'white',
  speed: '6s',
  thickness: 1
});
</script>

<style scoped>
.star-border-container {
  display: inline-block;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.border-gradient-bottom {
  position: absolute;
  width: 200%;
  height: 30%;
  opacity: 0.7;
  bottom: -12px;
  right: -250%;
  border-radius: 50%;
  animation: star-movement-bottom linear infinite alternate;
  z-index: 0;
}

.border-gradient-top {
  position: absolute;
  opacity: 0.7;
  width: 200%;
  height: 30%;
  top: -12px;
  left: -250%;
  border-radius: 50%;
  animation: star-movement-top linear infinite alternate;
  z-index: 0;
}

.inner-content {
  position: relative;
  z-index: 1;
}

@keyframes star-movement-bottom {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(-100%, 0%);
    opacity: 0;
  }
}

@keyframes star-movement-top {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(100%, 0%);
    opacity: 0;
  }
}
</style>