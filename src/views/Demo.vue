<template>
  <div class="gaznetcad-app">
    <!-- Top Toolbar -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">GazNetCAD</div>
        <div class="project-info">
          <span class="project-name">Проект: Газопровод №1</span>
          <span class="project-status">Активный</span>
        </div>
      </div>
      <div class="header-center">
        <div class="toolbar">
          <button class="tool-btn" @click="activeTool = 'select'" :class="{ active: activeTool === 'select' }">
            <span class="icon">👆</span>
            <span>Выбор</span>
          </button>
          <button class="tool-btn" @click="activeTool = 'line'" :class="{ active: activeTool === 'line' }">
            <span class="icon">📏</span>
            <span>Линия</span>
          </button>
          <button class="tool-btn" @click="activeTool = 'pipe'" :class="{ active: activeTool === 'pipe' }">
            <span class="icon">🔗</span>
            <span>Труба</span>
          </button>
          <button class="tool-btn" @click="activeTool = 'valve'" :class="{ active: activeTool === 'valve' }">
            <span class="icon">🔧</span>
            <span>Клапан</span>
          </button>
          <button class="tool-btn" @click="activeTool = 'measure'" :class="{ active: activeTool === 'measure' }">
            <span class="icon">📐</span>
            <span>Измерение</span>
          </button>
          <button class="tool-btn" @click="activeTool = 'obstacle'" :class="{ active: activeTool === 'obstacle' }">
            <span class="icon">🚧</span>
            <span>Препятствие</span>
          </button>
        </div>
      </div>
      <div class="header-right">
        <button class="action-btn" @click="checkCollisions">
          <span class="icon">🔍</span>
          <span>Проверить</span>
        </button>
        <button class="action-btn" @click="autoReroute" :disabled="collisionErrors.length === 0">
          <span class="icon">🔄</span>
          <span>Обойти</span>
        </button>
        <button class="action-btn" @click="calculateAll">
          <span class="icon">⚡</span>
          <span>Расчёт</span>
        </button>
        <button class="action-btn" @click="exportProject">
          <span class="icon">📤</span>
          <span>Экспорт</span>
        </button>
        <button class="action-btn" @click="saveProject">
          <span class="icon">💾</span>
          <span>Сохранить</span>
        </button>
      </div>
    </header>
    <!-- Main Workspace -->
    <div class="workspace">
      <!-- Left Sidebar -->
      <aside class="sidebar left-sidebar">
        <div class="sidebar-section">
          <h3>Параметры проекта</h3>
          <div class="param-group">
            <label>Рабочее давление (МПа)</label>
            <input type="number" v-model="projectParams.pressure" step="0.01" min="0" />
          </div>
          <div class="param-group">
            <label>Температура (°C)</label>
            <input type="number" v-model="projectParams.temperature" step="1" />
          </div>
          <div class="param-group">
            <label>Тип газа</label>
            <select v-model="projectParams.gasType">
              <option value="natural">Природный газ</option>
              <option value="propane">Пропан</option>
              <option value="butane">Бутан</option>
            </select>
          </div>
        </div>
        <div class="sidebar-section">
          <h3>Свойства элемента</h3>
          <div v-if="selectedElement" class="element-props">
            <div class="prop-group">
              <label>Тип</label>
              <span>{{ selectedElement.type }}</span>
            </div>
            <div class="prop-group">
              <label>Длина (м)</label>
              <input type="number" v-model="selectedElement.length" step="0.1" />
            </div>
            <div class="prop-group">
              <label>Диаметр (мм)</label>
              <input type="number" v-model="selectedElement.diameter" step="1" />
            </div>
            <div class="prop-group">
              <label>Материал</label>
              <select v-model="selectedElement.material">
                <option value="pe">Полиэтилен</option>
                <option value="steel">Сталь</option>
                <option value="copper">Медь</option>
              </select>
            </div>
            <div class="prop-group">
              <label>Шероховатость (мм)</label>
              <input type="number" v-model="selectedElement.roughness" step="0.01" />
            </div>
          </div>
          <div v-else class="no-selection">
            Выберите элемент на чертеже
          </div>
        </div>
        <div class="sidebar-section">
          <h3>Результаты расчёта</h3>
          <div class="calc-results">
            <div class="result-item">
              <span>Пропускная способность:</span>
              <strong>{{ calculationResults.flowRate }} м³/ч</strong>
            </div>
            <div class="result-item">
              <span>Скорость потока:</span>
              <strong>{{ calculationResults.velocity }} м/с</strong>
            </div>
            <div class="result-item">
              <span>Потери давления:</span>
              <strong>{{ calculationResults.pressureLoss }} МПа</strong>
            </div>
            <div class="result-item">
              <span>Число Рейнольдса:</span>
              <strong>{{ calculationResults.reynolds }}</strong>
            </div>
          </div>
        </div>
      </aside>
      <!-- Main Canvas Area -->
      <main class="canvas-area">
        <div class="canvas-toolbar">
          <div class="view-controls">
            <button class="view-btn" @click="viewMode = '2d'" :class="{ active: viewMode === '2d' }">2D</button>
            <button class="view-btn" @click="viewMode = '3d'" :class="{ active: viewMode === '3d' }">3D</button>
            <button class="view-btn" @click="viewMode = 'isometric'" :class="{ active: viewMode === 'isometric' }">Изометрия</button>
          </div>
          <div class="zoom-controls">
            <button @click="zoomOut">-</button>
            <span>{{ Math.round(zoom * 100) }}%</span>
            <button @click="zoomIn">+</button>
          </div>
        </div>
        <div class="canvas-container" 
             :class="{ 
               'drawing': activeTool === 'line', 
               'selecting': activeTool === 'select',
               'measuring': activeTool === 'measure'
             }"
             @mousedown="handleCanvasMouseDown" 
             @mousemove="handleCanvasMouseMove" 
             @mouseup="handleCanvasMouseUp">
          <div class="canvas" :style="{ transform: `scale(${zoom})` }">
            <!-- Grid -->
            <div class="grid"></div>
            <!-- Tool Indicator -->
            <div class="tool-indicator">
              {{ getToolName(activeTool) }} | X: {{ mouseCoords.x }}, Y: {{ mouseCoords.y }}
            </div>
            <!-- Obstacles -->
            <div 
              v-for="obstacle in obstacles" 
              :key="obstacle.id"
              class="obstacle"
              :class="[obstacle.type, { 'high-priority': obstacle.priority === 'high' }]"
              :style="getObstacleStyle(obstacle)"
            >
              <div class="obstacle-label">{{ obstacle.name }}</div>
            </div>
            <!-- Auto-reroute Paths -->
            <div 
              v-for="path in autoReroutePaths" 
              :key="path.id"
              class="reroute-path"
              :style="getConnectionStyle(path)"
            >
              <div class="reroute-label">Обход</div>
            </div>
            <!-- Drawing Line -->
            <div v-if="currentLine" class="drawing-line" :style="getDrawingLineStyle(currentLine)"></div>
            <!-- Connections (waypoint segments) -->
            <template v-for="connection in connections">
              <div v-for="(segment, idx) in connection.segments" 
                   :key="idx"
                   class="connection-segment"
                   :class="{ final: idx === connection.segments.length - 1, collision: connection.hasCollision }"
                   :style="getSegmentStyle(segment)"></div>
            </template>
            <!-- Pipeline Elements -->
            <div v-for="element in pipelineElements" 
                 :key="element.id"
                 class="pipeline-element"
                 :class="[element.type, { selected: selectedElement && selectedElement.id === element.id }]"
                 :style="getElementStyle(element)"
                 @mousedown.stop="selectElement(element)">
              <div v-if="element.type === 'pipe'" class="pipe">{{ element.name }}</div>
              <div v-else-if="element.type === 'valve'" class="valve" :class="{ closed: !element.isOpen }" @click.stop="toggleValve(element)">
                {{ element.isOpen ? '🟢' : '🔴' }}
              </div>
            </div>
            <!-- Measurements -->
            <div v-for="measurement in measurements" :key="measurement.id" class="measurement" :style="getMeasurementStyle(measurement)">
              <div class="measurement-label">{{ measurement.value }} м</div>
            </div>
          </div>
        </div>
      </main>
      <!-- Right Sidebar -->
      <aside class="sidebar right-sidebar">
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'console' }" @click="activeTab = 'console'">Консоль</button>
          <button class="tab" :class="{ active: activeTab === 'spec' }" @click="activeTab = 'spec'">Спецификация</button>
          <button class="tab" :class="{ active: activeTab === 'calc' }" @click="activeTab = 'calc'">Таблица расчёта</button>
          <button class="tab" :class="{ active: activeTab === 'layers' }" @click="activeTab = 'layers'">Слои</button>
        </div>
        <div class="tab-content" v-if="activeTab === 'console'">
          <div class="logs-container">
            <div v-for="log in consoleLogs" :key="log.id" class="log-item" :class="log.type">
              <span class="log-time">{{ log.time }}</span>
              {{ log.message }}
            </div>
          </div>
        </div>
        <div class="tab-content" v-if="activeTab === 'spec'">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Поз.</th>
                  <th>Наименование</th>
                  <th>Кол-во</th>
                  <th>Ед.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in specification" :key="item.id">
                  <td>{{ item.position }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.unit }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-content" v-if="activeTab === 'calc'">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Участок</th>
                  <th>Длина (м)</th>
                  <th>Диаметр (мм)</th>
                  <th>Q (м³/ч)</th>
                  <th>Потери (МПа)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in calculationTable" :key="row.id">
                  <td>{{ row.name }}</td>
                  <td>{{ row.length }}</td>
                  <td>{{ row.diameter }}</td>
                  <td>{{ row.flowRate }}</td>
                  <td>{{ row.pressureLoss }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-content" v-if="activeTab === 'layers'">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Слой</th>
                  <th>Видимость</th>
                  <th>Цвет</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="layer in layers" :key="layer.id">
                  <td>{{ layer.name }}</td>
                  <td><input type="checkbox" v-model="layer.visible" /></td>
                  <td><span :style="{ color: layer.color }">●</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </aside>
    </div>
    <!-- Modal for adding obstacle -->
    <div v-if="showObstacleModal" class="modal-overlay">
      <div class="modal">
        <h3>Выберите тип препятствия</h3>
        <div class="modal-content">
          <div class="obstacle-types">
            <button class="obstacle-type-btn" @click="addObstacleByType('building')">Здание</button>
            <button class="obstacle-type-btn" @click="addObstacleByType('tree')">Дерево</button>
            <button class="obstacle-type-btn" @click="addObstacleByType('underground')">Подземная труба</button>
          </div>
        </div>
        <button class="modal-close-btn" @click="showObstacleModal = false">Отмена</button>
      </div>
    </div>
    
    <!-- Modal for export menu -->
    <div v-if="showExportMenu" class="modal-overlay">
      <div class="modal">
        <h3>Экспорт проекта</h3>
        <div class="modal-content">
          <div class="export-options">
            <button class="export-btn" @click="saveProject">
              <span class="export-icon">💾</span>
              <span>Сохранить проект (JSON)</span>
            </button>
            <button class="export-btn" @click="exportAsSVG">
              <span class="export-icon">📐</span>
              <span>Экспорт схемы (SVG)</span>
            </button>
            <button class="export-btn" @click="exportAsPNG">
              <span class="export-icon">🖼️</span>
              <span>Экспорт изображения (PNG)</span>
            </button>
            <button class="export-btn" @click="importProject">
              <span class="export-icon">📂</span>
              <span>Импорт проекта</span>
            </button>
          </div>
        </div>
        <button class="modal-close-btn" @click="showExportMenu = false">Закрыть</button>
      </div>
    </div>
  </div>
</template> 

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

// --- Основные состояния приложения ---
const activeTool = ref('select')
const viewMode = ref('2d')
const zoom = ref(1)
const selectedElement = ref(null)
const activeTab = ref('console')
const mouseCoords = ref({ x: 0, y: 0 })

// --- Параметры проекта ---
const projectParams = ref({
  pressure: 0.3,
  temperature: 20,
  gasType: 'natural'
})

// --- Элементы трубопровода ---
const pipelineElements = ref([
  {
    id: 1,
    name: 'Труба-1',
    type: 'pipe',
    x: 100,
    y: 100,
    length: 50,
    diameter: 110,
    material: 'pe',
    roughness: 0.01,
    flowRate: 150,
    pressureLoss: 0.002,
    velocity: 0,
    reynolds: 0,
    connections: []
  },
  {
    id: 2,
    name: 'Клапан-1',
    type: 'valve',
    x: 200,
    y: 100,
    diameter: 110,
    material: 'steel',
    isOpen: true,
    velocity: 0,
    reynolds: 0,
    connections: []
  },
  {
    id: 3,
    name: 'Труба-2',
    type: 'pipe',
    x: 300,
    y: 100,
    length: 75,
    diameter: 110,
    material: 'pe',
    roughness: 0.01,
    flowRate: 150,
    pressureLoss: 0.003,
    velocity: 0,
    reynolds: 0,
    connections: []
  }
])

// --- Препятствия ---
const obstacles = ref([
  {
    id: 1,
    name: 'Здание-1',
    type: 'building',
    x: 150,
    y: 80,
    width: 60,
    height: 40,
    color: '#ff4757',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Дерево',
    type: 'tree',
    x: 250,
    y: 120,
    radius: 15,
    color: '#2ed573',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Подземная труба',
    type: 'underground',
    x: 180,
    y: 150,
    width: 80,
    height: 8,
    color: '#ffa502',
    priority: 'high'
  }
])

// --- Слои ---
const layers = ref([
  { id: 1, name: 'Трубопроводы', visible: true, color: '#00d4ff' },
  { id: 2, name: 'Арматура', visible: true, color: '#ff6b6b' },
  { id: 3, name: 'Измерения', visible: true, color: '#00ff88' },
  { id: 4, name: 'Соединения', visible: true, color: '#ffd43b' }
])

// --- Спецификация ---
const specification = ref([
  { id: 1, position: '1', name: 'Труба ПЭ 110x10', quantity: 125, unit: 'м' },
  { id: 2, position: '2', name: 'Клапан запорный 110', quantity: 1, unit: 'шт' },
  { id: 3, position: '3', name: 'Муфта 110', quantity: 2, unit: 'шт' }
])

// --- Результаты расчёта ---
const calculationResults = ref({
  flowRate: 0,
  velocity: 0,
  pressureLoss: 0,
  reynolds: 0
})

// --- Таблица расчёта ---
const calculationTable = ref([
  { id: 1, name: 'Участок 1', length: 50, diameter: 110, flowRate: 150, pressureLoss: 0.002 },
  { id: 2, name: 'Участок 2', length: 75, diameter: 110, flowRate: 150, pressureLoss: 0.003 }
])

// --- Логи ---
const consoleLogs = ref([
  { id: 1, time: '14:30:15', message: 'Проект загружен', type: 'info' },
  { id: 2, time: '14:30:20', message: 'Расчёт выполнен успешно', type: 'success' }
])

// --- System logs (для примера, можно расширить) ---
const systemLogs = ref([
  { id: 1, time: '14:30:15', message: 'Инициализация системы' },
  { id: 2, time: '14:30:16', message: 'Загрузка библиотек' }
])

// --- Ошибки ---
const errors = ref([])

// --- Canvas и интерактив ---
const isDrawing = ref(false)
const drawingStart = ref({ x: 0, y: 0 })
const currentLine = ref(null)
const connections = ref<Array<{
  id: string;
  start: any;
  end: any;
  segments: Array<{
    id: string;
    start: any;
    end: any;
    isWaypoint: boolean;
    hasCollision: boolean;
  }>;
  waypoints?: any[];
  hasCollision: boolean;
  isFlowing: boolean;
}>>([])
const measurements = ref([])
const isDragging = ref(false)
const dragElement = ref(null)
const dragOffset = ref({ x: 0, y: 0 })

// --- Reroute и коллизии ---
const collisionErrors = ref([])
const autoReroutePaths = ref([])
const isAutoRerouting = ref(false)
const showObstacleModal = ref(false)

// --- Zoom ---
function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 2)
}
function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, 0.2)
}

