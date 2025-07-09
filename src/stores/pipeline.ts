import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export interface PipelinePoint {
  id: string
  x: number
  y: number
  z: number
  elevation?: number
  type?: 'start' | 'end' | 'junction' | 'valve' | 'reducer'
}

export interface PipelineSegment {
  id: string
  startPointId: string
  endPointId: string
  diameter: number // mm
  material: 'PE100' | 'Steel' | 'PVC'
  pressure: number // MPa
  length: number // m
  sdr?: number // for PE pipes
  wallThickness?: number // mm
  roughness?: number // mm
  insulationType?: string
  depthMin?: number // m
  depthMax?: number // m
  isSelected?: boolean
}

export interface PipelineData {
  id: string
  name: string
  description?: string
  points: PipelinePoint[]
  segments: PipelineSegment[]
  designPressure: number // MPa
  operatingPressure: number // MPa
  designTemperature: number // °C
  operatingTemperature: number // °C
  medium: 'natural_gas' | 'propane' | 'air'
  flowRate: number // m³/h
  created: Date
  modified: Date
  version: number
}

export interface PipelineParams {
  pressure: number
  temperature: number
  flowRate: number
  roughness: number
  safetyFactor: number
  designLife: number // years
  soilType: string
  region: string
  climate: string
}

export interface CalculationConstraints {
  maxPressureDrop: number // %
  minVelocity: number // m/s
  maxVelocity: number // m/s
  minDepth: number // m
  maxDepth: number // m
  bendRadius: number // multiple of diameter
  supportSpacing: number // m
}

