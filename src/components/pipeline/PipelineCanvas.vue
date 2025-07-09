<template>
  <div ref="canvasContainer" class="pipeline-canvas">
    <!-- Canvas for Three.js -->
    <canvas 
      ref="canvasElement"
      class="three-canvas"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @wheel="handleWheel"
    />
    
    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Загрузка 3D модели...</p>
    </div>
    
    <!-- Controls overlay -->
    <div class="canvas-controls">
      <div class="control-group">
        <button 
          v-for="mode in viewModes" 
          :key="mode.id"
          :class="['control-btn', { active: currentViewMode === mode.id }]"
          @click="setViewMode(mode.id)"
          :title="mode.label"
        >
          <component :is="mode.icon" :size="20" />
        </button>
      </div>
      
      <div class="control-group">
        <button 
          class="control-btn"
          @click="resetCamera"
          title="Сбросить камеру"
        >
          <RotateCcw :size="20" />
        </button>
        
        <button 
          class="control-btn"
          @click="toggleAnimation"
          :title="animationPlaying ? 'Пауза' : 'Воспроизвести'"
        >
          <component :is="animationPlaying ? Pause : Play" :size="20" />
        </button>
        
        <button 
          class="control-btn"
          @click="captureScreenshot"
          title="Скриншот"
        >
          <Camera :size="20" />
        </button>
      </div>
    </div>
    
    <!-- Pipeline info panel -->
    <div v-if="selectedPipeSegment" class="info-panel">
      <h4>Участок трубопровода</h4>
      <div class="info-grid">
        <div class="info-item">
          <label>Диаметр:</label>
          <span>{{ selectedPipeSegment.diameter }}мм</span>
        </div>
        <div class="info-item">
          <label>Давление:</label>
          <span :class="getPressureClass(selectedPipeSegment.pressure)">
            {{ selectedPipeSegment.pressure.toFixed(3) }} МПа
          </span>
        </div>
        <div class="info-item">
          <label>Материал:</label>
          <span>{{ selectedPipeSegment.material }}</span>
        </div>
        <div class="info-item">
          <label>Длина:</label>
          <span>{{ selectedPipeSegment.length.toFixed(1) }}м</span>
        </div>
      </div>
      
      <button class="close-btn" @click="selectedPipeSegment = null">
        <X :size="16" />
      </button>
    </div>
    
    <!-- Performance stats (dev mode) -->
    <div v-if="showStats" class="stats-panel">
      <div>FPS: {{ fps }}</div>
      <div>Triangles: {{ triangleCount }}</div>
      <div>Draw calls: {{ drawCalls }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' // Disabled for now
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader' // Disabled for now
import { gsap } from 'gsap'
import { 
  Eye, 
  Layers, 
  Grid3X3, 
  RotateCcw, 
  Play, 
  Pause, 
  Camera,
  X 
} from 'lucide-vue-next'

// Props
interface Props {
  pipelineData?: any
  calculationMode?: string
}

const props = withDefaults(defineProps<Props>(), {
  pipelineData: () => ({}),
  calculationMode: 'design'
})

// Emits
const emit = defineEmits<{
  'pipeline-update': [data: any]
  'pressure-change': [pressure: number]
  'segment-select': [segment: any]
}>()

// Reactive state
const canvasContainer = ref<HTMLDivElement>()
const canvasElement = ref<HTMLCanvasElement>()
const isLoading = ref(true)
const currentViewMode = ref('3d')
const animationPlaying = ref(true)
const selectedPipeSegment = ref<any>(null)
const showStats = ref(false) // Disabled for now due to TypeScript issues

// Three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let pipelineGroup: THREE.Group
let gasParticles: THREE.Points
let animationMixer: THREE.AnimationMixer | undefined

// Performance monitoring
const fps = ref(0)
const triangleCount = ref(0)
const drawCalls = ref(0)

// Mouse interaction state
let isMouseDown = false
let isDragging = false
let mouseStartPos = { x: 0, y: 0 }

// View modes configuration
const viewModes = [
  { id: '3d', label: '3D вид', icon: Eye },
  { id: 'top', label: 'Вид сверху', icon: Layers },
  { id: 'grid', label: 'Сетка', icon: Grid3X3 }
]

// Computed properties
// const pipeSegments = computed(() => {
//   return props.pipelineData?.segments || []
// })

const gasFlowActive = computed(() => {
  return props.calculationMode === 'simulation' && animationPlaying.value
})

// Initialize Three.js scene
const initThreeJS = async () => {
  if (!canvasContainer.value || !canvasElement.value) return

  const container = canvasContainer.value
  const canvas = canvasElement.value

  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf7f9fa)
  scene.fog = new THREE.Fog(0xf7f9fa, 10, 1000)

  // Camera setup
  const aspect = container.clientWidth / container.clientHeight
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // Controls setup
  controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 2
  controls.maxDistance = 100
  controls.maxPolarAngle = Math.PI / 2

  // Lighting setup
  setupLighting()

  // Initialize pipeline group
  pipelineGroup = new THREE.Group()
  scene.add(pipelineGroup)

  // Create default pipeline if no data provided
  if (!props.pipelineData?.segments?.length) {
    createDefaultPipeline()
  }

  // Create gas particles system
  createGasParticles()

  // Start animation loop
  animate()

  isLoading.value = false
}

