import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/Landing.vue'),
      meta: {
        title: 'GazNetCAD - Профессиональное проектирование газовых сетей'
      }
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        title: 'GazNetCAD - Демо версия',
        requiresDemo: true
      }
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        title: 'GazNetCAD - Проектирование трубопроводов',
        requiresAuth: true
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectManager.vue'),
      meta: {
        title: 'GazNetCAD - Управление проектами',
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: {
        title: 'GazNetCAD - Настройки',
        requiresAuth: true
      }
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/views/Pricing.vue'),
      meta: {
        title: 'GazNetCAD - Тарифы и цены'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: {
        title: 'GazNetCAD - О нас'
      }
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: () => import('@/views/Documentation.vue'),
      meta: {
        title: 'GazNetCAD - Документация'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
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

  // Check for demo access
  if (to.meta.requiresDemo) {
    // In a real app, you might check for demo access token
    console.log('Accessing demo mode')
  }

  // Check for authentication (placeholder for future implementation)
  if (to.meta.requiresAuth) {
    // For now, redirect to demo instead of blocking
    // In a real app, you would check authentication status
    console.log('Full app access required, redirecting to demo')
    if (from.path !== '/demo') {
      next('/demo')
      return
    }
  }

  next()
})

export default router 