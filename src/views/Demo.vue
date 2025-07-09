<template>
  <div id="app" class="demo-app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Demo Banner -->
    <div class="demo-banner">
      <div class="banner-content">
        <span class="demo-label">🚀 ДЕМО-РЕЖИМ</span>
        <span class="demo-text">Вы используете ограниченную версию GazNetCAD</span>
        <button @click="showUpgradeModal = true" class="upgrade-btn">
          Купить полную версию
        </button>
      </div>
    </div>

    <!-- Application Header -->
    <AppHeader 
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
    />
    
    <!-- Main Layout Container -->
    <div class="app-container">
      <!-- Navigation Sidebar -->
      <AppSidebar 
        :collapsed="sidebarCollapsed"
        :active-section="activeSection"
        @section-change="handleSectionChange"
      />
      
      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Demo Limitations Notice -->
        <div class="demo-notice" v-if="showDemoNotice">
          <div class="notice-content">
            <span class="notice-icon">⚠️</span>
            <span class="notice-text">{{ demoLimitationMessage }}</span>
            <button @click="showDemoNotice = false" class="notice-close">✕</button>
          </div>
        </div>

        <!-- KPI Dashboard -->
        <div class="kpi-section">
          <div class="kpi-item" @click="checkDemoLimit('kpi')">
            <h3>Время проектирования</h3>
            <p class="kpi-value">{{ kpiMetrics.designTime || 0 }}ч</p>
            <div class="demo-overlay" v-if="!isPremiumFeature('kpi')">
              <span class="lock-icon">🔒</span>
            </div>
          </div>
          <div class="kpi-item">
            <h3>Количество ошибок</h3>
            <p class="kpi-value">{{ kpiMetrics.errors || 0 }}</p>
          </div>
          <div class="kpi-item" @click="checkDemoLimit('analytics')">
            <h3>Экономический эффект</h3>
            <p class="kpi-value">{{ kpiMetrics.roi || 0 }}%</p>
            <div class="demo-overlay" v-if="!isPremiumFeature('analytics')">
              <span class="lock-icon">🔒</span>
            </div>
          </div>
          <div class="kpi-item" @click="checkDemoLimit('analytics')">
            <h3>Эффективность процесса</h3>
            <p class="kpi-value">{{ kpiMetrics.efficiency || 0 }}%</p>
            <div class="demo-overlay" v-if="!isPremiumFeature('analytics')">
              <span class="lock-icon">🔒</span>
            </div>
          </div>
        </div>
        
        <!-- Primary Workspace -->
        <div class="workspace-grid">
          <!-- 3D Pipeline Canvas -->
          <div class="workspace-main">
            <div class="canvas-placeholder" @click="checkDemoLimit('3d')">
              <h3>3D Pipeline Canvas</h3>
              <p>Здесь будет отображаться 3D модель трубопровода</p>
              <button @click="initializeCanvas" class="init-btn">Инициализировать Canvas</button>
              
              <!-- Demo watermark -->
              <div class="demo-watermark">DEMO VERSION</div>
              
              <!-- 3D Demo overlay for premium -->
              <div class="demo-overlay large" v-if="!isPremiumFeature('3d')">
                <div class="overlay-content">
                  <span class="lock-icon">🔒</span>
                  <h4>3D Визуализация</h4>
                  <p>Доступно только в полной версии</p>
                  <button @click="showUpgradeModal = true" class="upgrade-btn small">
                    Обновить
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Controls Panel -->
          <div class="workspace-sidebar">
            <!-- Normative Controls -->
            <div class="control-section">
              <h3 class="control-title">Параметры трубопровода</h3>
              <div class="control-group">
                <label>Давление (МПа):</label>
                <input 
                  type="number" 
                  v-model="pipelineParams.pressure" 
                  step="0.001"
                  min="0"
                  :max="demoLimits.maxPressure"
                  :disabled="demoLimits.maxPressure < 1"
                />
                <small v-if="demoLimits.maxPressure < 1" class="demo-limit-text">
                  Демо: макс. {{ demoLimits.maxPressure }} МПа
                </small>
              </div>
              <div class="control-group">
                <label>Диаметр (мм):</label>
                <input 
                  type="number" 
                  v-model="pipelineParams.diameter" 
                  step="1"
                  min="1"
                  :max="demoLimits.maxDiameter"
                />
                <small class="demo-limit-text">
                  Демо: макс. {{ demoLimits.maxDiameter }}мм
                </small>
              </div>
              <div class="control-group">
                <label>Материал:</label>
                <select v-model="pipelineParams.material">
                  <option value="pe">Полиэтилен</option>
                  <option value="steel" disabled>Сталь (Pro версия)</option>
                </select>
              </div>
            </div>
            
            <!-- Route Calculator -->
            <div class="control-section">
              <h3 class="control-title">Маршрут трассы</h3>
              <div class="route-info">
                <p>Количество точек: {{ routePoints.length }}/{{ demoLimits.maxRoutePoints }}</p>
                <p>Общая длина: {{ totalLength }}м</p>
              </div>
              <button 
                @click="addRoutePoint" 
                class="action-btn"
                :disabled="routePoints.length >= demoLimits.maxRoutePoints"
              >
                Добавить точку
              </button>
              <button @click="calculateRoute" class="action-btn primary">
                Рассчитать
              </button>
              <small class="demo-limit-text">
                Демо-версия: до {{ demoLimits.maxRoutePoints }} точек
              </small>
            </div>
            
            <!-- Gas Sphere Visualization -->
            <div class="control-section">
              <h3 class="control-title">Визуализация газа</h3>
              <div class="gas-sphere">
                <div class="sphere" :class="gasState"></div>
                <p>Давление: {{ pipelineParams.pressure }} МПа</p>
                <p>Состояние: {{ gasStateText }}</p>
              </div>
            </div>

            <!-- Demo Progress -->
            <div class="control-section demo-progress">
              <h3 class="control-title">Демо-лимиты</h3>
              <div class="progress-item">
                <span>Проекты</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${(demoUsage.projects / demoLimits.maxProjects) * 100}%` }"></div>
                </div>
                <span>{{ demoUsage.projects }}/{{ demoLimits.maxProjects }}</span>
              </div>
              <div class="progress-item">
                <span>Расчёты</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${(demoUsage.calculations / demoLimits.maxCalculations) * 100}%` }"></div>
                </div>
                <span>{{ demoUsage.calculations }}/{{ demoLimits.maxCalculations }}</span>
              </div>
              <div class="progress-item">
                <span>Экспорты</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${(demoUsage.exports / demoLimits.maxExports) * 100}%` }"></div>
                </div>
                <span>{{ demoUsage.exports }}/{{ demoLimits.maxExports }}</span>
              </div>
              
              <button @click="showUpgradeModal = true" class="upgrade-btn full-width">
                🚀 Снять ограничения
              </button>
            </div>
          </div>
        </div>
        
        <!-- Demo Tutorial -->
        <div class="demo-tutorial" v-if="showTutorial">
          <div class="tutorial-content">
            <h3>🎯 Добро пожаловать в демо GazNetCAD!</h3>
            <div class="tutorial-steps">
              <div class="step">
                <span class="step-number">1</span>
                <span>Измените параметры трубопровода</span>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <span>Добавьте точки маршрута</span>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <span>Выполните расчёт</span>
              </div>
            </div>
            <button @click="showTutorial = false" class="tutorial-close">
              Понятно
            </button>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Floating Action Button -->
    <div class="fab-container">
      <button 
        class="fab"
        @click="showQuickActions = !showQuickActions"
        :class="{ active: showQuickActions }"
      >
        <span>+</span>
      </button>
      
      <div v-if="showQuickActions" class="fab-menu">
        <button class="fab-item" @click="checkDemoLimit('newProject')">
          <span>📄</span>
          <span>Новый проект</span>
        </button>
        <button class="fab-item" @click="checkDemoLimit('export')">
          <span>📥</span>
          <span>Экспорт</span>
        </button>
        <button class="fab-item" @click="showUpgradeModal = true">
          <span>💎</span>
          <span>Купить Pro</span>
        </button>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <div v-if="showUpgradeModal" class="modal-backdrop" @click="showUpgradeModal = false">
      <div class="upgrade-modal" @click.stop>
        <div class="modal-header">
          <h3>Обновить до полной версии</h3>
          <button @click="showUpgradeModal = false" class="modal-close">✕</button>
        </div>
        
        <div class="modal-content">
          <div class="upgrade-benefits">
            <h4>Что вы получите:</h4>
            <ul>
              <li>✅ Неограниченное количество проектов</li>
              <li>✅ Полная 3D визуализация</li>
              <li>✅ Расширенная аналитика</li>
              <li>✅ Экспорт во все форматы</li>
              <li>✅ ИИ-оптимизация</li>
              <li>✅ Техническая поддержка</li>
            </ul>
          </div>
          
          <div class="pricing-options">
            <div class="pricing-option">
              <h4>Профессиональный</h4>
              <div class="price">₽19,990/мес</div>
              <button class="upgrade-btn full-width">Выбрать</button>
            </div>
            <div class="pricing-option featured">
              <div class="popular-badge">Популярный</div>
              <h4>Корпоративный</h4>
              <div class="price">₽49,990/мес</div>
              <button class="upgrade-btn full-width primary">Выбрать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// import { useRouter } from 'vue-router' // Unused for now

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

// Router
// const router = useRouter() // Unused for now

// Local reactive state
const sidebarCollapsed = ref(false)
const activeSection = ref('pipeline')
const showQuickActions = ref(false)
const showUpgradeModal = ref(false)
const showDemoNotice = ref(false)
const showTutorial = ref(true)
const demoLimitationMessage = ref('')

// Demo limits
const demoLimits = ref({
  maxProjects: 3,
  maxCalculations: 10,
  maxExports: 2,
  maxRoutePoints: 5,
  maxPressure: 0.3,
  maxDiameter: 200
})

// Demo usage tracking
const demoUsage = ref({
  projects: 1,
  calculations: 3,
  exports: 0
})

// Pipeline data
const pipelineParams = ref({
  pressure: 0.3,
  diameter: 110,
  material: 'pe'
})

const routePoints = ref([
  { x: 0, y: 0, z: 0 },
  { x: 100, y: 0, z: 0 },
  { x: 200, y: 50, z: 0 }
])

// KPI metrics
const kpiMetrics = ref({
  designTime: 2.5,
  errors: 0,
  roi: 15,
  efficiency: 85
})

// Computed properties
const totalLength = computed(() => {
  if (routePoints.value.length < 2) return 0
  let length = 0
  for (let i = 1; i < routePoints.value.length; i++) {
    const prev = routePoints.value[i - 1]
    const curr = routePoints.value[i]
    length += Math.sqrt(
      Math.pow(curr.x - prev.x, 2) + 
      Math.pow(curr.y - prev.y, 2) + 
      Math.pow(curr.z - prev.z, 2)
    )
  }
  return Math.round(length)
})

const gasState = computed(() => {
  const pressure = pipelineParams.value.pressure
  if (pressure < 0.005) return 'low'
  if (pressure < 0.3) return 'medium'
  return 'high'
})

const gasStateText = computed(() => {
  switch (gasState.value) {
    case 'low': return 'Низкое'
    case 'medium': return 'Среднее'
    case 'high': return 'Высокое'
    default: return 'Неизвестно'
  }
})

// Demo feature checking
const isPremiumFeature = (feature: string) => {
  const premiumFeatures = ['3d', 'analytics', 'ai', 'export', 'kpi']
  return !premiumFeatures.includes(feature)
}

const checkDemoLimit = (feature: string) => {
  const limits: Record<string, () => boolean> = {
    '3d': () => {
      showDemoLimitNotice('3D визуализация доступна только в полной версии')
      return false
    },
    'analytics': () => {
      showDemoLimitNotice('Расширенная аналитика доступна только в полной версии')
      return false
    },
    'newProject': () => {
      if (demoUsage.value.projects >= demoLimits.value.maxProjects) {
        showDemoLimitNotice(`Достигнут лимит проектов (${demoLimits.value.maxProjects})`)
        return false
      }
      return true
    },
    'export': () => {
      if (demoUsage.value.exports >= demoLimits.value.maxExports) {
        showDemoLimitNotice(`Достигнут лимит экспортов (${demoLimits.value.maxExports})`)
        return false
      }
      return true
    }
  }

  const checkFunction = limits[feature]
  if (checkFunction) {
    return checkFunction()
  }
  return true
}

const showDemoLimitNotice = (message: string) => {
  demoLimitationMessage.value = message
  showDemoNotice.value = true
  setTimeout(() => {
    showDemoNotice.value = false
  }, 4000)
}

// Event handlers
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleSectionChange = (section: string) => {
  activeSection.value = section
}

const initializeCanvas = () => {
  if (!isPremiumFeature('3d')) {
    checkDemoLimit('3d')
    return
  }
  alert('3D Canvas будет инициализирован в полной версии приложения')
}

const addRoutePoint = () => {
  if (routePoints.value.length >= demoLimits.value.maxRoutePoints) {
    showDemoLimitNotice(`Достигнут лимит точек маршрута (${demoLimits.value.maxRoutePoints})`)
    return
  }
  
  const lastPoint = routePoints.value[routePoints.value.length - 1]
  routePoints.value.push({
    x: lastPoint.x + 50,
    y: lastPoint.y,
    z: lastPoint.z
  })
}

const calculateRoute = () => {
  if (demoUsage.value.calculations >= demoLimits.value.maxCalculations) {
    showDemoLimitNotice(`Достигнут лимит расчётов (${demoLimits.value.maxCalculations})`)
    return
  }
  
  demoUsage.value.calculations++
  alert('Расчёт маршрута выполнен!')
}

// Lifecycle hooks
onMounted(() => {
  console.log('🚀 GazNetCAD Demo initialized')
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.demo-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  color: #ffffff;
}

/* Demo Banner */
.demo-banner {
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  color: #0a0f1c;
  padding: 0.75rem 0;
  position: relative;
  z-index: 200;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.demo-label {
  font-weight: 700;
  font-size: 0.875rem;
}

.demo-text {
  font-size: 0.875rem;
}

.upgrade-btn {
  background: #0a0f1c;
  color: #00d4ff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1a1f2e;
    transform: translateY(-1px);
  }
  
  &.small {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  &.full-width {
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  &.primary {
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #0a0f1c;
    
    &:hover {
      box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
    }
  }
}

.app-container {
  display: flex;
  flex: 1;
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  
  .sidebar-collapsed & {
    margin-left: 60px;
  }
}

/* Demo Notice */
.demo-notice {
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid #ff9800;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notice-icon {
  font-size: 1.25rem;
}

.notice-text {
  flex: 1;
  color: #ffffff;
}

.notice-close {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.125rem;
  
  &:hover {
    opacity: 0.7;
  }
}

/* KPI Section with demo overlays */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .kpi-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 212, 255, 0.2);
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
      border-color: rgba(0, 212, 255, 0.4);
      transform: translateY(-2px);
    }
    
    h3 {
      font-size: 0.875rem;
      color: #b8c9d9;
      margin-bottom: 0.5rem;
    }
    
    .kpi-value {
      font-size: 2rem;
      font-weight: 600;
      color: #00d4ff;
      margin: 0;
      text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    }
  }
}

/* Demo Overlays */
.demo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  .lock-icon {
    font-size: 1.5rem;
    opacity: 0.7;
  }
  
  &.large {
    .overlay-content {
      text-align: center;
      
      .lock-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
      }
      
      h4 {
        color: #00d4ff;
        margin-bottom: 0.5rem;
      }
      
      p {
        color: #b8c9d9;
        margin-bottom: 1rem;
      }
    }
  }
}

/* Workspace */
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

.workspace-main {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  min-height: 400px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  backdrop-filter: blur(10px);
  
  .canvas-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
    text-align: center;
    position: relative;
    
    h3 {
      color: #00d4ff;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    }
    
    p {
      color: #b8c9d9;
      margin-bottom: 2rem;
    }
    
    .init-btn {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: #0a0f1c;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        transform: translateY(-2px);
      }
    }
  }
}

.demo-watermark {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: #00d4ff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.workspace-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.2);
  backdrop-filter: blur(10px);
  
  .control-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #00d4ff;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(0, 255, 136, 0.3);
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  }
  
  .control-group {
    margin-bottom: 1rem;
    
    label {
      display: block;
      font-size: 0.875rem;
      color: #b8c9d9;
      margin-bottom: 0.25rem;
    }
    
    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 6px;
      font-size: 0.875rem;
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      backdrop-filter: blur(5px);
      
      &:focus {
        outline: none;
        border-color: #00d4ff;
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  
  .demo-limit-text {
    color: #ff9800;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .route-info {
    margin-bottom: 1rem;
    
    p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      color: #b8c9d9;
    }
  }
  
  .action-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(0, 212, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.primary {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: #0a0f1c;
      border: none;
      
      &:hover:not(:disabled) {
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
      }
    }
  }
  
  .gas-sphere {
    text-align: center;
    
    .sphere {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      
      &.low {
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
      }
      
      &.medium {
        background: linear-gradient(135deg, #ff9800, #f57c00);
        box-shadow: 0 0 20px rgba(255, 152, 0, 0.3);
      }
      
      &.high {
        background: linear-gradient(135deg, #ff5722, #d32f2f);
        box-shadow: 0 0 20px rgba(255, 87, 34, 0.3);
      }
    }
    
    p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      color: #b8c9d9;
    }
  }
}

/* Demo Progress Section */
.demo-progress {
  .progress-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    
    span:first-child {
      min-width: 60px;
      color: #b8c9d9;
    }
    
    span:last-child {
      min-width: 40px;
      text-align: right;
      color: #00d4ff;
      font-weight: 600;
    }
  }
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d4ff, #00ff88);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
}

/* Demo Tutorial */
.demo-tutorial {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  
  .tutorial-content h3 {
    color: #00ff88;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .step-number {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #0a0f1c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

.tutorial-close {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  color: #0a0f1c;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
  }
}

/* FAB */
.fab-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  color: #0a0f1c;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.4);
  }
  
  &.active {
    transform: rotate(45deg);
    background: linear-gradient(135deg, #00ff88, #00cc6a);
  }
}

.fab-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 180px;
  
  .fab-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    color: #ffffff;
    font-size: 0.875rem;
    border: 1px solid rgba(0, 212, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(0, 212, 255, 0.4);
      transform: translateX(-4px);
    }
    
    span:first-child {
      font-size: 1.25rem;
    }
  }
}

/* Upgrade Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.upgrade-modal {
  background: rgba(26, 31, 46, 0.95);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(0, 212, 255, 0.3);
  backdrop-filter: blur(20px);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    color: #00d4ff;
    font-size: 1.5rem;
    margin: 0;
  }
}

.modal-close {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.5rem;
  
  &:hover {
    opacity: 0.7;
  }
}

.modal-content {
  padding: 1.5rem;
}

.upgrade-benefits {
  margin-bottom: 2rem;
  
  h4 {
    color: #00ff88;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.5rem 0;
      color: #b8c9d9;
    }
  }
}

.pricing-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.pricing-option {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  
  &.featured {
    border-color: rgba(0, 255, 136, 0.5);
    
    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #00ff88, #00cc6a);
      color: #0a0f1c;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  }
  
  h4 {
    color: #00d4ff;
    margin-bottom: 0.5rem;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1rem;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .workspace-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  
  .workspace-sidebar {
    order: -1;
  }
  
  .pricing-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
  
  .kpi-section {
    grid-template-columns: 1fr;
  }
  
  .fab-container {
    bottom: 1rem;
    right: 1rem;
  }
  
  .banner-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style> 