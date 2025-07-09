<template>
  <div class="analytics-page">
    <!-- Header -->
    <section class="analytics-header">
      <div class="container">
        <div class="header-content">
          <h1 class="header-title">Аналитика проектов</h1>
          <p class="header-subtitle">
            Детальная статистика эффективности проектирования и использования ресурсов
          </p>
          
          <!-- Filters -->
          <div class="analytics-filters">
            <select v-model="filters.period" class="filter-select">
              <option value="7d">Последние 7 дней</option>
              <option value="30d">Последние 30 дней</option>
              <option value="90d">Последние 3 месяца</option>
              <option value="1y">Последний год</option>
            </select>
            
            <select v-model="filters.projectType" class="filter-select">
              <option value="all">Все типы проектов</option>
              <option value="distribution">Распределительные</option>
              <option value="transmission">Магистральные</option>
              <option value="service">Служебные</option>
            </select>
            
            <button @click="exportReport" class="export-btn">
              📊 Экспорт отчёта
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="analytics-content">
      <div class="container">
        <div class="analytics-grid">
          <!-- Key Metrics -->
          <div class="metrics-section">
            <h2 class="section-title">Ключевые показатели</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-header">
                  <span class="metric-icon">📈</span>
                  <span class="metric-trend positive">+15%</span>
                </div>
                <div class="metric-value">{{ metrics.productivity }}%</div>
                <div class="metric-label">Рост продуктивности</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-header">
                  <span class="metric-icon">⏱️</span>
                  <span class="metric-trend negative">-23%</span>
                </div>
                <div class="metric-value">{{ metrics.avgTime }}ч</div>
                <div class="metric-label">Среднее время проекта</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-header">
                  <span class="metric-icon">📊</span>
                  <span class="metric-trend positive">+15%</span>
                </div>
                <div class="metric-value">{{ metrics.costSavings }}</div>
                <div class="metric-label">Выполнено проектов</div>
              </div>
            </div>
          </div>

          <!-- Charts -->
          <div class="charts-section">
            <div class="chart-card">
              <h3>Количество проектов по месяцам</h3>
              <div class="chart-placeholder">
                <canvas ref="projectsChart" width="400" height="200"></canvas>
              </div>
            </div>
            
            <div class="chart-card">
              <h3>Время выполнения проектов</h3>
              <div class="chart-placeholder">
                <canvas ref="timeChart" width="400" height="200"></canvas>
              </div>
            </div>
          </div>

          <!-- Performance Table -->
          <div class="performance-section">
            <h2 class="section-title">Производительность по проектам</h2>
            <div class="performance-table">
              <div class="table-header">
                <div class="table-cell">Проект</div>
                <div class="table-cell">Тип</div>
                <div class="table-cell">Время</div>
                <div class="table-cell">Эффективность</div>
                <div class="table-cell">Статус</div>
              </div>
              
              <div 
                v-for="project in performanceData" 
                :key="project.id"
                class="table-row"
              >
                <div class="table-cell">{{ project.name }}</div>
                <div class="table-cell">{{ project.type }}</div>
                <div class="table-cell">{{ project.time }}ч</div>
                <div class="table-cell">
                  <div class="efficiency-bar">
                    <div 
                      class="efficiency-fill" 
                      :style="{ width: project.efficiency + '%' }"
                      :class="getEfficiencyClass(project.efficiency)"
                    ></div>
                  </div>
                  <span>{{ project.efficiency }}%</span>
                </div>
                <div class="table-cell">
                  <span 
                    class="status-badge" 
                    :class="project.status"
                  >
                    {{ getStatusText(project.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const filters = reactive({
  period: '30d',
  projectType: 'all'
})

const metrics = reactive({
  productivity: 85,
  avgTime: 14.5,
  costSavings: 15
})

const performanceData = ref([
  {
    id: '1',
    name: 'Газопровод Север-1',
    type: 'Распределительный',
    time: 16,
    efficiency: 92,
    status: 'completed'
  },
  {
    id: '2',
    name: 'ЖК Солнечный',
    type: 'Служебный',
    time: 8,
    efficiency: 89,
    status: 'active'
  },
  {
    id: '3',
    name: 'Модернизация ЦР',
    type: 'Магистральный',
    time: 24,
    efficiency: 76,
    status: 'planning'
  }
])

const projectsChart = ref<HTMLCanvasElement>()
const timeChart = ref<HTMLCanvasElement>()

const getEfficiencyClass = (efficiency: number) => {
  if (efficiency >= 90) return 'excellent'
  if (efficiency >= 75) return 'good'
  if (efficiency >= 60) return 'average'
  return 'poor'
}

const getStatusText = (status: string) => {
  const statusMap = {
    completed: 'Завершён',
    active: 'Активный',
    planning: 'Планирование'
  }
  return statusMap[status] || status
}

const exportReport = () => {
  console.log('Exporting analytics report...')
}

const drawCharts = () => {
  // Простые заглушки для графиков
  if (projectsChart.value) {
    const ctx = projectsChart.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, 400, 200)
      ctx.fillStyle = '#00d4ff'
      ctx.fillText('График проектов по месяцам', 120, 100)
    }
  }
  
  if (timeChart.value) {
    const ctx = timeChart.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, 400, 200)
      ctx.fillStyle = '#22c55e'
      ctx.fillText('График времени выполнения', 120, 100)
    }
  }
}

