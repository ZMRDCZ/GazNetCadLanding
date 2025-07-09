<template>
  <div class="route-calculator">
    <div class="calculator-header">
      <h3 class="calculator-title">Расчёт маршрута</h3>
      <div class="calculation-status" :class="statusClass">
        <div class="status-dot"></div>
        <span>{{ statusText }}</span>
      </div>
    </div>
    
    <!-- Route Points -->
    <div class="route-section">
      <h4 class="section-title">Опорные точки маршрута</h4>
      
      <div class="route-points">
        <div 
          v-for="(point, index) in localRoutePoints" 
          :key="point.id"
          class="route-point"
          :class="{ active: activePointIndex === index }"
          @click="selectPoint(index)"
        >
          <div class="point-header">
            <div class="point-number">{{ index + 1 }}</div>
            <div class="point-info">
              <span class="point-name">{{ point.name || `Точка ${index + 1}` }}</span>
              <span class="point-coords">{{ formatCoordinates(point) }}</span>
            </div>
            <button 
              v-if="localRoutePoints.length > 2"
              class="remove-point"
              @click.stop="removePoint(index)"
            >
              <X :size="16" />
            </button>
          </div>
          
          <div class="point-details" v-if="activePointIndex === index">
            <div class="detail-group">
              <label class="detail-label">Координата X, м</label>
              <input 
                v-model.number="point.x"
                @input="updateRoute"
                type="number"
                class="detail-input"
              />
            </div>
            
            <div class="detail-group">
              <label class="detail-label">Координата Y, м</label>
              <input 
                v-model.number="point.y"
                @input="updateRoute"
                type="number"
                class="detail-input"
              />
            </div>
            
            <div class="detail-group">
              <label class="detail-label">Высотная отметка, м</label>
              <input 
                v-model.number="point.elevation"
                @input="updateRoute"
                type="number"
                step="0.1"
                class="detail-input"
              />
            </div>
            
            <div class="detail-group">
              <label class="detail-label">Тип точки</label>
              <select 
                v-model="point.type"
                @change="updateRoute"
                class="detail-select"
              >
                <option value="start">Начальная</option>
                <option value="intermediate">Промежуточная</option>
                <option value="turn">Поворот</option>
                <option value="end">Конечная</option>
              </select>
            </div>
          </div>
        </div>
        
        <button class="add-point-btn" @click="addPoint">
          <Plus :size="16" />
          <span>Добавить точку</span>
        </button>
      </div>
    </div>
    
    <!-- Route Statistics -->
    <div class="route-section">
      <h4 class="section-title">Параметры маршрута</h4>
      
      <div class="route-stats">
        <div class="stat-item">
          <span class="stat-label">Общая длина</span>
          <span class="stat-value">{{ formatLength(routeLength) }}</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">Количество поворотов</span>
          <span class="stat-value">{{ turnsCount }}</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">Перепад высот</span>
          <span class="stat-value">{{ formatElevation(elevationDifference) }}</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">Уклон максимальный</span>
          <span class="stat-value">{{ formatSlope(maxSlope) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Calculation Results -->
    <div v-if="calculationResults" class="route-section">
      <h4 class="section-title">Результаты расчёта</h4>
      
      <div class="results-grid">
        <div class="result-item">
          <div class="result-icon pressure">
            <Gauge :size="20" />
          </div>
          <div class="result-content">
            <span class="result-label">Давление на входе</span>
            <span class="result-value">{{ calculationResults.inputPressure }} МПа</span>
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-icon flow">
            <Wind :size="20" />
          </div>
          <div class="result-content">
            <span class="result-label">Расход газа</span>
            <span class="result-value">{{ calculationResults.flowRate }} м³/ч</span>
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-icon velocity">
            <Zap :size="20" />
          </div>
          <div class="result-content">
            <span class="result-label">Скорость потока</span>
            <span class="result-value">{{ calculationResults.velocity }} м/с</span>
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-icon losses">
            <TrendingDown :size="20" />
          </div>
          <div class="result-content">
            <span class="result-label">Потери давления</span>
            <span class="result-value">{{ calculationResults.pressureLoss }} кПа</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="calculator-actions">
      <button 
        class="btn btn-primary"
        @click="$emit('calculate')"
        :disabled="!canCalculate || isCalculating"
      >
        <Calculator :size="16" />
        <span v-if="isCalculating">Расчёт...</span>
        <span v-else>Рассчитать</span>
      </button>
      
      <button class="btn btn-secondary" @click="optimizeRoute">
        <Target :size="16" />
        <span>Оптимизировать</span>
      </button>
      
      <button class="btn btn-secondary" @click="resetRoute">
        <RotateCcw :size="16" />
        <span>Сбросить</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  Plus, 
  X, 
  Calculator, 
  Target, 
  RotateCcw,
  Gauge,
  Wind,
  Zap,
  TrendingDown
} from 'lucide-vue-next'

interface RoutePoint {
  id: string
  x: number
  y: number
  elevation: number
  type: 'start' | 'intermediate' | 'turn' | 'end'
  name?: string
}

interface CalculationResults {
  inputPressure: number
  flowRate: number
  velocity: number
  pressureLoss: number
  efficiency: number
  errors?: string[]
}

interface Props {
  routePoints: RoutePoint[]
  calculationResults?: CalculationResults | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'route-update': [points: RoutePoint[]]
  'calculate': []
}>()

// Local state
const localRoutePoints = ref<RoutePoint[]>([...props.routePoints])
const activePointIndex = ref<number | null>(null)
const isCalculating = ref(false)

// Computed properties
const statusClass = computed(() => {
  if (isCalculating.value) return 'calculating'
  if (props.calculationResults?.errors?.length) return 'error'
  if (props.calculationResults) return 'completed'
  return 'pending'
})

const statusText = computed(() => {
  if (isCalculating.value) return 'Выполняется расчёт'
  if (props.calculationResults?.errors?.length) return 'Ошибка расчёта'
  if (props.calculationResults) return 'Расчёт выполнен'
  return 'Готов к расчёту'
})

const canCalculate = computed(() => {
  return localRoutePoints.value.length >= 2 &&
         localRoutePoints.value.every(point => point.x !== undefined && point.y !== undefined)
})

const routeLength = computed(() => {
  if (localRoutePoints.value.length < 2) return 0
  
  let totalLength = 0
  for (let i = 1; i < localRoutePoints.value.length; i++) {
    const p1 = localRoutePoints.value[i - 1]
    const p2 = localRoutePoints.value[i]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const dz = (p2.elevation || 0) - (p1.elevation || 0)
    totalLength += Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
  return totalLength
})

const turnsCount = computed(() => {
  return localRoutePoints.value.filter(point => point.type === 'turn').length
})

const elevationDifference = computed(() => {
  if (localRoutePoints.value.length < 2) return 0
  const elevations = localRoutePoints.value.map(p => p.elevation || 0)
  return Math.max(...elevations) - Math.min(...elevations)
})

const maxSlope = computed(() => {
  if (localRoutePoints.value.length < 2) return 0
  
  let maxSlope = 0
  for (let i = 1; i < localRoutePoints.value.length; i++) {
    const p1 = localRoutePoints.value[i - 1]
    const p2 = localRoutePoints.value[i]
    const dx = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    const dy = (p2.elevation || 0) - (p1.elevation || 0)
    const slope = Math.abs(dy / dx) * 100 // Convert to percentage
    maxSlope = Math.max(maxSlope, slope)
  }
  return maxSlope
})

// Methods
const selectPoint = (index: number) => {
  activePointIndex.value = activePointIndex.value === index ? null : index
}

const addPoint = () => {
  const newPoint: RoutePoint = {
    id: `point-${Date.now()}`,
    x: 0,
    y: 0,
    elevation: 0,
    type: 'intermediate'
  }
  
  if (localRoutePoints.value.length === 0) {
    newPoint.type = 'start'
  } else if (localRoutePoints.value.length === 1) {
    newPoint.type = 'end'
    // Update previous point type if it was 'end'
    if (localRoutePoints.value[0].type === 'end') {
      localRoutePoints.value[0].type = 'start'
    }
  } else {
    // Set last point as end, new point as intermediate
    const lastIndex = localRoutePoints.value.length - 1
    if (localRoutePoints.value[lastIndex].type === 'end') {
      localRoutePoints.value[lastIndex].type = 'intermediate'
    }
    newPoint.type = 'end'
  }
  
  localRoutePoints.value.push(newPoint)
  updateRoute()
  activePointIndex.value = localRoutePoints.value.length - 1
}

const removePoint = (index: number) => {
  if (localRoutePoints.value.length <= 2) return
  
  localRoutePoints.value.splice(index, 1)
  
  // Update point types
  if (localRoutePoints.value.length > 0) {
    localRoutePoints.value[0].type = 'start'
    localRoutePoints.value[localRoutePoints.value.length - 1].type = 'end'
  }
  
  if (activePointIndex.value === index) {
    activePointIndex.value = null
  } else if (activePointIndex.value! > index) {
    activePointIndex.value!--
  }
  
  updateRoute()
}

const updateRoute = () => {
  emit('route-update', [...localRoutePoints.value])
}

const optimizeRoute = () => {
  // Implement route optimization algorithm
  // For now, just sort points by distance from start
  const startPoint = localRoutePoints.value.find(p => p.type === 'start')
  if (!startPoint) return
  
  const otherPoints = localRoutePoints.value.filter(p => p.type !== 'start' && p.type !== 'end')
  const endPoint = localRoutePoints.value.find(p => p.type === 'end')
  
  // Simple optimization: sort intermediate points by distance from start
  otherPoints.sort((a, b) => {
    const distA = Math.sqrt(Math.pow(a.x - startPoint.x, 2) + Math.pow(a.y - startPoint.y, 2))
    const distB = Math.sqrt(Math.pow(b.x - startPoint.x, 2) + Math.pow(b.y - startPoint.y, 2))
    return distA - distB
  })
  
  localRoutePoints.value = [startPoint, ...otherPoints, endPoint].filter((point): point is RoutePoint => point !== undefined)
  updateRoute()
}

const resetRoute = () => {
  localRoutePoints.value = [
    {
      id: 'start',
      x: 0,
      y: 0,
      elevation: 0,
      type: 'start',
      name: 'Начальная точка'
    },
    {
      id: 'end',
      x: 100,
      y: 100,
      elevation: 0,
      type: 'end',
      name: 'Конечная точка'
    }
  ]
  activePointIndex.value = null
  updateRoute()
}

// Formatting methods
const formatCoordinates = (point: RoutePoint) => {
  return `(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`
}

const formatLength = (length: number) => {
  if (length < 1000) return `${length.toFixed(1)} м`
  return `${(length / 1000).toFixed(2)} км`
}

const formatElevation = (elevation: number) => {
  return `${elevation.toFixed(1)} м`
}

const formatSlope = (slope: number) => {
  return `${slope.toFixed(2)}%`
}

// Watchers
watch(() => props.routePoints, (newPoints) => {
  localRoutePoints.value = [...newPoints]
}, { deep: true })
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.route-calculator {
  @include glassmorphism;
  border-radius: $radius-xl;
  border: 1px solid rgba($color-primary, 0.2);
  box-shadow: $shadow-xl;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      $color-primary 0%, 
      $color-secondary 50%, 
      $color-accent 100%);
  }
}

