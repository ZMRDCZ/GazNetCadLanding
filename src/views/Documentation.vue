<template>
  <div class="documentation-page">
    <!-- Header -->
    <section class="docs-header">
      <div class="container">
        <div class="header-content">
          <h1 class="header-title">Документация</h1>
          <p class="header-subtitle">
            Руководство по использованию демонстрационной системы GazNetCAD
          </p>
          
          <!-- Search -->
          <div class="search-section">
            <div class="search-input-wrapper">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Поиск в документации..." 
                class="search-input"
                @input="handleSearch"
              />
              <span class="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="docs-content">
      <div class="container">
        <div class="docs-layout">
          <!-- Sidebar Navigation -->
          <aside class="docs-sidebar">
            <nav class="docs-nav">
              <div class="nav-section">
                <h3 class="nav-title">Начало работы</h3>
                <ul class="nav-links">
                  <li>
                    <a href="#introduction" @click="scrollToSection('introduction')" 
                       :class="{ active: activeSection === 'introduction' }">
                      Введение
                    </a>
                  </li>
                  <li>
                    <a href="#installation" @click="scrollToSection('installation')"
                       :class="{ active: activeSection === 'installation' }">
                      Установка
                    </a>
                  </li>
                  <li>
                    <a href="#first-project" @click="scrollToSection('first-project')"
                       :class="{ active: activeSection === 'first-project' }">
                      Первый проект
                    </a>
                  </li>
                </ul>
              </div>
              
              <div class="nav-section">
                <h3 class="nav-title">Основные функции</h3>
                <ul class="nav-links">
                  <li>
                    <a href="#design" @click="scrollToSection('design')"
                       :class="{ active: activeSection === 'design' }">
                      Проектирование
                    </a>
                  </li>
                  <li>
                    <a href="#calculations" @click="scrollToSection('calculations')"
                       :class="{ active: activeSection === 'calculations' }">
                      Расчёты
                    </a>
                  </li>
                  <li>
                    <a href="#visualization" @click="scrollToSection('visualization')"
                       :class="{ active: activeSection === 'visualization' }">
                      3D Визуализация
                    </a>
                  </li>
                  <li>
                    <a href="#export" @click="scrollToSection('export')"
                       :class="{ active: activeSection === 'export' }">
                      Экспорт данных
                    </a>
                  </li>
                </ul>
              </div>
              
              <div class="nav-section">
                <h3 class="nav-title">Продвинутые возможности</h3>
                <ul class="nav-links">
                  <li>
                    <a href="#ai-optimization" @click="scrollToSection('ai-optimization')"
                       :class="{ active: activeSection === 'ai-optimization' }">
                      ИИ-оптимизация
                    </a>
                  </li>
                  <li>
                    <a href="#collaboration" @click="scrollToSection('collaboration')"
                       :class="{ active: activeSection === 'collaboration' }">
                      Совместная работа
                    </a>
                  </li>
                  <li>
                    <a href="#integrations" @click="scrollToSection('integrations')"
                       :class="{ active: activeSection === 'integrations' }">
                      Интеграции
                    </a>
                  </li>
                </ul>
              </div>
              
              <div class="nav-section">
                <h3 class="nav-title">Справочники</h3>
                <ul class="nav-links">
                  <li>
                    <a href="#standards" @click="scrollToSection('standards')"
                       :class="{ active: activeSection === 'standards' }">
                      Нормативы
                    </a>
                  </li>
                  <li>
                    <a href="#materials" @click="scrollToSection('materials')"
                       :class="{ active: activeSection === 'materials' }">
                      Материалы
                    </a>
                  </li>
                  <li>
                    <a href="#faq" @click="scrollToSection('faq')"
                       :class="{ active: activeSection === 'faq' }">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="docs-main">
            <!-- Introduction -->
            <section id="introduction" class="doc-section">
              <h2 class="section-title">Введение</h2>
              <div class="section-content">
                <p>
                  GazNetCAD — это демонстрационная система для проектирования газораспределительных сетей, 
                  которая объединяет мощные инструменты моделирования, точные гидравлические расчёты 
                  и интеллектуальную оптимизацию на базе ИИ.
                </p>
                
                <h3>Основные возможности</h3>
                <ul class="feature-list">
                  <li>Интерактивное 3D-проектирование газовых сетей</li>
                  <li>Автоматические гидравлические расчёты</li>
                  <li>ИИ-оптимизация трассировки и диаметров</li>
                  <li>Интеграция с популярными CAD-системами</li>
                  <li>Совместная работа в реальном времени</li>
                  <li>Соответствие российским и международным стандартам</li>
                </ul>
                
                <div class="info-box">
                  <h4>💡 Совет</h4>
                  <p>
                    Начните с изучения раздела "Первый проект" для быстрого освоения основных функций системы.
                  </p>
                </div>
              </div>
            </section>

            <!-- Installation -->
            <section id="installation" class="doc-section">
              <h2 class="section-title">Установка и настройка</h2>
              <div class="section-content">
                <p>
                  GazNetCAD работает в браузере и не требует установки дополнительного ПО. 
                  Для оптимальной работы рекомендуется использовать современные браузеры.
                </p>
                
                <h3>Системные требования</h3>
                <div class="requirements-grid">
                  <div class="requirement-item">
                    <h4>Браузер</h4>
                    <ul>
                      <li>Chrome 90+</li>
                      <li>Firefox 88+</li>
                      <li>Safari 14+</li>
                      <li>Edge 90+</li>
                    </ul>
                  </div>
                  
                  <div class="requirement-item">
                    <h4>Операционная система</h4>
                    <ul>
                      <li>Windows 10/11</li>
                      <li>macOS 10.15+</li>
                      <li>Linux (Ubuntu 18.04+)</li>
                    </ul>
                  </div>
                  
                  <div class="requirement-item">
                    <h4>Железо</h4>
                    <ul>
                      <li>RAM: 4 ГБ (рекомендуется 8 ГБ)</li>
                      <li>Видеокарта с поддержкой WebGL 2.0</li>
                      <li>Стабильное интернет-соединение</li>
                    </ul>
                  </div>
                </div>
                
                <h3>Первый вход</h3>
                <ol class="step-list">
                  <li>Перейдите на сайт gaznetcad.com</li>
                  <li>Нажмите кнопку "Демо"</li>
                  <li>Ознакомьтесь с интерфейсом</li>
                  <li>Изучите основные функции</li>
                  <li>Начните создание первого проекта</li>
                </ol>
              </div>
            </section>

            <!-- First Project -->
            <section id="first-project" class="doc-section">
              <h2 class="section-title">Создание первого проекта</h2>
              <div class="section-content">
                <p>
                  Пошаговое руководство по созданию простого проекта газораспределительной сети.
                </p>
                
                <div class="tutorial-steps">
                  <div class="tutorial-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h4>Создание нового проекта</h4>
                      <p>
                        Нажмите кнопку "Новый проект" на главной странице. 
                        Введите название проекта и выберите тип газовой сети.
                      </p>
                    </div>
                  </div>
                  
                  <div class="tutorial-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h4>Добавление точек маршрута</h4>
                      <p>
                        Кликните на карте для добавления точек маршрута. 
                        Первая точка — источник газа, последующие — потребители.
                      </p>
                    </div>
                  </div>
                  
                  <div class="tutorial-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h4>Настройка параметров</h4>
                      <p>
                        В панели параметров укажите давление, материал трубопровода 
                        и другие характеристики системы.
                      </p>
                    </div>
                  </div>
                  
                  <div class="tutorial-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                      <h4>Запуск расчёта</h4>
                      <p>
                        Нажмите кнопку "Рассчитать" для выполнения гидравлических 
                        расчётов и оптимизации диаметров.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="warning-box">
                  <h4>⚠️ Важно</h4>
                  <p>
                    Убедитесь, что все обязательные параметры заполнены перед запуском расчёта. 
                    Незаполненные поля будут подсвечены красным цветом.
                  </p>
                </div>
              </div>
            </section>

            <!-- Design -->
            <section id="design" class="doc-section">
              <h2 class="section-title">Проектирование</h2>
              <div class="section-content">
                <p>
                  Инструменты проектирования позволяют создавать сложные газораспределительные сети 
                  с учётом топографии, препятствий и технических ограничений.
                </p>
                
                <h3>Инструменты рисования</h3>
                <div class="tools-grid">
                  <div class="tool-item">
                    <div class="tool-icon">📍</div>
                    <h4>Точка</h4>
                    <p>Добавление узловых точек сети</p>
                  </div>
                  
                  <div class="tool-item">
                    <div class="tool-icon">📏</div>
                    <h4>Линия</h4>
                    <p>Создание участков трубопровода</p>
                  </div>
                  
                  <div class="tool-item">
                    <div class="tool-icon">🔄</div>
                    <h4>Ответвление</h4>
                    <p>Создание разветвлений сети</p>
                  </div>
                  
                  <div class="tool-item">
                    <div class="tool-icon">⚙️</div>
                    <h4>Оборудование</h4>
                    <p>Размещение арматуры и приборов</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Calculations -->
            <section id="calculations" class="doc-section">
              <h2 class="section-title">Гидравлические расчёты</h2>
              <div class="section-content">
                <p>
                  Система автоматически выполняет сложные гидравлические расчёты 
                  в соответствии с действующими нормативами.
                </p>
                
                <h3>Типы расчётов</h3>
                <ul class="calculation-types">
                  <li>
                    <strong>Расчёт потерь давления</strong> — определение падения давления по длине трубопровода
                  </li>
                  <li>
                    <strong>Подбор диаметров</strong> — автоматический выбор оптимальных диаметров труб
                  </li>
                  <li>
                    <strong>Расчёт расходов</strong> — распределение потоков газа по участкам сети
                  </li>
                  <li>
                    <strong>Проверка на прочность</strong> — контроль допустимых напряжений в трубах
                  </li>
                </ul>
                
                <div class="code-example">
                  <h4>Пример формулы расчёта</h4>
                  <pre><code>ΔP = λ × (L/D) × (ρ × v²/2)

