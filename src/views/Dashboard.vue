<template>
  <div class="demo-app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
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
        <!-- KPI Dashboard -->
        <div class="kpi-section">
          <div class="kpi-item">
            <h3>Время проектирования</h3>
            <p class="kpi-value">{{ kpiMetrics.designTime || 0 }}ч</p>
          </div>
          <div class="kpi-item">
            <h3>Количество ошибок</h3>
            <p class="kpi-value">{{ kpiMetrics.errors || 0 }}</p>
          </div>
          <div class="kpi-item">
            <h3>Экономический эффект</h3>
            <p class="kpi-value">{{ kpiMetrics.roi || 0 }}%</p>
          </div>
          <div class="kpi-item">
            <h3>Эффективность процесса</h3>
            <p class="kpi-value">{{ kpiMetrics.efficiency || 0 }}%</p>
          </div>
        </div>
        
        <!-- Primary Workspace -->
        <div class="workspace-grid">
          <!-- 3D Pipeline Canvas -->
          <div class="workspace-main">
            <div class="canvas-placeholder">
              <h3>3D Pipeline Canvas</h3>
              <p>Здесь будет отображаться 3D модель трубопровода</p>
              <button @click="initializeCanvas" class="init-btn">Инициализировать Canvas</button>
              
              <!-- Demo watermark -->
              <div class="demo-watermark">DEMO VERSION</div>
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
                />
              </div>
              <div class="control-group">
                <label>Диаметр (мм):</label>
                <input 
                  type="number" 
                  v-model="pipelineParams.diameter" 
                  step="1"
                  min="1"
                />
              </div>
              <div class="control-group">
                <label>Материал:</label>
                <select v-model="pipelineParams.material">
                  <option value="pe">Полиэтилен</option>
                  <option value="steel">Сталь</option>
                </select>
              </div>
            </div>
            
            <!-- Route Calculator -->
            <div class="control-section">
              <h3 class="control-title">Маршрут трассы</h3>
              <div class="route-info">
                <p>Количество точек: {{ routePoints.length }}</p>
                <p>Общая длина: {{ totalLength }}м</p>
              </div>
              <button @click="addRoutePoint" class="action-btn">Добавить точку</button>
              <button @click="calculateRoute" class="action-btn primary">Рассчитать</button>
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
        <button class="fab-item" @click="createNewProject">
          <span>📄</span>
          <span>Новый проект</span>
        </button>
        <button class="fab-item" @click="exportResults">
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
import { useRouter } from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

// Router
const router = useRouter()

// Local reactive state
const sidebarCollapsed = ref(false)
const activeSection = ref('pipeline')
const showQuickActions = ref(false)
const showUpgradeModal = ref(false)

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

// Event handlers
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleSectionChange = (section: string) => {
  activeSection.value = section
}

const initializeCanvas = () => {
  alert('3D Canvas будет инициализирован в полной версии приложения')
}

const addRoutePoint = () => {
  const lastPoint = routePoints.value[routePoints.value.length - 1]
  routePoints.value.push({
    x: lastPoint.x + 50,
    y: lastPoint.y,
    z: lastPoint.z
  })
}

const calculateRoute = () => {
  alert('Расчёт маршрута выполнен!')
}

const createNewProject = () => {
  showQuickActions.value = false
  alert('Новый проект создан')
}

const exportResults = () => {
  showQuickActions.value = false
  alert('Результаты экспортированы')
}

// Lifecycle hooks
onMounted(() => {
  console.log('🚀 GazNetCAD Dashboard initialized')
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.demo-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $color-background;
  font-family: $font-family-primary;
  overflow: hidden;
  color: $color-text-primary;
}

/* Demo Banner */
.demo-banner {
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  color: $color-text-on-primary;
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
  font-weight: $font-weight-bold;
  font-size: $font-size-sm;
}

.demo-text {
  font-size: $font-size-sm;
}

.upgrade-btn {
  @include button-neon($color-background, $color-primary);
  
  &.full-width {
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  &.primary {
    @include button-neon($color-secondary, $color-text-on-primary);
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
  padding: $space-6;
  margin-left: $sidebar-width;
  transition: margin-left $duration-normal $ease-out;
  overflow-y: auto;
  overflow-x: hidden;
  
  .sidebar-collapsed & {
    margin-left: $sidebar-width-collapsed;
  }
}

/* KPI Section */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: $space-4;
  margin-bottom: $space-6;
  
  .kpi-item {
    @include card-neon;
    padding: $space-6;
    text-align: center;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, $color-primary, $color-secondary);
    }
    
    h3 {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-bottom: $space-2;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .kpi-value {
      font-size: $font-size-4xl;
      font-weight: $font-weight-bold;
      @include neon-text($color-primary);
      margin: 0;
      animation: neon-pulse $neon-pulse-duration infinite;
    }
  }
}

/* Workspace */
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: $space-6;
  flex: 1;
  min-height: 0;
}

.workspace-main {
  @include card-neon;
  overflow: hidden;
  position: relative;
  min-height: 400px;
  
  .canvas-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: $space-8;
    text-align: center;
    position: relative;
    
    h3 {
      @include neon-text($color-primary);
      margin-bottom: $space-4;
      font-size: $font-size-2xl;
    }
    
    p {
      color: $color-text-secondary;
      margin-bottom: $space-8;
      font-size: $font-size-lg;
    }
    
    .init-btn {
      @include button-neon;
    }
  }
}

