<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 v-if="!collapsed" class="nav-title">Проектирование</h3>
        
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: activeSection === 'pipeline' }">
            <button class="nav-link" @click="$emit('section-change', 'pipeline')">
              <span class="nav-icon">📊</span>
              <span v-if="!collapsed" class="nav-text">Трассировка</span>
              <div v-if="activeSection === 'pipeline'" class="active-indicator"></div>
            </button>
          </li>
          
          <li class="nav-item" :class="{ active: activeSection === 'calculation' }">
            <button class="nav-link" @click="$emit('section-change', 'calculation')">
              <span class="nav-icon">🧮</span>
              <span v-if="!collapsed" class="nav-text">Расчёты</span>
              <div v-if="activeSection === 'calculation'" class="active-indicator"></div>
            </button>
          </li>
          
          <li class="nav-item" :class="{ active: activeSection === 'visualization' }">
            <button class="nav-link" @click="$emit('section-change', 'visualization')">
              <span class="nav-icon">🌐</span>
              <span v-if="!collapsed" class="nav-text">3D Визуализация</span>
              <div v-if="activeSection === 'visualization'" class="active-indicator"></div>
            </button>
          </li>
          
          <li class="nav-item" :class="{ active: activeSection === 'optimization' }">
            <button class="nav-link" @click="$emit('section-change', 'optimization')">
              <span class="nav-icon">🤖</span>
              <span v-if="!collapsed" class="nav-text">ИИ Оптимизация</span>
              <span v-if="!collapsed" class="premium-badge">PRO</span>
              <div v-if="activeSection === 'optimization'" class="active-indicator"></div>
            </button>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3 v-if="!collapsed" class="nav-title">Документация</h3>
        
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: activeSection === 'standards' }">
            <button class="nav-link" @click="$emit('section-change', 'standards')">
              <span class="icon">📚</span>
              <span v-if="!collapsed">Нормативы</span>
            </button>
          </li>
          
          <li class="nav-item" :class="{ active: activeSection === 'export' }">
            <button class="nav-link" @click="$emit('section-change', 'export')">
              <span class="icon">📄</span>
              <span v-if="!collapsed">Экспорт</span>
            </button>
          </li>
          
          <li class="nav-item" :class="{ active: activeSection === 'history' }">
            <button class="nav-link" @click="$emit('section-change', 'history')">
              <span class="icon">📈</span>
              <span v-if="!collapsed" class="nav-text">История</span>
              <div v-if="activeSection === 'history'" class="active-indicator"></div>
            </button>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3 v-if="!collapsed" class="nav-title">Управление</h3>
        
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: activeSection === 'projects' }">
            <button class="nav-link" @click="$emit('section-change', 'projects')">
              <span class="nav-icon">📁</span>
              <span v-if="!collapsed" class="nav-text">Проекты</span>
              <div v-if="activeSection === 'projects'" class="active-indicator"></div>
            </button>
          </li>
          
          <li class="nav-item" :class="{ active: activeSection === 'reports' }">
            <button class="nav-link" @click="$emit('section-change', 'reports')">
              <span class="nav-icon">📋</span>
              <span v-if="!collapsed" class="nav-text">Отчёты</span>
              <span v-if="!collapsed" class="premium-badge">PRO</span>
              <div v-if="activeSection === 'reports'" class="active-indicator"></div>
            </button>
          </li>
        </ul>
      </div>
    </nav>
    
    <!-- Bottom Section -->
    <div class="sidebar-bottom">
      <div v-if="!collapsed" class="upgrade-section">
        <div class="upgrade-card">
          <div class="upgrade-icon">💎</div>
          <h4>Обновить до Pro</h4>
          <p>Получите полный доступ ко всем функциям</p>
          <button class="upgrade-btn" @click="$emit('upgrade-clicked')">
            Обновить
          </button>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="version-info" v-if="!collapsed">
          <span class="version-text">GazNetCAD v2.0</span>
          <span class="build-info">Demo Build</span>
        </div>
        
        <div class="connection-status" :class="connectionStatusClass">
          <div class="status-dot"></div>
          <span v-if="!collapsed" class="status-text">{{ connectionStatusText }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  collapsed?: boolean
  activeSection?: string
}

const _props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  activeSection: 'pipeline'
})

// Emits
defineEmits<{
  'section-change': [section: string]
  'upgrade-clicked': []
}>()

// Reactive state
const connectionStatus = ref<'connected' | 'connecting' | 'disconnected'>('connected')

// Computed properties
const connectionStatusClass = computed(() => ({
  'status-connected': connectionStatus.value === 'connected',
  'status-connecting': connectionStatus.value === 'connecting',
  'status-disconnected': connectionStatus.value === 'disconnected'
}))

const connectionStatusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return 'Подключено'
    case 'connecting': return 'Подключение...'
    case 'disconnected': return 'Отключено'
    default: return 'Неизвестно'
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.app-sidebar {
  position: fixed;
  left: 0;
  top: $header-height + $demo-banner-height;
  bottom: 0;
  width: $sidebar-width;
  @include glassmorphism;
  @include neon-border;
  border-top: none;
  border-left: none;
  transition: all $duration-normal $ease-out;
  z-index: $z-sticky;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, $color-primary, $color-secondary, $color-accent);
  }
  
  &.collapsed {
    width: $sidebar-width-collapsed;
    
    .nav-title {
      opacity: 0;
      pointer-events: none;
    }
    
    .nav-text {
      opacity: 0;
      pointer-events: none;
    }
    
    .premium-badge {
      opacity: 0;
      pointer-events: none;
    }
  }
}

.sidebar-nav {
  flex: 1;
  padding: $space-6 $space-4;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba($color-surface, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba($color-primary, 0.3);
    border-radius: 2px;
    
    &:hover {
      background: rgba($color-primary, 0.5);
    }
  }
}

.nav-section {
  margin-bottom: $space-8;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.nav-title {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-text-tertiary;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 $space-4 $space-3;
  padding-bottom: $space-2;
  border-bottom: 1px solid rgba($color-primary, 0.2);
  transition: opacity $duration-normal $ease-out;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: $space-1;
  
  &.active {
    .nav-link {
      background: rgba($color-primary, 0.15);
      @include neon-border($color-primary);
      color: $color-primary;
      @include neon-glow($color-primary, 0.2);
      
      .nav-icon {
        color: $color-primary;
        animation: neon-pulse $neon-pulse-duration infinite;
      }
    }
  }
}

.nav-link {
  @include button-base;
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3;
  border-radius: $radius-lg;
  color: $color-text-secondary;
  text-align: left;
  position: relative;
  transition: all $duration-normal $ease-out;
  @include glassmorphism;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba($color-primary, 0.1);
    color: $color-primary;
    border-color: rgba($color-primary, 0.3);
    transform: translateX(4px);
    
    .nav-icon {
      transform: scale(1.1);
    }
  }
}

.nav-icon {
  font-size: $font-size-xl;
  min-width: 24px;
  text-align: center;
  transition: all $duration-normal $ease-out;
}

.nav-text {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  flex: 1;
  transition: opacity $duration-normal $ease-out;
}

.premium-badge {
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  background: linear-gradient(135deg, $color-accent, $color-accent-dark);
  color: $color-text-on-accent;
  padding: 2px 6px;
  border-radius: $radius-sm;
  @include neon-glow($color-accent, 0.3);
  transition: opacity $duration-normal $ease-out;
}

.active-indicator {
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(180deg, $color-primary, $color-secondary);
  border-radius: 0 2px 2px 0;
  @include neon-glow($color-primary, 0.4);
  animation: pulse-width 2s infinite;
}

/* Bottom Section */
.sidebar-bottom {
  border-top: 1px solid rgba($color-divider, 0.3);
  padding: $space-4;
}

.upgrade-section {
  margin-bottom: $space-4;
}

.upgrade-card {
  @include glassmorphism;
  @include neon-border($color-accent);
  border-radius: $radius-xl;
  padding: $space-4;
  text-align: center;
  background: rgba($color-accent, 0.05);
  
  .upgrade-icon {
    font-size: $font-size-2xl;
    margin-bottom: $space-2;
    animation: bounce 2s infinite;
  }
  
  h4 {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    @include neon-text($color-accent);
    margin: 0 0 $space-2 0;
  }
  
  p {
    font-size: $font-size-xs;
    color: $color-text-tertiary;
    margin: 0 0 $space-3 0;
    line-height: $line-height-normal;
  }
}

.upgrade-btn {
  @include button-neon($color-accent, $color-text-on-accent);
  width: 100%;
  font-size: $font-size-xs;
  padding: $space-2 $space-3;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.version-info {
  text-align: center;
  
  .version-text {
    display: block;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    margin-bottom: 2px;
  }
  
  .build-info {
    font-size: $font-size-xs;
    color: $color-text-tertiary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.connection-status {
  display: flex;
  align-items: center;
  gap: $space-2;
  justify-content: center;
  
  &.status-connected {
    color: $color-success;
    
    .status-dot {
      background: $color-success;
      @include neon-glow($color-success, 0.3);
    }
  }
  
  &.status-connecting {
    color: $color-warning;
    
    .status-dot {
      background: $color-warning;
      @include neon-glow($color-warning, 0.3);
      animation: pulse 1s infinite;
    }
  }
  
  &.status-disconnected {
    color: $color-error;
    
    .status-dot {
      background: $color-error;
      @include neon-glow($color-error, 0.3);
      animation: blink 1s infinite;
    }
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: $radius-full;
  transition: all $duration-normal $ease-out;
}

.status-text {
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
}

/* Animations */
@keyframes pulse-width {
  0%, 100% {
    width: 3px;
  }
  50% {
    width: 5px;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
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

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Responsive */
@media (max-width: $breakpoint-md) {
  .app-sidebar {
    transform: translateX(-100%);
    
    &:not(.collapsed) {
      transform: translateX(0);
    }
  }
}
</style> 