export const usePipelineStore = defineStore('pipeline', () => {
  // State
  const currentPipeline = ref<PipelineData>({
    id: '',
    name: 'Новый проект',
    points: [],
    segments: [],
    designPressure: 0.4,
    operatingPressure: 0.3,
    designTemperature: 20,
    operatingTemperature: 15,
    medium: 'natural_gas',
    flowRate: 100,
    created: new Date(),
    modified: new Date(),
    version: 1
  })

  const currentParams = ref<PipelineParams>({
    pressure: 0.4,
    temperature: 15,
    flowRate: 100,
    roughness: 0.01,
    safetyFactor: 1.5,
    designLife: 50,
    soilType: 'clay',
    region: 'moscow',
    climate: 'temperate'
  })

  const constraints = ref<CalculationConstraints>({
    maxPressureDrop: 5,
    minVelocity: 1,
    maxVelocity: 20,
    minDepth: 0.8,
    maxDepth: 2.0,
    bendRadius: 40,
    supportSpacing: 3
  })

  const routePoints = ref<PipelinePoint[]>([])
  const selectedPoints = ref<string[]>([])
  const selectedSegments = ref<string[]>([])
  
  const isLoading = ref(false)
  const isDirty = ref(false)
  const lastSaved = ref<Date | null>(null)
  const validationErrors = ref<Array<{ field: string, message: string }>>([])

  // Computed
  const totalLength = computed(() => {
    return currentPipeline.value.segments.reduce((total, segment) => {
      return total + segment.length
    }, 0)
  })

  const averagePressure = computed(() => {
    const segments = currentPipeline.value.segments
    if (segments.length === 0) return 0
    
    const totalPressure = segments.reduce((sum, segment) => sum + segment.pressure, 0)
    return totalPressure / segments.length
  })

  const materialDistribution = computed(() => {
    const distribution: Record<string, number> = {}
    currentPipeline.value.segments.forEach(segment => {
      distribution[segment.material] = (distribution[segment.material] || 0) + segment.length
    })
    return distribution
  })

  const isValid = computed(() => {
    return validationErrors.value.length === 0 && 
           currentPipeline.value.points.length >= 2 &&
           currentPipeline.value.segments.length >= 1
  })

  const hasUnsavedChanges = computed(() => isDirty.value)

  // Actions
  const initializeDefault = async () => {
    const defaultPoints: PipelinePoint[] = [
      { id: 'p1', x: 0, y: 0, z: 0, type: 'start' },
      { id: 'p2', x: 100, y: 0, z: 0, type: 'junction' },
      { id: 'p3', x: 200, y: 50, z: 0, type: 'end' }
    ]

    const defaultSegments: PipelineSegment[] = [
      {
        id: 's1',
        startPointId: 'p1',
        endPointId: 'p2',
        diameter: 110,
        material: 'PE100',
        pressure: 0.4,
        length: 100,
        sdr: 11
      },
      {
        id: 's2',
        startPointId: 'p2',
        endPointId: 'p3',
        diameter: 110,
        material: 'PE100',
        pressure: 0.35,
        length: 111.8, // sqrt(100² + 50²)
        sdr: 11
      }
    ]

    currentPipeline.value = {
      ...currentPipeline.value,
      id: generateId(),
      points: defaultPoints,
      segments: defaultSegments
    }

    routePoints.value = [...defaultPoints]
    validatePipeline()
  }

  const addPoint = (point: Omit<PipelinePoint, 'id'>) => {
    const newPoint: PipelinePoint = {
      ...point,
      id: generateId()
    }
    
    currentPipeline.value.points.push(newPoint)
    routePoints.value.push(newPoint)
    markAsDirty()
    validatePipeline()
    
    return newPoint.id
  }

  const updatePoint = (pointId: string, updates: Partial<PipelinePoint>) => {
    const pointIndex = currentPipeline.value.points.findIndex(p => p.id === pointId)
    if (pointIndex === -1) return false

    currentPipeline.value.points[pointIndex] = {
      ...currentPipeline.value.points[pointIndex],
      ...updates
    }

    // Update route points
    const routeIndex = routePoints.value.findIndex(p => p.id === pointId)
    if (routeIndex !== -1) {
      routePoints.value[routeIndex] = {
        ...routePoints.value[routeIndex],
        ...updates
      }
    }

    markAsDirty()
    validatePipeline()
    return true
  }

  const removePoint = (pointId: string) => {
    // Remove point
    currentPipeline.value.points = currentPipeline.value.points.filter(p => p.id !== pointId)
    routePoints.value = routePoints.value.filter(p => p.id !== pointId)
    
    // Remove segments connected to this point
    currentPipeline.value.segments = currentPipeline.value.segments.filter(
      s => s.startPointId !== pointId && s.endPointId !== pointId
    )

    markAsDirty()
    validatePipeline()
  }

  const addSegment = (segment: Omit<PipelineSegment, 'id' | 'length'>) => {
    const startPoint = currentPipeline.value.points.find(p => p.id === segment.startPointId)
    const endPoint = currentPipeline.value.points.find(p => p.id === segment.endPointId)
    
    if (!startPoint || !endPoint) return null

    // Calculate length
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    const dz = endPoint.z - startPoint.z
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

    const newSegment: PipelineSegment = {
      ...segment,
      id: generateId(),
      length
    }

    currentPipeline.value.segments.push(newSegment)
    markAsDirty()
    validatePipeline()
    
    return newSegment.id
  }

  const updateSegment = (segmentId: string, updates: Partial<PipelineSegment>) => {
    const segmentIndex = currentPipeline.value.segments.findIndex(s => s.id === segmentId)
    if (segmentIndex === -1) return false

    currentPipeline.value.segments[segmentIndex] = {
      ...currentPipeline.value.segments[segmentIndex],
      ...updates
    }

    markAsDirty()
    validatePipeline()
    return true
  }

  const removeSegment = (segmentId: string) => {
    currentPipeline.value.segments = currentPipeline.value.segments.filter(s => s.id !== segmentId)
    markAsDirty()
    validatePipeline()
  }

  const updatePipeline = (pipelineData: Partial<PipelineData>) => {
    currentPipeline.value = {
      ...currentPipeline.value,
      ...pipelineData,
      modified: new Date(),
      version: currentPipeline.value.version + 1
    }
    markAsDirty()
    validatePipeline()
  }

  const updateParameter = (paramName: keyof PipelineParams, value: any) => {
    (currentParams.value as any)[paramName] = value
    markAsDirty()
    validatePipeline()
  }

  const updateRoutePoints = (points: PipelinePoint[]) => {
    routePoints.value = [...points]
    
    // Update pipeline points if they don't exist
    points.forEach(point => {
      const existingPoint = currentPipeline.value.points.find(p => p.id === point.id)
      if (!existingPoint) {
        currentPipeline.value.points.push(point)
      } else {
        Object.assign(existingPoint, point)
      }
    })
    
    markAsDirty()
    validatePipeline()
  }

  const selectPoint = (pointId: string, multiple = false) => {
    if (multiple) {
      if (selectedPoints.value.includes(pointId)) {
        selectedPoints.value = selectedPoints.value.filter(id => id !== pointId)
      } else {
        selectedPoints.value.push(pointId)
      }
    } else {
      selectedPoints.value = [pointId]
    }
  }

  const selectSegment = (segmentId: string, multiple = false) => {
    if (multiple) {
      if (selectedSegments.value.includes(segmentId)) {
        selectedSegments.value = selectedSegments.value.filter(id => id !== segmentId)
      } else {
        selectedSegments.value.push(segmentId)
      }
    } else {
      selectedSegments.value = [segmentId]
    }
  }

  const clearSelection = () => {
    selectedPoints.value = []
    selectedSegments.value = []
  }

  const validatePipeline = () => {
    const errors: Array<{ field: string, message: string }> = []

    // Check minimum points
    if (currentPipeline.value.points.length < 2) {
      errors.push({ field: 'points', message: 'Необходимо минимум 2 точки' })
    }

    // Check segments
    currentPipeline.value.segments.forEach((segment, index) => {
      // Check diameter
      if (segment.diameter < 32 || segment.diameter > 1400) {
        errors.push({ 
          field: `segments[${index}].diameter`, 
          message: `Диаметр ${segment.diameter}мм вне допустимого диапазона (32-1400мм)` 
        })
      }

      // Check pressure
      if (segment.pressure < 0.005 || segment.pressure > 1.6) {
        errors.push({ 
          field: `segments[${index}].pressure`, 
          message: `Давление ${segment.pressure}МПа вне допустимого диапазона (0.005-1.6МПа)` 
        })
      }

      // Check connected points exist
      const startExists = currentPipeline.value.points.some(p => p.id === segment.startPointId)
      const endExists = currentPipeline.value.points.some(p => p.id === segment.endPointId)
      
      if (!startExists || !endExists) {
        errors.push({ 
          field: `segments[${index}]`, 
          message: 'Сегмент не подключен к точкам' 
        })
      }
    })

    // Check parameters
    if (currentParams.value.flowRate <= 0) {
      errors.push({ field: 'flowRate', message: 'Расход должен быть больше 0' })
    }

    if (currentParams.value.pressure <= 0) {
      errors.push({ field: 'pressure', message: 'Давление должно быть больше 0' })
    }

    validationErrors.value = errors
  }

  const createNewProject = () => {
    const newPipeline: PipelineData = {
      id: generateId(),
      name: `Проект ${new Date().toLocaleDateString('ru-RU')}`,
      points: [],
      segments: [],
      designPressure: 0.4,
      operatingPressure: 0.3,
      designTemperature: 20,
      operatingTemperature: 15,
      medium: 'natural_gas',
      flowRate: 100,
      created: new Date(),
      modified: new Date(),
      version: 1
    }

    currentPipeline.value = newPipeline
    routePoints.value = []
    selectedPoints.value = []
    selectedSegments.value = []
    isDirty.value = false
    lastSaved.value = null
    validationErrors.value = []
  }

  const saveProject = async () => {
    if (!isValid.value) {
      throw new Error('Проект содержит ошибки и не может быть сохранен')
    }

    isLoading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, send to backend
      const dataToSave = {
        pipeline: currentPipeline.value,
        parameters: currentParams.value,
        constraints: constraints.value
      }
      
      // Save to localStorage as fallback
      localStorage.setItem(`gaznetcad_project_${currentPipeline.value.id}`, JSON.stringify(dataToSave))
      
      isDirty.value = false
      lastSaved.value = new Date()
      
      return currentPipeline.value.id
    } finally {
      isLoading.value = false
    }
  }

  const autoSave = async () => {
    if (!isDirty.value || !isValid.value) return
    
    try {
      await saveProject()
    } catch (error) {
      console.warn('Auto-save failed:', error)
    }
  }

  const loadProject = async (projectId: string) => {
    isLoading.value = true
    
    try {
      // In real app, fetch from backend
      const saved = localStorage.getItem(`gaznetcad_project_${projectId}`)
      
      if (saved) {
        const data = JSON.parse(saved)
        currentPipeline.value = data.pipeline
        currentParams.value = data.parameters
        constraints.value = data.constraints
        routePoints.value = [...data.pipeline.points]
        
        isDirty.value = false
        lastSaved.value = new Date(data.pipeline.modified)
        validatePipeline()
        
        return true
      }
      
      return false
    } finally {
      isLoading.value = false
    }
  }

  const exportProject = (format: 'dwg' | 'dxf' | 'json' | 'pdf') => {
    const exportData = {
      pipeline: currentPipeline.value,
      parameters: currentParams.value,
      constraints: constraints.value,
      metadata: {
        exportedAt: new Date(),
        format,
        version: '2.0.0'
      }
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `${currentPipeline.value.name}_${format}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
  }

  const markAsDirty = () => {
    isDirty.value = true
    currentPipeline.value.modified = new Date()
  }

  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Return store interface
  return {
    // State
    currentPipeline,
    currentParams,
    constraints,
    routePoints,
    selectedPoints,
    selectedSegments,
    isLoading,
    isDirty,
    lastSaved,
    validationErrors,

    // Computed
    totalLength,
    averagePressure,
    materialDistribution,
    isValid,
    hasUnsavedChanges,

    // Actions
    initializeDefault,
    addPoint,
    updatePoint,
    removePoint,
    addSegment,
    updateSegment,
    removeSegment,
    updatePipeline,
    updateParameter,
    updateRoutePoints,
    selectPoint,
    selectSegment,
    clearSelection,
    validatePipeline,
    createNewProject,
    saveProject,
    autoSave,
    loadProject,
    exportProject
  }
}, {
  persist: {
    key: 'gaznetcad-pipeline',
    paths: ['currentPipeline', 'currentParams', 'constraints'],
    storage: localStorage
  }
}) 