// Setup scene lighting
const setupLighting = () => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  // Main directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  scene.add(directionalLight)

  // Fill light
  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3)
  fillLight.position.set(-10, 5, -5)
  scene.add(fillLight)

  // Rim light
  const rimLight = new THREE.DirectionalLight(0xffca28, 0.2)
  rimLight.position.set(0, 0, -10)
  scene.add(rimLight)
}

// Create default pipeline for demonstration
const createDefaultPipeline = () => {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, 0, 2),
    new THREE.Vector3(10, 0, 1),
    new THREE.Vector3(15, 0, -1)
  ]

  const curve = new THREE.CatmullRomCurve3(points)
  createPipelineFromCurve(curve, {
    diameter: 0.2,
    material: 'PE100',
    pressure: 0.4
  })
}

// Create pipeline geometry from curve
const createPipelineFromCurve = (curve: THREE.CatmullRomCurve3, params: any) => {
  const tubeGeometry = new THREE.TubeGeometry(curve, 100, params.diameter / 2, 16, false)
  
  // Create material based on pressure
  const material = createPipeMaterial(params.pressure)
  
  const tubeMesh = new THREE.Mesh(tubeGeometry, material)
  tubeMesh.castShadow = true
  tubeMesh.receiveShadow = true
  
  // Add pipeline data for interaction
  tubeMesh.userData = {
    type: 'pipeline',
    diameter: params.diameter * 1000, // Convert to mm
    pressure: params.pressure,
    material: params.material,
    length: curve.getLength()
  }
  
  pipelineGroup.add(tubeMesh)
  
  // Create pressure indicators
  createPressureIndicators(curve, params.pressure)
}

// Create pressure-responsive material
const createPipeMaterial = (pressure: number) => {
  let color = new THREE.Color(0x4caf50) // Green for normal pressure
  
  if (pressure > 0.6) {
    color = new THREE.Color(0xff5722) // Red for high pressure
  } else if (pressure > 0.3) {
    color = new THREE.Color(0xff9800) // Orange for medium pressure
  }
  
  return new THREE.MeshPhongMaterial({
    color,
    shininess: 100,
    transparent: true,
    opacity: 0.9
  })
}

// Create pressure indicators along pipeline
const createPressureIndicators = (curve: THREE.CatmullRomCurve3, pressure: number) => {
  const indicatorCount = 8
  const indicatorGeometry = new THREE.SphereGeometry(0.05, 8, 6)
  
  for (let i = 0; i <= indicatorCount; i++) {
    const t = i / indicatorCount
    const point = curve.getPoint(t)
    // const tangent = curve.getTangent(t) // Unused variable
    
    // Create indicator material based on pressure
    const indicatorMaterial = new THREE.MeshBasicMaterial({
      color: pressure > 0.6 ? 0xff5722 : pressure > 0.3 ? 0xff9800 : 0x4caf50
    })
    
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial)
    indicator.position.copy(point)
    indicator.position.y += 0.15
    
    // Add pulsing animation for high pressure
    if (pressure > 0.6) {
      gsap.to(indicator.scale, {
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        x: 1.5,
        y: 1.5,
        z: 1.5
      })
    }
    
    pipelineGroup.add(indicator)
  }
}