// --- Анимации CSS ---
const animations = {
  pulse: {
    animation: 'pulse 2s infinite'
  },
  flow: {
    animation: 'flow 3s infinite'
  },
  glow: {
    animation: 'glow 1.5s ease-in-out infinite alternate'
  },
  bounce: {
    animation: 'bounce 1s infinite'
  }
}

// --- Применение анимаций к элементам ---
function applyAnimation(element: any, animationName: string) {
  element.animationClass = animationName
  element.animationStyle = animations[animationName] || {}
  
  // Удаляем анимацию через время
  setTimeout(() => {
    element.animationClass = null
    element.animationStyle = {}
  }, 3000)
}

// --- Выбор элемента ---
function selectElement(element: any) {
  selectedElement.value = element
  
  // Добавляем анимацию выбора
  applyAnimation(element, 'glow')
  
  addLog('info', `Выбран элемент: ${element.name}`)
}

// --- Переключение клапана ---
function toggleValve(element: any) {
  if (element.type === 'valve') {
    element.isOpen = !element.isOpen
    
    // Добавляем анимацию переключения
    applyAnimation(element, element.isOpen ? 'glow' : 'pulse')
    
    addLog('info', `Клапан ${element.name} ${element.isOpen ? 'открыт' : 'закрыт'}`)
    
    // Пересчитываем гидравлику
    calculateAll()
  }
}

// --- Добавление препятствия ---
function addObstacleByType(type: string) {
  showObstacleModal.value = false
  addObstacle(type, mouseCoords.value.x, mouseCoords.value.y)
}
function addObstacle(type: string, x: number, y: number) {
  const id = Date.now()
  let obstacle: any = { id, name: '', type, x, y, priority: 'medium' }
  if (type === 'building') {
    obstacle.name = `Здание-${id}`
    obstacle.width = 60
    obstacle.height = 40
    obstacle.color = '#ff4757'
    obstacle.priority = 'high'
  } else if (type === 'tree') {
    obstacle.name = 'Дерево'
    obstacle.radius = 15
    obstacle.color = '#2ed573'
  } else if (type === 'underground') {
    obstacle.name = 'Подземная труба'
    obstacle.width = 80
    obstacle.height = 8
    obstacle.color = '#ffa502'
    obstacle.priority = 'high'
  }
  obstacles.value.push(obstacle)
  checkCollisions()
}

