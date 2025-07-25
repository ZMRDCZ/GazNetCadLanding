<template>
  <div class="normative-controls">
    <div class="controls-header">
      <h3 class="controls-title">Нормативные требования</h3>
      <div class="standard-indicator" :class="standardClass">
        <div class="indicator-dot"></div>
        <span>{{ activeStandardName }}</span>
      </div>
    </div>
    
    <!-- Standards Selection -->
    <div class="control-group">
      <label class="control-label">Применяемый стандарт</label>
      <select 
        v-model="localStandard"
        @change="handleStandardChange"
        class="control-select"
      >
        <option value="sp-62-104-2022">СП 62.13330.2022</option>
        <option value="sp-101-2003">СП 101-2003</option>
        <option value="gost-r-54983">ГОСТ Р 54983-2012</option>
        <option value="snip-2-04-08">СНиП 2.04.08-87*</option>
      </select>
    </div>
    
    <!-- Pipeline Parameters -->
    <div class="parameters-section">
      <h4 class="section-title">Параметры трубопровода</h4>
      
      <div class="control-group">
        <label class="control-label">Рабочее давление, МПа</label>
        <div class="input-group">
          <input 
            v-model.number="localParams.pressure"
            @input="(e) => handleInputChange('pressure', e)"
            type="number"
            step="0.001"
            min="0"
            max="1.2"
            class="control-input"
          />
          <span class="input-unit">МПа</span>
        </div>
        <div class="param-range">Диапазон: 0.005 - 1.2 МПа</div>
      </div>
      
      <div class="control-group">
        <label class="control-label">Диаметр трубы, мм</label>
        <select 
          v-model="localParams.diameter"
          @change="(e) => handleSelectChange('diameter', e)"
          class="control-select"
        >
          <option v-for="diameter in standardDiameters" :key="diameter" :value="diameter">
            {{ diameter }} мм
          </option>
        </select>
      </div>
      
      <div class="control-group">
        <label class="control-label">Материал трубы</label>
        <select 
          v-model="localParams.material"
          @change="(e) => handleSelectChange('material', e)"
          class="control-select"
        >
          <option value="steel">Сталь</option>
          <option value="polyethylene">Полиэтилен</option>
          <option value="cast-iron">Чугун</option>
        </select>
      </div>
      
      <div class="control-group">
        <label class="control-label">Глубина заложения, м</label>
        <div class="input-group">
          <input 
            v-model.number="localParams.depth"
            @input="(e) => handleInputChange('depth', e)"
            type="number"
            step="0.1"
            min="0.8"
            max="5.0"
            class="control-input"
          />
          <span class="input-unit">м</span>
        </div>
        <div class="param-range">Мин. глубина: {{ minDepth }} м</div>
      </div>
    </div>
    
    <!-- Environmental Conditions -->
    <div class="parameters-section">
      <h4 class="section-title">Условия эксплуатации</h4>
      
      <div class="control-group">
        <label class="control-label">Температура грунта, °C</label>
        <div class="input-group">
          <input 
            v-model.number="localParams.soilTemperature"
            @input="(e) => handleInputChange('soilTemperature', e)"
            type="number"
            step="1"
            min="-50"
            max="25"
            class="control-input"
          />
          <span class="input-unit">°C</span>
        </div>
      </div>
      
      <div class="control-group">
        <label class="control-label">Тип грунта</label>
        <select 
          v-model="localParams.soilType"
          @change="(e) => handleSelectChange('soilType', e)"
          class="control-select"
        >
          <option value="clay">Глина</option>
          <option value="sand">Песок</option>
          <option value="loam">Суглинок</option>
          <option value="rocky">Скальный</option>
        </select>
      </div>
      
      <div class="control-group">
        <label class="control-label checkbox-label">
          <input 
            v-model="localParams.seismicActivity"
            @change="(e) => handleCheckboxChange('seismicActivity', e)"
            type="checkbox"
            class="control-checkbox"
          />
          <span>Сейсмически активная зона</span>
        </label>
      </div>
    </div>
    
    <!-- Safety Factors -->
    <div class="parameters-section">
      <h4 class="section-title">Коэффициенты безопасности</h4>
      
      <div class="safety-grid">
        <div class="safety-item">
          <label class="control-label">Кн (надёжность)</label>
          <input 
            v-model.number="localParams.reliabilityFactor"
            @input="(e) => handleInputChange('reliabilityFactor', e)"
            type="number"
            step="0.1"
            min="1.0"
            max="2.0"
            class="control-input"
            readonly
          />
        </div>
        
        <div class="safety-item">
          <label class="control-label">Кв (условия работы)</label>
          <input 
            v-model.number="localParams.workingConditionsFactor"
            @input="(e) => handleInputChange('workingConditionsFactor', e)"
            type="number"
            step="0.05"
            min="0.6"
            max="1.0"
            class="control-input"
          />
        </div>
      </div>
    </div>
    
    <!-- Validation Messages -->
    <div v-if="validationErrors.length" class="validation-errors">
      <div v-for="error in validationErrors" :key="error.field" class="error-message">
        <AlertTriangle :size="16" />
        <span>{{ error.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

interface PipelineParams {
  pressure: number
  diameter: number
  material: string
  depth: number
  soilTemperature: number
  soilType: string
  seismicActivity: boolean
  reliabilityFactor: number
  workingConditionsFactor: number
}

interface Props {
  selectedStandard: string
  pipelineParams: PipelineParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'standard-change': [standard: string]
  'parameter-update': [parameter: string, value: any]
}>()

// Local reactive copies
const localStandard = ref(props.selectedStandard)
const localParams = ref({ ...props.pipelineParams })

// Standards definitions
const standards = {
  'sp-62-104-2022': {
    name: 'СП 62.13330.2022',
    description: 'Газораспределительные системы',
    maxPressure: 1.2,
    minDepth: 0.8
  },
  'sp-101-2003': {
    name: 'СП 101-2003',
    description: 'Проектирование и строительство',
    maxPressure: 0.6,
    minDepth: 1.0
  },
  'gost-r-54983': {
    name: 'ГОСТ Р 54983-2012',
    description: 'Системы газораспределения',
    maxPressure: 1.2,
    minDepth: 0.8
  },
  'snip-2-04-08': {
    name: 'СНиП 2.04.08-87*',
    description: 'Газоснабжение',
    maxPressure: 1.2,
    minDepth: 1.2
  }
}

// Computed properties
const activeStandardName = computed(() => 
  standards[localStandard.value as keyof typeof standards]?.name || 'Не выбран'
)

const standardClass = computed(() => {
  const standard = standards[localStandard.value as keyof typeof standards]
  if (!standard) return 'invalid'
  if (localParams.value.pressure > standard.maxPressure) return 'warning'
  return 'valid'
})

const standardDiameters = computed(() => {
  // Standard pipe diameters per GOST
  return [32, 40, 50, 63, 75, 90, 110, 125, 140, 160, 180, 200, 225, 250, 280, 315, 355, 400, 450, 500, 630]
})

const minDepth = computed(() => {
  const standard = standards[localStandard.value as keyof typeof standards]
  return standard?.minDepth || 0.8
})

const validationErrors = ref<Array<{field: string, message: string}>>([])

// Event handlers
const handleStandardChange = () => {
  emit('standard-change', localStandard.value)
  validateParameters()
}

const handleParameterChange = (parameter: string, value: any) => {
  emit('parameter-update', parameter, value)
  validateParameters()
}

// Input event handlers with proper typing
const handleInputChange = (parameter: string, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    handleParameterChange(parameter, target.value)
  }
}

const handleSelectChange = (parameter: string, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target) {
    handleParameterChange(parameter, target.value)
  }
}

