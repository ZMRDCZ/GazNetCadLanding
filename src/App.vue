<template>
  <div id="app" :class="{ 'cursor-active': cursorActive }">
    <!-- Neon cursor trail effect -->
    <div class="cursor-trail" ref="cursorTrail"></div>
    
    <!-- Particles background -->
    <div class="particles-background">
      <div class="particle" v-for="n in 50" :key="n" 
           :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- Router view with transitions -->
    <transition name="page-transition" mode="out-in">
      <router-view />
    </transition>
    
    <!-- Global loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader-neon"></div>
      <div class="loading-text">Загружается...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursorActive = ref(false)
const cursorTrail = ref<HTMLElement>()
const isLoading = ref(false)

// Mouse position tracking for cursor effects
const mousePos = ref({ x: 0, y: 0 })

// Handle mouse movement for cursor trail effect
const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
  
  if (cursorTrail.value) {
    cursorTrail.value.style.left = e.clientX + 'px'
    cursorTrail.value.style.top = e.clientY + 'px'
  }
  
  // Update CSS custom properties for body cursor effect
  document.documentElement.style.setProperty('--x', e.clientX + 'px')
  document.documentElement.style.setProperty('--y', e.clientY + 'px')
  
  cursorActive.value = true
  
  // Add cursor active class to body
  document.body.classList.add('cursor-active')
}

// Handle mouse leave to deactivate cursor effects
const handleMouseLeave = () => {
  cursorActive.value = false
  document.body.classList.remove('cursor-active')
}

// Generate particle styles
const getParticleStyle = (index: number) => {
  const delay = Math.random() * 20
  const duration = 10 + Math.random() * 20
  const size = 1 + Math.random() * 3
  const opacity = 0.1 + Math.random() * 0.5
  
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`,
    '--opacity': opacity,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity
  }
}

// Initialize theme and effects
onMounted(() => {
  // Set dark theme
  document.documentElement.setAttribute('data-theme', 'dark')
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  
  // Initialize loading state
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<style lang="scss">
@import './styles/main.scss';

// Page transitions
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.5s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
  filter: blur(10px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateX(-50px) scale(0.95);
  filter: blur(10px);
}

// Cursor trail effect
.cursor-trail {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 217, 255, 0.6) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9999;
  transition: all 0.1s ease;
  transform: translate(-50%, -50%);
  mix-blend-mode: screen;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: cursorPulse 2s ease-in-out infinite;
  }
}

@keyframes cursorPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.3; }
}

// Enhanced particles
.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  
  .particle {
    position: absolute;
    background: var(--neon-primary, #00d9ff);
    border-radius: 50%;
    box-shadow: 0 0 6px currentColor;
    animation: particleMove var(--duration, 20s) linear infinite;
    
    &:nth-child(3n) {
      background: var(--neon-green, #00ff88);
    }
    
    &:nth-child(5n) {
      background: var(--neon-accent, #66ffff);
    }
  }
}

@keyframes particleMove {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.5);
  }
  90% {
    opacity: var(--opacity, 0.5);
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

// Loading overlay
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .loader-neon {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(0, 217, 255, 0.3);
    border-top: 3px solid #00d9ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
    margin-bottom: 20px;
  }
  
  .loading-text {
    color: #00d9ff;
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 0 10px #00d9ff;
    animation: textPulse 2s ease-in-out infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// Global CSS custom properties for neon theme
:root {
  --neon-primary: #00d9ff;
  --neon-green: #00ff88;
  --neon-accent: #66ffff;
  --dark-bg: #0a0a1a;
  --dark-surface: #1a1a2e;
}

// Remove default focus styles and add neon ones
*:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.5);
}

// Custom scrollbar for the entire app
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--dark-bg);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--neon-primary), var(--neon-green));
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.8);
}
</style>