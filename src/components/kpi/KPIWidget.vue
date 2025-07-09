<template>
  <div class="kpi-widget" :class="[`kpi-${variant}`, { 'loading': isLoading }]">
    <div class="kpi-header">
      <div class="kpi-icon" v-if="icon">
        <component :is="iconComponent" />
      </div>
      <div class="kpi-meta">
        <h3 class="kpi-title">{{ title }}</h3>
        <p v-if="subtitle" class="kpi-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    
    <div class="kpi-content">
      <div class="kpi-value">
        <span class="kpi-number">{{ formattedValue }}</span>
        <span v-if="unit" class="kpi-unit">{{ unit }}</span>
      </div>
      
      <div v-if="change !== undefined" class="kpi-change" :class="changeClass">
        <svg class="change-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path v-if="change > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          <path v-else-if="change < 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
        </svg>
        <span class="change-value">{{ Math.abs(change) }}%</span>
      </div>
    </div>
    
    <div v-if="showProgress && progress !== undefined" class="kpi-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${Math.min(progress, 100)}%` }"
        ></div>
      </div>
      <span class="progress-text">{{ progress }}% от цели</span>
    </div>
    
    <div v-if="description" class="kpi-description">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  title: string
  value: number | string
  unit?: string
  subtitle?: string
  description?: string
  change?: number
  progress?: number
  showProgress?: boolean
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  icon?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showProgress: false,
  isLoading: false
})

// Computed
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('ru-RU')
  }
  return props.value
})

const changeClass = computed(() => {
  if (props.change === undefined) return ''
  
  if (props.change > 0) return 'change-positive'
  if (props.change < 0) return 'change-negative'
  return 'change-neutral'
})

const iconComponent = computed(() => {
  if (!props.icon) return null
  
  // Define icon components mapping
  const iconMap: Record<string, string> = {
    speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>`,
    time: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"/>
    </svg>`,
    money: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
    </svg>`,
    chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>`
  }
  
  return iconMap[props.icon] || iconMap.chart
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.kpi-widget {
  @include modern-card(true);
  position: relative;
  overflow: hidden;
  
  &.loading {
    .kpi-content {
      opacity: 0.5;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($primary, 0.1),
        transparent
      );
      animation: loading-shimmer 1.5s infinite;
    }
  }
  
  // Variants
  &.kpi-primary {
    border-left: 4px solid $primary;
    
    .kpi-icon {
      background: rgba($primary, 0.1);
      color: $primary;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, $primary, lighten($primary, 10%));
    }
  }
  
  &.kpi-success {
    border-left: 4px solid $secondary;
    
    .kpi-icon {
      background: rgba($secondary, 0.1);
      color: $secondary;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, $secondary, lighten($secondary, 10%));
    }
  }
  
  &.kpi-warning {
    border-left: 4px solid $orange-500;
    
    .kpi-icon {
      background: rgba($orange-500, 0.1);
      color: $orange-500;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, $orange-500, lighten($orange-500, 10%));
    }
  }
  
  &.kpi-error {
    border-left: 4px solid $red-500;
    
    .kpi-icon {
      background: rgba($red-500, 0.1);
      color: $red-500;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, $red-500, lighten($red-500, 10%));
    }
  }
}

.kpi-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  
  .kpi-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($gray-500, 0.1);
    color: $gray-500;
    
    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }
  
  .kpi-meta {
    flex: 1;
    min-width: 0;
    
    .kpi-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: $dark-text-primary;
      margin: 0 0 2px 0;
      line-height: 1.3;
    }
    
    .kpi-subtitle {
      font-size: 0.75rem;
      color: $dark-text-muted;
      margin: 0;
      line-height: 1.3;
    }
  }
}

.kpi-content {
  margin-bottom: 16px;
  
  .kpi-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 8px;
    
    .kpi-number {
      font-size: 2rem;
      font-weight: 700;
      color: $dark-text-primary;
      line-height: 1;
    }
    
    .kpi-unit {
      font-size: 0.875rem;
      color: $dark-text-secondary;
      font-weight: 500;
    }
  }
  
  .kpi-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    
    .change-icon {
      width: 12px;
      height: 12px;
    }
    
    &.change-positive {
      color: $secondary;
    }
    
    &.change-negative {
      color: $red-500;
    }
    
    &.change-neutral {
      color: $dark-text-muted;
    }
  }
}

.kpi-progress {
  margin-bottom: 16px;
  
  .progress-bar {
    height: 6px;
    background: rgba($gray-600, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $primary, lighten($primary, 10%));
      border-radius: 3px;
      transition: width 0.8s ease;
    }
  }
  
  .progress-text {
    font-size: 0.75rem;
    color: $dark-text-muted;
  }
}

.kpi-description {
  font-size: 0.75rem;
  color: $dark-text-muted;
  line-height: 1.4;
  border-top: 1px solid rgba($dark-border, 0.5);
  padding-top: 12px;
  margin-top: 12px;
}

// Responsive
@media (max-width: 640px) {
  .kpi-widget {
    .kpi-value .kpi-number {
      font-size: 1.5rem;
    }
  }
}

@keyframes loading-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style> 