const handleCheckboxChange = (parameter: string, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    handleParameterChange(parameter, target.checked)
  }
}

// Validation
const validateParameters = () => {
  const errors: Array<{field: string, message: string}> = []
  const standard = standards[localStandard.value as keyof typeof standards]
  
  if (standard) {
    if (localParams.value.pressure > standard.maxPressure) {
      errors.push({
        field: 'pressure',
        message: `Давление превышает допустимое значение ${standard.maxPressure} МПа`
      })
    }
    
    if (localParams.value.depth < standard.minDepth) {
      errors.push({
        field: 'depth',
        message: `Глубина заложения менее минимальной ${standard.minDepth} м`
      })
    }
  }
  
  if (localParams.value.pressure < 0.005) {
    errors.push({
      field: 'pressure',
      message: 'Давление не может быть менее 0.005 МПа'
    })
  }
  
  validationErrors.value = errors
}

// Watchers
watch(() => props.selectedStandard, (newValue) => {
  localStandard.value = newValue
})

watch(() => props.pipelineParams, (newValue) => {
  localParams.value = { ...newValue }
}, { deep: true })

// Auto-calculate safety factors based on conditions
watch([
  () => localParams.value.material,
  () => localParams.value.seismicActivity,
  () => localParams.value.soilType
], () => {
  // Auto-calculate reliability factor
  let reliabilityFactor = 1.4 // Base value
  
  if (localParams.value.seismicActivity) {
    reliabilityFactor += 0.2
  }
  
  if (localParams.value.soilType === 'rocky') {
    reliabilityFactor += 0.1
  }
  
  localParams.value.reliabilityFactor = Math.min(reliabilityFactor, 2.0)
  emit('parameter-update', 'reliabilityFactor', localParams.value.reliabilityFactor)
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.normative-controls {
  @include glassmorphism;
  border-radius: $radius-xl;
  border: 1px solid rgba($color-primary, 0.2);
  box-shadow: $shadow-xl;
  overflow: hidden;
  position: relative;
  
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
      $color-tertiary 100%);
  }
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-6 $space-6 $space-4;
  border-bottom: 1px solid rgba($color-border, 0.3);
  
  .controls-title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    text-shadow: 0 0 10px rgba($color-primary, 0.3);
  }
}

