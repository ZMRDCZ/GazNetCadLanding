<template>
  <div class="project-manager">
    <h1>Управление проектами</h1>
    <div class="projects-grid">
      <div class="project-card">
        <h3>Газопровод №1</h3>
        <p>Проект высокого давления</p>
        <div class="project-actions">
          <button class="btn btn-primary">Открыть</button>
        </div>
      </div>
      <div class="project-card new-project">
        <Plus :size="48" />
        <h3>Новый проект</h3>
        <p>Создать новый проект газопровода</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.project-manager {
  padding: $space-6;
  
  h1 {
    color: $color-text-primary;
    margin-bottom: $space-6;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-4;
}

.project-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-6;
  cursor: pointer;
  transition: all $duration-fast;
  
  &:hover {
    border-color: $color-primary-light;
    transform: translateY(-2px);
  }
  
  &.new-project {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: $color-text-secondary;
    border-style: dashed;
    
    &:hover {
      color: $color-primary;
      border-color: $color-primary;
    }
  }
  
  h3 {
    margin: 0 0 $space-2 0;
    color: $color-text-primary;
  }
  
  p {
    margin: 0 0 $space-4 0;
    color: $color-text-secondary;
  }
}

.project-actions {
  .btn {
    padding: $space-2 $space-4;
    background: $color-primary;
    color: white;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    
    &:hover {
      background: darken($color-primary, 5%);
    }
  }
}
</style> 