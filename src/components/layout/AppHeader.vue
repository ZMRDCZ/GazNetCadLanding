<template>
  <header class="app-header">
    <div class="header-left">
      <button 
        class="sidebar-toggle"
        @click="$emit('toggle-sidebar')"
        :class="{ active: sidebarCollapsed }"
      >
        <span class="toggle-icon">☰</span>
      </button>
      
      <div class="logo-section">
        <div class="logo" @click="goToHome" style="cursor: pointer;">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">GazNetCAD</span>
        </div>
        <span class="version">v2.0</span>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <button class="nav-item" @click="goToDemo">
          <span class="nav-icon">🚀</span>
          <span class="nav-text">Демо</span>
        </button>
        <button class="nav-item" @click="goToPricing">
          <span class="nav-icon">💰</span>
          <span class="nav-text">Цены</span>
        </button>
        <button class="nav-item" @click="goToAbout">
          <span class="nav-icon">ℹ️</span>
          <span class="nav-text">О нас</span>
        </button>
        <button class="nav-item" @click="goToDocumentation">
          <span class="nav-icon">📚</span>
          <span class="nav-text">Документация</span>
        </button>
        <button class="nav-item" @click="goToContact">
          <span class="nav-icon">📞</span>
          <span class="nav-text">Контакты</span>
        </button>
      </nav>
    </div>
    
    <div class="header-center">
      <h1 class="project-title">{{ currentProjectName }}</h1>
      <div class="project-status" :class="statusClass">
        <div class="status-indicator"></div>
        <span>{{ statusText }}</span>
      </div>
    </div>
    
    <div class="header-right">
      <div class="header-actions">
        <button class="action-btn notification-btn" @click="toggleNotifications">
          <span class="icon">🔔</span>
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </button>
        
        <button class="action-btn settings-btn" @click="openSettings">
          <span class="icon">⚙️</span>
        </button>
        
        <button class="action-btn user-btn" @click="toggleUserMenu">
          <span class="icon">👤</span>
        </button>
      </div>
      
      <!-- Notifications Dropdown -->
      <div v-if="showNotifications" class="notifications-dropdown">
        <div class="dropdown-header">
          <h3>Уведомления</h3>
          <button @click="markAllAsRead" class="mark-read-btn">Отметить все</button>
        </div>
        <div class="notifications-list">
          <div v-for="notification in notifications" :key="notification.id" 
               class="notification-item" :class="{ unread: !notification.read }">
            <span class="notification-icon">{{ notification.icon }}</span>
            <div class="notification-content">
              <p class="notification-text">{{ notification.message }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- User Menu Dropdown -->
      <div v-if="showUserMenu" class="user-menu-dropdown">
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <div class="user-details">
            <span class="user-name">Demo User</span>
            <span class="user-plan">Демо версия</span>
          </div>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-items">
          <button class="menu-item" @click="goToProfile">
            <span class="item-icon">👤</span>
            <span>Профиль</span>
          </button>
          <button class="menu-item" @click="goToSettings">
            <span class="item-icon">⚙️</span>
            <span>Настройки</span>
          </button>
          <button class="menu-item" @click="showHelp">
            <span class="item-icon">❓</span>
            <span>Помощь</span>
          </button>
          <div class="menu-divider"></div>
          <button class="menu-item logout" @click="logout">
            <span class="item-icon">🚪</span>
            <span>Выход</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
interface Props {
  sidebarCollapsed?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  sidebarCollapsed: false
})

// Emits
defineEmits<{
  'toggle-sidebar': []
}>()

// Reactive state
const showNotifications = ref(false)
const showUserMenu = ref(false)
const currentProjectName = ref('Газопровод высокого давления')
const projectStatus = ref('active')

const notifications = ref([
  {
    id: 1,
    icon: '✅',
    message: 'Расчёт давления завершён успешно',
    time: '2 мин назад',
    read: false
  },
  {
    id: 2,
    icon: '⚠️',
    message: 'Превышен лимит демо-версии',
    time: '5 мин назад',
    read: false
  },
  {
    id: 3,
    icon: '📊',
    message: 'Новый отчёт готов к просмотру',
    time: '10 мин назад',
    read: true
  }
])

// Computed properties
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const statusClass = computed(() => ({
  'status-active': projectStatus.value === 'active',
  'status-warning': projectStatus.value === 'warning',
  'status-error': projectStatus.value === 'error'
}))

