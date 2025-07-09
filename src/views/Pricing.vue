<template>
  <div class="pricing-page">
    <!-- Hero Section -->
    <section class="pricing-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Выберите подходящий тариф</h1>
          <p class="hero-subtitle">
            Гибкие планы для команд любого размера - от индивидуальных разработчиков до крупных предприятий
          </p>
          
          <!-- Billing Toggle -->
          <div class="billing-toggle">
            <span :class="{ active: !isAnnual }" @click="isAnnual = false">Ежемесячно</span>
            <div class="toggle-switch" @click="toggleBilling">
              <div class="toggle-slider" :class="{ annual: isAnnual }"></div>
            </div>
            <span :class="{ active: isAnnual }" @click="isAnnual = true">
              Ежегодно
              <span class="discount-badge">-20%</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pricing-section">
      <div class="container">
        <div class="pricing-grid">
          <!-- Starter Plan -->
          <div class="pricing-card">
            <div class="card-header">
              <h3 class="plan-name">Стартовый</h3>
              <p class="plan-description">Идеально для индивидуальных проектов</p>
              <div class="price-container">
                <span class="currency">₽</span>
                <span class="price">{{ isAnnual ? '7,992' : '9,990' }}</span>
                <span class="period">{{ isAnnual ? '/год' : '/мес' }}</span>
              </div>
              <div v-if="isAnnual" class="savings">Экономия ₽23,976 в год</div>
            </div>
            
            <ul class="features-list">
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>До 10 проектов</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Базовые расчёты давления</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>2D визуализация</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Экспорт в DWG/PDF</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Email поддержка</span>
              </li>
              <li class="feature-item disabled">
                <span class="feature-icon">❌</span>
                <span>3D модели</span>
              </li>
              <li class="feature-item disabled">
                <span class="feature-icon">❌</span>
                <span>ИИ-оптимизация</span>
              </li>
              <li class="feature-item disabled">
                <span class="feature-icon">❌</span>
                <span>Командная работа</span>
              </li>
            </ul>
            
            <button class="select-plan-btn">Выбрать план</button>
            <p class="trial-info">30 дней бесплатно</p>
          </div>

          <!-- Professional Plan -->
          <div class="pricing-card featured">
            <div class="popular-badge">Популярный</div>
            <div class="card-header">
              <h3 class="plan-name">Профессиональный</h3>
              <p class="plan-description">Для профессиональных инженеров</p>
              <div class="price-container">
                <span class="currency">₽</span>
                <span class="price">{{ isAnnual ? '15,992' : '19,990' }}</span>
                <span class="period">{{ isAnnual ? '/год' : '/мес' }}</span>
              </div>
              <div v-if="isAnnual" class="savings">Экономия ₽47,976 в год</div>
            </div>
            
            <ul class="features-list">
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Неограниченные проекты</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Полный набор расчётов</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>3D визуализация и анимация</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Все форматы экспорта</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>ИИ-помощник для оптимизации</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Расширенная аналитика</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Приоритетная поддержка</span>
              </li>
              <li class="feature-item disabled">
                <span class="feature-icon">❌</span>
                <span>Командные проекты</span>
              </li>
            </ul>
            
            <button class="select-plan-btn primary">Выбрать план</button>
            <p class="trial-info">30 дней бесплатно</p>
          </div>

          <!-- Enterprise Plan -->
          <div class="pricing-card">
            <div class="card-header">
              <h3 class="plan-name">Корпоративный</h3>
              <p class="plan-description">Для команд и организаций</p>
              <div class="price-container">
                <span class="currency">₽</span>
                <span class="price">{{ isAnnual ? '39,992' : '49,990' }}</span>
                <span class="period">{{ isAnnual ? '/год' : '/мес' }}</span>
              </div>
              <div v-if="isAnnual" class="savings">Экономия ₽119,976 в год</div>
            </div>
            
            <ul class="features-list">
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Всё из Профессионального</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Командная работа в реальном времени</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Управление ролями и правами</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Корпоративная аналитика</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>API для интеграций</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Персональный менеджер</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>SLA 99.9%</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Обучение команды</span>
              </li>
            </ul>
            
            <button class="select-plan-btn">Связаться с нами</button>
            <p class="trial-info">Индивидуальный пилот</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Comparison -->
    <section class="features-comparison">
      <div class="container">
        <h2 class="section-title">Сравнение возможностей</h2>
        
        <div class="comparison-table">
          <div class="table-header">
            <div class="feature-column">Функции</div>
            <div class="plan-column">Стартовый</div>
            <div class="plan-column">Профессиональный</div>
            <div class="plan-column">Корпоративный</div>
          </div>
          
          <div class="table-group">
            <div class="group-title">Проектирование</div>
            <div class="table-row">
              <div class="feature-name">Количество проектов</div>
              <div class="feature-value">До 10</div>
              <div class="feature-value">Безлимит</div>
              <div class="feature-value">Безлимит</div>
            </div>
            <div class="table-row">
              <div class="feature-name">2D визуализация</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
            </div>
            <div class="table-row">
              <div class="feature-name">3D визуализация</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
            </div>
            <div class="table-row">
              <div class="feature-name">ИИ-оптимизация</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
            </div>
          </div>
          
          <div class="table-group">
            <div class="group-title">Совместная работа</div>
            <div class="table-row">
              <div class="feature-name">Количество пользователей</div>
              <div class="feature-value">1</div>
              <div class="feature-value">1</div>
              <div class="feature-value">Безлимит</div>
            </div>
            <div class="table-row">
              <div class="feature-name">Совместное редактирование</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">✅</div>
            </div>
            <div class="table-row">
              <div class="feature-name">Управление правами</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">✅</div>
            </div>
          </div>
          
          <div class="table-group">
            <div class="group-title">Поддержка</div>
            <div class="table-row">
              <div class="feature-name">Email поддержка</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
            </div>
            <div class="table-row">
              <div class="feature-name">Приоритетная поддержка</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">✅</div>
              <div class="feature-value">✅</div>
            </div>
            <div class="table-row">
              <div class="feature-name">Персональный менеджер</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">❌</div>
              <div class="feature-value">✅</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Часто задаваемые вопросы</h2>
        
        <div class="faq-grid">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <div class="faq-question" @click="toggleFAQ(index)">
              <h3>{{ faq.question }}</h3>
              <span class="faq-toggle" :class="{ active: faq.isOpen }">+</span>
            </div>
            <div class="faq-answer" v-show="faq.isOpen">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы начать проектирование?</h2>
          <p>Попробуйте GazNetCAD бесплатно в течение 30 дней</p>
          <div class="cta-actions">
            <button class="btn-primary" @click="startTrial">Начать бесплатный период</button>
            <button class="btn-secondary" @click="$router.push('/demo')">Демо-версия</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAnnual = ref(false)