// --- Обработчики мыши для canvas ---
function handleCanvasMouseDown(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = (event.clientX - rect.left) / zoom.value
  const y = (event.clientY - rect.top) / zoom.value
  mouseCoords.value = { x: Math.round(x), y: Math.round(y) }
  if (activeTool.value === 'line') {
    startDrawingLine(x, y)
  } else if (activeTool.value === 'pipe') {
    addPipe(x, y)
  } else if (activeTool.value === 'valve') {
    addValve(x, y)
  } else if (activeTool.value === 'measure') {
    startMeasurement(x, y)
  } else if (activeTool.value === 'obstacle') {
    showObstacleModal.value = true
  } else if (activeTool.value === 'select') {
    startDragging(x, y)
  }
}
function handleCanvasMouseMove(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = (event.clientX - rect.left) / zoom.value
  const y = (event.clientY - rect.top) / zoom.value
  mouseCoords.value = { x: Math.round(x), y: Math.round(y) }
  
  // Обновляем текущую линию при рисовании
  if (isDrawing.value && currentLine.value) {
    currentLine.value.end = { x: Math.round(x), y: Math.round(y) }
  }
  
  // Обновляем измерения при перетаскивании
  if (isDragging.value && dragElement.value) {
    const offsetX = x - dragOffset.value.x
    const offsetY = y - dragOffset.value.y
    
    dragElement.value.x = Math.round(offsetX)
    dragElement.value.y = Math.round(offsetY)
    
    // Пересчитываем коллизии при перемещении
    checkCollisions()
  }
}
function handleCanvasMouseUp(event: MouseEvent) {
  if (isDrawing.value && currentLine.value) {
    // Завершаем рисование линии
    const connection = {
      id: Date.now().toString(),
      start: currentLine.value.start,
      end: currentLine.value.end,
      segments: [],
      waypoints: [],
      hasCollision: false,
      isFlowing: false
    }
    
    // Проверяем коллизии и создаём waypoints если нужно
    const hasCollision = obstacles.value.some(obstacle => 
      checkLineObstacleCollision(connection.start, connection.end, obstacle)
    )
    
    if (hasCollision) {
      const waypoints = createWaypoints(connection.start, connection.end, obstacles.value)
      connection.segments = createConnectionSegments(connection.start, connection.end, waypoints.slice(1, -1))
      connection.waypoints = waypoints.slice(1, -1)
    } else {
      connection.segments = createConnectionSegments(connection.start, connection.end)
    }
    
    connections.value.push(connection)
    checkCollisions()
    
    addLog('success', 'Соединение создано')
  }
  
  isDrawing.value = false
  isDragging.value = false
  currentLine.value = null
  dragElement.value = null
}

// --- Методы для добавления элементов ---
function addPipe(x: number, y: number) {
  const id = Date.now()
  pipelineElements.value.push({
    id,
    name: `Труба-${id}`,
    type: 'pipe',
    x,
    y,
    length: 50,
    diameter: 110,
    material: 'pe',
    roughness: 0.01,
    flowRate: 100,
    pressureLoss: 0.001,
    velocity: 0,
    reynolds: 0,
    connections: []
  })
}
function addValve(x: number, y: number) {
  const id = Date.now()
  pipelineElements.value.push({
    id,
    name: `Клапан-${id}`,
    type: 'valve',
    x,
    y,
    diameter: 110,
    material: 'steel',
    isOpen: true,
    velocity: 0,
    reynolds: 0,
    connections: []
  })
}

// --- Drag ---
function startDragging(x: number, y: number) {
  // Находим элемент под курсором
  const element = findElementAtPosition(x, y)
  
  if (element) {
    isDragging.value = true
    dragElement.value = element
    dragOffset.value = { x: x - element.x, y: y - element.y }
    selectedElement.value = element
    
    addLog('info', `Перемещение элемента: ${element.name}`)
  }
}

function findElementAtPosition(x: number, y: number) {
  // Проверяем элементы трубопровода
  for (const element of pipelineElements.value) {
    const elementRect = getElementRect(element)
    if (x >= elementRect.left && x <= elementRect.right && 
        y >= elementRect.top && y <= elementRect.bottom) {
      return element
    }
  }
  
  // Проверяем препятствия
  for (const obstacle of obstacles.value) {
    const obstacleRect = getObstacleRect(obstacle)
    if (x >= obstacleRect.left && x <= obstacleRect.right && 
        y >= obstacleRect.top && y <= obstacleRect.bottom) {
      return obstacle
    }
  }
  
  return null
}

function getElementRect(element: any) {
  if (element.type === 'pipe') {
    return {
      left: element.x,
      top: element.y,
      right: element.x + 100,
      bottom: element.y + 20
    }
  } else if (element.type === 'valve') {
    return {
      left: element.x - 15,
      top: element.y - 15,
      right: element.x + 15,
      bottom: element.y + 15
    }
  }
  return { left: 0, top: 0, right: 0, bottom: 0 }
}

function getObstacleRect(obstacle: any) {
  if (obstacle.type === 'building') {
    return {
      left: obstacle.x,
      top: obstacle.y,
      right: obstacle.x + obstacle.width,
      bottom: obstacle.y + obstacle.height
    }
  } else if (obstacle.type === 'tree') {
    return {
      left: obstacle.x - obstacle.radius,
      top: obstacle.y - obstacle.radius,
      right: obstacle.x + obstacle.radius,
      bottom: obstacle.y + obstacle.radius
    }
  } else if (obstacle.type === 'underground') {
    return {
      left: obstacle.x,
      top: obstacle.y,
      right: obstacle.x + obstacle.width,
      bottom: obstacle.y + obstacle.height
    }
  }
  return { left: 0, top: 0, right: 0, bottom: 0 }
}

// --- Логика для линии, измерения, reroute, collision ---
function startDrawingLine(x: number, y: number) {
  isDrawing.value = true
  drawingStart.value = { x, y }
  currentLine.value = { start: { x, y }, end: { x, y } }
}

function startMeasurement(x: number, y: number) {
  const id = Date.now()
  const measurement = {
    id,
    start: { x, y },
    end: { x, y },
    value: 0
  }
  measurements.value.push(measurement)
}

