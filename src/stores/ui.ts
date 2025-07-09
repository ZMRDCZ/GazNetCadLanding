import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number // ms, 0 for persistent
  actions?: Array<{
    label: string
    action: () => void
    style?: 'primary' | 'secondary'
  }>
  timestamp: Date
  isRead: boolean
  category?: 'system' | 'calculation' | 'project' | 'export'
}

export interface Modal {
  id: string
  component: string
  props?: Record<string, any>
  options?: {
    closable?: boolean
    persistent?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    position?: 'center' | 'top' | 'bottom'
  }
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  accentColor: string
  fontSize: 'sm' | 'md' | 'lg'
  borderRadius: 'sm' | 'md' | 'lg'
  animations: boolean
  reducedMotion: boolean
}

export interface LayoutConfig {
  sidebarCollapsed: boolean
  sidebarWidth: number
  headerHeight: number
  showKPI: boolean
  showMinimap: boolean
  showGrid: boolean
  gridSize: number
  snapToGrid: boolean
  showRulers: boolean
}

export interface UserPreferences {
  language: 'ru' | 'en'
  dateFormat: 'DD.MM.YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  numberFormat: 'ru' | 'en'
  timezone: string
  autoSave: boolean
  autoSaveInterval: number // minutes
  confirmBeforeExit: boolean
  showTooltips: boolean
  keyboardShortcuts: boolean
  soundEnabled: boolean
}

export interface TourStep {
  target: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
}

