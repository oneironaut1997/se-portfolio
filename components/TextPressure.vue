<template>
  <div
    ref="containerRef"
    :style="{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'transparent'
    }"
  >
    <p
      ref="titleRef"
      :class="['text-pressure-title', dynamicClassName]"
      :style="{
        fontFamily,
        textTransform: 'uppercase',
        fontSize: `${fontSize}px`,
        lineHeight,
        transform: `scale(1, ${scaleY})`,
        transformOrigin: 'center top',
        margin: 0,
        textAlign: 'center',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        fontWeight: 100,
        width: '100%'
      }"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        :ref="(el) => setSpanRef(i, el)"
        :data-char="char"
        :class="spanClass"
        :style="{
          display: 'inline-block',
          color: stroke ? undefined : textColor
        }"
      >
        {{ char }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

interface TextPressureProps {
  text?: string
  fontFamily?: string
  fontUrl?: string
  width?: boolean
  weight?: boolean
  italic?: boolean
  alpha?: boolean
  flex?: boolean
  stroke?: boolean
  scale?: boolean
  textColor?: string
  strokeColor?: string
  className?: string
  spanClass?: string
  minFontSize?: number
}

const props = withDefaults(defineProps<TextPressureProps>(), {
  text: 'Compressa',
  fontFamily: 'Compressa VF',
  fontUrl: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
  width: true,
  weight: true,
  italic: true,
  alpha: false,
  flex: true,
  stroke: false,
  scale: false,
  textColor: '#FFFFFF',
  strokeColor: '#FF0000',
  className: '',
  spanClass: '',
  minFontSize: 24
})

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist)
  return Math.max(minVal, val + minVal)
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

const setSpanRef = (i: number, el: any) => {
  if (el) spansRefs.value[i] = el as HTMLSpanElement
}

const containerRef = ref<HTMLDivElement | null>(null)
const titleRef = ref<HTMLHeadingElement | null>(null)
const spansRefs = ref<HTMLSpanElement[]>([])
const styleElement = ref<HTMLStyleElement | null>(null)
const rafId = ref<number | null>(null)
const debouncedSetSize = ref<any>(null)

const mouseRef = ref({ x: 0, y: 0 })
const cursorRef = ref({ x: 0, y: 0 })

const fontSize = ref(props.minFontSize)
const scaleY = ref(1)
const lineHeight = ref(1)

const chars = computed(() => props.text.split(''))

const dynamicClassName = computed(() => {
  const classes = [props.className]
  if (props.flex) classes.push('flex-text')
  if (props.stroke) classes.push('stroke')
  return classes.filter(Boolean).join(' ')
})

const styleContent = computed(() => `
  @font-face {
    font-family: '${props.fontFamily}';
    src: url('${props.fontUrl}');
    font-style: normal;
  }

  .flex-text {
    display: flex;
    justify-content: space-between;
  }

  .stroke span {
    position: relative;
    color: var(--text-color);
  }
  .stroke span::after {
    content: attr(data-char);
    position: absolute;
    left: 0;
    top: 0;
    color: transparent;
    z-index: -1;
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: var(--stroke-color);
  }

  .text-pressure-title {
    color: var(--text-color);
  }
`)

const handleMouseMove = (e: MouseEvent) => {
  cursorRef.value.x = e.clientX
  cursorRef.value.y = e.clientY
}

const handleTouchMove = (e: TouchEvent) => {
  if (!e.touches.length) return
  const t = e.touches[0]!
  cursorRef.value.x = t.clientX
  cursorRef.value.y = t.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })

  if (containerRef.value) {
    const { left, top, width, height } = containerRef.value.getBoundingClientRect()
    mouseRef.value.x = left + width / 2
    mouseRef.value.y = top + height / 2
    cursorRef.value.x = mouseRef.value.x
    cursorRef.value.y = mouseRef.value.y
  }

  debouncedSetSize.value = debounce(setSize, 100)
  debouncedSetSize.value()
  window.addEventListener('resize', debouncedSetSize.value)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) {
    animate()
  }

  styleElement.value = document.createElement('style')
  styleElement.value.textContent = styleContent.value
  document.head.appendChild(styleElement.value)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  if (debouncedSetSize.value) window.removeEventListener('resize', debouncedSetSize.value)
  if (rafId.value !== null) cancelAnimationFrame(rafId.value)
  if (styleElement.value) document.head.removeChild(styleElement.value)
})

const setSize = () => {
  if (!containerRef.value || !titleRef.value) return

  const { width: containerW, height: containerH } = containerRef.value.getBoundingClientRect()

  let newFontSize = containerW / (chars.value.length / 2)
  newFontSize = Math.max(newFontSize, props.minFontSize)

  fontSize.value = newFontSize
  scaleY.value = 1
  lineHeight.value = 1

  nextTick(() => {
    if (!titleRef.value) return
    const textRect = titleRef.value.getBoundingClientRect()

    if (props.scale && textRect.height > 0) {
      const yRatio = containerH / textRect.height
      scaleY.value = yRatio
      lineHeight.value = yRatio
    }
  })
}

const animate = () => {
  mouseRef.value.x += (cursorRef.value.x - mouseRef.value.x) / 15
  mouseRef.value.y += (cursorRef.value.y - mouseRef.value.y) / 15

  if (titleRef.value) {
    const titleRect = titleRef.value.getBoundingClientRect()
    const maxDist = titleRect.width / 2

    spansRefs.value.forEach(span => {
      if (!span) return

      const rect = span.getBoundingClientRect()
      const charCenter = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      }

      const d = dist(mouseRef.value, charCenter)

      const wdth = props.width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100
      const wght = props.weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400
      const italVal = props.italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0'
      const alphaVal = props.alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : '1'

      const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`

      if (span.style.fontVariationSettings !== newFontVariationSettings) {
        span.style.fontVariationSettings = newFontVariationSettings
      }
      if (props.alpha && span.style.opacity !== alphaVal) {
        span.style.opacity = alphaVal
      }
    })
  }

  rafId.value = requestAnimationFrame(animate)
}

</script>

<style scoped>
/* Additional styles if needed */
</style>