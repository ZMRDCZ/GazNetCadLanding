<template>
  <div class="kpi-widget" :class="[`kpi-${metric.type}`, { 'is-updating': isUpdating }]">
    <!-- KPI Header -->
    <div class="kpi-header">
      <div class="kpi-icon">
        <component :is="metricIcon" :size="24" />
      </div>
      <div class="kpi-meta">
        <h3 class="kpi-title">{{ metric.title }}</h3>
        <p class="kpi-subtitle">{{ metric.subtitle }}</p>
      </div>
      
      <!-- Trend indicator -->
      <div v-if="metric.trend" class="trend-indicator" :class="trendClass">
        <component :is="trendIcon" :size="16" />
        <span class="trend-value">{{ Math.abs(metric.trend) }}%</span>
      </div>
    </div>
    
    <!-- KPI Value Display -->
    <div class="kpi-value-section">
      <div class="kpi-main-value">
        <span ref="valueElement" class="kpi-number">{{ displayValue }}</span>
        <span class="kpi-unit">{{ metric.unit }}</span>
      </div>
      
      <!-- Comparison values -->
      <div v-if="metric.comparison" class="kpi-comparison">
        <div class="comparison-item before">
          <span class="label">Было:</span>
          <span class="value">{{ metric.comparison.before }}{{ metric.unit }}</span>
        </div>
        <div class="comparison-arrow">
          <ArrowRight :size="16" />
        </div>
        <div class="comparison-item after">
          <span class="label">Стало:</span>
          <span class="value">{{ metric.comparison.after }}{{ metric.unit }}</span>
        </div>
      </div>
    </div>
    
    <!-- Progress Bar (for percentage metrics) -->
    <div v-if="showProgress" class="kpi-progress">
      <div class="progress-bar">
        <div 
          ref="progressFill"
          class="progress-fill"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
      <div class="progress-labels">
        <span class="progress-start">{{ metric.progressRange?.[0] || 0 }}{{ metric.unit }}</span>
        <span class="progress-end">{{ metric.progressRange?.[1] || 100 }}{{ metric.unit }}</span>
      </div>
    </div>
    
    <!-- Chart Mini Visualization -->
    <div v-if="metric.chartData" class="kpi-chart">
      <canvas ref="chartCanvas" class="mini-chart"></canvas>
    </div>
    
    <!-- KPI Footer -->
    <div class="kpi-footer">
      <div class="kpi-timestamp">
        <Clock :size="12" />
        <span>{{ formattedTimestamp }}</span>
      </div>
      
      <!-- Action button -->
      <button 
        v-if="metric.actionLabel"
        class="kpi-action"
        @click="handleAction"
        :disabled="isUpdating"
      >
        {{ metric.actionLabel }}
      </button>
    </div>
    
    <!-- Loading overlay -->
    <div v-if="isUpdating" class="updating-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Timer,
  AlertTriangle,
  DollarSign,
  Zap,
  Target,
  BarChart3
} from 'lucide-vue-next'

// Props
interface KPIMetric {
  id: string
  type: 'time' | 'errors' | 'efficiency' | 'roi' | 'savings'
  title: string
  subtitle?: string
  value: number
  unit: string
  target?: number
  trend?: number // percentage change
  comparison?: {
    before: number
    after: number
  }
  progressRange?: [number, number]
  chartData?: number[]
  actionLabel?: string
  timestamp?: Date
}

interface Props {
  metric: KPIMetric
  animated?: boolean
  updateInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
  updateInterval: 0
})

// Emits
const emit = defineEmits<{
  'action-click': [metricId: string]
  'value-change': [newValue: number]
}>()

// Reactive state
const valueElement = ref<HTMLSpanElement>()
const progressFill = ref<HTMLDivElement>()
const chartCanvas = ref<HTMLCanvasElement>()
const isUpdating = ref(false)
const displayValue = ref(props.metric.value)
// const currentChartIndex = ref(0) // Unused for now

// Animation timeline
let animationTimeline: gsap.core.Timeline | null = null
let updateInterval: number | null = null

// Computed properties
const metricIcon = computed(() => {
  switch (props.metric.type) {
    case 'time': return Timer
    case 'errors': return AlertTriangle
    case 'efficiency': return Zap
    case 'roi': return DollarSign
    case 'savings': return Target
    default: return BarChart3
  }
})

const trendClass = computed(() => {
  if (!props.metric.trend) return ''
  return props.metric.trend > 0 ? 'trend-positive' : 'trend-negative'
})

