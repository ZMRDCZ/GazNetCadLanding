import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export interface CalculationInput {
  pipeline: any
  parameters: any
  standard: string
  calculationType?: 'hydraulic' | 'thermal' | 'structural' | 'full'
}

export interface CalculationResults {
  id: string
  timestamp: Date
  standard: string
  calculationType: string
  
  // Hydraulic results
  pressureDrops: Array<{
    segmentId: string
    pressureDrop: number // Pa
    velocity: number // m/s
    reynoldsNumber: number
    frictionFactor: number
  }>
  
  // Flow characteristics
  flowDistribution: Array<{
    segmentId: string
    flowRate: number // m³/h
    direction: 'forward' | 'reverse'
  }>
  
  // Pressure profile
  pressureProfile: Array<{
    pointId: string
    pressure: number // MPa
    elevation: number // m
  }>
  
  // Validation results
  errors: Array<{
    type: 'warning' | 'error' | 'critical'
    code: string
    message: string
    segmentId?: string
    pointId?: string
    standard?: string
  }>
  
  warnings: Array<{
    type: 'performance' | 'safety' | 'standard'
    message: string
    recommendation?: string
  }>
  
  // Performance metrics
  efficiency: number // %
  totalPressureDrop: number // %
  maxVelocity: number // m/s
  minPressure: number // MPa
  
  // Material specifications
  materialRecommendations: Array<{
    segmentId: string
    recommendedDiameter: number // mm
    recommendedMaterial: string
    recommendedSDR?: number
    reason: string
  }>
  
  // Economic calculations
  estimatedCost: {
    materials: number // RUB
    installation: number // RUB
    total: number // RUB
    costPerMeter: number // RUB/m
  }
  
  // Compliance check
  compliance: {
    standard: string
    version: string
    overallCompliance: boolean
    checkedRequirements: Array<{
      requirement: string
      status: 'pass' | 'fail' | 'warning'
      value: number
      limit: number
      unit: string
    }>
  }
}

export interface CalculationHistory {
  id: string
  name: string
  timestamp: Date
  input: CalculationInput
  results: CalculationResults
  executionTime: number // ms
  status: 'success' | 'error' | 'warning'
}

export interface CalculationStandard {
  id: string
  name: string
  version: string
  description: string
  applicableRegion: string[]
  parameters: {
    maxPressure: number // MPa
    minPressure: number // MPa
    maxVelocity: number // m/s
    minDepth: number // m
    safetyFactors: {
      pressure: number
      temperature: number
      fatigue: number
    }
    materialProperties: {
      [material: string]: {
        allowableStress: number // MPa
        modulusOfElasticity: number // GPa
        thermalExpansion: number // 1/K
        roughness: number // mm
      }
    }
  }
}

// Worker for heavy calculations
let calculationWorker: Worker | null = null