const faqs = ref([
  {
    question: 'Можно ли изменить план в любое время?',
    answer: 'Да, вы можете повысить или понизить тариф в любое время. При повышении тарифа новые функции станут доступны сразу, а при понижении изменения вступят в силу в следующем платёжном периоде.',
    isOpen: false
  },
  {
    question: 'Что происходит с данными при отмене подписки?',
    answer: 'Ваши проекты сохраняются в течение 90 дней после отмены подписки. В течение этого времени вы можете восстановить доступ или экспортировать данные.',
    isOpen: false
  },
  {
    question: 'Доступна ли техническая поддержка?',
    answer: 'Да, все пользователи получают доступ к email-поддержке. Пользователи профессионального и корпоративного планов получают приоритетную поддержку с гарантированным временем ответа.',
    isOpen: false
  },
  {
    question: 'Можно ли использовать GazNetCAD офлайн?',
    answer: 'Основные функции проектирования доступны офлайн. Для синхронизации данных, ИИ-оптимизации и совместной работы требуется интернет-соединение.',
    isOpen: false
  },
  {
    question: 'Есть ли скидки для учебных заведений?',
    answer: 'Да, мы предоставляем специальные академические лицензии со скидкой до 50% для учебных заведений и студентов. Свяжитесь с нами для получения подробной информации.',
    isOpen: false
  },
  {
    question: 'Какие форматы файлов поддерживаются?',
    answer: 'GazNetCAD поддерживает импорт и экспорт в основные CAD-форматы: DWG, DXF, PDF, а также специализированные форматы для газового оборудования.',
    isOpen: false
  }
])

const toggleBilling = () => {
  isAnnual.value = !isAnnual.value
}

const toggleFAQ = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

const startTrial = () => {
  // В реальном приложении здесь была бы логика регистрации
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.pricing-page {
  background: $color-background;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-4;
}

// Hero Section
.pricing-hero {
  padding: $space-16 0 $space-12;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  text-align: center;
  
  .hero-title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-4;
    color: white;
  }
  
  .hero-subtitle {
    font-size: $font-size-lg;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: $space-8;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-4;
  margin-top: $space-8;
  
  span {
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $duration-normal;
    
    &.active {
      color: $color-primary;
    }
    
    &:not(.active) {
      opacity: 0.6;
    }
  }
  
  .discount-badge {
    background: $color-primary;
    color: white;
    font-size: $font-size-xs;
    padding: 2px 6px;
    border-radius: $radius-sm;
    margin-left: $space-1;
  }
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: background $duration-normal;
  
  .toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform $duration-normal;
    
    &.annual {
      transform: translateX(24px);
    }
  }
}

