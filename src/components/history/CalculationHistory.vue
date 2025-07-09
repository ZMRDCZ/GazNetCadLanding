<template>
  <div class="calculation-history">
    <div class="history-header">
      <h3>История расчётов</h3>
      <button @click="clearHistory" class="clear-btn">
        <Trash2 :size="16" />
      </button>
    </div>
    
    <div v-if="history.length === 0" class="empty-state">
      <FileText :size="48" />
      <p>История расчётов пуста</p>
    </div>
    
    <div v-else class="history-list">
      <div 
        v-for="calculation in history" 
        :key="calculation.id"
        class="history-item"
        @click="$emit('restore-calculation', calculation.id)"
      >
        <div class="item-header">
          <span class="timestamp">{{ formatDate(calculation.timestamp) }}</span>
          <span class="status" :class="calculation.status">{{ calculation.status }}</span>
        </div>
        <div class="item-content">
          <div class="calc-params">
            <span>P: {{ calculation.pressure }} МПа</span>
            <span>D: {{ calculation.diameter }} мм</span>
            <span>L: {{ calculation.length }} м</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2, FileText } from 'lucide-vue-next'

interface CalculationRecord {
  id: string
  timestamp: Date
  status: 'success' | 'error' | 'warning'
  pressure: number
  diameter: number
  length: number
}

interface Props {
  history: CalculationRecord[]
}

defineProps<Props>()
defineEmits<{
  'restore-calculation': [id: string]
}>()

const clearHistory = () => {
  // Implementation
}

const formatDate = (date: Date) => {
  return date.toLocaleString('ru-RU')
}
</script>

<style lang="scss" scoped>
@import "@/styles/tokens.scss";

.calculation-history {
  background: $color-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  border: 1px solid $color-border;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-4;
  
  h3 {
    margin: 0;
    color: $color-text-primary;
  }
  
  .clear-btn {
    @include button-base;
    padding: $space-2;
    color: $color-text-secondary;
    border-radius: $radius-sm;
    
    &:hover {
      color: $color-error;
      background: $color-error-light;
    }
  }
}

.empty-state {
  text-align: center;
  color: $color-text-secondary;
  padding: $space-8;
  
  svg {
    margin-bottom: $space-4;
    opacity: 0.5;
  }
}

.history-list {
  .history-item {
    padding: $space-3;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    margin-bottom: $space-2;
    cursor: pointer;
    transition: all $duration-fast;
    
    &:hover {
      border-color: $color-primary-light;
      background: $color-surface-elevated;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: $space-2;
      
      .timestamp {
        font-size: $font-size-sm;
        color: $color-text-secondary;
      }
      
      .status {
        font-size: $font-size-xs;
        padding: 2px 6px;
        border-radius: $radius-sm;
        text-transform: uppercase;
        
        &.success {
          background: $color-success-light;
          color: $color-success;
        }
        
        &.error {
          background: $color-error-light;
          color: $color-error;
        }
        
        &.warning {
          background: $color-warning-light;
          color: $color-warning;
        }
      }
    }
    
    .calc-params {
      display: flex;
      gap: $space-3;
      font-size: $font-size-sm;
      color: $color-text-primary;
    }
  }
}
</style> 