export const useCalculationStore = defineStore('calculation', () => {
  // State
  const results = ref<CalculationResults | null>(null)
  const history = ref<CalculationHistory[]>([])
  const activeStandard = ref('SP-62-104-2022')
  const mode = ref<'design' | 'verification' | 'simulation'>('design')
  const autoCalculate = ref(true)
  
  const isCalculating = ref(false)
  const calculationProgress = ref(0)
  const lastCalculationTime = ref<Date | null>(null)
  const calculationError = ref<string | null>(null)

  // Available standards
  const standards = ref<CalculationStandard[]>([
    {
      id: 'SP-62-104-2022',
      name: 'СП 62.13330.2022',
      version: '2022',
      description: 'Газораспределительные системы',
      applicableRegion: ['RU'],
      parameters: {
        maxPressure: 1.6,
        minPressure: 0.005,
        maxVelocity: 20,
        minDepth: 0.8,
        safetyFactors: {
          pressure: 1.5,
          temperature: 1.2,
          fatigue: 2.0
        },
        materialProperties: {
          'PE100': {
            allowableStress: 8.0,
            modulusOfElasticity: 1.0,
            thermalExpansion: 0.0002,
            roughness: 0.01
          },
          'Steel': {
            allowableStress: 160,
            modulusOfElasticity: 210,
            thermalExpansion: 0.000012,
            roughness: 0.05
          }
        }
      }
    },
    {
      id: 'SP-101-2003',
      name: 'СП 101-2003',
      version: '2003',
      description: 'Гидравлический расчет трубопроводов',
      applicableRegion: ['RU'],
      parameters: {
        maxPressure: 1.2,
        minPressure: 0.003,
        maxVelocity: 15,
        minDepth: 0.6,
        safetyFactors: {
          pressure: 1.4,
          temperature: 1.1,
          fatigue: 1.8
        },
        materialProperties: {
          'PE100': {
            allowableStress: 7.5,
            modulusOfElasticity: 0.95,
            thermalExpansion: 0.00018,
            roughness: 0.01
          }
        }
      }
    },
    {
      id: 'GOST-R-58121',
      name: 'ГОСТ Р 58121-2018',
      version: '2018',
      description: 'Трубы полиэтиленовые',
      applicableRegion: ['RU'],
      parameters: {
        maxPressure: 1.0,
        minPressure: 0.005,
        maxVelocity: 12,
        minDepth: 0.7,
        safetyFactors: {
          pressure: 1.6,
          temperature: 1.3,
          fatigue: 2.2
        },
        materialProperties: {
          'PE100': {
            allowableStress: 8.0,
            modulusOfElasticity: 1.0,
            thermalExpansion: 0.0002,
            roughness: 0.007
          }
        }
      }
    }
  ])

  // Computed
  const currentStandard = computed(() => {
    return standards.value.find(s => s.id === activeStandard.value) || standards.value[0]
  })

  const hasResults = computed(() => results.value !== null)

  const calculationSummary = computed(() => {
    if (!results.value) return null
    
    return {
      totalErrors: results.value.errors.length,
      totalWarnings: results.value.warnings.length,
      overallCompliance: results.value.compliance.overallCompliance,
      efficiency: results.value.efficiency,
      executionTime: history.value[0]?.executionTime || 0
    }
  })

  const recentCalculations = computed(() => {
    return history.value.slice(0, 10).map(calc => ({
      id: calc.id,
      name: calc.name,
      timestamp: calc.timestamp,
      status: calc.status,
      standard: calc.input.standard,
      efficiency: calc.results.efficiency
    }))
  })

  // Actions
  const initializeWorker = () => {
    if (typeof Worker !== 'undefined' && !calculationWorker) {
      // In a real app, this would load the actual worker file
      // calculationWorker = new Worker(new URL('../workers/calculation.worker.ts', import.meta.url))
      
      // Mock worker for demonstration
      calculationWorker = {
        postMessage: (data: any) => {
          // Simulate calculation
          setTimeout(() => {
            const mockResults = generateMockResults(data)
            handleWorkerMessage({ data: { type: 'result', data: mockResults } } as any)
          }, 2000)
        },
        terminate: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      } as any
    }
  }

  const performCalculation = async (input: CalculationInput): Promise<CalculationResults> => {
    if (isCalculating.value) {
      throw new Error('Расчет уже выполняется')
    }

    isCalculating.value = true
    calculationProgress.value = 0
    calculationError.value = null

    try {
      const startTime = performance.now()
      
      // Initialize worker if needed
      if (!calculationWorker) {
        initializeWorker()
      }

      // Start calculation
      const calculationPromise = new Promise<CalculationResults>((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          const { type, data, progress, error } = event.data
          
          switch (type) {
            case 'progress':
              calculationProgress.value = progress
              break
            
            case 'result':
              resolve(data)
              break
            
            case 'error':
              reject(new Error(error))
              break
          }
        }

        if (calculationWorker) {
          calculationWorker.addEventListener('message', handleMessage)
          calculationWorker.postMessage({
            type: 'calculate',
            input,
            standard: currentStandard.value
          })
        }
      })

      // Perform calculation
      const calculationResults = await calculationPromise
      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Store results
      results.value = calculationResults
      lastCalculationTime.value = new Date()

      // Add to history
      const historyEntry: CalculationHistory = {
        id: generateId(),
        name: `Расчет ${new Date().toLocaleString('ru-RU')}`,
        timestamp: new Date(),
        input,
        results: calculationResults,
        executionTime,
        status: calculationResults.errors.some(e => e.type === 'critical') ? 'error' : 
                calculationResults.errors.some(e => e.type === 'error') ? 'warning' : 'success'
      }

      history.value.unshift(historyEntry)
      
      // Keep only last 50 calculations
      if (history.value.length > 50) {
        history.value = history.value.slice(0, 50)
      }

      return calculationResults

    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : 'Неизвестная ошибка'
      throw error
    } finally {
      isCalculating.value = false
      calculationProgress.value = 100
    }
  }

  const setActiveStandard = (standardId: string) => {
    const standard = standards.value.find(s => s.id === standardId)
    if (standard) {
      activeStandard.value = standardId
    }
  }

  const setCalculationMode = (newMode: 'design' | 'verification' | 'simulation') => {
    mode.value = newMode
  }

  const restoreCalculation = (calculationId: string) => {
    const calculation = history.value.find(c => c.id === calculationId)
    if (calculation) {
      results.value = calculation.results
      lastCalculationTime.value = calculation.timestamp
    }
  }

  const deleteCalculation = (calculationId: string) => {
    history.value = history.value.filter(c => c.id !== calculationId)
  }

  const exportResults = (format: 'pdf' | 'excel' | 'dwg' | 'json') => {
    if (!results.value) {
      throw new Error('Нет результатов для экспорта')
    }

    const exportData = {
      metadata: {
        timestamp: new Date(),
        format,
        standard: activeStandard.value,
        version: '2.0.0'
      },
      input: history.value[0]?.input,
      results: results.value
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `gaznetcad_results_${format}_${Date.now()}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
  }

  const validateInput = (input: CalculationInput): Array<{ field: string, message: string }> => {
    const errors: Array<{ field: string, message: string }> = []
    
    if (!input.pipeline?.segments?.length) {
      errors.push({ field: 'pipeline', message: 'Не задана трасса трубопровода' })
    }

    if (!input.parameters?.pressure || input.parameters.pressure <= 0) {
      errors.push({ field: 'pressure', message: 'Некорректное значение давления' })
    }

    if (!input.parameters?.flowRate || input.parameters.flowRate <= 0) {
      errors.push({ field: 'flowRate', message: 'Некорректное значение расхода' })
    }

    const standard = standards.value.find(s => s.id === input.standard)
    if (!standard) {
      errors.push({ field: 'standard', message: 'Неизвестный нормативный документ' })
    } else {
      // Validate against standard limits
      if (input.parameters.pressure > standard.parameters.maxPressure) {
        errors.push({ 
          field: 'pressure', 
          message: `Давление превышает максимальное значение по ${standard.name}` 
        })
      }
    }

    return errors
  }

  const generateCalculationReport = () => {
    if (!results.value) return null

    return {
      title: `Отчет по расчету газопровода`,
      subtitle: `Нормативный документ: ${currentStandard.value.name}`,
      timestamp: new Date(),
      sections: [
        {
          title: 'Исходные данные',
          content: history.value[0]?.input || {}
        },
        {
          title: 'Результаты гидравлического расчета',
          content: {
            pressureDrops: results.value.pressureDrops,
            flowDistribution: results.value.flowDistribution,
            maxVelocity: results.value.maxVelocity,
            totalPressureDrop: results.value.totalPressureDrop
          }
        },
        {
          title: 'Проверка соответствия нормативам',
          content: results.value.compliance
        },
        {
          title: 'Рекомендации',
          content: {
            materials: results.value.materialRecommendations,
            warnings: results.value.warnings
          }
        },
        {
          title: 'Экономическая оценка',
          content: results.value.estimatedCost
        }
      ]
    }
  }

  // Worker message handler
  const handleWorkerMessage = (event: MessageEvent) => {
    // This would be set up with the actual worker
    console.log('Worker message:', event.data)
  }

  // Mock results generator (for demonstration)
  const generateMockResults = (input: any): CalculationResults => {
    const segmentCount = input.input?.pipeline?.segments?.length || 3
    
    return {
      id: generateId(),
      timestamp: new Date(),
      standard: input.standard || activeStandard.value,
      calculationType: input.input?.calculationType || 'full',
      
      pressureDrops: Array.from({ length: segmentCount }, (_, i) => ({
        segmentId: `segment_${i}`,
        pressureDrop: 500 + Math.random() * 1000, // Pa
        velocity: 5 + Math.random() * 10, // m/s
        reynoldsNumber: 50000 + Math.random() * 100000,
        frictionFactor: 0.015 + Math.random() * 0.01
      })),
      
      flowDistribution: Array.from({ length: segmentCount }, (_, i) => ({
        segmentId: `segment_${i}`,
        flowRate: 80 + Math.random() * 40,
        direction: 'forward' as const
      })),
      
      pressureProfile: Array.from({ length: segmentCount + 1 }, (_, i) => ({
        pointId: `point_${i}`,
        pressure: 0.4 - (i * 0.02) + (Math.random() - 0.5) * 0.01,
        elevation: Math.random() * 2
      })),
      
      errors: Math.random() > 0.7 ? [{
        type: 'warning' as const,
        code: 'HIGH_VELOCITY',
        message: 'Скорость газа превышает рекомендуемое значение',
        segmentId: 'segment_1'
      }] : [],
      
      warnings: [{
        type: 'performance' as const,
        message: 'Рекомендуется увеличить диаметр трубы на участке 2',
        recommendation: 'Использовать трубу диаметром 160мм вместо 110мм'
      }],
      
      efficiency: 85 + Math.random() * 10,
      totalPressureDrop: 2.5 + Math.random() * 2,
      maxVelocity: 8 + Math.random() * 5,
      minPressure: 0.35 + Math.random() * 0.05,
      
      materialRecommendations: [{
        segmentId: 'segment_1',
        recommendedDiameter: 160,
        recommendedMaterial: 'PE100',
        recommendedSDR: 11,
        reason: 'Оптимизация по скорости потока'
      }],
      
      estimatedCost: {
        materials: 450000 + Math.random() * 100000,
        installation: 280000 + Math.random() * 50000,
        total: 730000 + Math.random() * 150000,
        costPerMeter: 3200 + Math.random() * 800
      },
      
      compliance: {
        standard: activeStandard.value,
        version: currentStandard.value.version,
        overallCompliance: Math.random() > 0.2,
        checkedRequirements: [
          {
            requirement: 'Максимальная скорость',
            status: Math.random() > 0.3 ? 'pass' : 'warning' as const,
            value: 8.5,
            limit: 20,
            unit: 'м/с'
          },
          {
            requirement: 'Минимальная глубина',
            status: 'pass' as const,
            value: 1.2,
            limit: 0.8,
            unit: 'м'
          }
        ]
      }
    }
  }

  const generateId = () => {
    return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Cleanup
  const cleanup = () => {
    if (calculationWorker) {
      calculationWorker.terminate()
      calculationWorker = null
    }
  }

  return {
    // State
    results,
    history,
    activeStandard,
    mode,
    autoCalculate,
    isCalculating,
    calculationProgress,
    lastCalculationTime,
    calculationError,
    standards,

    // Computed
    currentStandard,
    hasResults,
    calculationSummary,
    recentCalculations,

    // Actions
    performCalculation,
    setActiveStandard,
    setCalculationMode,
    restoreCalculation,
    deleteCalculation,
    exportResults,
    validateInput,
    generateCalculationReport,
    cleanup
  }
}, {
  persist: {
    key: 'gaznetcad-calculation',
    paths: ['history', 'activeStandard', 'mode', 'autoCalculate'],
    storage: localStorage
  }
}) 