// Pricing Cards
.pricing-section {
  padding: $space-16 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $space-8;
  margin-top: $space-12;
}

.pricing-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  padding: $space-8;
  position: relative;
  transition: all $duration-normal;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  &.featured {
    border-color: $color-primary;
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
    
    .select-plan-btn.primary {
      background: $color-primary;
      color: white;
      
      &:hover {
        background: $color-primary-dark;
      }
    }
  }
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: $color-primary;
  color: white;
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
}

.card-header {
  text-align: center;
  margin-bottom: $space-8;
  
  .plan-name {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-2;
  }
  
  .plan-description {
    color: $color-text-secondary;
    margin-bottom: $space-6;
  }
}

.price-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: $space-1;
  margin-bottom: $space-2;
  
  .currency {
    font-size: $font-size-lg;
    color: $color-text-secondary;
  }
  
  .price {
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }
  
  .period {
    font-size: $font-size-lg;
    color: $color-text-secondary;
  }
}

.savings {
  color: $color-success;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: $space-8;
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-bottom: $space-3;
    
    &.disabled {
      opacity: 0.5;
    }
    
    .feature-icon {
      font-size: $font-size-sm;
    }
  }
}

.select-plan-btn {
  width: 100%;
  padding: $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  background: $color-surface-elevated;
  color: $color-text-primary;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-normal;
  
  &:hover {
    background: $color-surface-hover;
  }
  
  &.primary {
    background: $color-primary;
    border-color: $color-primary;
    color: white;
    
    &:hover {
      background: $color-primary-dark;
    }
  }
}

.trial-info {
  text-align: center;
  margin-top: $space-3;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// Features Comparison
.features-comparison {
  padding: $space-16 0;
  background: $color-surface;
}

.section-title {
  text-align: center;
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  margin-bottom: $space-12;
}

.comparison-table {
  background: white;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  .table-header {
    display: grid;
    grid-template-columns: 1fr repeat(3, 150px);
    background: $color-primary;
    color: white;
    font-weight: $font-weight-medium;
    
    > div {
      padding: $space-4;
      text-align: center;
      
      &:first-child {
        text-align: left;
      }
    }
  }
  
  .table-group {
    .group-title {
      background: $color-surface;
      padding: $space-3 $space-4;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      border-bottom: 1px solid $color-border;
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 1fr repeat(3, 150px);
      border-bottom: 1px solid $color-border;
      
      &:last-child {
        border-bottom: none;
      }
      
      > div {
        padding: $space-3 $space-4;
        text-align: center;
        
        &:first-child {
          text-align: left;
          font-weight: $font-weight-medium;
        }
      }
      
      .feature-name {
        color: $color-text-primary;
      }
      
      .feature-value {
        color: $color-text-secondary;
      }
    }
  }
}

// FAQ Section
.faq-section {
  padding: $space-16 0;
}

.faq-grid {
  display: grid;
  gap: $space-4;
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $space-6;
    cursor: pointer;
    transition: background $duration-normal;
    
    &:hover {
      background: $color-surface-hover;
    }
    
    h3 {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      margin: 0;
    }
    
    .faq-toggle {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      transition: transform $duration-normal;
      
      &.active {
        transform: rotate(45deg);
      }
    }
  }
  
  .faq-answer {
    padding: 0 $space-6 $space-4;
    color: $color-text-secondary;
    line-height: $line-height-relaxed;
  }
}

// CTA Section
.cta-section {
  padding: $space-16 0;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  color: white;
  text-align: center;
  
  .cta-content {
    h2 {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      margin-bottom: $space-4;
      color: white;
    }
    
    p {
      font-size: $font-size-lg;
      opacity: 0.9;
      margin-bottom: $space-8;
    }
  }
  
  .cta-actions {
    display: flex;
    justify-content: center;
    gap: $space-4;
    flex-wrap: wrap;
    
    .btn-primary, .btn-secondary {
      padding: $space-4 $space-8;
      border-radius: $radius-lg;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $duration-normal;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background: white;
      color: $color-primary;
      border: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
      }
    }
    
    .btn-secondary {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

// Responsive Design
@media (max-width: 768px) {
  .pricing-hero {
    padding: $space-12 0 $space-8;
    
    .hero-title {
      font-size: $font-size-3xl;
    }
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: $space-6;
  }
  
  .comparison-table {
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      
      > div {
        text-align: left !important;
        border-bottom: 1px solid $color-border;
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
    
    .btn-primary, .btn-secondary {
      width: 100%;
      max-width: 300px;
    }
  }
}
</style> 