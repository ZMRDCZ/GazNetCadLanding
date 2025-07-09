<template>
  <div class="gas-sphere" :class="{ 'animated': animate }">
    <svg class="sphere-svg" viewBox="0 0 200 200">
      <defs>
        <!-- Gradients for gas sphere -->
        <radialGradient id="gasGradient" cx="40%" cy="30%">
          <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.8"/>
          <stop offset="50%" style="stop-color:#0099cc;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#004466;stop-opacity:0.4"/>
        </radialGradient>
        
        <!-- Glow filter -->
        <filter id="gasGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Pipeline gradient -->
        <linearGradient id="pipelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="50%" style="stop-color:#10b981"/>
          <stop offset="100%" style="stop-color:#3b82f6"/>
        </linearGradient>
      </defs>
      
      <!-- Main gas sphere -->
      <circle 
        cx="100" 
        cy="100" 
        r="60" 
        fill="url(#gasGradient)" 
        filter="url(#gasGlow)"
        class="gas-sphere-main"
      />
      
      <!-- Inner particles -->
      <circle 
        v-for="particle in particles" 
        :key="particle.id"
        :cx="particle.x" 
        :cy="particle.y" 
        :r="particle.size"
        :fill="particle.color"
        :opacity="particle.opacity"
        class="gas-particle"
        :style="{ 
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`
        }"
      />
      
      <!-- Pipeline connections -->
      <g class="pipeline-connections">
        <path 
          d="M 40 100 Q 70 100 100 100" 
          stroke="url(#pipelineGradient)" 
          stroke-width="3" 
          fill="none"
          class="pipeline-segment"
        />
        <path 
          d="M 100 100 Q 130 100 160 100" 
          stroke="url(#pipelineGradient)" 
          stroke-width="3" 
          fill="none"
          class="pipeline-segment"
          style="animation-delay: 0.5s"
        />
        <path 
          d="M 100 100 Q 100 70 100 40" 
          stroke="url(#pipelineGradient)" 
          stroke-width="3" 
          fill="none"
          class="pipeline-segment"
          style="animation-delay: 1s"
        />
        <path 
          d="M 100 100 Q 100 130 100 160" 
          stroke="url(#pipelineGradient)" 
          stroke-width="3" 
          fill="none"
          class="pipeline-segment"
          style="animation-delay: 1.5s"
        />
      </g>
      
      <!-- Flow indicators -->
      <g class="flow-indicators">
        <circle class="flow-dot" r="2" fill="#00ff88">
          <animateMotion dur="3s" repeatCount="indefinite">
            <path d="M 40 100 Q 70 100 160 100"/>
          </animateMotion>
        </circle>
        <circle class="flow-dot" r="2" fill="#00ff88">
          <animateMotion dur="4s" repeatCount="indefinite">
            <path d="M 100 40 Q 100 70 100 160"/>
          </animateMotion>
        </circle>
      </g>
      
      <!-- Pressure readings -->
      <g class="pressure-readings" v-if="showReadings">
        <text x="100" y="190" text-anchor="middle" class="reading-text">
          {{ pressure }} МПа
        </text>
        <text x="30" y="110" text-anchor="middle" class="reading-text">
          {{ flowRate }} м³/ч
        </text>
        <text x="170" y="110" text-anchor="middle" class="reading-text">
          Ø{{ diameter }}мм
        </text>
      </g>
    </svg>
    
    <!-- Status indicator -->
    <div class="status-indicator" :class="`status-${status}`">
      <div class="status-dot"></div>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Props {
  animate?: boolean
  showReadings?: boolean
  pressure?: number
  flowRate?: number
  diameter?: number
  status?: 'active' | 'warning' | 'error' | 'offline'
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showReadings: true,
  pressure: 0.3,
  flowRate: 150,
  diameter: 110,
  status: 'active'
})

// Generate particles for animation
const particles = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 70 + Math.random() * 60,
    y: 70 + Math.random() * 60,
    size: 1 + Math.random() * 2,
    color: Math.random() > 0.5 ? '#00d4ff' : '#00ff88',
    opacity: 0.3 + Math.random() * 0.4,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2
  }))
)

// Status text mapping
const statusText = computed(() => {
  const statusMap = {
    active: 'Активен',
    warning: 'Предупреждение',
    error: 'Ошибка',
    offline: 'Отключен'
  }
  return statusMap[props.status]
})

// Update particles periodically for more dynamic effect
onMounted(() => {
  if (props.animate) {
    const interval = setInterval(() => {
      particles.value = particles.value.map(particle => ({
        ...particle,
        x: 70 + Math.random() * 60,
        y: 70 + Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.4
      }))
    }, 5000)
    
    // Cleanup
    return () => clearInterval(interval)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.gas-sphere {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  
  &.animated {
    .gas-sphere-main {
      animation: spherePulse 4s ease-in-out infinite;
    }
    
    .gas-particle {
      animation: particleFloat 3s ease-in-out infinite;
    }
    
    .pipeline-segment {
      animation: pipelineFlow 2s ease-in-out infinite;
    }
  }
}

.sphere-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 20px rgba($primary, 0.3));
}

.gas-sphere-main {
  transition: all 0.3s ease;
  
  &:hover {
    filter: url(#gasGlow) drop-shadow(0 0 30px rgba($primary, 0.6));
  }
}

.gas-particle {
  filter: url(#gasGlow);
}

.pipeline-segment {
  opacity: 0.8;
  filter: drop-shadow(0 0 3px rgba($primary, 0.5));
}

.flow-dot {
  filter: drop-shadow(0 0 3px rgba($secondary, 0.8));
}

.reading-text {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 600;
  fill: $dark-text-secondary;
}

.pressure-readings {
  .reading-text {
    &:first-child {
      fill: $primary;
    }
    
    &:nth-child(2) {
      fill: $secondary;
    }
    
    &:nth-child(3) {
      fill: $orange-500;
    }
  }
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba($dark-surface, 0.9);
  border-radius: 12px;
  border: 1px solid rgba($dark-border, 0.5);
  backdrop-filter: blur(10px);
  
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    
    .status-active & {
      background: $secondary;
      box-shadow: 0 0 6px rgba($secondary, 0.6);
      animation: statusPulse 2s ease-in-out infinite;
    }
    
    .status-warning & {
      background: $orange-500;
      box-shadow: 0 0 6px rgba($orange-500, 0.6);
    }
    
    .status-error & {
      background: $red-500;
      box-shadow: 0 0 6px rgba($red-500, 0.6);
    }
    
    .status-offline & {
      background: $gray-500;
    }
  }
  
  .status-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: $dark-text-secondary;
    
    .status-active & {
      color: $secondary;
    }
    
    .status-warning & {
      color: $orange-500;
    }
    
    .status-error & {
      color: $red-500;
    }
  }
}

// Animations
@keyframes spherePulse {
  0%, 100% {
    r: 60;
    opacity: 0.8;
  }
  50% {
    r: 62;
    opacity: 1;
  }
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes pipelineFlow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// Responsive adjustments
@media (max-width: 640px) {
  .gas-sphere {
    max-width: 250px;
  }
  
  .reading-text {
    font-size: 8px;
  }
  
  .status-indicator {
    .status-text {
      font-size: 0.625rem;
    }
  }
}
</style> 