export const useUIStore = defineStore('ui', () => {
  // State
  const notifications = ref<Notification[]>([])
  const modals = ref<Modal[]>([])
  const loadingStates = ref<Record<string, boolean>>({})
  
  const theme = ref<ThemeConfig>({
    mode: 'light',
    primaryColor: '#003f5c',
    accentColor: '#ffca28',
    fontSize: 'md',
    borderRadius: 'md',
    animations: true,
    reducedMotion: false
  })

  const layout = ref<LayoutConfig>({
    sidebarCollapsed: false,
    sidebarWidth: 280,
    headerHeight: 64,
    showKPI: true,
    showMinimap: false,
    showGrid: false,
    gridSize: 20,
    snapToGrid: false,
    showRulers: false
  })

  const preferences = ref<UserPreferences>({
    language: 'ru',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'ru',
    timezone: 'Europe/Moscow',
    autoSave: true,
    autoSaveInterval: 5,
    confirmBeforeExit: true,
    showTooltips: true,
    keyboardShortcuts: true,
    soundEnabled: false
  })

  // Tour system
  const tourActive = ref(false)
  const currentTourStep = ref(0)
  const tourSteps = ref<TourStep[]>([])
  const tourCompleted = ref<string[]>([])

  // App state
  const isAppReady = ref(false)
  const currentView = ref('pipeline')
  const fullscreenMode = ref(false)
  const keyboardShortcutsEnabled = ref(true)

  // Performance monitoring
  const performanceMetrics = ref({
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    lastUpdate: new Date()
  })

  // Computed
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.isRead)
  )

  const persistentNotifications = computed(() => 
    notifications.value.filter(n => n.duration === 0)
  )

  const hasActiveModal = computed(() => modals.value.length > 0)

  const currentModal = computed(() => 
    modals.value[modals.value.length - 1] || null
  )

  const isLoading = computed(() => 
    Object.values(loadingStates.value).some(state => state)
  )

  const themeVariables = computed(() => ({
    '--color-primary': theme.value.primaryColor,
    '--color-accent': theme.value.accentColor,
    '--font-size-base': theme.value.fontSize === 'sm' ? '14px' : 
                       theme.value.fontSize === 'lg' ? '18px' : '16px',
    '--border-radius': theme.value.borderRadius === 'sm' ? '4px' : 
                      theme.value.borderRadius === 'lg' ? '12px' : '8px'
  }))

  const isDarkMode = computed(() => {
    if (theme.value.mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value.mode === 'dark'
  })

  // Notification actions
  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      isRead: false,
      duration: notification.duration ?? (notification.type === 'error' ? 0 : 5000)
    }

    notifications.value.unshift(newNotification)

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }

    // Play sound if enabled
    if (preferences.value.soundEnabled) {
      playNotificationSound(notification.type)
    }

    return newNotification.id
  }

  const removeNotification = (notificationId: string) => {
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  }

  const markNotificationAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(notification => {
      notification.isRead = true
    })
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const clearReadNotifications = () => {
    notifications.value = notifications.value.filter(n => !n.isRead || n.duration === 0)
  }

  // Modal actions
  const showModal = (modal: Omit<Modal, 'id'>) => {
    const newModal: Modal = {
      ...modal,
      id: generateId(),
      options: {
        closable: true,
        persistent: false,
        size: 'md',
        position: 'center',
        ...modal.options
      }
    }

    modals.value.push(newModal)
    return newModal.id
  }

  const closeModal = (modalId?: string) => {
    if (modalId) {
      const index = modals.value.findIndex(m => m.id === modalId)
      if (index > -1) {
        modals.value.splice(index, 1)
      }
    } else {
      // Close top modal
      modals.value.pop()
    }
  }

  const closeAllModals = () => {
    modals.value = []
  }

  // Loading state management
  const setLoading = (key: string, loading: boolean) => {
    if (loading) {
      loadingStates.value[key] = true
    } else {
      delete loadingStates.value[key]
    }
  }

  const clearAllLoading = () => {
    loadingStates.value = {}
  }

  // Theme actions
  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    theme.value = { ...theme.value, ...newTheme }
    applyTheme()
  }

  const toggleDarkMode = () => {
    const newMode = theme.value.mode === 'dark' ? 'light' : 'dark'
    setTheme({ mode: newMode })
  }

  const applyTheme = () => {
    const root = document.documentElement
    
    // Apply CSS variables
    Object.entries(themeVariables.value).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    // Apply dark mode class
    if (isDarkMode.value) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    // Apply reduced motion
    if (theme.value.reducedMotion) {
      document.body.classList.add('reduce-motion')
    } else {
      document.body.classList.remove('reduce-motion')
    }
  }

  // Layout actions
  const setSidebarCollapsed = (collapsed: boolean) => {
    layout.value.sidebarCollapsed = collapsed
  }

  const toggleSidebar = () => {
    layout.value.sidebarCollapsed = !layout.value.sidebarCollapsed
  }

  const setLayoutConfig = (config: Partial<LayoutConfig>) => {
    layout.value = { ...layout.value, ...config }
  }

  // Preferences actions
  const setPreferences = (newPrefs: Partial<UserPreferences>) => {
    preferences.value = { ...preferences.value, ...newPrefs }
  }

  const setLanguage = (language: 'ru' | 'en') => {
    preferences.value.language = language
    document.documentElement.lang = language
  }

  // Tour system
  const startTour = (steps: TourStep[], tourId?: string) => {
    tourSteps.value = steps
    currentTourStep.value = 0
    tourActive.value = true
    
    if (tourId && !tourCompleted.value.includes(tourId)) {
      // Mark tour as started
    }
  }

  const nextTourStep = () => {
    if (currentTourStep.value < tourSteps.value.length - 1) {
      // Execute current step action if any
      const currentStep = tourSteps.value[currentTourStep.value]
      if (currentStep.action) {
        currentStep.action()
      }
      
      currentTourStep.value++
    } else {
      completeTour()
    }
  }

  const previousTourStep = () => {
    if (currentTourStep.value > 0) {
      currentTourStep.value--
    }
  }

  const completeTour = (tourId?: string) => {
    tourActive.value = false
    currentTourStep.value = 0
    tourSteps.value = []
    
    if (tourId && !tourCompleted.value.includes(tourId)) {
      tourCompleted.value.push(tourId)
    }
  }

  const skipTour = () => {
    completeTour()
  }

  // App lifecycle
  const setAppReady = (ready: boolean) => {
    isAppReady.value = ready
    
    if (ready) {
      applyTheme()
      setupKeyboardShortcuts()
      startPerformanceMonitoring()
    }
  }

  const setCurrentView = (view: string) => {
    currentView.value = view
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      fullscreenMode.value = true
    } else {
      document.exitFullscreen()
      fullscreenMode.value = false
    }
  }

  // Performance monitoring
  const updatePerformanceMetrics = (metrics: Partial<typeof performanceMetrics.value>) => {
    performanceMetrics.value = {
      ...performanceMetrics.value,
      ...metrics,
      lastUpdate: new Date()
    }
  }

  const startPerformanceMonitoring = () => {
    if (typeof window === 'undefined') return

    // Monitor FPS
    let lastTime = performance.now()
    let frameCount = 0

    const measureFPS = () => {
      const now = performance.now()
      frameCount++

      if (now - lastTime >= 1000) {
        updatePerformanceMetrics({ fps: frameCount })
        frameCount = 0
        lastTime = now
      }

      requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        updatePerformanceMetrics({
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        })
      }, 5000)
    }
  }

  // Utility functions
  const setupKeyboardShortcuts = () => {
    if (!preferences.value.keyboardShortcuts) return

    const shortcuts: Record<string, (e?: KeyboardEvent) => void> = {
      'Escape': (e) => {
        if (hasActiveModal.value) {
          closeModal()
        }
      },
      'F11': (e) => {
        e?.preventDefault()
        toggleFullscreen()
      },
      'Ctrl+Shift+D': (e) => {
        e?.preventDefault()
        toggleDarkMode()
      },
      'Ctrl+Shift+S': (e) => {
        e?.preventDefault()
        toggleSidebar()
      }
    }

    document.addEventListener('keydown', (e) => {
      if (!keyboardShortcutsEnabled.value) return

      const key = e.key
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const alt = e.altKey

      let shortcutKey = ''
      if (ctrl) shortcutKey += 'Ctrl+'
      if (shift) shortcutKey += 'Shift+'
      if (alt) shortcutKey += 'Alt+'
      shortcutKey += key

      const handler = shortcuts[shortcutKey]
      if (handler) {
        handler(e)
      }
    })
  }

  const playNotificationSound = (type: string) => {
    // In a real app, you would play actual sound files
    if ('AudioContext' in window) {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different tones for different notification types
      const frequencies = {
        success: 800,
        error: 400,
        warning: 600,
        info: 500
      }

      oscillator.frequency.value = frequencies[type as keyof typeof frequencies] || 500
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const generateId = () => {
    return `ui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const resetUI = () => {
    notifications.value = []
    modals.value = []
    loadingStates.value = {}
    tourActive.value = false
    currentTourStep.value = 0
    tourSteps.value = []
  }

  // Auto-save preferences
  const savePreferences = () => {
    localStorage.setItem('gaznetcad-preferences', JSON.stringify({
      theme: theme.value,
      layout: layout.value,
      preferences: preferences.value,
      tourCompleted: tourCompleted.value
    }))
  }

  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('gaznetcad-preferences')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.theme) theme.value = { ...theme.value, ...data.theme }
        if (data.layout) layout.value = { ...layout.value, ...data.layout }
        if (data.preferences) preferences.value = { ...preferences.value, ...data.preferences }
        if (data.tourCompleted) tourCompleted.value = data.tourCompleted
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error)
    }
  }

  // Return store interface
  return {
    // State
    notifications,
    modals,
    loadingStates,
    theme,
    layout,
    preferences,
    tourActive,
    currentTourStep,
    tourSteps,
    tourCompleted,
    isAppReady,
    currentView,
    fullscreenMode,
    keyboardShortcutsEnabled,
    performanceMetrics,

    // Computed
    unreadNotifications,
    persistentNotifications,
    hasActiveModal,
    currentModal,
    isLoading,
    themeVariables,
    isDarkMode,

    // Actions
    showNotification,
    removeNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    clearReadNotifications,
    showModal,
    closeModal,
    closeAllModals,
    setLoading,
    clearAllLoading,
    setTheme,
    toggleDarkMode,
    applyTheme,
    setSidebarCollapsed,
    toggleSidebar,
    setLayoutConfig,
    setPreferences,
    setLanguage,
    startTour,
    nextTourStep,
    previousTourStep,
    completeTour,
    skipTour,
    setAppReady,
    setCurrentView,
    toggleFullscreen,
    updatePerformanceMetrics,
    resetUI,
    savePreferences,
    loadPreferences,

    // Getters for specific preferences
    sidebarCollapsed: computed(() => layout.value.sidebarCollapsed),
    autoSave: computed(() => preferences.value.autoSave)
  }
}, {
  persist: {
    key: 'gaznetcad-ui',
    paths: ['theme', 'layout', 'preferences', 'tourCompleted'],
    storage: localStorage
  }
}) 