// Create gas particles system
const createGasParticles = () => {
  const particleCount = 500
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  
  // Initialize particles along pipeline
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 20
    positions[i3 + 1] = Math.random() * 2
    positions[i3 + 2] = (Math.random() - 0.5) * 20
    
    velocities[i3] = (Math.random() - 0.5) * 0.02
    velocities[i3 + 1] = Math.random() * 0.01
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
  }
  
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x4caf50,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })
  
  gasParticles = new THREE.Points(particleGeometry, particleMaterial)
  gasParticles.visible = gasFlowActive.value
  scene.add(gasParticles)
}

// Update gas particles animation
const updateGasParticles = () => {
  if (!gasParticles || !gasFlowActive.value) return
  
  const positions = gasParticles.geometry.attributes.position.array as Float32Array
  const velocities = gasParticles.geometry.attributes.velocity.array as Float32Array
  
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += velocities[i]
    positions[i + 1] += velocities[i + 1]
    positions[i + 2] += velocities[i + 2]
    
    // Reset particles that move too far
    if (Math.abs(positions[i]) > 10) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = Math.random() * 2
      positions[i + 2] = (Math.random() - 0.5) * 20
    }
  }
  
  gasParticles.geometry.attributes.position.needsUpdate = true
}

// Animation loop
const animate = () => {
  requestAnimationFrame(animate)
  
  // Update controls
  controls.update()
  
  // Update gas particles
  if (animationPlaying.value) {
    updateGasParticles()
  }
  
  // Update animation mixer
  if (animationMixer && animationPlaying.value) {
    animationMixer.update(0.016) // 60 FPS
  }
  
  // Render scene
  renderer.render(scene, camera)
  
  // Update performance stats
  updateStats()
}

// Update performance statistics
const updateStats = () => {
  if (!showStats.value) return
  
  const info = renderer.info
  triangleCount.value = info.render.triangles
  drawCalls.value = info.render.calls
  
  // Calculate FPS (simplified)
  const now = performance.now()
  fps.value = Math.round(1000 / (now - (window as any).lastFrameTime || 16))
  ;(window as any).lastFrameTime = now
}

// Handle window resize
const handleResize = () => {
  if (!canvasContainer.value || !camera || !renderer) return
  
  const container = canvasContainer.value
  const aspect = container.clientWidth / container.clientHeight
  
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// Mouse interaction handlers
const handleMouseDown = (event: MouseEvent) => {
  isMouseDown = true
  mouseStartPos = { x: event.clientX, y: event.clientY }
}

const handleMouseMove = (event: MouseEvent) => {
  if (isMouseDown) {
    const deltaX = Math.abs(event.clientX - mouseStartPos.x)
    const deltaY = Math.abs(event.clientY - mouseStartPos.y)
    
    if (deltaX > 5 || deltaY > 5) {
      isDragging = true
    }
  }
}

const handleMouseUp = (event: MouseEvent) => {
  if (!isDragging) {
    handleClick(event)
  }
  
  isMouseDown = false
  isDragging = false
}

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
}

// Handle click interaction
const handleClick = (event: MouseEvent) => {
  if (!canvasElement.value || !camera) return
  
  const rect = canvasElement.value.getBoundingClientRect()
  const mouse = new THREE.Vector2()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  
  const intersects = raycaster.intersectObjects(pipelineGroup.children)
  
  if (intersects.length > 0) {
    const object = intersects[0].object
    if (object.userData.type === 'pipeline') {
      selectedPipeSegment.value = object.userData
      emit('segment-select', object.userData)
    }
  } else {
    selectedPipeSegment.value = null
  }
}

// Control methods
const setViewMode = (mode: string) => {
  currentViewMode.value = mode
  
  switch (mode) {
    case '3d':
      gsap.to(camera.position, {
        duration: 1,
        x: 10,
        y: 10,
        z: 10,
        ease: "power2.inOut"
      })
      break
    case 'top':
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 20,
        z: 0,
        ease: "power2.inOut"
      })
      break
    case 'grid':
      // Toggle grid visibility
      const grid = scene.getObjectByName('grid')
      if (grid) {
        scene.remove(grid)
      } else {
        const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc)
        gridHelper.name = 'grid'
        scene.add(gridHelper)
      }
      break
  }
}

