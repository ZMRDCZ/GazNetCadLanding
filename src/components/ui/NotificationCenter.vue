<template>
  <div class="notification-center">
    <!-- Notification Toggle Button -->
    <button 
      class="notification-toggle btn btn-ghost"
      @click="toggleNotifications"
      :class="{ 'has-notifications': hasUnread }"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M15 17h5l-5-5-5 5h5zm0 0v-1.5a1.5 1.5 0 00-3 0V17"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>

    <!-- Notifications Panel -->
    <transition name="slide-down">
      <div v-if="showNotifications" class="notifications-panel">
        <div class="panel-header">
          <h3 class="panel-title">Уведомления</h3>
          <button 
            v-if="hasUnread" 
            @click="markAllAsRead" 
            class="btn btn-ghost btn-small"
          >
            Отметить все
          </button>
        </div>

        <div class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon" :class="`icon-${notification.type}`">
              {{ getNotificationIcon(notification.type) }}
            </div>
            <div class="notification-content">
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.time) }}</span>
            </div>
            <div v-if="!notification.read" class="unread-indicator"></div>
          </div>
          
          <div v-if="notifications.length === 0" class="empty-state">
            <p>Нет новых уведомлений</p>
          </div>
        </div>

        <div class="panel-footer">
          <button @click="clearAll" class="btn btn-ghost btn-small text-muted">
            Очистить все
          </button>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <div 
      v-if="showNotifications" 
      class="notification-backdrop"
      @click="closeNotifications"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Types
interface Notification {
  id: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  time: Date
  read: boolean
}

// Props
interface Props {
  notifications?: Notification[]
}

const props = withDefaults(defineProps<Props>(), {
  notifications: () => [
    {
      id: '1',
      message: 'Расчёт давления завершён успешно',
      type: 'success',
      time: new Date(Date.now() - 2 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      message: 'Превышен лимит демо-версии',
      type: 'warning',
      time: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      message: 'Новый отчёт готов к просмотру',
      type: 'info',
      time: new Date(Date.now() - 10 * 60 * 1000),
      read: true
    }
  ]
})

// Emits
defineEmits<{
  'notification-read': [id: string]
  'all-read': []
  'clear-all': []
}>()

// State
const showNotifications = ref(false)
const notifications = ref([...props.notifications])

// Computed
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const hasUnread = computed(() => unreadCount.value > 0)

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
}

const markAsRead = (id: string) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    // Emit event for parent component
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    if (!n.read) n.read = true
  })
  // Emit event for parent component
}

const clearAll = () => {
  notifications.value = []
  showNotifications.value = false
  // Emit event for parent component
}

const getNotificationIcon = (type: string): string => {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  }
  return icons[type as keyof typeof icons] || 'ℹ️'
}

const formatTime = (time: Date): string => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'только что'
  if (minutes < 60) return `${minutes} мин назад`
  if (hours < 24) return `${hours} ч назад`
  return `${days} д назад`
}

// Close on escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeNotifications()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.notification-center {
  position: relative;
}

.notification-toggle {
  position: relative;
  
  &.has-notifications {
    .icon {
      color: $primary;
    }
  }
  
  .notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: $red-500;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s infinite;
  }
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-height: 480px;
  @include modern-card(false);
  z-index: 1000;
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: 320px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid $dark-border;
  
  .panel-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: $dark-text-primary;
    margin: 0;
  }
}

.notifications-list {
  max-height: 320px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba($dark-border, 0.5);
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
  
  &:hover {
    background: rgba($primary, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &.unread {
    background: rgba($primary, 0.03);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: $primary;
    }
  }
  
  .notification-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    
    &.icon-success {
      background: rgba($secondary, 0.1);
    }
    
    &.icon-warning {
      background: rgba($orange-500, 0.1);
    }
    
    &.icon-error {
      background: rgba($red-500, 0.1);
    }
    
    &.icon-info {
      background: rgba($primary, 0.1);
    }
  }
  
  .notification-content {
    flex: 1;
    min-width: 0;
    
    .notification-message {
      font-size: 0.875rem;
      color: $dark-text-primary;
      line-height: 1.4;
      margin: 0 0 4px 0;
    }
    
    .notification-time {
      font-size: 0.75rem;
      color: $dark-text-muted;
    }
  }
  
  .unread-indicator {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    background: $primary;
    border-radius: 50%;
    margin-top: 8px;
  }
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  
  p {
    color: $dark-text-muted;
    margin: 0;
  }
}

.panel-footer {
  padding: 12px 20px;
  border-top: 1px solid $dark-border;
  display: flex;
  justify-content: center;
}

.notification-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

// Transitions
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style> 