// --- Функции для работы с препятствиями ---
function checkLineObstacleCollision(lineStart: any, lineEnd: any, obstacle: any): boolean {
  const { x: x1, y: y1 } = lineStart
  const { x: x2, y: y2 } = lineEnd
  
  if (obstacle.type === 'building') {
    return checkLineRectCollision(x1, y1, x2, y2, obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  } else if (obstacle.type === 'tree') {
    return checkLineCircleCollision(x1, y1, x2, y2, obstacle.x, obstacle.y, obstacle.radius)
  } else if (obstacle.type === 'underground') {
    return checkLineRectCollision(x1, y1, x2, y2, obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  }
  return false
}

function checkLineRectCollision(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean {
  // Проверка пересечения линии с прямоугольником
  const left = rx
  const right = rx + rw
  const top = ry
  const bottom = ry + rh
  
  // Проверяем, находится ли хотя бы одна точка линии внутри прямоугольника
  if ((x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) ||
      (x2 >= left && x2 <= right && y2 >= top && y2 <= bottom)) {
    return true
  }
  
  // Проверяем пересечение с каждой стороной прямоугольника
  const lines = [
    { x1: left, y1: top, x2: right, y2: top },     // верхняя сторона
    { x1: right, y1: top, x2: right, y2: bottom }, // правая сторона
    { x1: right, y1: bottom, x2: left, y2: bottom }, // нижняя сторона
    { x1: left, y1: bottom, x2: left, y2: top }    // левая сторона
  ]
  
  for (const line of lines) {
    if (linesIntersect(x1, y1, x2, y2, line.x1, line.y1, line.x2, line.y2)) {
      return true
    }
  }
  
  return false
}

function checkLineCircleCollision(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, radius: number): boolean {
  // Проверка пересечения линии с окружностью
  const A = x2 - x1
  const B = y2 - y1
  const C = cx - x1
  const D = cy - y1
  
  const dot = A * C + B * D
  const lenSq = A * A + B * B
  
  if (lenSq === 0) return false
  
  const param = dot / lenSq
  
  let xx, yy
  
  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * A
    yy = y1 + param * B
  }
  
  const dx = cx - xx
  const dy = cy - yy
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  return distance <= radius
}

function linesIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  if (denom === 0) return false
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom
  
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1
}

// --- Функции для создания waypoints ---
function createWaypoints(start: any, end: any, obstacles: any[]): any[] {
  const waypoints = [start]
  let currentPoint = { ...start }
  
  // Сортируем препятствия по приоритету (high -> medium -> low)
  const sortedObstacles = [...obstacles].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
  
  for (const obstacle of sortedObstacles) {
    if (checkLineObstacleCollision(currentPoint, end, obstacle)) {
      const waypoint = generateWaypoint(currentPoint, end, obstacle)
      if (waypoint) {
        waypoints.push(waypoint)
        currentPoint = waypoint
      }
    }
  }
  
  waypoints.push(end)
  return waypoints
}

function generateWaypoint(start: any, end: any, obstacle: any): any {
  const { x: x1, y: y1 } = start
  const { x: x2, y: y2 } = end
  
  if (obstacle.type === 'building') {
    return generateBuildingWaypoint(x1, y1, x2, y2, obstacle)
  } else if (obstacle.type === 'tree') {
    return generateTreeWaypoint(x1, y1, x2, y2, obstacle)
  } else if (obstacle.type === 'underground') {
    return generateUndergroundWaypoint(x1, y1, x2, y2, obstacle)
  }
  return null
}

function generateBuildingWaypoint(x1: number, y1: number, x2: number, y2: number, building: any): any {
  const { x: bx, y: by, width: bw, height: bh } = building
  
  // Увеличенный отступ для зданий (высокий приоритет)
  const baseOffset = 50
  
  // Находим ближайший угол здания к линии
  const corners = [
    { x: bx, y: by },                    // левый верхний
    { x: bx + bw, y: by },               // правый верхний
    { x: bx + bw, y: by + bh },          // правый нижний
    { x: bx, y: by + bh }                // левый нижний
  ]
  
  let bestCorner = corners[0]
  let minDistance = Infinity
  
  for (const corner of corners) {
    const distance = Math.sqrt((corner.x - x1) ** 2 + (corner.y - y1) ** 2)
    if (distance < minDistance) {
      minDistance = distance
      bestCorner = corner
    }
  }
  
  // Определяем направление обхода
  const centerX = bx + bw / 2
  const centerY = by + bh / 2
  
  // Если линия проходит выше здания - обходим сверху
  if (y1 < centerY && y2 < centerY) {
    return { 
      x: Math.round(centerX), 
      y: Math.round(by - baseOffset - 20) 
    }
  }
  // Если линия проходит ниже здания - обходим снизу
  else if (y1 > centerY && y2 > centerY) {
    return { 
      x: Math.round(centerX), 
      y: Math.round(by + bh + baseOffset + 20) 
    }
  }
  // Если линия проходит слева от здания - обходим слева
  else if (x1 < centerX && x2 < centerX) {
    return { 
      x: Math.round(bx - baseOffset - 20), 
      y: Math.round(centerY) 
    }
  }
  // Если линия проходит справа от здания - обходим справа
  else if (x1 > centerX && x2 > centerX) {
    return { 
      x: Math.round(bx + bw + baseOffset + 20), 
      y: Math.round(centerY) 
    }
  }
  
  // По умолчанию - обходим через ближайший угол с увеличенным отступом
  const dx = bestCorner.x - x1
  const dy = bestCorner.y - y1
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance > 0) {
    const waypointX = bestCorner.x + (dx / distance) * (baseOffset + 30)
    const waypointY = bestCorner.y + (dy / distance) * (baseOffset + 30)
    return { x: Math.round(waypointX), y: Math.round(waypointY) }
  }
  
  return { x: bestCorner.x + baseOffset + 30, y: bestCorner.y + baseOffset + 30 }
}

function generateTreeWaypoint(x1: number, y1: number, x2: number, y2: number, tree: any): any {
  const { x: tx, y: ty, radius } = tree
  
  // Средний отступ для деревьев
  const baseOffset = 35
  
  // Находим точку на окружности, ближайшую к линии
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  
  if (length === 0) return { x: tx + radius + baseOffset, y: ty }
  
  const unitX = dx / length
  const unitY = dy / length
  
  // Создаём два waypoint'а для более плавного обхода дерева
  const waypoint1 = {
    x: Math.round(tx + unitX * (radius + baseOffset)),
    y: Math.round(ty + unitY * (radius + baseOffset))
  }
  
  // Второй waypoint для создания дуги обхода
  const perpendicularX = -unitY
  const perpendicularY = unitX
  
  const waypoint2 = {
    x: Math.round(waypoint1.x + perpendicularX * (radius + 15)),
    y: Math.round(waypoint1.y + perpendicularY * (radius + 15))
  }
  
  // Возвращаем ближайший к начальной точке waypoint
  const dist1 = Math.sqrt((waypoint1.x - x1) ** 2 + (waypoint1.y - y1) ** 2)
  const dist2 = Math.sqrt((waypoint2.x - x1) ** 2 + (waypoint2.y - y1) ** 2)
  
  return dist1 < dist2 ? waypoint1 : waypoint2
}

function generateUndergroundWaypoint(x1: number, y1: number, x2: number, y2: number, underground: any): any {
  const { x: ux, y: uy, width: uw, height: uh } = underground
  
  // Большой отступ для подземных труб (высокий приоритет)
  const baseOffset = 60
  
  const centerY = uy + uh / 2
  const centerX = ux + uw / 2
  
  // Определяем направление линии относительно подземной трубы
  const lineAngle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  
  // Если линия более горизонтальная - обходим сверху/снизу
  if (Math.abs(lineAngle) < 45 || Math.abs(lineAngle) > 135) {
    if (y1 < centerY) {
      // Линия выше подземной трубы - обходим сверху с большим отступом
      return { 
        x: Math.round(centerX), 
        y: Math.round(uy - baseOffset - 30) 
      }
    } else {
      // Линия ниже подземной трубы - обходим снизу с большим отступом
      return { 
        x: Math.round(centerX), 
        y: Math.round(uy + uh + baseOffset + 30) 
      }
    }
  } else {
    // Если линия более вертикальная - обходим слева/справа
    if (x1 < centerX) {
      return { 
        x: Math.round(ux - baseOffset - 30), 
        y: Math.round(centerY) 
      }
    } else {
      return { 
        x: Math.round(ux + uw + baseOffset + 30), 
        y: Math.round(centerY) 
      }
    }
  }
}

// --- Основные функции reroute ---
function checkCollisions() {
  collisionErrors.value = []
  
  // Проверяем коллизии для всех соединений
  for (const connection of connections.value) {
    const hasCollision = obstacles.value.some(obstacle => 
      checkLineObstacleCollision(connection.start, connection.end, obstacle)
    )
    
    if (hasCollision) {
      connection.hasCollision = true
      collisionErrors.value.push({
        id: connection.id,
        message: `Коллизия с препятствием в соединении ${connection.id}`,
        connection
      })
    } else {
      connection.hasCollision = false
    }
  }
  
  // Обновляем логи
  if (collisionErrors.value.length > 0) {
    addLog('warning', `Обнаружено ${collisionErrors.value.length} коллизий`)
  } else {
    addLog('success', 'Коллизий не обнаружено')
  }
}

function autoReroute() {
  if (collisionErrors.value.length === 0) {
    addLog('info', 'Нет коллизий для обхода')
    return
  }
  
  isAutoRerouting.value = true
  addLog('info', 'Начинаем автоматический обход препятствий...')
  
  // Очищаем предыдущие reroute пути
  autoReroutePaths.value = []
  
  for (const error of collisionErrors.value) {
    const connection = error.connection
    const waypoints = createWaypoints(connection.start, connection.end, obstacles.value)
    
    // Создаём сегменты для waypoints
    connection.segments = []
    for (let i = 0; i < waypoints.length - 1; i++) {
      const segment = {
        start: waypoints[i],
        end: waypoints[i + 1],
        isWaypoint: i > 0 && i < waypoints.length - 2
      }
      connection.segments.push(segment)
    }
    
    // Добавляем в reroute пути для визуализации
    autoReroutePaths.value.push({
      id: `reroute-${connection.id}`,
      waypoints,
      connectionId: connection.id
    })
  }
  
  // Пересчитываем результаты
  calculateAll()
  
  isAutoRerouting.value = false
  addLog('success', `Автоматический обход завершён. Создано ${autoReroutePaths.value.length} путей обхода`)
}

// --- Вспомогательные функции ---
function addLog(type: string, message: string) {
  const time = new Date().toLocaleTimeString()
  const id = Date.now()
  consoleLogs.value.unshift({ id, time, message, type })
  
  // Ограничиваем количество логов
  if (consoleLogs.value.length > 50) {
    consoleLogs.value = consoleLogs.value.slice(0, 50)
  }
}