.standard-indicator {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  border: 1px solid;
  
  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  &.standard-sp {
    background: rgba($color-primary, 0.1);
    color: $color-primary;
    border-color: rgba($color-primary, 0.3);
    
    .indicator-dot {
      background: $color-primary;
      box-shadow: 0 0 10px $color-primary;
    }
  }
  
  &.standard-gost {
    background: rgba($color-secondary, 0.1);
    color: $color-secondary;
    border-color: rgba($color-secondary, 0.3);
    
    .indicator-dot {
      background: $color-secondary;
      box-shadow: 0 0 10px $color-secondary;
    }
  }
  
  &.standard-snip {
    background: rgba($color-accent, 0.1);
    color: $color-accent;
    border-color: rgba($color-accent, 0.3);
    
    .indicator-dot {
      background: $color-accent;
      box-shadow: 0 0 10px $color-accent;
    }
  }
}

.parameters-section {
  border-bottom: 1px solid rgba($color-border, 0.3);
  
  &:last-child {
    border-bottom: none;
  }
  
  .section-title {
    margin: 0 0 $space-4 0;
    padding: $space-4 $space-6 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    display: flex;
    align-items: center;
    gap: $space-2;
    
    &::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(45deg, $color-secondary, $color-tertiary);
      border-radius: $radius-sm;
    }
  }
}

.control-group {
  padding: $space-4 $space-6;
  
  .control-label {
    display: block;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    margin-bottom: $space-2;
    
    &.checkbox-label {
      display: flex;
      align-items: center;
      gap: $space-2;
      cursor: pointer;
      padding: $space-3;
      border-radius: $radius-md;
      transition: all $duration-fast ease;
      
      &:hover {
        background: rgba($color-primary, 0.05);
      }
    }
  }
  
  .control-select {
    width: 100%;
    padding: $space-3;
    border: 1px solid rgba($color-border, 0.5);
    border-radius: $radius-md;
    background: rgba($color-surface, 0.8);
    color: $color-text-primary;
    font-size: $font-size-sm;
    transition: all $duration-normal ease;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1), $shadow-neon-sm;
    }
    
    &:hover {
      border-color: rgba($color-primary, 0.7);
    }
  }
  
  .input-group {
    display: flex;
    align-items: center;
    position: relative;
    
    .control-input {
      flex: 1;
      padding: $space-3;
      border: 1px solid rgba($color-border, 0.5);
      border-radius: $radius-md;
      background: rgba($color-surface, 0.8);
      color: $color-text-primary;
      font-size: $font-size-sm;
      font-family: $font-family-mono;
      transition: all $duration-normal ease;
      
      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba($color-primary, 0.1), $shadow-neon-sm;
      }
      
      &:hover {
        border-color: rgba($color-primary, 0.7);
      }
      
      &[readonly] {
        background: rgba($color-surface-elevated, 0.5);
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
    
    .input-unit {
      position: absolute;
      right: $space-3;
      font-size: $font-size-sm;
      color: $color-text-secondary;
      font-weight: $font-weight-medium;
      background: rgba($color-surface-elevated, 0.8);
      padding: $space-1 $space-2;
      border-radius: $radius-sm;
      border: 1px solid rgba($color-border, 0.3);
    }
  }
  
  .control-checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid rgba($color-border, 0.5);
    border-radius: $radius-sm;
    background: rgba($color-surface, 0.8);
    cursor: pointer;
    position: relative;
    transition: all $duration-normal ease;
    
    &:checked {
      background: linear-gradient(45deg, $color-primary, $color-secondary);
      border-color: $color-primary;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }
  
  .param-range {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    margin-top: $space-1;
    font-style: italic;
  }
}

.safety-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-4;
  
  .safety-item {
    .control-label {
      font-size: $font-size-xs;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: $color-text-secondary;
      margin-bottom: $space-2;
    }
    
    .control-input {
      width: 100%;
      padding: $space-3;
      border: 1px solid rgba($color-border, 0.5);
      border-radius: $radius-md;
      background: rgba($color-surface, 0.8);
      color: $color-text-primary;
      font-size: $font-size-sm;
      font-family: $font-family-mono;
      font-weight: $font-weight-semibold;
      text-align: center;
      transition: all $duration-normal ease;
      
      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba($color-primary, 0.1), $shadow-neon-sm;
      }
      
      &[readonly] {
        background: linear-gradient(45deg, 
          rgba($color-primary, 0.1), 
          rgba($color-secondary, 0.1));
        border-color: rgba($color-primary, 0.3);
        cursor: not-allowed;
      }
    }
  }
}

.validation-errors {
  padding: $space-4 $space-6 $space-6;
  
  .error-message {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3;
    margin-bottom: $space-2;
    background: rgba($color-error, 0.1);
    border: 1px solid rgba($color-error, 0.3);
    border-radius: $radius-md;
    color: $color-error;
    font-size: $font-size-sm;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    svg {
      flex-shrink: 0;
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

// Responsive design
@media (max-width: $breakpoint-md) {
  .safety-grid {
    grid-template-columns: 1fr;
  }
  
  .input-group {
    .input-unit {
      position: static;
      margin-left: $space-2;
      margin-top: $space-1;
    }
  }
}
</style> 