.calculator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-6 $space-6 $space-4;
  border-bottom: 1px solid rgba($color-border, 0.3);
  
  .calculator-title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    text-shadow: 0 0 10px rgba($color-primary, 0.3);
  }
}

.calculation-status {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  &.status-ready {
    background: rgba($color-success, 0.1);
    color: $color-success;
    border: 1px solid rgba($color-success, 0.3);
    
    .status-dot {
      background: $color-success;
      box-shadow: 0 0 10px $color-success;
    }
  }
  
  &.status-calculating {
    background: rgba($color-warning, 0.1);
    color: $color-warning;
    border: 1px solid rgba($color-warning, 0.3);
    
    .status-dot {
      background: $color-warning;
      box-shadow: 0 0 10px $color-warning;
    }
  }
  
  &.status-error {
    background: rgba($color-error, 0.1);
    color: $color-error;
    border: 1px solid rgba($color-error, 0.3);
    
    .status-dot {
      background: $color-error;
      box-shadow: 0 0 10px $color-error;
    }
  }
}

.route-section {
  padding: $space-6;
  
  & + .route-section {
    border-top: 1px solid rgba($color-border, 0.3);
  }
  
  .section-title {
    margin: 0 0 $space-4 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    display: flex;
    align-items: center;
    gap: $space-2;
    
    &::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(45deg, $color-primary, $color-secondary);
      border-radius: $radius-sm;
    }
  }
}