где:
ΔP — потери давления, Па
λ — коэффициент гидравлического сопротивления
L — длина участка, м
D — внутренний диаметр трубы, м
ρ — плотность газа, кг/м³
v — скорость потока, м/с</code></pre>
                </div>
              </div>
            </section>

            <!-- FAQ -->
            <section id="faq" class="doc-section">
              <h2 class="section-title">Часто задаваемые вопросы</h2>
              <div class="section-content">
                <div class="faq-list">
                  <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
                    <div class="faq-question" @click="toggleFAQ(index)">
                      <h4>{{ faq.question }}</h4>
                      <span class="faq-toggle" :class="{ active: faq.isOpen }">+</span>
                    </div>
                    <div class="faq-answer" v-show="faq.isOpen">
                      <p>{{ faq.answer }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </section>

    <!-- Help Section -->
    <section class="help-section">
      <div class="container">
        <div class="help-content">
          <h2>Нужна дополнительная помощь?</h2>
          <p>Наша команда готова ответить на ваши вопросы</p>
          <div class="help-actions">
            <button class="btn-primary" @click="$router.push('/contact')">
              Связаться с поддержкой
            </button>
            <button class="btn-secondary" @click="$router.push('/demo')">
              Попробовать демо
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const searchQuery = ref('')
const activeSection = ref('introduction')

const faqs = ref([
  {
    question: 'Как импортировать существующий проект из AutoCAD?',
    answer: 'Используйте функцию "Импорт" в меню "Файл". Поддерживаются форматы DWG и DXF. После импорта система автоматически распознает элементы газовой сети.',
    isOpen: false
  },
  {
    question: 'Можно ли работать с проектом офлайн?',
    answer: 'Основные функции проектирования доступны офлайн. Для синхронизации данных, ИИ-оптимизации и совместной работы требуется интернет-соединение.',
    isOpen: false
  },
  {
    question: 'Как настроить пользовательские материалы?',
    answer: 'Перейдите в раздел "Настройки" → "Материалы". Добавьте новый материал, указав его физические свойства и нормативные характеристики.',
    isOpen: false
  },
  {
    question: 'Что делать, если расчёт не сходится?',
    answer: 'Проверьте корректность исходных данных, особенно граничные условия и расходы. Убедитесь, что сеть топологически связна. При необходимости обратитесь в техподдержку.',
    isOpen: false
  }
])

const handleSearch = () => {
  // Здесь была бы логика поиска по документации
  console.log('Поиск:', searchQuery.value)
}

const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleFAQ = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

// Отслеживание активной секции при скролле
const handleScroll = () => {
  const sections = ['introduction', 'installation', 'first-project', 'design', 'calculations', 'faq']
  
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom > 100) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.documentation-page {
  background: $color-background;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-4;
}

// Header
.docs-header {
  padding: $space-12 0 $space-8;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  
  .header-content {
    text-align: center;
    
    .header-title {
      font-size: $font-size-4xl;
      font-weight: $font-weight-bold;
      margin-bottom: $space-4;
      color: white;
    }
    
    .header-subtitle {
      font-size: $font-size-lg;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: $space-8;
    }
  }
}

.search-section {
  max-width: 500px;
  margin: 0 auto;
  
  .search-input-wrapper {
    position: relative;
    
    .search-input {
      width: 100%;
      padding: $space-4 $space-12 $space-4 $space-4;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: $radius-lg;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: $font-size-lg;
      backdrop-filter: blur(10px);
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
      
      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
      }
    }
    
    .search-icon {
      position: absolute;
      right: $space-4;
      top: 50%;
      transform: translateY(-50%);
      font-size: $font-size-lg;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

// Content Layout
.docs-content {
  padding: $space-8 0 $space-16;
}

.docs-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: $space-8;
  align-items: start;
}

// Sidebar
.docs-sidebar {
  position: sticky;
  top: $space-8;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-6;
  max-height: calc(100vh - 2 * $space-8);
  overflow-y: auto;
}

.docs-nav {
  .nav-section {
    margin-bottom: $space-6;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .nav-title {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: $space-3;
    }
    
    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: $space-1;
        
        a {
          display: block;
          padding: $space-2 $space-3;
          color: $color-text-primary;
          text-decoration: none;
          border-radius: $radius-md;
          transition: all $duration-normal;
          
          &:hover {
            background: $color-surface-hover;
            color: $color-primary;
          }
          
          &.active {
            background: rgba(0, 212, 255, 0.1);
            color: $color-primary;
            font-weight: $font-weight-medium;
          }
        }
      }
    }
  }
}