const resetCamera = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: 10,
    y: 10,
    z: 10,
    ease: "power2.inOut"
  })
  gsap.to(controls.target, {
    duration: 1,
    x: 0,
    y: 0,
    z: 0,
    ease: "power2.inOut"
  })
}

const toggleAnimation = () => {
  animationPlaying.value = !animationPlaying.value
  gasParticles.visible = gasFlowActive.value
}

const captureScreenshot = () => {
  if (!renderer) return
  
  renderer.render(scene, camera)
  const dataURL = renderer.domElement.toDataURL('image/png')
  
  const link = document.createElement('a')
  link.download = 'gaznetcad-pipeline.png'
  link.href = dataURL
  link.click()
}

// Utility methods
const getPressureClass = (pressure: number) => {
  if (pressure > 0.6) return 'pressure-high'
  if (pressure > 0.3) return 'pressure-medium'
  return 'pressure-normal'
}

// Watch for pipeline data changes
watch(() => props.pipelineData, (newData: any) => {
  if (newData && pipelineGroup) {
    // Clear existing pipeline
    pipelineGroup.clear()
    
    // Create new pipeline from data
    if (newData.segments?.length) {
      newData.segments.forEach((segment: any) => {
        const points = segment.points.map((p: any) => new THREE.Vector3(p.x, p.y, p.z))
        const curve = new THREE.CatmullRomCurve3(points)
        createPipelineFromCurve(curve, segment)
      })
    }
    
    emit('pipeline-update', newData)
  }
}, { deep: true })

// Watch for gas flow visualization
watch(gasFlowActive, (active: boolean) => {
  if (gasParticles) {
    gasParticles.visible = active
  }
})

// Lifecycle hooks
onMounted(async () => {
  await initThreeJS()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  // Cleanup Three.js resources
  if (renderer) {
    renderer.dispose()
  }
  if (pipelineGroup) {
    pipelineGroup.clear()
  }
})
</script>

<style lang="scss" scoped>
.pipeline-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: $scene-background;
  border-radius: $radius-lg;
  overflow: hidden;
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(247, 249, 250, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  p {
    margin-top: $space-4;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $color-border;
  border-top: 3px solid $color-primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.canvas-controls {
  position: absolute;
  top: $space-4;
  right: $space-4;
  display: flex;
  gap: $space-2;
  z-index: 3;
}

.control-group {
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $space-1;
  box-shadow: $shadow-sm;
}

.control-btn {
  @include button-reset;
  padding: $space-2;
  border-radius: $radius-md;
  color: $color-text-secondary;
  transition: all $duration-fast $ease-out;
  
  &:hover {
    background: $color-surface-variant;
    color: $color-text-primary;
  }
  
  &.active {
    background: $color-primary;
    color: $color-text-on-primary;
  }
}

.info-panel {
  position: absolute;
  bottom: $space-4;
  left: $space-4;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $space-4;
  min-width: 250px;
  box-shadow: $shadow-lg;
  z-index: 3;
  
  h4 {
    margin: 0 0 $space-3 0;
    color: $color-text-primary;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }
  
  .close-btn {
    @include button-reset;
    position: absolute;
    top: $space-2;
    right: $space-2;
    padding: $space-1;
    border-radius: $radius-sm;
    color: $color-text-secondary;
    
    &:hover {
      background: $color-surface-variant;
      color: $color-text-primary;
    }
  }
}

.info-grid {
  display: grid;
  gap: $space-2;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  label {
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
  
  span {
    font-weight: $font-weight-medium;
    
    &.pressure-normal {
      color: $color-success;
    }
    
    &.pressure-medium {
      color: $color-warning;
    }
    
    &.pressure-high {
      color: $color-error;
    }
  }
}

.stats-panel {
  position: absolute;
  top: $space-4;
  left: $space-4;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: $space-2;
  border-radius: $radius-md;
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  z-index: 3;
  
  div {
    margin-bottom: 2px;
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-md) {
  .canvas-controls {
    top: $space-2;
    right: $space-2;
    gap: $space-1;
  }
  
  .info-panel {
    bottom: $space-2;
    left: $space-2;
    right: $space-2;
    min-width: auto;
  }
  
  .control-btn {
    padding: $space-1;
  }
}
</style> 