.route-points {
  .route-point {
    background: rgba($color-surface-elevated, 0.8);
    border: 1px solid rgba($color-border, 0.3);
    border-radius: $radius-lg;
    margin-bottom: $space-3;
    overflow: hidden;
    transition: all $duration-normal ease;
    
    &:hover {
      border-color: rgba($color-primary, 0.5);
      box-shadow: 0 4px 20px rgba($color-primary, 0.1);
      transform: translateY(-2px);
    }
    
    &.active {
      border-color: $color-primary;
      box-shadow: $shadow-neon-sm;
      background: rgba($color-primary, 0.05);
    }
  }
  
  .point-header {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-4;
    cursor: pointer;
    
    .point-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: linear-gradient(45deg, $color-primary, $color-secondary);
      color: white;
      border-radius: 50%;
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
      box-shadow: 0 2px 10px rgba($color-primary, 0.3);
    }
    
    .point-info {
      flex: 1;
      
      .point-name {
        display: block;
        font-weight: $font-weight-medium;
        color: $color-text-primary;
        margin-bottom: 2px;
      }
      
      .point-coords {
        font-size: $font-size-sm;
        color: $color-text-secondary;
        font-family: $font-family-mono;
      }
    }
    
    .remove-point {
      @include button-base;
      padding: $space-2;
      color: $color-text-secondary;
      border-radius: $radius-md;
      transition: all $duration-fast ease;
      
      &:hover {
        color: $color-error;
        background: rgba($color-error, 0.1);
        transform: scale(1.1);
      }
    }
  }
  
  .point-details {
    padding: 0 $space-4 $space-4;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $space-3;
    
    .detail-group {
      .detail-label {
        display: block;
        font-size: $font-size-sm;
        color: $color-text-secondary;
        margin-bottom: $space-1;
        font-weight: $font-weight-medium;
      }
      
      .detail-input,
      .detail-select {
        width: 100%;
        padding: $space-3;
        border: 1px solid rgba($color-border, 0.5);
        border-radius: $radius-md;
        background: rgba($color-surface, 0.8);
        color: $color-text-primary;
        font-size: $font-size-sm;
        transition: all $duration-normal ease;
        
        &:focus {
          outline: none;
          border-color: $color-primary;
          box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
        }
      }
    }
  }
  
  .add-point-btn {
    @include button-base;
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-4;
    width: 100%;
    border: 2px dashed rgba($color-primary, 0.3);
    border-radius: $radius-lg;
    color: $color-primary;
    font-weight: $font-weight-medium;
    transition: all $duration-normal ease;
    
    &:hover {
      border-color: $color-primary;
      background: rgba($color-primary, 0.05);
      box-shadow: $shadow-neon-sm;
    }
  }
}

