import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Demo from '@/views/Demo.vue'
import Dashboard from '@/views/Dashboard.vue'
import ProjectManager from '@/views/ProjectManager.vue'
import Settings from '@/views/Settings.vue'
import About from '@/views/About.vue'
import Documentation from '@/views/Documentation.vue'
import Contact from '@/views/Contact.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
      meta: {
        title: 'GazNetCAD - Демонстрация проектирования газовых сетей'
      }
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
      meta: {
        title: 'GazNetCAD - Калькулятор трубопровода',
        requiresDemo: true
      }
    },
    {
      path: '/app',
      name: 'app',
      component: Dashboard,
      meta: {
        title: 'GazNetCAD - Проектирование трубопроводов',
        requiresAuth: true
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectManager,
      meta: {
        title: 'GazNetCAD - Управление проектами',
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
        title: 'GazNetCAD - Настройки',
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'GazNetCAD - О нас'
      }
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: Documentation,
      meta: {
        title: 'GazNetCAD - Документация'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: {
        title: 'GazNetCAD - Контакты'
      }
    },
    // Redirect old routes for compatibility
    {
      path: '/pipeline',
      redirect: '/app'
    },
    // Catch all 404s
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  next()
})

export default router 