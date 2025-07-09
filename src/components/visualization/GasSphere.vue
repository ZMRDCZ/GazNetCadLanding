<template>
  <div class="gas-sphere-container">
    <div class="sphere-wrapper" ref="sphereWrapper">
      <!-- Main gas sphere -->
      <div 
        ref="gasSphere"
        class="gas-sphere"
        :class="[`pressure-${state}`, { 'flowing': isFlowing }]"
        :style="sphereStyle"
      >
        <!-- Inner glow effect -->
        <div class="sphere-core"></div>
        
        <!-- Gas particles -->
        <div 
          v-for="particle in particles" 
          :key="particle.id"
          class="gas-particle"
          :style="particle.style"
        ></div>
        
        <!-- Pressure waves -->
        <div 
          v-for="wave in pressureWaves" 
          :key="wave.id"
          class="pressure-wave"
          :style="wave.style"
        ></div>
      </div>
      
      <!-- Flow indicators -->
      <div v-if="isFlowing" class="flow-indicators">
        <div 
          v-for="indicator in flowIndicators" 
          :key="indicator.id"
          class="flow-indicator"
          :style="indicator.style"
        ></div>
      </div>
    </div>
    
    <!-- Sphere controls -->
    <div class="sphere-controls">
      <div class="control-item">
        <label>Давление:</label>
        <div class="pressure-display">
          <span class="value">{{ formattedPressure }}</span>
          <span class="unit">МПа</span>
          <div class="pressure-bar">
            <div 
              class="pressure-fill"
              :style="{ width: `${pressurePercent}%` }"
              :class="pressureBarClass"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="control-item">
        <label>Расход:</label>
        <div class="flow-display">
          <span class="value">{{ formattedFlowRate }}</span>
          <span class="unit">м³/ч</span>
        </div>
      </div>
      
      <div class="control-item">
        <label>Состояние:</label>
        <div class="state-indicator" :class="stateClass">
          <div class="state-dot"></div>
          <span>{{ stateLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'

// Props
interface Props {
  pressure?: number
  flowRate?: number
  state?: 'low' | 'medium' | 'high'
  size?: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pressure: 0.4,
  flowRate: 25,
  state: 'medium',
  size: 120,
  animated: true
})

// Refs
const sphereWrapper = ref<HTMLDivElement>()
const gasSphere = ref<HTMLDivElement>()

// Reactive state
const particles = ref<Array<{
  id: number
  style: Record<string, string>
}>>([])

const pressureWaves = ref<Array<{
  id: number
  style: Record<string, string>
}>>([])

const flowIndicators = ref<Array<{
  id: number
  style: Record<string, string>
}>>([])

// Animation timelines
let particleTimeline: gsap.core.Timeline | null = null
let pressureTimeline: gsap.core.Timeline | null = null
let flowTimeline: gsap.core.Timeline | null = null

// Computed properties
const formattedPressure = computed(() => props.pressure.toFixed(3))
const formattedFlowRate = computed(() => Math.round(props.flowRate))

const pressurePercent = computed(() => {
  return Math.min((props.pressure / 1.6) * 100, 100) // Max 1.6 MPa
})

const isFlowing = computed(() => props.flowRate > 0)

const sphereStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  transform: `scale(${1 + (props.pressure - 0.4) * 0.3})` // Scale based on pressure
}))

const stateClass = computed(() => `state-${props.state}`)

const pressureBarClass = computed(() => {
  if (props.pressure > 0.6) return 'pressure-high'
  if (props.pressure > 0.3) return 'pressure-medium'
  return 'pressure-low'
})

const stateLabel = computed(() => {
  switch (props.state) {
    case 'low': return 'Низкое давление'
    case 'medium': return 'Рабочее давление'
    case 'high': return 'Высокое давление'
    default: return 'Неизвестно'
  }
})

