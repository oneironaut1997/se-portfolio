<template>
  <component
    :is="as"
    ref="containerRef"
    :class="`text-type ${className}`"
    v-bind="$attrs"
  >
    <slot name="content" :text="displayedText" :index="currentTextIndex">
      <span
        class="text-type__content"
        :style="{ color: getCurrentTextColor() || 'inherit' }"
      >
        {{ displayedText }}
      </span>
    </slot>
    <span
      v-if="showCursor && !isComplete"
      ref="cursorRef"
      :class="`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`"
    >
      {{ cursorCharacter }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

interface Props {
  className?: string
  showCursor?: boolean
  hideCursorWhileTyping?: boolean
  cursorCharacter?: string | any // Vue doesn't have React.ReactNode, so string or component
  cursorBlinkDuration?: number
  cursorClassName?: string
  text: string | string[]
  as?: string
  typingSpeed?: number
  initialDelay?: number
  pauseDuration?: number
  deletingSpeed?: number
  loop?: boolean
  textColors?: string[]
  variableSpeed?: { min: number; max: number }
  onSentenceComplete?: (sentence: string, index: number) => void
  startOnVisible?: boolean
  reverseMode?: boolean
  typoProbability?: number
  typoCorrectionDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  typingSpeed: 50,
  initialDelay: 0,
  pauseDuration: 2000,
  deletingSpeed: 30,
  loop: true,
  className: '',
  showCursor: true,
  hideCursorWhileTyping: false,
  cursorCharacter: '|',
  cursorClassName: '',
  cursorBlinkDuration: 0.5,
  textColors: () => [],
  startOnVisible: false,
  reverseMode: false,
  typoProbability: 0,
  typoCorrectionDelay: 100,
})

const displayedText = ref('')
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)
const isVisible = ref(!props.startOnVisible)
const isComplete = ref(false)
const isCorrectingTypo = ref(false)
const cursorRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()

const textArray = computed(() => (Array.isArray(props.text) ? props.text : [props.text]))

const getRandomSpeed = () => {
  if (!props.variableSpeed) return props.typingSpeed
  const { min, max } = props.variableSpeed
  return Math.random() * (max - min) + min
}

const getRandomChar = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  return chars[Math.floor(Math.random() * chars.length)]
}

const getCurrentTextColor = () => {
  if (props.textColors.length === 0) return
  return props.textColors[currentTextIndex.value % props.textColors.length]
}

const shouldHideCursor = computed(() => {
  const currentText = textArray.value[currentTextIndex.value]
  return props.hideCursorWhileTyping && (currentText && currentCharIndex.value < currentText.length || isDeleting.value)
})

let timeout: any

const executeTypingAnimation = () => {
  const currentText = textArray.value[currentTextIndex.value]
  if (!currentText) return
  const processedText = props.reverseMode ? currentText.split('').reverse().join('') : currentText

  if (isDeleting.value) {
    if (displayedText.value === '') {
      isDeleting.value = false
      if (currentTextIndex.value === textArray.value.length - 1 && !props.loop) {
        isComplete.value = true
        return
      }

      if (props.onSentenceComplete) {
        props.onSentenceComplete(currentText, currentTextIndex.value)
      }

      currentTextIndex.value = (currentTextIndex.value + 1) % textArray.value.length
      currentCharIndex.value = 0
      timeout = setTimeout(() => {}, props.pauseDuration)
    } else {
      timeout = setTimeout(() => {
        displayedText.value = displayedText.value.slice(0, -1)
      }, props.deletingSpeed)
    }
  } else {
    if (currentCharIndex.value < processedText.length) {
      const correctChar = processedText[currentCharIndex.value]
      const shouldTypo = !isCorrectingTypo.value && Math.random() < props.typoProbability
      const charToType = shouldTypo ? getRandomChar() : correctChar

      timeout = setTimeout(
        () => {
          displayedText.value += charToType
          if (shouldTypo) {
            isCorrectingTypo.value = true
            // Backspace the wrong char and type correct
            setTimeout(() => {
              displayedText.value = displayedText.value.slice(0, -1)
              displayedText.value += correctChar
              currentCharIndex.value++
              isCorrectingTypo.value = false
            }, props.deletingSpeed)
          } else {
            currentCharIndex.value++
          }
        },
        props.variableSpeed ? getRandomSpeed() : props.typingSpeed
      )
    } else if (textArray.value.length >= 1) {
      if (!props.loop && currentTextIndex.value === textArray.value.length - 1) {
        isComplete.value = true
        return
      }
      timeout = setTimeout(() => {
        isDeleting.value = true
      }, props.pauseDuration)
    }
  }
}

onMounted(() => {
  if (props.showCursor && cursorRef.value) {
    gsap.set(cursorRef.value, { opacity: 1 })
    gsap.to(cursorRef.value, {
      opacity: 0,
      duration: props.cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    })
  }

  if (props.startOnVisible && containerRef.value) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible.value = true
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.value)
  } else if (isVisible.value) {
    // Start animation immediately if visible
    nextTick(() => {
      if (currentCharIndex.value === 0 && !isDeleting.value && displayedText.value === '') {
        timeout = setTimeout(executeTypingAnimation, props.initialDelay)
      }
    })
  }
})

watch(isVisible, (newVal) => {
  if (!newVal) return

  nextTick(() => {
    if (currentCharIndex.value === 0 && !isDeleting.value && displayedText.value === '') {
      timeout = setTimeout(executeTypingAnimation, props.initialDelay)
    } else {
      executeTypingAnimation()
    }
  })
})

watch([currentCharIndex, displayedText, isDeleting, currentTextIndex], () => {
  if (!isVisible.value) return
  executeTypingAnimation()
})
</script>

<style scoped>
.text-type {
  display: inline-block;
  white-space: pre-wrap;
}

.text-type__cursor {
  margin-left: 0.25rem;
  display: inline-block;
  opacity: 1;
}

.text-type__cursor--hidden {
  display: none;
}
</style>