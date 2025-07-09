<template>
  <Teleport to="body">
    <div class="notification-center">
      <TransitionGroup name="notification" tag="div">
        <div 
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <div class="notification-icon">
            <component :is="getIcon(notification.type)" :size="20" />
          </div>
          <div class="notification-content">
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button 
            class="notification-close"
            @click="closeNotification(notification.id)"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const notifications = computed(() => uiStore.notifications)

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'warning': return AlertTriangle
    case 'error': return AlertCircle
    case 'info': return Info
    default: return Info
  }
}

const closeNotification = (id: string) => {
  uiStore.removeNotification(id)
}
</script>

<style lang="scss" scoped>
.notification-center {
  position: fixed;
  top: $space-6;
  right: $space-6;
  z-index: 1000;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-4;
  margin-bottom: $space-3;
  min-width: 320px;
  max-width: 480px;
  pointer-events: auto;
  box-shadow: $shadow-lg;
  
  @include glassmorphism;
  
  &.success {
    border-color: $color-success;
    .notification-icon {
      color: $color-success;
    }
  }
  
  &.warning {
    border-color: $color-warning;
    .notification-icon {
      color: $color-warning;
    }
  }
  
  &.error {
    border-color: $color-error;
    .notification-icon {
      color: $color-error;
    }
  }
  
  &.info {
    border-color: $color-primary;
    .notification-icon {
      color: $color-primary;
    }
  }
}

.notification-content {
  flex: 1;
  
  .notification-message {
    margin: 0;
    color: $color-text-primary;
    font-size: $font-size-sm;
    line-height: 1.4;
  }
}

.notification-close {
  @include button-base;
  padding: $space-1;
  color: $color-text-secondary;
  border-radius: $radius-sm;
  
  &:hover {
    color: $color-text-primary;
    background: $color-surface-hover;
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 