// Main Content
.docs-main {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-8;
}

.doc-section {
  margin-bottom: $space-12;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .section-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $space-6;
    padding-bottom: $space-3;
    border-bottom: 2px solid $color-border;
  }
  
  .section-content {
    line-height: $line-height-relaxed;
    color: $color-text-secondary;
    
    h3 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      margin: $space-6 0 $space-4 0;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    h4 {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      margin: $space-4 0 $space-2 0;
    }
    
    p {
      margin-bottom: $space-4;
    }
    
    ul, ol {
      margin-bottom: $space-4;
      padding-left: $space-6;
      
      li {
        margin-bottom: $space-2;
      }
    }
  }
}

// Special Content Blocks
.info-box, .warning-box {
  padding: $space-4;
  border-radius: $radius-md;
  margin: $space-6 0;
  
  h4 {
    margin: 0 0 $space-2 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
  }
  
  p {
    margin: 0;
  }
}

.info-box {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  
  h4 {
    color: #3b82f6;
  }
}

.warning-box {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  
  h4 {
    color: #f59e0b;
  }
}

// Requirements Grid
.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $space-6;
  margin: $space-6 0;
  
  .requirement-item {
    background: white;
    padding: $space-4;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    
    h4 {
      color: $color-primary;
      margin-bottom: $space-3;
    }
    
    ul {
      margin: 0;
      padding-left: $space-4;
      
      li {
        margin-bottom: $space-1;
        font-size: $font-size-sm;
      }
    }
  }
}

