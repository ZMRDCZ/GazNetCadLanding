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
  background: linear-gradient(145deg, #0a0f1c 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 18px;
    padding: 2px;
    background: linear-gradient(45deg, 
      rgba(0, 255, 255, 0.3) 0%, 
      rgba(255, 0, 255, 0.3) 25%,
      rgba(0, 255, 127, 0.3) 50%,
      rgba(255, 215, 0, 0.3) 75%,
      rgba(0, 255, 255, 0.3) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: 1;
    animation: borderPulse 3s ease-in-out infinite;
  }
}

@keyframes borderPulse {
  0%, 100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.3) saturate(1.2);
  }
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
  position: relative;
  z-index: 2;
  
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
  background: linear-gradient(145deg, rgba(10, 15, 28, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  p {
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 500;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    animation: textGlow 2s ease-in-out infinite alternate;
  }
}

@keyframes textGlow {
  from {
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
  to {
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4);
  }
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid transparent;
  border-radius: 50%;
  position: relative;
  animation: spin 1s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top: 4px solid #00ffff;
    animation: spin 1.5s linear infinite reverse;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top: 3px solid #ff00ff;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.canvas-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 5;
}

.control-group {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    background: linear-gradient(45deg, 
      rgba(0, 255, 255, 0.1) 0%, 
      rgba(255, 0, 255, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
}

.control-btn {
  border: none;
  background: transparent;
  padding: 12px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(0, 255, 255, 0.2) 0%, 
      rgba(255, 0, 255, 0.2) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
  }
  
  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &.active {
    color: #ffffff;
    background: linear-gradient(45deg, #00ffff 0%, #ff00ff 100%);
    box-shadow: 
      0 4px 20px rgba(0, 255, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    &::before {
      opacity: 0;
    }
  }
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  min-width: 280px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 5;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: linear-gradient(45deg, 
      rgba(0, 255, 255, 0.1) 0%, 
      rgba(255, 0, 255, 0.1) 50%,
      rgba(0, 255, 127, 0.1) 100%
    );
    opacity: 0.5;
    z-index: -1;
  }
  
  h4 {
    margin: 0 0 16px 0;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
  
  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    padding: 8px;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
  }
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 500;
  }
  
  span {
    font-weight: 600;
    font-size: 15px;
    
    &.pressure-normal {
      color: #00ff80;
      text-shadow: 0 0 8px rgba(0, 255, 128, 0.5);
    }
    
    &.pressure-medium {
      color: #ffdd00;
      text-shadow: 0 0 8px rgba(255, 221, 0, 0.5);
    }
    
    &.pressure-high {
      color: #ff4444;
      text-shadow: 0 0 8px rgba(255, 68, 68, 0.5);
    }
  }
}

.stats-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  color: #00ffff;
  padding: 16px;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  z-index: 5;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 
    0 4px 20px rgba(0, 255, 255, 0.2),
    inset 0 1px 0 rgba(0, 255, 255, 0.1);
  
  div {
    margin-bottom: 4px;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

// Hover effects for interactive elements
.three-canvas:hover + .canvas-controls .control-group {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

// Responsive adjustments
@media (max-width: 768px) {
  .canvas-controls {
    top: 12px;
    right: 12px;
    gap: 8px;
  }
  
  .control-group {
    padding: 6px;
  }
  
  .control-btn {
    padding: 10px;
  }
  
  .info-panel {
    bottom: 12px;
    left: 12px;
    right: 12px;
    min-width: auto;
    padding: 20px;
  }
  
  .stats-panel {
    top: 12px;
    left: 12px;
    padding: 12px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .pipeline-canvas {
    border-radius: 16px;
  }
  
  .canvas-controls {
    top: 8px;
    right: 8px;
  }
  
  .info-panel {
    bottom: 8px;
    left: 8px;
    right: 8px;
    padding: 16px;
  }
  
  .stats-panel {
    top: 8px;
    left: 8px;
    padding: 10px;
  }
}
</style> 