.demo-watermark {
  position: absolute;
  top: $space-4;
  right: $space-4;
  @include glassmorphism;
  color: $color-primary;
  padding: $space-2 $space-4;
  border-radius: $radius-md;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  @include neon-border;
  letter-spacing: 0.1em;
}

.workspace-sidebar {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.control-section {
  @include card-neon;
  padding: $space-4;
  
  .control-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    @include neon-text($color-primary);
    margin-bottom: $space-4;
    padding-bottom: $space-2;
    border-bottom: 2px solid rgba($color-secondary, 0.3);
  }
  
  .control-group {
    margin-bottom: $space-4;
    
    label {
      display: block;
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-bottom: $space-1;
    }
    
    input, select {
      width: 100%;
      padding: $space-3;
      @include neon-border;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      @include glassmorphism;
      color: $color-text-primary;
      
      &:focus {
        @include neon-border($color-primary);
        @include neon-glow;
      }
    }
  }
  
  .route-info {
    margin-bottom: $space-4;
    
    p {
      margin: $space-1 0;
      font-size: $font-size-sm;
      color: $color-text-secondary;
    }
  }
  
  .action-btn {
    @include glassmorphism;
    @include neon-border;
    color: $color-text-primary;
    padding: $space-2 $space-4;
    border-radius: $radius-md;
    cursor: pointer;
    font-size: $font-size-sm;
    margin-right: $space-2;
    margin-bottom: $space-2;
    transition: all $duration-normal $ease-out;
    
    &:hover {
      @include neon-glow;
      transform: translateY(-1px);
    }
    
    &.primary {
      @include button-neon;
    }
  }
  
  .gas-sphere {
    text-align: center;
    
    .sphere {
      width: 60px;
      height: 60px;
      border-radius: $radius-full;
      margin: 0 auto $space-4;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-xl;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: $radius-full;
        padding: 4px;
        background: linear-gradient(45deg, transparent, currentColor, transparent);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        animation: spin 3s linear infinite;
      }
      
      &.low {
        background: linear-gradient(135deg, $color-success, $color-success-dark);
        color: $color-text-on-primary;
        @include neon-glow($color-success);
      }
      
      &.medium {
        background: linear-gradient(135deg, $color-warning, $color-warning-light);
        color: $color-text-on-primary;
        @include neon-glow($color-warning);
      }
      
      &.high {
        background: linear-gradient(135deg, $color-error, $color-error-light);
        color: $color-text-on-primary;
        @include neon-glow($color-error);
      }
    }
    
    p {
      margin: $space-1 0;
      font-size: $font-size-sm;
      color: $color-text-secondary;
    }
  }
}

/* FAB */
.fab-container {
  position: fixed;
  bottom: $space-8;
  right: $space-8;
  z-index: $z-fixed;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: $radius-full;
  @include button-neon;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  @include neon-glow;
  
  &.active {
    transform: rotate(45deg);
    @include button-neon($color-secondary);
  }
}

.fab-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  min-width: 180px;
  
  .fab-item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    @include card-neon;
    color: $color-text-primary;
    font-size: $font-size-sm;
    cursor: pointer;
    
    &:hover {
      transform: translateX(-4px);
      @include neon-glow;
    }
    
    span:first-child {
      font-size: $font-size-lg;
    }
  }
}

/* Upgrade Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: $z-modal-backdrop;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-8;
}

.upgrade-modal {
  @include glassmorphism;
  border-radius: $radius-2xl;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  @include neon-border;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-6;
  border-bottom: 1px solid $color-divider;
  
  h3 {
    @include neon-text($color-primary);
    font-size: $font-size-xl;
    margin: 0;
  }
}

.modal-close {
  @include button-base;
  color: $color-text-primary;
  font-size: $font-size-xl;
  
  &:hover {
    opacity: 0.7;
  }
}

.modal-content {
  padding: $space-6;
}

.upgrade-benefits {
  margin-bottom: $space-8;
  
  h4 {
    @include neon-text($color-secondary);
    margin-bottom: $space-4;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: $space-2 0;
      color: $color-text-secondary;
    }
  }
}

.pricing-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}

.pricing-option {
  @include card-neon;
  padding: $space-6;
  text-align: center;
  position: relative;
  
  &.featured {
    @include neon-border($color-secondary);
    
    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      @include button-neon($color-secondary);
      font-size: $font-size-xs;
      padding: $space-1 $space-3;
      border-radius: $radius-full;
    }
  }
  
  h4 {
    @include neon-text($color-primary);
    margin-bottom: $space-2;
  }
  
  .price {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $space-4;
  }
}

/* Responsive */
@media (max-width: $breakpoint-lg) {
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

@media (max-width: $breakpoint-md) {
  .main-content {
    margin-left: 0;
    padding: $space-4;
  }
  
  .kpi-section {
    grid-template-columns: 1fr;
  }
  
  .fab-container {
    bottom: $space-4;
    right: $space-4;
  }
  
  .banner-content {
    flex-direction: column;
    gap: $space-2;
    text-align: center;
  }
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 