// Tutorial Steps
.tutorial-steps {
  margin: $space-6 0;
  
  .tutorial-step {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    margin-bottom: $space-6;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .step-number {
      min-width: 40px;
      height: 40px;
      background: $color-primary;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: $font-weight-bold;
      flex-shrink: 0;
    }
    
    .step-content {
      h4 {
        margin: 0 0 $space-2 0;
        color: $color-text-primary;
      }
      
      p {
        margin: 0;
        line-height: $line-height-relaxed;
      }
    }
  }
}

// Tools Grid
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-4;
  margin: $space-6 0;
  
  .tool-item {
    background: white;
    padding: $space-4;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    text-align: center;
    transition: all $duration-normal;
    
    &:hover {
      border-color: $color-primary;
      transform: translateY(-2px);
    }
    
    .tool-icon {
      font-size: $font-size-2xl;
      margin-bottom: $space-2;
    }
    
    h4 {
      color: $color-text-primary;
      margin-bottom: $space-1;
    }
    
    p {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin: 0;
    }
  }
}

// Code Examples
.code-example {
  margin: $space-6 0;
  
  h4 {
    margin-bottom: $space-3;
  }
  
  pre {
    background: #1a1a1a;
    color: #f8f8f2;
    padding: $space-4;
    border-radius: $radius-md;
    overflow-x: auto;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: $font-size-sm;
    line-height: $line-height-relaxed;
    margin: 0;
  }
}

// FAQ
.faq-list {
  .faq-item {
    background: white;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    margin-bottom: $space-4;
    overflow: hidden;
    
    &:last-child {
      margin-bottom: 0;
    }
    
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
      
      h4 {
        margin: 0;
        color: $color-text-primary;
      }
      
      .faq-toggle {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-primary;
        transition: transform $duration-normal;
        
        &.active {
          transform: rotate(45deg);
        }
      }
    }
    
    .faq-answer {
      padding: 0 $space-6 $space-4;
      color: $color-text-secondary;
      
      p {
        margin: 0;
        line-height: $line-height-relaxed;
      }
    }
  }
}

// Help Section
.help-section {
  padding: $space-16 0;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  color: white;
  text-align: center;
  
  .help-content {
    h2 {
      font-size: $font-size-2xl;
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
  
  .help-actions {
    display: flex;
    justify-content: center;
    gap: $space-4;
    flex-wrap: wrap;
    
    .btn-primary, .btn-secondary {
      padding: $space-3 $space-6;
      border-radius: $radius-lg;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $duration-normal;
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
  .docs-layout {
    grid-template-columns: 1fr;
    gap: $space-6;
  }
  
  .docs-sidebar {
    position: static;
    max-height: none;
  }
  
  .docs-main {
    padding: $space-6;
  }
  
  .requirements-grid {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .help-actions {
    flex-direction: column;
    align-items: center;
    
    .btn-primary, .btn-secondary {
      width: 100%;
      max-width: 300px;
    }
  }
}
</style> 