// --- Обновлённые стили для элементов ---
function getObstacleStyle(obstacle: any): Record<string, string | number> {
  const baseStyle: Record<string, string | number> = {
    position: 'absolute',
    border: '2px solid',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10
  }
  
  if (obstacle.type === 'building') {
    const buildingStyle: Record<string, string | number> = {
      ...baseStyle,
      left: `${obstacle.x}px`,
      top: `${obstacle.y}px`,
      width: `${obstacle.width}px`,
      height: `${obstacle.height}px`,
      backgroundColor: 'rgba(255, 71, 87, 0.2)',
      borderColor: '#ff4757',
      boxShadow: '0 0 15px rgba(255, 71, 87, 0.3)'
    }
    
    if (obstacle.priority === 'high') {
      return {
        ...buildingStyle,
        borderWidth: '3px',
        ...getNeonEffect('#ff4757', 1.5)
      }
    }
    
    return buildingStyle
  } else if (obstacle.type === 'tree') {
    const treeStyle: Record<string, string | number> = {
      ...baseStyle,
      left: `${obstacle.x - obstacle.radius}px`,
      top: `${obstacle.y - obstacle.radius}px`,
      width: `${obstacle.radius * 2}px`,
      height: `${obstacle.radius * 2}px`,
      backgroundColor: 'rgba(46, 213, 115, 0.2)',
      borderColor: '#2ed573',
      borderRadius: '50%',
      boxShadow: '0 0 15px rgba(46, 213, 115, 0.3)'
    }
    
    if (obstacle.priority === 'high') {
      return {
        ...treeStyle,
        borderWidth: '3px',
        ...getNeonEffect('#2ed573', 1.5)
      }
    }
    
    return treeStyle
  } else if (obstacle.type === 'underground') {
    const undergroundStyle: Record<string, string | number> = {
      ...baseStyle,
      left: `${obstacle.x}px`,
      top: `${obstacle.y}px`,
      width: `${obstacle.width}px`,
      height: `${obstacle.height}px`,
      backgroundColor: 'rgba(255, 165, 2, 0.2)',
      borderColor: '#ffa502',
      boxShadow: '0 0 15px rgba(255, 165, 2, 0.3)'
    }
    
    if (obstacle.priority === 'high') {
      return {
        ...undergroundStyle,
        borderWidth: '3px',
        ...getNeonEffect('#ffa502', 1.5)
      }
    }
    
    return undergroundStyle
  }
  
  return baseStyle
}

function getConnectionStyle(path: any): Record<string, string | number> {
  if (path.waypoints && path.waypoints.length > 2) {
    return {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 5
    }
  }
  
  const baseStyle: Record<string, string | number> = {
    position: 'absolute',
    height: '2px',
    background: 'linear-gradient(90deg, #00d4ff 0%, #0099cc 100%)',
    boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
    zIndex: 15
  }
  
  if (path.hasCollision) {
    return {
      ...baseStyle,
      background: 'linear-gradient(90deg, #ff4757 0%, #ff6b6b 100%)',
      boxShadow: '0 0 20px rgba(255, 71, 87, 0.8)',
      zIndex: 25
    }
  }
  
  if (path.isFlowing) {
    return {
      ...baseStyle,
      background: 'linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)',
      boxShadow: '0 0 15px rgba(0, 255, 136, 0.6)',
      zIndex: 20
    }
  }
  
  return baseStyle
}

