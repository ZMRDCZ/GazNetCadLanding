import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types for KPI metrics
export interface KPIMetric {
  id: string
  type: 'time' | 'errors' | 'efficiency' | 'roi' | 'savings' | 'speed' | 'compliance'
  title: string
  subtitle?: string
  value: number
  previousValue?: number
  target?: number
  unit: string
  trend?: number // percentage change
  comparison?: {
    before: number
    after: number
    label?: string
  }
  progressRange?: [number, number]
  chartData?: number[]
  actionLabel?: string
  timestamp: Date
  isTracking: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'design' | 'quality' | 'economics' | 'performance'
  format: 'number' | 'percentage' | 'currency' | 'time' | 'decimal'
}

export interface KPITarget {
  metricId: string
  targetValue: number
  deadline?: Date
  description: string
  achievementRate: number // 0-100%
  status: 'not_started' | 'in_progress' | 'achieved' | 'overdue'
}

export interface KPIAlert {
  id: string
  metricId: string
  type: 'threshold' | 'trend' | 'target'
  severity: 'info' | 'warning' | 'critical'
  message: string
  threshold?: number
  condition: 'above' | 'below' | 'equal'
  isActive: boolean
  timestamp: Date
}

export const useKPIStore = defineStore('kpi', () => {
  // State
  const metrics = ref<KPIMetric[]>([])
  const targets = ref<KPITarget[]>([])
  const alerts = ref<KPIAlert[]>([])
  
  const isLoading = ref(false)
  const lastUpdated = ref<Date | null>(null)
  const updateInterval = ref<number | null>(null)
  const autoUpdate = ref(true)

  // Dashboard configuration
  const dashboardConfig = ref({
    refreshInterval: 30000, // 30 seconds
    showTrends: true,
    showComparisons: true,
    showAlerts: true,
    groupByCategory: false
  })

  // Computed properties
  const designMetrics = computed(() => 
    metrics.value.filter(m => m.category === 'design')
  )

  const qualityMetrics = computed(() => 
    metrics.value.filter(m => m.category === 'quality')
  )

  const economicsMetrics = computed(() => 
    metrics.value.filter(m => m.category === 'economics')
  )

  const performanceMetrics = computed(() => 
    metrics.value.filter(m => m.category === 'performance')
  )

  const activeAlerts = computed(() => 
    alerts.value.filter(alert => alert.isActive)
  )

  const criticalAlerts = computed(() => 
    activeAlerts.value.filter(alert => alert.severity === 'critical')
  )

  const overallPerformance = computed(() => {
    if (metrics.value.length === 0) return 0
    
    const metricsWithTargets = metrics.value.filter(m => m.target)
    if (metricsWithTargets.length === 0) return 0
    
    const totalAchievement = metricsWithTargets.reduce((sum, metric) => {
      const achievement = Math.min((metric.value / metric.target!) * 100, 100)
      return sum + achievement
    }, 0)
    
    return Math.round(totalAchievement / metricsWithTargets.length)
  })

  const trendingSummary = computed(() => {
    const improving = metrics.value.filter(m => m.trend && m.trend > 0).length
    const declining = metrics.value.filter(m => m.trend && m.trend < 0).length
    const stable = metrics.value.filter(m => !m.trend || m.trend === 0).length
    
    return { improving, declining, stable }
  })

  // Actions
  const initializeMetrics = () => {
    // Initialize with default GazNetCAD KPIs based on presentation data
    const defaultMetrics: Omit<KPIMetric, 'timestamp'>[] = [
      {
        id: 'design-time',
        type: 'time',
        title: 'Время проектирования',
        subtitle: 'Сокращение сроков на 35%',
        value: 36, // hours (down from 70 hours)
        previousValue: 70,
        target: 24,
        unit: 'ч',
        trend: -48.6, // 35% reduction
        comparison: {
          before: 70,
          after: 36,
          label: 'Традиционный vs GazNetCAD'
        },
        progressRange: [0, 120],
        chartData: [70, 65, 58, 52, 45, 41, 36],
        actionLabel: 'Подробнее',
        isTracking: true,
        priority: 'high',
        category: 'design',
        format: 'decimal'
      },
      {
        id: 'error-reduction',
        type: 'errors',
        title: 'Количество ошибок',
        subtitle: 'Снижение на 68%',
        value: 3,
        previousValue: 18,
        target: 2,
        unit: 'шт',
        trend: -83.3, // 68% reduction
        comparison: {
          before: 18,
          after: 3,
          label: 'На проект'
        },
        progressRange: [0, 25],
        chartData: [18, 16, 12, 8, 6, 4, 3],
        actionLabel: 'Анализ',
        isTracking: true,
        priority: 'high',
        category: 'quality',
        format: 'number'
      },
      {
        id: 'roi-annual',
        type: 'roi',
        title: 'Экономический эффект',
        subtitle: '12 млн ₽/год для МосОблГаз',
        value: 12.3,
        previousValue: 0,
        target: 15,
        unit: 'млн ₽',
        trend: 100,
        comparison: {
          before: 0,
          after: 12.3,
          label: 'Годовая экономия'
        },
        progressRange: [0, 20],
        chartData: [0, 2.1, 4.8, 7.2, 9.6, 11.2, 12.3],
        actionLabel: 'Отчёт',
        isTracking: true,
        priority: 'high',
        category: 'economics',
        format: 'currency'
      },
      {
        id: 'automation-level',
        type: 'efficiency',
        title: 'Уровень автоматизации',
        subtitle: 'Автоматический роутинг и расчеты',
        value: 87,
        previousValue: 15,
        target: 95,
        unit: '%',
        trend: 480, // 480% increase
        comparison: {
          before: 15,
          after: 87,
          label: 'Автоматизированных процессов'
        },
        progressRange: [0, 100],
        chartData: [15, 25, 38, 52, 68, 78, 87],
        actionLabel: 'Настройки',
        isTracking: true,
        priority: 'medium',
        category: 'performance',
        format: 'percentage'
      },
      {
        id: 'compliance-rate',
        type: 'compliance',
        title: 'Соответствие нормативам',
        subtitle: 'СП 62-104-2022, СП 101-2003',
        value: 98.5,
        previousValue: 82,
        target: 100,
        unit: '%',
        trend: 20.1,
        comparison: {
          before: 82,
          after: 98.5,
          label: 'Автоматическая проверка'
        },
        progressRange: [70, 100],
        chartData: [82, 85, 89, 92, 95, 97, 98.5],
        actionLabel: 'Проверить',
        isTracking: true,
        priority: 'high',
        category: 'quality',
        format: 'percentage'
      },
      {
        id: 'processing-speed',
        type: 'speed',
        title: 'Скорость обработки',
        subtitle: 'Расчет трассы за секунды',
        value: 5.2,
        previousValue: 45,
        target: 3,
        unit: 'сек',
        trend: -88.4,
        comparison: {
          before: 45,
          after: 5.2,
          label: 'Время расчета'
        },
        progressRange: [0, 60],
        chartData: [45, 38, 28, 18, 12, 8, 5.2],
        actionLabel: 'Оптимизация',
        isTracking: true,
        priority: 'medium',
        category: 'performance',
        format: 'decimal'
      }
    ]

    metrics.value = defaultMetrics.map(metric => ({
      ...metric,
      timestamp: new Date()
    }))

    // Initialize targets
    targets.value = metrics.value.filter(m => m.target).map(metric => ({
      metricId: metric.id,
      targetValue: metric.target!,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      description: `Достичь целевого значения ${metric.target}${metric.unit}`,
      achievementRate: Math.min((metric.value / metric.target!) * 100, 100),
      status: metric.value >= metric.target! ? 'achieved' : 'in_progress'
    }))

    lastUpdated.value = new Date()
  }

  const loadMetrics = async () => {
    isLoading.value = true
    
    try {
      // In real app, this would fetch from API
      // For now, initialize with defaults if empty
      if (metrics.value.length === 0) {
        initializeMetrics()
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      lastUpdated.value = new Date()
    } finally {
      isLoading.value = false
    }
  }

  const updateMetric = (metricId: string, newValue: number) => {
    const metric = metrics.value.find(m => m.id === metricId)
    if (!metric) return false

    const oldValue = metric.value
    metric.previousValue = oldValue
    metric.value = newValue
    metric.timestamp = new Date()

    // Calculate trend
    if (metric.previousValue !== undefined) {
      metric.trend = ((newValue - metric.previousValue) / metric.previousValue) * 100
    }

    // Update target achievement
    updateTargetAchievement(metricId)

    // Check alerts
    checkAlerts(metricId, newValue, oldValue)

    lastUpdated.value = new Date()
    return true
  }

  const addMetric = (metric: Omit<KPIMetric, 'id' | 'timestamp'>) => {
    const newMetric: KPIMetric = {
      ...metric,
      id: generateId(),
      timestamp: new Date()
    }

    metrics.value.push(newMetric)
    return newMetric.id
  }

  const removeMetric = (metricId: string) => {
    metrics.value = metrics.value.filter(m => m.id !== metricId)
    targets.value = targets.value.filter(t => t.metricId !== metricId)
    alerts.value = alerts.value.filter(a => a.metricId !== metricId)
  }

  const setTarget = (metricId: string, targetValue: number, deadline?: Date) => {
    const existingTarget = targets.value.find(t => t.metricId === metricId)
    
    if (existingTarget) {
      existingTarget.targetValue = targetValue
      existingTarget.deadline = deadline
      updateTargetAchievement(metricId)
    } else {
      const newTarget: KPITarget = {
        metricId,
        targetValue,
        deadline,
        description: `Достичь ${targetValue}`,
        achievementRate: 0,
        status: 'not_started'
      }
      targets.value.push(newTarget)
    }

    // Update metric target
    const metric = metrics.value.find(m => m.id === metricId)
    if (metric) {
      metric.target = targetValue
    }
  }

  const updateTargetAchievement = (metricId: string) => {
    const target = targets.value.find(t => t.metricId === metricId)
    const metric = metrics.value.find(m => m.id === metricId)
    
    if (!target || !metric || !metric.target) return

    const achievementRate = Math.min((metric.value / metric.target) * 100, 100)
    target.achievementRate = achievementRate

    // Update status
    if (achievementRate >= 100) {
      target.status = 'achieved'
    } else if (target.deadline && new Date() > target.deadline) {
      target.status = 'overdue'
    } else if (achievementRate > 0) {
      target.status = 'in_progress'
    } else {
      target.status = 'not_started'
    }
  }

  const addAlert = (alert: Omit<KPIAlert, 'id' | 'timestamp' | 'isActive'>) => {
    const newAlert: KPIAlert = {
      ...alert,
      id: generateId(),
      timestamp: new Date(),
      isActive: true
    }

    alerts.value.push(newAlert)
    return newAlert.id
  }

  const checkAlerts = (metricId: string, newValue: number, oldValue: number) => {
    const metric = metrics.value.find(m => m.id === metricId)
    if (!metric) return

    // Check threshold alerts
    alerts.value.forEach(alert => {
      if (alert.metricId !== metricId || alert.type !== 'threshold' || !alert.threshold) return

      const shouldTrigger = alert.condition === 'above' 
        ? newValue > alert.threshold
        : alert.condition === 'below'
        ? newValue < alert.threshold
        : newValue === alert.threshold

      if (shouldTrigger && !alert.isActive) {
        alert.isActive = true
        alert.timestamp = new Date()
      } else if (!shouldTrigger && alert.isActive) {
        alert.isActive = false
      }
    })

    // Auto-create alerts for significant changes
    if (Math.abs(newValue - oldValue) > oldValue * 0.2) { // 20% change
      const alertType = newValue > oldValue ? 'Значительное улучшение' : 'Значительное снижение'
      const severity = newValue > oldValue ? 'info' : 'warning'
      
      addAlert({
        metricId,
        type: 'trend',
        severity: severity as 'info' | 'warning',
        message: `${alertType} показателя "${metric.title}": ${oldValue}${metric.unit} → ${newValue}${metric.unit}`,
        condition: 'above'
      })
    }
  }

  const dismissAlert = (alertId: string) => {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.isActive = false
    }
  }

  const clearOldAlerts = () => {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours
    alerts.value = alerts.value.filter(alert => 
      alert.isActive || alert.timestamp > cutoffDate
    )
  }

  const updateChartData = (metricId: string, newDataPoint: number) => {
    const metric = metrics.value.find(m => m.id === metricId)
    if (!metric) return

    if (!metric.chartData) {
      metric.chartData = []
    }

    metric.chartData.push(newDataPoint)
    
    // Keep only last 20 data points
    if (metric.chartData.length > 20) {
      metric.chartData = metric.chartData.slice(-20)
    }
  }

  const startAutoUpdate = () => {
    if (updateInterval.value) return

    updateInterval.value = window.setInterval(() => {
      if (!autoUpdate.value) return

      // Simulate real-time updates with small variations
      metrics.value.forEach(metric => {
        if (!metric.isTracking) return

        const variation = (Math.random() - 0.5) * 0.05 // ±2.5% variation
        const newValue = Math.max(0, metric.value * (1 + variation))
        
        updateMetric(metric.id, parseFloat(newValue.toFixed(2)))
        updateChartData(metric.id, newValue)
      })

      clearOldAlerts()
    }, dashboardConfig.value.refreshInterval)
  }

  const stopAutoUpdate = () => {
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
  }

  const exportMetrics = (format: 'json' | 'csv' | 'excel') => {
    const exportData = {
      metrics: metrics.value,
      targets: targets.value,
      alerts: alerts.value,
      summary: {
        overallPerformance: overallPerformance.value,
        trending: trendingSummary.value,
        lastUpdated: lastUpdated.value
      },
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
    link.download = `gaznetcad_kpi_${format}_${Date.now()}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
  }

  const resetMetrics = () => {
    metrics.value = []
    targets.value = []
    alerts.value = []
    lastUpdated.value = null
    initializeMetrics()
  }

  const calculateROI = (investmentCost: number, savings: number, timeframe: number) => {
    // Calculate ROI based on GazNetCAD benefits
    const roi = ((savings * timeframe - investmentCost) / investmentCost) * 100
    updateMetric('roi-annual', savings)
    return roi
  }

  // Utility functions
  const generateId = () => {
    return `kpi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const formatMetricValue = (metric: KPIMetric): string => {
    switch (metric.format) {
      case 'currency':
        return `${metric.value.toFixed(1)} ${metric.unit}`
      case 'percentage':
        return `${metric.value.toFixed(1)}${metric.unit}`
      case 'time':
        return metric.value < 1 
          ? `${(metric.value * 60).toFixed(0)} мин`
          : `${metric.value.toFixed(1)} ${metric.unit}`
      case 'decimal':
        return `${metric.value.toFixed(1)} ${metric.unit}`
      default:
        return `${Math.round(metric.value)} ${metric.unit}`
    }
  }

  // Return store interface
  return {
    // State
    metrics,
    targets,
    alerts,
    isLoading,
    lastUpdated,
    autoUpdate,
    dashboardConfig,

    // Computed
    designMetrics,
    qualityMetrics,
    economicsMetrics,
    performanceMetrics,
    activeAlerts,
    criticalAlerts,
    overallPerformance,
    trendingSummary,

    // Actions
    loadMetrics,
    updateMetric,
    addMetric,
    removeMetric,
    setTarget,
    addAlert,
    dismissAlert,
    clearOldAlerts,
    updateChartData,
    startAutoUpdate,
    stopAutoUpdate,
    exportMetrics,
    resetMetrics,
    calculateROI,
    formatMetricValue
  }
}, {
  persist: {
    key: 'gaznetcad-kpi',
    paths: ['metrics', 'targets', 'dashboardConfig'],
    storage: localStorage
  }
}) 