// Initialize gas particles
const initializeParticles = () => {
  const particleCount = Math.floor(props.pressure * 50) + 10
  
  particles.value = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    style: {
      '--delay': `${Math.random() * 2}s`,
      '--duration': `${2 + Math.random() * 3}s`,
      '--size': `${2 + Math.random() * 4}px`,
      '--opacity': `${0.3 + Math.random() * 0.4}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }
  }))
}

// Initialize pressure waves
const initializePressureWaves = () => {
  if (props.state === 'high') {
    const waveCount = 3
    
    pressureWaves.value = Array.from({ length: waveCount }, (_, i) => ({
      id: i,
      style: {
        '--delay': `${i * 0.3}s`,
        '--scale': `${1.5 + i * 0.5}`
      }
    }))
  }
}

// Initialize flow indicators
const initializeFlowIndicators = () => {
  if (isFlowing.value) {
    const indicatorCount = 8
    
    flowIndicators.value = Array.from({ length: indicatorCount }, (_, i) => ({
      id: i,
      style: {
        '--angle': `${(360 / indicatorCount) * i}deg`,
        '--delay': `${i * 0.1}s`,
        '--distance': `${props.size / 2 + 20}px`
      }
    }))
  }
}

// Setup animations
const setupAnimations = () => {
  if (!props.animated || !gasSphere.value) return

  // Main sphere pulsing animation
  gsap.set(gasSphere.value, { scale: 1 })
  
  const pulseIntensity = props.pressure > 0.6 ? 1.2 : props.pressure > 0.3 ? 1.1 : 1.05
  const pulseSpeed = props.pressure > 0.6 ? 0.8 : props.pressure > 0.3 ? 1.2 : 1.8
  
  gsap.to(gasSphere.value, {
    scale: pulseIntensity,
    duration: pulseSpeed,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut"
  })

  // Particle animation
  if (particles.value.length > 0) {
    particleTimeline = gsap.timeline({ repeat: -1 })
    
    particles.value.forEach((particle, index) => {
      const element = document.querySelector(`.gas-particle:nth-child(${index + 2})`) as HTMLElement
      if (element) {
        particleTimeline.to(element, {
          rotation: 360,
          scale: 1.5,
          opacity: 0.8,
          duration: 2 + Math.random() * 2,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        }, index * 0.1)
      }
    })
  }

  // Pressure wave animation
  if (pressureWaves.value.length > 0) {
    pressureTimeline = gsap.timeline({ repeat: -1 })
    
    pressureWaves.value.forEach((wave, index) => {
      const element = document.querySelector(`.pressure-wave:nth-child(${index + 1})`) as HTMLElement
      if (element) {
        pressureTimeline.fromTo(element, {
          scale: 0,
          opacity: 0.8
        }, {
          scale: 2,
          opacity: 0,
          duration: 1.5,
          ease: "power2.out",
          repeat: -1,
          delay: index * 0.3
        })
      }
    })
  }

  // Flow indicator animation
  if (flowIndicators.value.length > 0) {
    flowTimeline = gsap.timeline({ repeat: -1 })
    
    flowIndicators.value.forEach((indicator, index) => {
      const element = document.querySelector(`.flow-indicator:nth-child(${index + 1})`) as HTMLElement
      if (element) {
        flowTimeline.to(element, {
          rotation: 360,
          duration: 3,
          ease: "none",
          repeat: -1
        }, 0)
        
        flowTimeline.to(element, {
          scale: 1.2,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: index * 0.1
        }, 0)
      }
    })
  }
}

// Cleanup animations
const cleanupAnimations = () => {
  if (gasSphere.value) {
    gsap.killTweensOf(gasSphere.value)
  }
  
  if (particleTimeline) {
    particleTimeline.kill()
    particleTimeline = null
  }
  
  if (pressureTimeline) {
    pressureTimeline.kill()
    pressureTimeline = null
  }
  
  if (flowTimeline) {
    flowTimeline.kill()
    flowTimeline = null
  }
}

// Initialize all components
const initializeComponents = () => {
  initializeParticles()
  initializePressureWaves()
  initializeFlowIndicators()
  
  // Wait for DOM update then setup animations
  setTimeout(() => {
    setupAnimations()
  }, 100)
}

// Watch for changes
watch(() => props.pressure, () => {
  cleanupAnimations()
  initializeComponents()
})

watch(() => props.flowRate, () => {
  initializeFlowIndicators()
})

watch(() => props.state, () => {
  cleanupAnimations()
  initializeComponents()
})

// Lifecycle
onMounted(() => {
  initializeComponents()
})

onUnmounted(() => {
  cleanupAnimations()
})
</script>

<style lang="scss" scoped>
.gas-sphere-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-4;
  background: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
}

.sphere-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gas-sphere {
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    rgba(76, 175, 80, 0.8), 
    rgba(76, 175, 80, 0.4)
  );
  box-shadow: 
    0 0 20px rgba(76, 175, 80, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  transition: all $duration-normal $ease-out;
  overflow: hidden;
  
  &.pressure-low {
    background: radial-gradient(circle at 30% 30%, 
      rgba(76, 175, 80, 0.6), 
      rgba(76, 175, 80, 0.2)
    );
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
  }
  
  &.pressure-medium {
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 152, 0, 0.8), 
      rgba(255, 152, 0, 0.4)
    );
    box-shadow: 0 0 25px rgba(255, 152, 0, 0.4);
  }
  
  &.pressure-high {
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 87, 34, 0.9), 
      rgba(255, 87, 34, 0.5)
    );
    box-shadow: 
      0 0 30px rgba(255, 87, 34, 0.5),
      0 0 50px rgba(255, 87, 34, 0.3);
    animation: pressureGlow $pressure-transition ease-in-out infinite;
  }
  
  &.flowing::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: conic-gradient(
      transparent,
      rgba(76, 175, 80, 0.6),
      transparent
    );
    animation: flowRing 2s linear infinite;
    z-index: -1;
  }
}

.sphere-core {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: coreGlow 3s ease-in-out infinite alternate;
}

.gas-particle {
  position: absolute;
  width: var(--size, 3px);
  height: var(--size, 3px);
  background: rgba(255, 255, 255, var(--opacity, 0.5));
  border-radius: 50%;
  animation: particleFloat var(--duration, 3s) var(--delay, 0s) ease-in-out infinite;
  pointer-events: none;
}

.pressure-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 87, 34, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: waveExpand 1.5s var(--delay, 0s) ease-out infinite;
}

.flow-indicators {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.flow-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: $color-accent;
  border-radius: 50%;
  transform: 
    translate(-50%, -50%) 
    rotate(var(--angle, 0deg)) 
    translateY(calc(-1 * var(--distance, 80px)));
  animation: flowIndicatorPulse 1s var(--delay, 0s) ease-in-out infinite;
  box-shadow: 0 0 10px $color-accent;
}

.sphere-controls {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  width: 100%;
}

.control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
  }
}

.pressure-display {
  display: flex;
  align-items: center;
  gap: $space-2;
  
  .value {
    font-family: $font-family-mono;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }
  
  .unit {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }
}

.pressure-bar {
  width: 60px;
  height: 6px;
  background: $color-border;
  border-radius: $radius-full;
  overflow: hidden;
  
  .pressure-fill {
    height: 100%;
    border-radius: $radius-full;
    transition: all $duration-normal $ease-out;
    
    &.pressure-low {
      background: $color-success;
    }
    
    &.pressure-medium {
      background: $color-warning;
    }
    
    &.pressure-high {
      background: $color-error;
      animation: pressureBarPulse 1s ease-in-out infinite alternate;
    }
  }
}

.flow-display {
  display: flex;
  align-items: baseline;
  gap: $space-1;
  
  .value {
    font-family: $font-family-mono;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }
  
  .unit {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }
}

.state-indicator {
  display: flex;
  align-items: center;
  gap: $space-2;
  
  .state-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: statePulse 2s ease-in-out infinite;
  }
  
  span {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }
  
  &.state-low {
    .state-dot {
      background: $color-success;
    }
    
    span {
      color: $color-success;
    }
  }
  
  &.state-medium {
    .state-dot {
      background: $color-warning;
    }
    
    span {
      color: $color-warning;
    }
  }
  
  &.state-high {
    .state-dot {
      background: $color-error;
    }
    
    span {
      color: $color-error;
    }
  }
}

// Animations
@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(10px, -10px) scale(1.2);
    opacity: 0.8;
  }
}

@keyframes coreGlow {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes waveExpand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(var(--scale, 2));
    opacity: 0;
  }
}

@keyframes flowRing {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes flowIndicatorPulse {
  0%, 100% {
    opacity: 0.6;
    transform: 
      translate(-50%, -50%) 
      rotate(var(--angle, 0deg)) 
      translateY(calc(-1 * var(--distance, 80px)))
      scale(1);
  }
  50% {
    opacity: 1;
    transform: 
      translate(-50%, -50%) 
      rotate(var(--angle, 0deg)) 
      translateY(calc(-1 * var(--distance, 80px)))
      scale(1.3);
  }
}

@keyframes pressureBarPulse {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
    box-shadow: 0 0 10px currentColor;
  }
}

@keyframes statePulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

// Responsive
@media (max-width: $breakpoint-sm) {
  .gas-sphere-container {
    padding: $space-3;
  }
  
  .control-item {
    flex-direction: column;
    align-items: flex-start;
    gap: $space-1;
  }
}
</style> 