function getDrawingLineStyle(line: any): Record<string, string | number> {
  if (!line) return {}
  
  const dx = line.end.x - line.start.x
  const dy = line.end.y - line.start.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  
  return {
    left: `${line.start.x}px`,
    top: `${line.start.y}px`,
    width: `${length}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 50%'
  }
}

function getSegmentStyle(segment: any): Record<string, string | number> {
  const dx = segment.end.x - segment.start.x
  const dy = segment.end.y - segment.start.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  
  let backgroundColor = 'linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)'
  let boxShadow = '0 0 10px rgba(0, 255, 136, 0.5)'
  
  if (segment.hasCollision) {
    backgroundColor = 'linear-gradient(90deg, #ff4757 0%, #ff6b6b 100%)'
    boxShadow = '0 0 20px rgba(255, 71, 87, 0.8)'
  } else if (segment.isFinal) {
    backgroundColor = 'linear-gradient(90deg, #00d4ff 0%, #0099cc 100%)'
    boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)'
  } else if (segment.isWaypoint) {
    backgroundColor = 'linear-gradient(90deg, #ffd43b 0%, #ffed4e 100%)'
    boxShadow = '0 0 15px rgba(255, 212, 59, 0.6)'
  }
  
  return {
    left: `${segment.start.x}px`,
    top: `${segment.start.y}px`,
    width: `${length}px`,
    height: '3px',
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 50%',
    background: backgroundColor,
    boxShadow: boxShadow,
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: segment.hasCollision ? 25 : 15,
    transition: 'all 0.3s ease'
  }
}

function getElementStyle(element: any): Record<string, string | number> {
  const baseStyle: Record<string, string | number> = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    position: 'absolute',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 15
  }
  
  if (element.type === 'pipe') {
    return {
      ...baseStyle,
      width: '100px',
      height: '20px',
      background: 'linear-gradient(90deg, #00d4ff 0%, #0099cc 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: '#fff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      boxShadow: '0 2px 8px rgba(0, 212, 255, 0.3)'
    }
  } else if (element.type === 'valve') {
    return {
      ...baseStyle,
      width: '40px',
      height: '40px',
      background: element.isOpen ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)' : 'linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: element.isOpen ? '0 0 20px rgba(0, 255, 136, 0.5)' : '0 0 20px rgba(255, 71, 87, 0.5)',
      border: '2px solid #fff'
    }
  }
  
  return baseStyle
}

function getMeasurementStyle(measurement: any): Record<string, string | number> {
  const dx = measurement.end.x - measurement.start.x
  const dy = measurement.end.y - measurement.start.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  
  measurement.value = Math.round(length)
  
  return {
    left: `${measurement.start.x}px`,
    top: `${measurement.start.y}px`,
    width: `${length}px`,
    height: '2px',
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 50%',
    background: 'linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)',
    boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10
  }
}

// --- Computed и базовые методы ---
const getToolName = (tool: string) => {
  const names = {
    select: 'Выбор',
    line: 'Линия',
    pipe: 'Труба',
    valve: 'Клапан',
    measure: 'Измерение',
    obstacle: 'Препятствие'
  }
  return names[tool] || tool
}

// --- Гидравлические расчёты ---
function calculateAll() {
  addLog('info', 'Начинаем гидравлический расчёт...')
  
  let totalFlowRate = 0
  let totalPressureLoss = 0
  let totalLength = 0
  let maxVelocity = 0
  let maxReynolds = 0
  
  // Расчёт для каждого элемента трубопровода
  for (const element of pipelineElements.value) {
    if (element.type === 'pipe') {
      const results = calculatePipeHydraulics(element)
      
      // Обновляем элемент
      element.flowRate = results.flowRate
      element.pressureLoss = results.pressureLoss
      element.velocity = results.velocity
      element.reynolds = results.reynolds
      
      // Суммируем общие показатели
      totalFlowRate += results.flowRate
      totalPressureLoss += results.pressureLoss
      totalLength += (element.length as number) || 0
      maxVelocity = Math.max(maxVelocity, results.velocity)
      maxReynolds = Math.max(maxReynolds, results.reynolds)
    }
  }
  
  // Обновляем общие результаты
  calculationResults.value = {
    flowRate: Math.round(totalFlowRate),
    velocity: Number(maxVelocity.toFixed(2)),
    pressureLoss: Number(totalPressureLoss.toFixed(4)),
    reynolds: Math.round(maxReynolds)
  }
  
  // Обновляем таблицу расчёта
  updateCalculationTable()
  
  addLog('success', `Расчёт завершён. Расход: ${calculationResults.value.flowRate} м³/ч`)
}

function calculatePipeHydraulics(pipe: any) {
  const { diameter, length, material, roughness } = pipe
  const { pressure, temperature, gasType } = projectParams.value
  
  // Физические свойства газа
  const gasProperties = getGasProperties(gasType, temperature)
  
  // Диаметр в метрах
  const D = diameter / 1000
  const L = length
  
  // Площадь поперечного сечения
  const A = Math.PI * D * D / 4
  
  // Расход (принимаем базовый расход на основе диаметра)
  const baseFlowRate = getBaseFlowRate(diameter, pressure)
  const Q = baseFlowRate // м³/ч
  
  // Скорость потока
  const velocity = (Q / 3600) / A // м/с
  
  // Число Рейнольдса
  const reynolds = (velocity * D) / gasProperties.kinematicViscosity
  
  // Коэффициент трения (формула Коулбрука-Уайта)
  const frictionFactor = calculateFrictionFactor(reynolds, roughness, D)
  
  // Потери давления (формула Дарси-Вейсбаха)
  const pressureLoss = (frictionFactor * L * gasProperties.density * velocity * velocity) / (2 * D)
  
  return {
    flowRate: Q,
    velocity: velocity,
    pressureLoss: pressureLoss / 1000000, // переводим в МПа
    reynolds: reynolds
  }
}

function getGasProperties(gasType: string, temperature: number) {
  const properties = {
    natural: {
      density: 0.668, // кг/м³ при 20°C
      kinematicViscosity: 1.5e-5 // м²/с
    },
    propane: {
      density: 1.88,
      kinematicViscosity: 1.2e-6
    },
    butane: {
      density: 2.48,
      kinematicViscosity: 1.1e-6
    }
  }
  
  const baseProps = properties[gasType] || properties.natural
  
  // Корректировка плотности по температуре (упрощённая)
  const tempCorrection = 1 + (temperature - 20) * 0.003
  const density = baseProps.density / tempCorrection
  
  return {
    density,
    kinematicViscosity: baseProps.kinematicViscosity
  }
}

function getBaseFlowRate(diameter: number, pressure: number) {
  // Базовый расход в зависимости от диаметра и давления
  const baseRates = {
    50: 50,    // DN50
    63: 80,    // DN63
    90: 150,   // DN90
    110: 250,  // DN110
    160: 500,  // DN160
    200: 800,  // DN200
    250: 1200, // DN250
    315: 2000  // DN315
  }
  
  const baseRate = baseRates[diameter] || 150
  const pressureCorrection = Math.sqrt(pressure / 0.3) // нормализация к 0.3 МПа
  
  return Math.round(baseRate * pressureCorrection)
}

function calculateFrictionFactor(reynolds: number, roughness: number, diameter: number) {
  // Формула Коулбрука-Уайта для турбулентного потока
  const relativeRoughness = roughness / (diameter * 1000)
  
  if (reynolds < 2300) {
    // Ламинарный поток
    return 64 / reynolds
  } else {
    // Турбулентный поток (итеративное решение)
    let f = 0.02 // начальное приближение
    
    for (let i = 0; i < 10; i++) {
      const newF = 1 / Math.pow(-2 * Math.log10(relativeRoughness / 3.7 + 2.51 / (reynolds * Math.sqrt(f))), 2)
      if (Math.abs(newF - f) < 0.001) break
      f = newF
    }
    
    return f
  }
}

function updateCalculationTable() {
  calculationTable.value = pipelineElements.value
    .filter(element => element.type === 'pipe')
    .map((pipe, index) => ({
      id: index + 1,
      name: pipe.name,
      length: (pipe.length as number) || 0,
      diameter: pipe.diameter,
      flowRate: (pipe.flowRate as number) || 0,
      pressureLoss: (pipe.pressureLoss as number) || 0
    }))
}

// --- Автоматическое обновление при изменении параметров ---
function updateCalculationsOnParamChange() {
  // Пересчитываем при изменении параметров проекта
  calculateAll()
}

// --- Расчёт длины соединений с waypoints ---
function calculateConnectionLength(connection: any) {
  if (!connection.segments || connection.segments.length === 0) {
    // Прямое соединение
    const dx = connection.end.x - connection.start.x
    const dy = connection.end.y - connection.start.y
    return Math.sqrt(dx * dx + dy * dy)
  } else {
    // Соединение с waypoints
    let totalLength = 0
    for (const segment of connection.segments) {
      const dx = segment.end.x - segment.start.x
      const dy = segment.end.y - segment.start.y
      totalLength += Math.sqrt(dx * dx + dy * dy)
    }
    return totalLength
  }
}

// --- Расчёт потерь в клапанах ---
function calculateValvePressureLoss(valve: any, flowRate: number) {
  const { diameter } = valve
  
  // Коэффициент сопротивления клапана (зависит от типа)
  const valveCoefficient = valve.isOpen ? 0.2 : 100 // закрытый клапан имеет высокое сопротивление
  
  // Скорость потока
  const area = Math.PI * (diameter / 1000) * (diameter / 1000) / 4
  const velocity = (flowRate / 3600) / area
  
  // Потери давления в клапане
  const pressureLoss = valveCoefficient * velocity * velocity / 2
  
  return pressureLoss / 1000000 // МПа
}

// --- Обновлённые методы для экспорта/сохранения ---
function exportProject() {
  // Показываем меню экспорта
  showExportMenu.value = true
}

function exportAsSVG() {
  const canvas = document.querySelector('.canvas') as HTMLElement
  if (!canvas) {
    addLog('error', 'Канвас не найден')
    return
  }
  
  // Создаём SVG элемент
  const svg = createSVGFromCanvas()
  const svgString = new XMLSerializer().serializeToString(svg)
  
  // Создаём файл для скачивания
  const dataBlob = new Blob([svgString], { type: 'image/svg+xml' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `gaznetcad-scheme-${new Date().toISOString().split('T')[0]}.svg`
  link.click()
  
  addLog('success', 'Схема экспортирована в SVG')
  showExportMenu.value = false
}

function exportAsPNG() {
  const canvas = document.querySelector('.canvas') as HTMLElement
  if (!canvas) {
    addLog('error', 'Канвас не найден')
    return
  }
  
  // Используем html2canvas для создания PNG
  import('html2canvas').then(html2canvas => {
    html2canvas.default(canvas, {
      background: '#0a0a0a',
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = `gaznetcad-scheme-${new Date().toISOString().split('T')[0]}.png`
          link.click()
          
          addLog('success', 'Схема экспортирована в PNG')
        }
      }, 'image/png')
    })
  }).catch(() => {
    addLog('error', 'Ошибка экспорта PNG. Установите html2canvas')
  })
  
  showExportMenu.value = false
}

function createSVGFromCanvas() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '1200')
  svg.setAttribute('height', '800')
  svg.setAttribute('viewBox', '0 0 1200 800')
  svg.style.backgroundColor = '#0a0a0a'
  
  // Добавляем сетку
  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
  pattern.setAttribute('id', 'grid')
  pattern.setAttribute('width', '20')
  pattern.setAttribute('height', '20')
  pattern.setAttribute('patternUnits', 'userSpaceOnUse')
  
  const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  gridLine.setAttribute('d', 'M 20 0 L 0 0 0 20')
  gridLine.setAttribute('fill', 'none')
  gridLine.setAttribute('stroke', 'rgba(0, 212, 255, 0.1)')
  gridLine.setAttribute('stroke-width', '1')
  
  pattern.appendChild(gridLine)
  grid.appendChild(pattern)
  svg.appendChild(grid)
  
  // Фон с сеткой
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  background.setAttribute('width', '100%')
  background.setAttribute('height', '100%')
  background.setAttribute('fill', 'url(#grid)')
  svg.appendChild(background)
  
  // Добавляем препятствия
  obstacles.value.forEach(obstacle => {
    const element = createSVGObstacle(obstacle)
    svg.appendChild(element)
  })
  
  // Добавляем соединения
  connections.value.forEach(connection => {
    const elements = createSVGConnection(connection)
    elements.forEach(element => svg.appendChild(element))
  })
  
  // Добавляем элементы трубопровода
  pipelineElements.value.forEach(element => {
    const svgElement = createSVGElement(element)
    svg.appendChild(svgElement)
  })
  
  // Добавляем измерения
  measurements.value.forEach(measurement => {
    const element = createSVGMeasurement(measurement)
    svg.appendChild(element)
  })
  
  return svg
}

function createSVGObstacle(obstacle: any) {
  if (obstacle.type === 'building') {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', obstacle.x.toString())
    rect.setAttribute('y', obstacle.y.toString())
    rect.setAttribute('width', obstacle.width.toString())
    rect.setAttribute('height', obstacle.height.toString())
    rect.setAttribute('fill', 'rgba(255, 71, 87, 0.2)')
    rect.setAttribute('stroke', '#ff4757')
    rect.setAttribute('stroke-width', '2')
    
    // Лейбл
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', (obstacle.x + obstacle.width / 2).toString())
    text.setAttribute('y', (obstacle.y + obstacle.height / 2).toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'middle')
    text.setAttribute('fill', '#ff4757')
    text.setAttribute('font-size', '10')
    text.textContent = obstacle.name
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.appendChild(rect)
    group.appendChild(text)
    return group
  } else if (obstacle.type === 'tree') {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', obstacle.x.toString())
    circle.setAttribute('cy', obstacle.y.toString())
    circle.setAttribute('r', obstacle.radius.toString())
    circle.setAttribute('fill', 'rgba(46, 213, 115, 0.2)')
    circle.setAttribute('stroke', '#2ed573')
    circle.setAttribute('stroke-width', '2')
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', obstacle.x.toString())
    text.setAttribute('y', (obstacle.y - obstacle.radius - 5).toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('fill', '#2ed573')
    text.setAttribute('font-size', '10')
    text.textContent = obstacle.name
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.appendChild(circle)
    group.appendChild(text)
    return group
  }
  
  return document.createElementNS('http://www.w3.org/2000/svg', 'g')
}

function createSVGConnection(connection: any) {
  const elements = []
  
  if (connection.segments && connection.segments.length > 0) {
    // Сложное соединение с сегментами
    connection.segments.forEach((segment: any) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', segment.start.x.toString())
      line.setAttribute('y1', segment.start.y.toString())
      line.setAttribute('x2', segment.end.x.toString())
      line.setAttribute('y2', segment.end.y.toString())
      line.setAttribute('stroke', segment.hasCollision ? '#ff4757' : '#00d4ff')
      line.setAttribute('stroke-width', '2')
      line.setAttribute('stroke-linecap', 'round')
      elements.push(line)
    })
  } else {
    // Простое соединение
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', connection.start.x.toString())
    line.setAttribute('y1', connection.start.y.toString())
    line.setAttribute('x2', connection.end.x.toString())
    line.setAttribute('y2', connection.end.y.toString())
    line.setAttribute('stroke', connection.hasCollision ? '#ff4757' : '#00d4ff')
    line.setAttribute('stroke-width', '2')
    line.setAttribute('stroke-linecap', 'round')
    elements.push(line)
  }
  
  return elements
}

function createSVGElement(element: any) {
  if (element.type === 'pipe') {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', element.x.toString())
    rect.setAttribute('y', element.y.toString())
    rect.setAttribute('width', '100')
    rect.setAttribute('height', '20')
    rect.setAttribute('rx', '10')
    rect.setAttribute('fill', 'url(#pipeGradient)')
    rect.setAttribute('stroke', '#00d4ff')
    rect.setAttribute('stroke-width', '2')
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', (element.x + 50).toString())
    text.setAttribute('y', (element.y + 10).toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'middle')
    text.setAttribute('fill', '#000')
    text.setAttribute('font-size', '10')
    text.textContent = element.name
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.appendChild(rect)
    group.appendChild(text)
    return group
  } else if (element.type === 'valve') {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', element.x.toString())
    circle.setAttribute('cy', element.y.toString())
    circle.setAttribute('r', '15')
    circle.setAttribute('fill', element.isOpen ? '#ff6b6b' : '#ff4757')
    circle.setAttribute('stroke', '#ff4757')
    circle.setAttribute('stroke-width', '2')
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', element.x.toString())
    text.setAttribute('y', element.y.toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'middle')
    text.setAttribute('fill', '#fff')
    text.setAttribute('font-size', '12')
    text.textContent = element.isOpen ? '🟢' : '🔴'
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.appendChild(circle)
    group.appendChild(text)
    return group
  }
  
  return document.createElementNS('http://www.w3.org/2000/svg', 'g')
}

function createSVGMeasurement(measurement: any) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('x1', measurement.start.x.toString())
  line.setAttribute('y1', measurement.start.y.toString())
  line.setAttribute('x2', measurement.end.x.toString())
  line.setAttribute('y2', measurement.end.y.toString())
  line.setAttribute('stroke', '#00ff88')
  line.setAttribute('stroke-width', '2')
  line.setAttribute('stroke-dasharray', '5,5')
  
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  const centerX = (measurement.start.x + measurement.end.x) / 2
  const centerY = (measurement.start.y + measurement.end.y) / 2 - 10
  text.setAttribute('x', centerX.toString())
  text.setAttribute('y', centerY.toString())
  text.setAttribute('text-anchor', 'middle')
  text.setAttribute('fill', '#00ff88')
  text.setAttribute('font-size', '10')
  text.textContent = `${measurement.value} м`
  
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.appendChild(line)
  group.appendChild(text)
  return group
}

// --- Импорт проектов ---
function importProject() {
  loadProject()
  showExportMenu.value = false
}

function loadProject() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target?.result as string)
          loadProjectData(projectData)
          addLog('success', 'Проект загружен')
        } catch (error) {
          addLog('error', 'Ошибка загрузки проекта')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

function loadProjectData(projectData: any) {
  if (projectData.parameters) projectParams.value = projectData.parameters
  if (projectData.elements) pipelineElements.value = projectData.elements
  if (projectData.obstacles) obstacles.value = projectData.obstacles
  if (projectData.connections) connections.value = projectData.connections
  if (projectData.measurements) measurements.value = projectData.measurements
  if (projectData.layers) layers.value = projectData.layers
  if (projectData.specification) specification.value = projectData.specification
  if (projectData.calculations) calculationResults.value = projectData.calculations
  if (projectData.calculationTable) calculationTable.value = projectData.calculationTable
  
  // Пересчитываем всё
  checkCollisions()
  calculateAll()
}

// --- Автосохранение ---
function setupAutoSave() {
  // Автосохранение каждые 5 минут
  setInterval(() => {
    const projectData = {
      name: 'Газопровод №1',
      timestamp: new Date().toISOString(),
      parameters: projectParams.value,
      elements: pipelineElements.value,
      obstacles: obstacles.value,
      connections: connections.value,
      measurements: measurements.value
    }
    
    localStorage.setItem('gaznetcad-autosave', JSON.stringify(projectData))
  }, 5 * 60 * 1000)
}

// --- Восстановление автосохранения ---
function restoreAutoSave() {
  const autoSaveData = localStorage.getItem('gaznetcad-autosave')
  if (autoSaveData) {
    try {
      const projectData = JSON.parse(autoSaveData)
      const autoSaveTime = new Date(projectData.timestamp)
      const now = new Date()
      const diffHours = (now.getTime() - autoSaveTime.getTime()) / (1000 * 60 * 60)
      
      if (diffHours < 24) { // Восстанавливаем только если автосохранение не старше 24 часов
        if (confirm('Найдено автосохранение. Восстановить?')) {
          loadProjectData(projectData)
          addLog('info', 'Проект восстановлен из автосохранения')
        }
      }
    } catch (error) {
      addLog('warning', 'Ошибка восстановления автосохранения')
    }
  }
}

// --- Переменные для меню экспорта ---
const showExportMenu = ref(false)

// --- Инициализация при загрузке ---
onMounted(() => {
  addLog('info', 'GazNetCAD загружен')
  calculateAll()
  loadProject() // Загружаем сохранённый проект если есть
  restoreAutoSave() // Проверяем автосохранение
  setupAutoSave() // Настраиваем автосохранение
})

// --- Улучшенная отрисовка сегментов и соединений ---
function createConnectionSegments(start: any, end: any, waypoints: any[] = []) {
  const points = [start, ...waypoints, end]
  const segments: Array<{
    id: string;
    start: any;
    end: any;
    isWaypoint: boolean;
    hasCollision: boolean;
  }> = []
  
  for (let i = 0; i < points.length - 1; i++) {
    const segment = {
      id: `segment-${Date.now()}-${i}`,
      start: points[i],
      end: points[i + 1],
      isWaypoint: i > 0 && i < points.length - 2,
      hasCollision: false
    }
    
    // Проверяем коллизии для каждого сегмента
    segment.hasCollision = obstacles.value.some(obstacle => 
      checkLineObstacleCollision(segment.start, segment.end, obstacle)
    )
    
    segments.push(segment)
  }
  
  return segments
}

function updateConnectionVisualization(connection: any) {
  if (!connection.segments) return
  
  // Обновляем визуальные свойства сегментов
  connection.segments.forEach((segment: any, index: number) => {
    segment.isWaypoint = index > 0 && index < connection.segments.length - 1
    segment.isFinal = index === connection.segments.length - 1
    segment.hasCollision = obstacles.value.some(obstacle => 
      checkLineObstacleCollision(segment.start, segment.end, obstacle)
    )
  })
}

// --- Анимация потока ---
function startFlowAnimation() {
  // Добавляем класс для анимации потока
  const flowingConnections = connections.value.filter(conn => !conn.hasCollision)
  flowingConnections.forEach(conn => {
    conn.isFlowing = true
  })
  
  addLog('info', 'Анимация потока запущена')
}

function stopFlowAnimation() {
  connections.value.forEach(conn => {
    conn.isFlowing = false
  })
  
  addLog('info', 'Анимация потока остановлена')
}

// --- Визуализация waypoints ---
function getWaypointStyle(waypoint: any, index: number) {
  return {
    position: 'absolute',
    left: `${waypoint.x - 4}px`,
    top: `${waypoint.y - 4}px`,
    width: '8px',
    height: '8px',
    backgroundColor: '#ffd43b',
    border: '2px solid #ffed4e',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(255, 212, 59, 0.8)',
    zIndex: 20,
    pointerEvents: 'none'
  }
}

// --- Улучшенная отрисовка соединений ---
function renderConnection(connection: any) {
  if (!connection.segments || connection.segments.length === 0) {
    // Простое прямое соединение
    return renderSimpleConnection(connection)
  } else {
    // Сложное соединение с waypoints
    return renderWaypointConnection(connection)
  }
}

function renderSimpleConnection(connection: any) {
  const dx = connection.end.x - connection.start.x
  const dy = connection.end.y - connection.start.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  
  let backgroundColor = 'linear-gradient(90deg, #00d4ff 0%, #0099cc 100%)'
  let boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)'
  
  if (connection.hasCollision) {
    backgroundColor = 'linear-gradient(90deg, #ff4757 0%, #ff6b6b 100%)'
    boxShadow = '0 0 20px rgba(255, 71, 87, 0.8)'
  } else if (connection.isFlowing) {
    backgroundColor = 'linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)'
    boxShadow = '0 0 15px rgba(0, 255, 136, 0.6)'
  }
  
  return {
    left: `${connection.start.x}px`,
    top: `${connection.start.y}px`,
    width: `${length}px`,
    height: '2px',
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 50%',
    background: backgroundColor,
    boxShadow: boxShadow,
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: connection.hasCollision ? 25 : 15
  }
}

function renderWaypointConnection(connection: any) {
  // Возвращаем массив элементов для рендеринга
  const elements = []
  
  // Рендерим сегменты
  connection.segments.forEach((segment: any) => {
    elements.push({
      type: 'segment',
      style: getSegmentStyle(segment),
      data: segment
    })
  })
  
  // Рендерим waypoints (кроме начальной и конечной точки)
  if (connection.waypoints) {
    connection.waypoints.forEach((waypoint: any, index: number) => {
      elements.push({
        type: 'waypoint',
        style: getWaypointStyle(waypoint, index),
        data: waypoint
      })
    })
  }
  
  return elements
}

// --- Улучшенная стилизация элементов ---
function getSelectedElementStyle(element: any) {
  const baseStyle = getElementStyle(element)
  
  return {
    ...baseStyle,
    outline: '2px solid #00d4ff',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
    transform: 'scale(1.05)',
    zIndex: 20
  }
}

// --- Анимации для элементов ---
function addElementAnimation(element: any, animationType: string) {
  element.animation = animationType
  
  // Удаляем анимацию через некоторое время
  setTimeout(() => {
    element.animation = null
  }, 2000)
}

// --- Неоновые эффекты ---
function getNeonEffect(color: string, intensity: number = 1) {
  return {
    boxShadow: `0 0 ${10 * intensity}px ${color}, 0 0 ${20 * intensity}px ${color}, 0 0 ${30 * intensity}px ${color}`,
    textShadow: `0 0 ${5 * intensity}px ${color}`
  }
}

// --- Стили для выбранного элемента ---
function getElementStateStyle(element: any, state: string) {
  const baseStyle = getElementStyle(element)
  
  switch (state) {
    case 'selected':
      return {
        ...baseStyle,
        outline: '2px solid #00d4ff',
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
        transform: 'scale(1.05)',
        zIndex: 20
      }
    case 'hover':
      return {
        ...baseStyle,
        transform: 'scale(1.1)',
        zIndex: 20,
        ...getNeonEffect('#00d4ff', 2)
      }
    case 'error':
      return {
        ...baseStyle,
        outline: '2px solid #ff4757',
        boxShadow: '0 0 20px rgba(255, 71, 87, 0.5)',
        zIndex: 25
      }
    case 'warning':
      return {
        ...baseStyle,
        outline: '2px solid #ffd43b',
        boxShadow: '0 0 20px rgba(255, 212, 59, 0.5)',
        zIndex: 20
      }
    case 'success':
      return {
        ...baseStyle,
        outline: '2px solid #00ff88',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
        zIndex: 20
      }
    default:
      return baseStyle
  }
}

// --- Обновлённые методы для экспорта/сохранения ---
function saveProject() {
  const projectData = {
    pipelineElements: pipelineElements.value,
    obstacles: obstacles.value,
    connections: connections.value,
    measurements: measurements.value,
    projectParams: projectParams.value,
    calculationResults: calculationResults.value,
    timestamp: new Date().toISOString()
  }
  
  const dataString = JSON.stringify(projectData, null, 2)
  const dataBlob = new Blob([dataString], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `gaznetcad-project-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  addLog('success', 'Проект сохранён')
  showExportMenu.value = false
}

</script> 

<style scoped>
.gaznetcad-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  color: #ffffff;
}