onMounted(() => {
  drawCharts()
})
</script>

<style lang="scss" scoped>
.analytics-page {
  background: $color-background;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $space-4;
}

// Header
.analytics-header {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  padding: $space-8 0;
  
  .header-title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-2;
    color: white;
  }
  
  .header-subtitle {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: $space-6;
  }
}

.analytics-filters {
  display: flex;
  gap: $space-4;
  flex-wrap: wrap;
  
  .filter-select {
    padding: $space-3 $space-4;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    
    &:focus {
      outline: none;
      border-color: $color-primary;
    }
  }
  
  .export-btn {
    padding: $space-3 $space-6;
    background: $color-primary;
    color: white;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    
    &:hover {
      background: $color-primary-dark;
    }
  }
}

// Content
.analytics-content {
  padding: $space-8 0;
}

.analytics-grid {
  display: grid;
  gap: $space-8;
}

.section-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $space-6;
}

// Metrics
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $space-4;
}

.metric-card {
  background: white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-6;
  
  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-4;
    
    .metric-icon {
      font-size: $font-size-xl;
    }
    
    .metric-trend {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      padding: $space-1 $space-2;
      border-radius: $radius-sm;
      
      &.positive {
        background: rgba(34, 197, 94, 0.1);
        color: $color-success;
      }
      
      &.negative {
        background: rgba(239, 68, 68, 0.1);
        color: $color-error;
      }
    }
  }
  
  .metric-value {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $space-1;
  }
  
  .metric-label {
    color: $color-text-secondary;
  }
}

// Charts
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;
}

.chart-card {
  background: white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-6;
  
  h3 {
    margin-bottom: $space-4;
    color: $color-text-primary;
  }
  
  .chart-placeholder {
    canvas {
      width: 100%;
      height: 200px;
      border: 1px solid $color-border;
      border-radius: $radius-md;
    }
  }
}

// Performance Table
.performance-section {
  background: white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-6;
}

.performance-table {
  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr;
    gap: $space-4;
    padding: $space-3;
    align-items: center;
  }
  
  .table-header {
    border-bottom: 2px solid $color-border;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
  
  .table-row {
    border-bottom: 1px solid $color-border;
    
    &:hover {
      background: $color-surface;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .efficiency-bar {
    width: 60px;
    height: 8px;
    background: $color-surface;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    margin-right: $space-2;
    
    .efficiency-fill {
      height: 100%;
      transition: width $duration-normal;
      
      &.excellent { background: $color-success; }
      &.good { background: #3b82f6; }
      &.average { background: #f59e0b; }
      &.poor { background: $color-error; }
    }
  }
  
  .status-badge {
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    
    &.completed {
      background: rgba(34, 197, 94, 0.1);
      color: $color-success;
    }
    
    &.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
    
    &.planning {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-table {
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: $space-2;
      text-align: left;
    }
  }
}
</style> 