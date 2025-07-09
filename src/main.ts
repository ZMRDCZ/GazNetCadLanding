import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'
import { setupGlobalComponents } from './plugins/global-components'

// Import global styles
import './styles/main.scss'

// Localization setup
const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    ru: {
      app: {
        title: 'GazNetCAD',
        subtitle: 'Интерактивное проектирование газовых сетей',
        loading: 'Загрузка системы...'
      },
      kpi: {
        designTime: 'Время проектирования',
        errors: 'Количество ошибок',
        roi: 'Экономический эффект',
        efficiency: 'Эффективность процесса'
      },
      pipeline: {
        pressure: 'Давление',
        diameter: 'Диаметр',
        material: 'Материал',
        depth: 'Глубина заложения',
        route: 'Маршрут трассы'
      },
      controls: {
        calculate: 'Рассчитать',
        reset: 'Сбросить',
        export: 'Экспорт',
        save: 'Сохранить',
        load: 'Загрузить'
      }
    }
  }
})

// Pinia store setup
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Vue app initialization
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(MotionPlugin)

// Setup global components
setupGlobalComponents(app)

// Performance monitoring
// Performance monitoring - disabled for now due to TypeScript issues
// if (import.meta.env?.DEV) {
//   app.config.performance = true
// }

// Global error handling
app.config.errorHandler = (err, _vm, info) => {
  console.error('🚨 Global Error:', err, info)
  // Here you could send errors to monitoring service
}

// Mount app
app.mount('#app')

// Remove preloader after mount
const loader = document.querySelector('.app-loader')
if (loader) {
  setTimeout(() => {
    const loaderElement = loader as HTMLElement
    loaderElement.style.opacity = '0'
    loaderElement.style.transform = 'scale(0.8)'
    setTimeout(() => loader.remove(), 300)
  }, 500)
} 