/* Header */
.app-header {
  height: 60px;
  background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 300px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-name {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.project-status {
  font-size: 12px;
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.toolbar {
  display: flex;
  gap: 8px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  color: #b0b0b0;
}

.tool-btn:hover {
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  border-color: #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
}

.tool-btn.active {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #000;
  border-color: #00d4ff;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.tool-btn .icon {
  font-size: 16px;
}

.tool-btn span:last-child {
  font-size: 12px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
}

.action-btn:hover {
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  border-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Workspace */
.workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebars */
.sidebar {
  width: 320px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  border-right: 1px solid #333;
  overflow-y: auto;
}

.right-sidebar {
  border-right: none;
  border-left: 1px solid #333;
}

.sidebar-section {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.sidebar-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.param-group, .prop-group {
  margin-bottom: 16px;
}

.param-group label, .prop-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #b0b0b0;
}

.param-group input, .param-group select,
.prop-group input, .prop-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 14px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #ffffff;
  transition: all 0.3s ease;
}

.param-group input:focus, .param-group select:focus,
.prop-group input:focus, .prop-group select:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.element-props {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-selection {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.calc-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #333;
}

.result-item strong {
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

/* Canvas Area */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
}

.canvas-toolbar {
  height: 50px;
  background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
}

.view-btn:hover, .view-btn.active {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #000;
  border-color: #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
}

.zoom-controls button:hover {
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.zoom-controls span {
  min-width: 60px;
  text-align: center;
  font-weight: 600;
  color: #00d4ff;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
}

.canvas-container.selecting {
  cursor: pointer;
}

.canvas-container.measuring {
  cursor: crosshair;
}

.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: top left;
}

/* Grid */
.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

/* Tool Indicator */
.tool-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #00d4ff;
  border: 1px solid #333;
  z-index: 1000;
}

/* Obstacles */
.obstacle {
  position: absolute;
  border: 2px solid;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.obstacle.building {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff4757;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.3);
}

.obstacle.tree {
  background: rgba(46, 213, 115, 0.2);
  border-color: #2ed573;
  box-shadow: 0 0 15px rgba(46, 213, 115, 0.3);
  border-radius: 50%;
}

.obstacle.underground {
  background: rgba(255, 165, 2, 0.2);
  border-color: #ffa502;
  box-shadow: 0 0 15px rgba(255, 165, 2, 0.3);
}

.obstacle.high-priority {
  border-width: 3px;
  box-shadow: 0 0 20px currentColor;
}

.obstacle-label {
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
}

/* Reroute Paths */
.reroute-path {
  position: absolute;
  height: 3px;
  background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  pointer-events: none;
  z-index: 5;
}

.reroute-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: #00ff88;
  white-space: nowrap;
}

/* Pipeline Elements */
.pipeline-element {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 15;
}

.pipeline-element:hover {
  transform: scale(1.1);
  z-index: 20;
}

.pipeline-element.selected {
  outline: 2px solid #00d4ff;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.pipe {
  width: 100px;
  height: 20px;
  background: linear-gradient(90deg, #00d4ff 0%, #0099cc 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.valve {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
}

.valve.closed {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
}

/* Connections */
.connection {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #00d4ff 0%, #0099cc 100%);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  pointer-events: none;
  transition: all 0.3s ease;
}

.connection.flowing {
  background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
  animation: flow 2s infinite;
}

.connection.collision {
  background: linear-gradient(90deg, #ff4757 0%, #ff6b6b 100%);
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.8);
  animation: pulse 1s infinite;
}

.connection::after {
  content: '';
  position: absolute;
  right: -5px;
  top: -2px;
  width: 0;
  height: 0;
  border-left: 6px solid currentColor;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

/* Waypoint Connections */
.waypoint-connection {
  position: relative;
  pointer-events: none;
}

.connection-segment {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  transition: all 0.3s ease;
}

.connection-segment.final {
  background: linear-gradient(90deg, #00d4ff 0%, #0099cc 100%);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

@keyframes flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Drawing Line */
.drawing-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #ffd43b 0%, #ffed4e 100%);
  box-shadow: 0 0 10px rgba(255, 212, 59, 0.5);
  pointer-events: none;
  z-index: 25;
}

/* Measurements */
.measurement {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  pointer-events: none;
}

.measurement-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #00ff88;
  white-space: nowrap;
}

/* Right Sidebar */
.right-sidebar {
  width: 280px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #333;
}

.tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
}

.tab.active {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #000;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.tab-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* Tables */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #333;
}

th {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #00d4ff;
  font-weight: 600;
}

tr:hover {
  background: rgba(0, 212, 255, 0.1);
}

/* Logs */
.logs-container {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 12px;
  border-left: 3px solid;
}

.log-item.info {
  background: rgba(0, 212, 255, 0.1);
  border-left-color: #00d4ff;
  color: #00d4ff;
}

.log-item.success {
  background: rgba(0, 255, 136, 0.1);
  border-left-color: #00ff88;
  color: #00ff88;
}

.log-item.warning {
  background: rgba(255, 212, 59, 0.1);
  border-left-color: #ffd43b;
  color: #ffd43b;
}

.log-item.error {
  background: rgba(255, 71, 87, 0.1);
  border-left-color: #ff4757;
  color: #ff4757;
}

.log-time {
  font-size: 10px;
  opacity: 0.7;
  margin-right: 8px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal h3 {
  margin: 0 0 20px 0;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.modal-content {
  margin-bottom: 20px;
}

.obstacle-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.obstacle-type-btn {
  padding: 12px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
  text-align: center;
}

.obstacle-type-btn:hover {
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  border-color: #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
  text-align: left;
  font-size: 14px;
}

.export-btn:hover {
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  border-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
}

.export-icon {
  font-size: 20px;
  min-width: 24px;
}

.modal-close-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
}

.modal-close-btn:hover {
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  border-color: #ff4757;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .sidebar {
    width: 280px;
  }
  
  .right-sidebar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .workspace {
    flex-direction: column;
  }
  
  .sidebar, .right-sidebar {
    width: 100%;
    height: 200px;
  }
}
</style> 