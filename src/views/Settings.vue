<template>
  <div class="settings-view">
    <h1>Настройки</h1>
    
    <div class="settings-sections">
      <div class="settings-section">
        <h2>Интерфейс</h2>
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="darkMode" />
            Темная тема
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="autoSave" />
            Автосохранение
          </label>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Единицы измерения</h2>
        <div class="setting-item">
          <label>Давление:</label>
          <select v-model="pressureUnit">
            <option value="mpa">МПа</option>
            <option value="bar">бар</option>
            <option value="atm">атм</option>
          </select>
        </div>
        <div class="setting-item">
          <label>Длина:</label>
          <select v-model="lengthUnit">
            <option value="m">м</option>
            <option value="km">км</option>
            <option value="mm">мм</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="settings-actions">
      <button class="btn btn-primary" @click="saveSettings">
        Сохранить
      </button>
      <button class="btn btn-secondary" @click="resetSettings">
        Сбросить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const darkMode = ref(false)
const autoSave = ref(true)
const pressureUnit = ref('mpa')
const lengthUnit = ref('m')

const saveSettings = () => {
  // Implementation
}

const resetSettings = () => {
  darkMode.value = false
  autoSave.value = true
  pressureUnit.value = 'mpa'
  lengthUnit.value = 'm'
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.settings-view {
  padding: $space-6;
  max-width: 800px;
  
  h1 {
    color: $color-text-primary;
    margin-bottom: $space-6;
  }
}

.settings-sections {
  .settings-section {
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    padding: $space-6;
    margin-bottom: $space-4;
    
    h2 {
      margin: 0 0 $space-4 0;
      color: $color-text-primary;
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-3;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      label {
        color: $color-text-primary;
        display: flex;
        align-items: center;
        gap: $space-2;
      }
      
      select {
        padding: $space-2;
        border: 1px solid $color-border;
        border-radius: $radius-md;
        background: $color-surface-elevated;
        color: $color-text-primary;
      }
    }
  }
}

.settings-actions {
  display: flex;
  gap: $space-3;
  
  .btn {
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    border: 1px solid;
    cursor: pointer;
    
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