.route-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-3;
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4;
    background: rgba($color-surface-elevated, 0.8);
    border: 1px solid rgba($color-border, 0.3);
    border-radius: $radius-lg;
    
    .stat-label {
      color: $color-text-secondary;
      font-size: $font-size-sm;
    }
    
    .stat-value {
      color: $color-text-primary;
      font-weight: $font-weight-semibold;
      font-family: $font-family-mono;
    }
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $space-4;
  
  .result-item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-4;
    background: rgba($color-surface-elevated, 0.8);
    border: 1px solid rgba($color-border, 0.3);
    border-radius: $radius-lg;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(45deg, $color-primary, $color-secondary);
    }
    
    .result-icon {
      padding: $space-2;
      border-radius: $radius-md;
      
      &.pressure {
        background: rgba($color-primary, 0.1);
        color: $color-primary;
      }
      
      &.flow {
        background: rgba($color-secondary, 0.1);
        color: $color-secondary;
      }
      
      &.velocity {
        background: rgba($color-accent, 0.1);
        color: $color-accent;
      }
      
      &.losses {
        background: rgba($color-warning, 0.1);
        color: $color-warning;
      }
    }
    
    .result-content {
      flex: 1;
      
      .result-label {
        display: block;
        font-size: $font-size-sm;
        color: $color-text-secondary;
        margin-bottom: 2px;
      }
      
      .result-value {
        font-size: $font-size-lg;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
        font-family: $font-family-mono;
      }
    }
  }
}

.calculator-actions {
  display: flex;
  gap: $space-3;
  padding: $space-6;
  border-top: 1px solid rgba($color-border, 0.3);
  
  .btn {
    @include button-base;
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-6;
    border-radius: $radius-lg;
    font-weight: $font-weight-medium;
    transition: all $duration-normal ease;
    
    &.btn-primary {
      background: linear-gradient(45deg, $color-primary, $color-secondary);
      color: white;
      border: none;
      box-shadow: $shadow-md;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: $shadow-lg, $shadow-neon-md;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }
    
    &.btn-secondary {
      background: rgba($color-surface-elevated, 0.8);
      color: $color-text-primary;
      border: 1px solid rgba($color-border, 0.5);
      
      &:hover {
        border-color: $color-primary;
        background: rgba($color-primary, 0.05);
        box-shadow: $shadow-md;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}
</style> 