const statusText = computed(() => {
  switch (projectStatus.value) {
    case 'active': return 'Активный'
    case 'warning': return 'Требует внимания'
    case 'error': return 'Ошибка'
    default: return 'Неизвестно'
  }
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const openSettings = () => {
  console.log('Opening settings...')
}

const goToProfile = () => {
  showUserMenu.value = false
  console.log('Going to profile...')
}

const goToSettings = () => {
  showUserMenu.value = false
  console.log('Going to settings...')
}

const showHelp = () => {
  showUserMenu.value = false
  console.log('Showing help...')
}

const logout = () => {
  showUserMenu.value = false
  console.log('Logging out...')
}

// Navigation functions
const goToHome = () => {
  router.push('/')
}

const goToDemo = () => {
  router.push('/demo')
}

const goToPricing = () => {
  router.push('/pricing')
}

const goToAbout = () => {
  router.push('/about')
}

const goToDocumentation = () => {
  router.push('/documentation')
}

const goToContact = () => {
  router.push('/contact')
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (!event.target) return
  
  const target = event.target as Element
  if (!target.closest('.notifications-dropdown') && !target.closest('.notification-btn')) {
    showNotifications.value = false
  }
  if (!target.closest('.user-menu-dropdown') && !target.closest('.user-btn')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  @include glassmorphism;
  padding: 0 $space-6;
  @include neon-border;
  border-left: none;
  border-right: none;
  border-top: none;
  position: relative;
  z-index: $z-sticky;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, $color-primary, $color-secondary, $color-accent);
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.sidebar-toggle {
  @include button-base;
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  @include glassmorphism;
  @include neon-border;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-secondary;
  transition: all $duration-normal $ease-out;
  
  &:hover {
    @include neon-glow;
    color: $color-primary;
    transform: scale(1.05);
  }
  
  &.active {
    @include neon-glow($color-secondary);
    color: $color-secondary;
    border-color: $color-secondary;
  }
  
  .toggle-icon {
    font-size: $font-size-lg;
  }
}

.logo-section {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.logo {
  display: flex;
  align-items: center;
  gap: $space-2;
  
  .logo-icon {
    font-size: $font-size-xl;
    color: $color-primary;
    animation: neon-pulse $neon-pulse-duration infinite;
  }
  
  .logo-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    @include neon-text($color-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.version {
  @include glassmorphism;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  color: $color-text-tertiary;
  border: 1px solid rgba($color-secondary, 0.3);
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-left: $space-6;
}

.nav-item {
  @include button-base;
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  transition: all $duration-normal $ease-out;
  
  &:hover {
    background: rgba($color-primary, 0.1);
    color: $color-primary;
    transform: translateY(-1px);
  }
  
  .nav-icon {
    font-size: $font-size-md;
  }
  
  .nav-text {
    font-weight: $font-weight-medium;
  }
}

.header-center {
  flex: 1;
  text-align: center;
  max-width: 400px;
}

.project-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin: 0 0 $space-1 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.project-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  font-size: $font-size-sm;
  
  &.status-active {
    color: $color-success;
    
    .status-indicator {
      background: $color-success;
      @include neon-glow($color-success, 0.3);
    }
  }
  
  &.status-warning {
    color: $color-warning;
    
    .status-indicator {
      background: $color-warning;
      @include neon-glow($color-warning, 0.3);
    }
  }
  
  &.status-error {
    color: $color-error;
    
    .status-indicator {
      background: $color-error;
      @include neon-glow($color-error, 0.3);
    }
  }
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: $radius-full;
  animation: pulse 2s infinite;
}

.header-right {
  position: relative;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.action-btn {
  @include button-base;
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  @include glassmorphism;
  @include neon-border;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-secondary;
  position: relative;
  
  &:hover {
    @include neon-glow;
    color: $color-primary;
    transform: scale(1.05);
  }
  
  .icon {
    font-size: $font-size-lg;
  }
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: $color-error;
  color: $color-text-on-primary;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  padding: 2px 6px;
  border-radius: $radius-full;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  @include neon-glow($color-error, 0.4);
  animation: bounce 2s infinite;
}

/* Dropdowns */
.notifications-dropdown,
.user-menu-dropdown {
  position: absolute;
  top: calc(100% + $space-2);
  right: 0;
  min-width: 320px;
  @include glassmorphism;
  @include neon-border;
  border-radius: $radius-xl;
  @include neon-glow;
  z-index: $z-dropdown;
  animation: slideDown $duration-normal $ease-out;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4;
  border-bottom: 1px solid $color-divider;
  
  h3 {
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    @include neon-text($color-primary);
    margin: 0;
  }
}

.mark-read-btn {
  @include button-base;
  font-size: $font-size-sm;
  color: $color-text-tertiary;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  
  &:hover {
    color: $color-primary;
    background: rgba($color-primary, 0.1);
  }
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-bottom: 1px solid rgba($color-divider, 0.5);
  transition: background $duration-fast $ease-out;
  
  &:hover {
    background: rgba($color-primary, 0.05);
  }
  
  &.unread {
    background: rgba($color-primary, 0.1);
    border-left: 3px solid $color-primary;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.notification-icon {
  font-size: $font-size-md;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
  
  .notification-text {
    font-size: $font-size-sm;
    color: $color-text-primary;
    margin: 0 0 $space-1 0;
    line-height: $line-height-normal;
  }
  
  .notification-time {
    font-size: $font-size-xs;
    color: $color-text-tertiary;
  }
}

/* User Menu */
.user-menu-dropdown {
  min-width: 260px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4;
  border-bottom: 1px solid $color-divider;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: $radius-full;
  @include glassmorphism;
  @include neon-border;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-lg;
  color: $color-primary;
}

.user-details {
  display: flex;
  flex-direction: column;
  
  .user-name {
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-size: $font-size-sm;
  }
  
  .user-plan {
    font-size: $font-size-xs;
    color: $color-text-tertiary;
  }
}

.menu-divider {
  height: 1px;
  background: $color-divider;
  margin: $space-2 0;
}

.menu-items {
  padding: $space-2;
}

.menu-item {
  @include button-base;
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2 $space-3;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  text-align: left;
  
  &:hover {
    background: rgba($color-primary, 0.1);
    color: $color-primary;
  }
  
  &.logout {
    color: $color-error;
    
    &:hover {
      background: rgba($color-error, 0.1);
      color: $color-error;
    }
  }
  
  .item-icon {
    font-size: $font-size-md;
  }
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Responsive */
@media (max-width: $breakpoint-md) {
  .app-header {
    padding: 0 $space-4;
  }
  
  .header-center {
    max-width: 200px;
  }
  
  .project-title {
    font-size: $font-size-md;
  }
  
  .nav-menu {
    display: none;
  }
  
  .notifications-dropdown,
  .user-menu-dropdown {
    min-width: 280px;
    right: -$space-4;
  }
}
</style> 