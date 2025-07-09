<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Отчёт по расчёту</h2>
          <button class="close-btn" @click="$emit('close')">
            <X :size="24" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="report-section">
            <h3>Исходные данные</h3>
            <div class="data-grid">
              <div class="data-item">
                <span class="label">Давление:</span>
                <span class="value">0.3 МПа</span>
              </div>
              <div class="data-item">
                <span class="label">Диаметр:</span>
                <span class="value">110 мм</span>
              </div>
              <div class="data-item">
                <span class="label">Материал:</span>
                <span class="value">Полиэтилен</span>
              </div>
              <div class="data-item">
                <span class="label">Длина:</span>
                <span class="value">150 м</span>
              </div>
            </div>
          </div>
          
          <div class="report-section">
            <h3>Результаты расчёта</h3>
            <div class="results-list">
              <div class="result-item">
                <CheckCircle class="success-icon" :size="20" />
                <span>Гидравлический расчёт выполнен успешно</span>
              </div>
              <div class="result-item">
                <CheckCircle class="success-icon" :size="20" />
                <span>Прочностной расчёт соответствует нормам</span>
              </div>
              <div class="result-item">
                <AlertTriangle class="warning-icon" :size="20" />
                <span>Скорость потока близка к максимальной</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            Закрыть
          </button>
          <button class="btn btn-primary" @click="exportReport">
            <Download :size="16" />
            Экспорт
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CheckCircle, AlertTriangle, Download } from 'lucide-vue-next'

defineEmits<{
  'close': []
}>()

const exportReport = () => {
  // Implementation for report export
}
</script>

<style lang="scss" scoped>
@import "@/styles/tokens.scss";

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $space-6;
}

.modal-content {
  background: $color-surface;
  border-radius: $radius-lg;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: $shadow-xl;
  
  @include glassmorphism;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-6;
  border-bottom: 1px solid $color-border;
  
  h2 {
    margin: 0;
    color: $color-text-primary;
  }
  
  .close-btn {
    @include button-base;
    padding: $space-2;
    color: $color-text-secondary;
    border-radius: $radius-md;
    
    &:hover {
      color: $color-text-primary;
      background: $color-surface-hover;
    }
  }
}

.modal-body {
  padding: $space-6;
  overflow-y: auto;
  max-height: 50vh;
}

.report-section {
  & + .report-section {
    margin-top: $space-6;
  }
  
  h3 {
    margin: 0 0 $space-4 0;
    color: $color-text-primary;
    font-size: $font-size-lg;
  }
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-3;
  
  .data-item {
    display: flex;
    justify-content: space-between;
    padding: $space-3;
    background: $color-surface-elevated;
    border-radius: $radius-md;
    
    .label {
      color: $color-text-secondary;
    }
    
    .value {
      color: $color-text-primary;
      font-weight: $font-weight-medium;
    }
  }
}

.results-list {
  .result-item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3;
    margin-bottom: $space-2;
    background: $color-surface-elevated;
    border-radius: $radius-md;
    
    .success-icon {
      color: $color-success;
    }
    
    .warning-icon {
      color: $color-warning;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $space-3;
  padding: $space-6;
  border-top: 1px solid $color-border;
  
  .btn {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    border: 1px solid;
    cursor: pointer;
    transition: all $duration-fast;
    
    &.btn-primary {
      background: $color-primary;
      color: white;
      border-color: $color-primary;
      
      &:hover {
        background: darken($color-primary, 5%);
      }
    }
    
    &.btn-secondary {
      background: $color-surface-elevated;
      color: $color-text-primary;
      border-color: $color-border;
      
      &:hover {
        background: $color-surface-hover;
      }
    }
  }
}
</style> 