const trendIcon = computed(() => {
  if (!props.metric.trend) return TrendingUp
  return props.metric.trend > 0 ? TrendingUp : TrendingDown
})

const showProgress = computed(() => {
  return props.metric.type === 'efficiency' || 
         (props.metric.target && props.metric.progressRange)
})

const progressPercent = computed(() => {
  if (!props.metric.progressRange) return 0
  const [min, max] = props.metric.progressRange
  const percent = ((props.metric.value - min) / (max - min)) * 100
  return Math.max(0, Math.min(100, percent))
})

const formattedTimestamp = computed(() => {
  if (!props.metric.timestamp) return 'Сейчас'
  
  const now = new Date()
  const diff = now.getTime() - props.metric.timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Только что'
  if (minutes < 60) return `${minutes} мин назад`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ч назад`
  
  return props.metric.timestamp.toLocaleDateString('ru-RU')
})

// Format display value based on metric type
const formatValue = (value: number): string => {
  switch (props.metric.type) {
    case 'time':
      return value < 1 ? (value * 60).toFixed(0) : value.toFixed(1)
    case 'errors':
      return Math.round(value).toString()
    case 'efficiency':
      return value.toFixed(1)
    case 'roi':
      return (value / 1000000).toFixed(1) // Convert to millions
    case 'savings':
      return value.toFixed(0)
    default:
      return value.toFixed(2)
  }
}

// Animate value change
const animateValue = (fromValue: number, toValue: number) => {
  if (!valueElement.value || !props.animated) {
    displayValue.value = toValue
    return
  }

  isUpdating.value = true

  // Create counter animation
  const counter = { value: fromValue }
  
  gsap.to(counter, {
    value: toValue,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => {
      displayValue.value = parseFloat(formatValue(counter.value))
    },
    onComplete: () => {
      displayValue.value = toValue
      isUpdating.value = false
      emit('value-change', toValue)
    }
  })

  // Add scaling animation for emphasis
  gsap.fromTo(valueElement.value, {
    scale: 1
  }, {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  })
}

// Animate progress bar
const animateProgress = () => {
  if (!progressFill.value || !props.animated) return

  gsap.fromTo(progressFill.value, {
    width: '0%'
  }, {
    width: `${progressPercent.value}%`,
    duration: 2,
    ease: "power2.out",
    delay: 0.5
  })
}

// Draw mini chart
const drawMiniChart = () => {
  if (!chartCanvas.value || !props.metric.chartData) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const data = props.metric.chartData
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  if (data.length < 2) return

  // Calculate bounds
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const valueRange = maxValue - minValue

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  
  switch (props.metric.type) {
    case 'time':
      gradient.addColorStop(0, 'rgba(255, 202, 40, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 202, 40, 0.05)')
      break
    case 'errors':
      gradient.addColorStop(0, 'rgba(255, 87, 34, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 87, 34, 0.05)')
      break
    case 'roi':
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)')
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0.05)')
      break
    default:
      gradient.addColorStop(0, 'rgba(0, 63, 92, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 63, 92, 0.05)')
  }

  // Draw line chart
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary')

  data.forEach((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - minValue) / valueRange) * height
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Fill area under curve
  data.forEach((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - minValue) / valueRange) * height
    
    if (index === 0) {
      ctx.beginPath()
      ctx.moveTo(x, height)
      ctx.lineTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.lineTo(width, height)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()
}

// Setup pulse animation for high priority metrics
const setupPulseAnimation = () => {
  if (!props.animated) return

  const shouldPulse = (
    (props.metric.type === 'errors' && props.metric.value > 10) ||
    (props.metric.type === 'time' && props.metric.trend && props.metric.trend > 20)
  )

  if (shouldPulse && valueElement.value) {
    gsap.to(valueElement.value, {
      textShadow: '0 0 15px currentColor',
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    })
  }
}

// Handle action button click
const handleAction = () => {
  emit('action-click', props.metric.id)
}

// Setup auto-update if interval is specified
const setupAutoUpdate = () => {
  if (props.updateInterval > 0) {
    updateInterval = window.setInterval(() => {
      // Simulate value update (in real app, this would fetch from store)
      const variation = (Math.random() - 0.5) * 0.1 * props.metric.value
      const newValue = Math.max(0, props.metric.value + variation)
      animateValue(props.metric.value, newValue)
    }, props.updateInterval)
  }
}

// Watch for metric value changes
watch(() => props.metric.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    animateValue(oldValue, newValue)
  }
})

// Watch for chart data changes
watch(() => props.metric.chartData, () => {
  if (props.metric.chartData) {
    setTimeout(drawMiniChart, 100)
  }
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  // Initial animations
  if (props.animated) {
    if (valueElement.value) {
      gsap.fromTo(valueElement.value, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      })
    }

    setTimeout(() => {
      animateProgress()
      drawMiniChart()
      setupPulseAnimation()
    }, 200)
  } else {
    drawMiniChart()
  }

  setupAutoUpdate()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  
  if (animationTimeline) {
    // animationTimeline.kill() // Disabled due to TypeScript issues
  }
  
  // Cleanup GSAP animations
  if (valueElement.value) {
    gsap.killTweensOf(valueElement.value)
  }
})
</script>

<style lang="scss" scoped>
.kpi-widget {
  position: relative;
  background: $color-surface;
  border-radius: $radius-xl;
  padding: $space-4;
  box-shadow: $shadow-sm;
  border: 1px solid $color-border;
  min-height: $kpi-card-min-height;
  transition: all $duration-normal $ease-out;
  overflow: hidden;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }
  
  &.is-updating {
    pointer-events: none;
  }
  
  // Type-specific styling
  &.kpi-time {
    border-left: 4px solid $color-accent;
  }
  
  &.kpi-errors {
    border-left: 4px solid $color-error;
  }
  
  &.kpi-efficiency {
    border-left: 4px solid $color-primary;
  }
  
  &.kpi-roi {
    border-left: 4px solid $color-success;
  }
  
  &.kpi-savings {
    border-left: 4px solid $color-info;
  }
}

.kpi-header {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  margin-bottom: $space-4;
}

.kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  background: $color-surface-variant;
  color: $color-primary;
  flex-shrink: 0;
}

.kpi-meta {
  flex: 1;
  min-width: 0;
  
  .kpi-title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin: 0 0 $space-1 0;
    line-height: $line-height-tight;
  }
  
  .kpi-subtitle {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin: 0;
    line-height: $line-height-normal;
  }
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: $space-1;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  
  &.trend-positive {
    background: rgba(76, 175, 80, 0.1);
    color: $color-success;
  }
  
  &.trend-negative {
    background: rgba(255, 87, 34, 0.1);
    color: $color-error;
  }
}

.kpi-value-section {
  margin-bottom: $space-4;
}

.kpi-main-value {
  display: flex;
  align-items: baseline;
  gap: $space-2;
  margin-bottom: $space-2;
  
  .kpi-number {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    font-family: $font-family-mono;
    color: $color-text-primary;
    line-height: 1;
  }
  
  .kpi-unit {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
  }
}

.kpi-comparison {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2;
  background: $color-surface-variant;
  border-radius: $radius-md;
  font-size: $font-size-xs;
  
  .comparison-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .label {
      color: $color-text-secondary;
      margin-bottom: 2px;
    }
    
    .value {
      font-family: $font-family-mono;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
    
    &.before .value {
      color: $color-error;
    }
    
    &.after .value {
      color: $color-success;
    }
  }
  
  .comparison-arrow {
    color: $color-text-secondary;
  }
}

.kpi-progress {
  margin-bottom: $space-3;
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background: $color-border;
    border-radius: $radius-full;
    overflow: hidden;
    margin-bottom: $space-2;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $color-primary, $color-accent);
      border-radius: $radius-full;
      transition: width $duration-normal $ease-out;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: progressShimmer 2s ease-in-out infinite;
      }
    }
  }
  
  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }
}

.kpi-chart {
  margin-bottom: $space-3;
  
  .mini-chart {
    width: 100%;
    height: 40px;
    border-radius: $radius-sm;
  }
}

.kpi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.kpi-timestamp {
  display: flex;
  align-items: center;
  gap: $space-1;
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.kpi-action {
  @include button-reset;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  background: $color-primary;
  color: $color-text-on-primary;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  transition: all $duration-fast $ease-out;
  
  &:hover:not(:disabled) {
    background: $color-primary-light;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.updating-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-xl;
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid $color-border;
    border-top: 2px solid $color-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

// Animations
@keyframes progressShimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive
@media (max-width: $breakpoint-sm) {
  .kpi-widget {
    padding: $space-3;
  }
  
  .kpi-main-value .kpi-number {
    font-size: $font-size-2xl;
  }
  
  .kpi-comparison {
    font-size: $font-size-xs;
    gap: $space-1;
    padding: $space-1;
  }
}
</style> 