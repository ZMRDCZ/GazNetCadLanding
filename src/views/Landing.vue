<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Демонстрация проектирования 
              <span class="text-gradient">газовых сетей</span>
            </h1>
            <p class="hero-subtitle">
              Автоматизированная система для проектирования газораспределительных сетей. 
              Экономьте до 40 часов на каждом проекте с соблюдением всех российских стандартов.
            </p>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-number">30%</span>
                <span class="stat-label">быстрее</span>
              </div>
              <div class="stat">
                <span class="stat-number">40ч</span>
                <span class="stat-label">экономия</span>
              </div>
              <div class="stat">
                <span class="stat-number">100%</span>
                <span class="stat-label">ГОСТ</span>
              </div>
            </div>
            <div class="hero-actions">
              <button @click="goToDemo" class="btn btn-primary btn-large">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Попробовать демо
              </button>
              <button @click="goToDocumentation" class="btn btn-secondary btn-large">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Документация
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card">
              <div class="card-header">
                <div class="card-title">Проект газопровода</div>
                <div class="card-status">
                  <div class="status-indicator status-success"></div>
                  Расчет завершен
                </div>
              </div>
              <div class="pipeline-demo">
                <svg viewBox="0 0 300 150" class="pipeline-svg">
                  <defs>
                    <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#3b82f6"/>
                      <stop offset="100%" style="stop-color:#10b981"/>
                    </linearGradient>
                  </defs>
                  <path d="M20 75 Q100 50 200 75 T280 75" 
                        stroke="url(#pipeGradient)" 
                        stroke-width="4" 
                        fill="none"/>
                  <circle cx="20" cy="75" r="4" fill="#3b82f6"/>
                  <circle cx="150" cy="65" r="4" fill="#10b981"/>
                  <circle cx="280" cy="75" r="4" fill="#3b82f6"/>
                </svg>
              </div>
              <div class="metrics">
                <div class="metric">
                  <span class="metric-label">Давление</span>
                  <span class="metric-value">0.3 МПа</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Расход</span>
                  <span class="metric-value">150 м³/ч</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Диаметр</span>
                  <span class="metric-value">110 мм</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Ключевые возможности</h2>
          <p class="section-subtitle">
            Полный цикл проектирования газораспределительных сетей в одной системе
          </p>
        </div>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.id" class="feature-card">
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-specs">{{ feature.specs }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits">
      <div class="container">
        <div class="benefits-content">
          <div class="benefits-text">
            <h2 class="section-title">Почему выбирают GazNetCAD</h2>
            <div class="benefits-list">
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div class="benefit-content">
                  <h3>Автоматическая трассировка</h3>
                  <p>Система автоматически строит оптимальные маршруты газопроводов с учетом всех ограничений</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="benefit-content">
                  <h3>Соответствие ГОСТ</h3>
                  <p>Встроенная проверка соответствия российским стандартам и строительным нормам</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                  </svg>
                </div>
                <div class="benefit-content">
                  <h3>База данных материалов</h3>
                  <p>Актуальная база трубопроводной арматуры и материалов с 15,000+ элементов</p>
                </div>
              </div>
            </div>
          </div>
          <div class="benefits-visual">
            <div class="comparison-card">
              <h3>Преимущества системы</h3>
              <div class="comparison-item">
                <span class="comparison-label">Автоматизация</span>
                <div class="comparison-bar">
                  <div class="comparison-fill" style="width: 90%"></div>
                </div>
                <span class="comparison-value">90%</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">Точность расчетов</span>
                <div class="comparison-bar">
                  <div class="comparison-fill" style="width: 95%"></div>
                </div>
                <span class="comparison-value">95%</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">Соответствие ГОСТ</span>
                <div class="comparison-bar">
                  <div class="comparison-fill" style="width: 100%"></div>
                </div>
                <span class="comparison-value">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Пример бизнес-процесса -->
    <section class="case-study">
      <div class="container">
        <div class="case-study-content">
          <div class="case-info">
            <span class="case-badge">Пример бизнес-процесса</span>
            <h2 class="case-title">Автоматизация проектирования газовых сетей</h2>
            <p class="case-description">
              GazNetCAD позволяет выполнять полный цикл работ — от трассировки до расчётов и подготовки исполнительных документов — в единой системе. Это сокращает сроки, снижает количество ошибок и автоматизирует отчётность для проектных и газораспределительных организаций.
            </p>
            <div class="case-metrics">
              <div class="case-metric">
                <span class="metric-value">4 часа</span>
                <span class="metric-label">на подготовку проекта</span>
              </div>
              <div class="case-metric">
                <span class="metric-value">0</span>
                <span class="metric-label">ошибок в документации</span>
              </div>
            </div>
          </div>
          <div class="case-visual">
            <div class="time-comparison">
              <div class="time-item">
                <div class="time-label">Ручной процесс</div>
                <div class="time-bar old">
                  <div class="time-fill" style="width: 100%"></div>
                </div>
                <div class="time-value">5 дней</div>
              </div>
              <div class="time-item">
                <div class="time-label">С GazNetCAD</div>
                <div class="time-bar new">
                  <div class="time-fill" style="width: 8%"></div>
                </div>
                <div class="time-value">4 часа</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Integration Section -->
    <section class="integration">
      <div class="container">
        <div class="integration-content">
          <div class="integration-text">
            <span class="integration-badge">Интеграция</span>
            <h2 class="integration-title">
              <span class="gaznetcad-text">GazNetCAD</span> + 
              <span class="datagazcore-text">DataGazCore</span>
            </h2>
            <p class="integration-description">
              Две мощные системы, которые переплетаются и дополняют друг друга, создавая единую экосистему для проектирования газовых сетей. 
              <span class="gaznetcad-text">GazNetCAD</span> — холодный неоновый тёмный инструмент для проектирования, 
              <span class="datagazcore-text">DataGazCore</span> — светлый оранжевый горячий источник знаний и данных.
            </p>
            <div class="integration-features">
              <div class="integration-feature">
                <div class="feature-icon gaznetcad-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h3>GazNetCAD</h3>
                  <p>Холодный неоновый тёмный инструмент для автоматизированного проектирования газовых сетей</p>
                </div>
              </div>
              <div class="integration-feature">
                <div class="feature-icon datagazcore-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h3>DataGazCore</h3>
                  <p>Светлый оранжевый горячий источник знаний, нормативов и технических данных</p>
                </div>
              </div>
            </div>
            <div class="integration-benefits">
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span>Мгновенный доступ к актуальным нормативным данным</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span>Автоматическая проверка соответствия стандартам</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                  </svg>
                </div>
                <span>Единая база знаний для всех проектов</span>
              </div>
            </div>
          </div>
          <div class="integration-visual">
            <div class="ecosystem-diagram">
              <div class="ecosystem-node gaznetcad-node">
                <div class="node-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/>
                  </svg>
                </div>
                <div class="node-label">GazNetCAD</div>
                <div class="node-description">Проектирование</div>
              </div>
              <div class="ecosystem-connection">
                <div class="connection-line"></div>
                <div class="connection-pulse"></div>
              </div>
              <div class="ecosystem-node datagazcore-node">
                <div class="node-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div class="node-label">DataGazCore</div>
                <div class="node-description">База знаний</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Готовы попробовать демо?</h2>
          <p class="cta-subtitle">
            Ознакомьтесь с возможностями GazNetCAD для проектирования газовых сетей
          </p>
          <div class="cta-actions">
            <button @click="goToDemo" class="btn btn-primary btn-large">
              Попробовать демо
            </button>
            <button @click="goToContact" class="btn btn-outline btn-large">
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact">
      <div class="container">
        <div class="contact-content">
          <div class="section-header">
            <h2 class="section-title">Контакты</h2>
            <p class="section-subtitle">
              Свяжитесь с нами для получения дополнительной информации о GazNetCAD
            </p>
          </div>
          <div class="contact-grid">
            <div class="contact-card">
              <div class="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="contact-title">Email</h3>
              <a href="mailto:komarovda@seznam.cz" class="contact-link">komarovda@seznam.cz</a>
            </div>
            <div class="contact-card">
              <div class="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h3 class="contact-title">Телефон</h3>
              <a href="tel:+89951173629" class="contact-link">+8 (995) 117-36-29</a>
            </div>
            <div class="contact-card">
              <div class="contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
                </svg>
              </div>
              <h3 class="contact-title">Telegram</h3>
              <a href="https://t.me/zmrdcz" target="_blank" rel="noopener noreferrer" class="contact-link">@zmrdcz</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-brand">
              <h3 class="footer-logo">GazNetCAD</h3>
              <p class="footer-description">
                Автоматизированная система для проектирования газораспределительных сетей
              </p>
            </div>
            <div class="footer-social">
              <a href="#" class="social-link" title="Telegram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Продукт</h4>
            <ul class="footer-links">
              <li><a href="#" @click="goToDemo">Демо</a></li>
              <li><a href="#" @click="goToDocumentation">Документация</a></li>
              <li><a href="#" @click="goToContact">Поддержка</a></li>
              <li><a href="#" @click="goToContact">Обновления</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Компания</h4>
            <ul class="footer-links">
              <li><a href="#" @click="goToContact">О нас</a></li>
              <li><a href="#" @click="goToContact">Контакты</a></li>
              <li><a href="#" @click="goToContact">Партнеры</a></li>
              <li><a href="#" @click="goToContact">Вакансии</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Правовая информация</h4>
            <ul class="footer-links">
              <li><a href="#" @click="goToContact">Политика конфиденциальности</a></li>
              <li><a href="#" @click="goToContact">Условия использования</a></li>
              <li><a href="#" @click="goToContact">Лицензионное соглашение</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2024 GazNetCAD. Все права защищены.</p>
          </div>
          <div class="footer-version">
            <span>Версия 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Features data
const features = ref([
  {
    id: 1,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/></svg>',
    title: 'Автотрассировка',
    description: 'Автоматическое построение оптимальных маршрутов газопроводов',
    specs: 'Экономия: 80% времени'
  },
  {
    id: 2,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
    title: 'Гидравлический расчет',
    description: 'Точный расчет давлений и расходов в газопроводной сети',
    specs: 'Точность: ±0.5%'
  },
  {
    id: 3,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    title: 'Проверка ГОСТ',
    description: 'Автоматическая проверка соответствия российским стандартам',
    specs: 'Стандарты: ГОСТ, СП, СНиП'
  },
  {
    id: 4,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    title: 'Техническая документация',
    description: 'Автоматическое создание рабочих чертежей и спецификаций',
    specs: 'Формат: DWG, PDF, Excel'
  },
  {
    id: 5,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    title: 'Оптимизация сетей',
    description: 'Поиск оптимальных решений по стоимости и надежности',
    specs: 'Экономия: до 15% материалов'
  },
  {
    id: 6,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>',
    title: 'База данных материалов',
    description: 'Актуальная база трубопроводной арматуры и материалов',
    specs: 'Элементов: 15,000+'
  }
])

// Methods
const goToDemo = () => {
  router.push('/demo')
}

const goToDocumentation = () => {
  router.push('/documentation')
}

const goToContact = () => {
  router.push('/contact')
}

onMounted(() => {
  // Set page title
  document.title = 'GazNetCAD - Демонстрация проектирования газовых сетей'
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.landing-page {
  min-height: 100vh;
  background: $dark-bg;
  color: $dark-text-primary;
}

// Hero Section
.hero {
  padding: 120px 0 80px;
  background: linear-gradient(135deg, $dark-bg 0%, $dark-surface 50%, $dark-bg 100%);
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 24px;
    
    .text-gradient {
      @include text-gradient;
    }
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: $dark-text-secondary;
    line-height: 1.6;
    margin-bottom: 32px;
  }
  
  .hero-stats {
    display: flex;
    gap: 32px;
    margin-bottom: 40px;
    
    @media (max-width: 480px) {
      justify-content: center;
    }
    
    .stat {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: $primary;
      }
      
      .stat-label {
        color: $dark-text-muted;
        font-size: 0.875rem;
      }
    }
  }
  
  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    
    @media (max-width: 480px) {
      justify-content: center;
    }
  }
  
  .hero-visual {
    display: flex;
    justify-content: center;
  }
  
  .hero-card {
    @include modern-card;
    width: 100%;
    max-width: 400px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      .card-title {
        font-weight: 600;
        color: $dark-text-primary;
      }
      
      .card-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
        color: $dark-text-secondary;
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          
          &.status-success {
            background: $secondary;
            box-shadow: 0 0 8px rgba($secondary, 0.5);
          }
        }
      }
    }
    
    .pipeline-demo {
      margin-bottom: 24px;
      
      .pipeline-svg {
        width: 100%;
        height: 80px;
      }
    }
    
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      
      .metric {
        text-align: center;
        
        .metric-label {
          display: block;
          font-size: 0.75rem;
          color: $dark-text-muted;
          margin-bottom: 4px;
        }
        
        .metric-value {
          display: block;
          font-weight: 600;
          color: $primary;
        }
      }
    }
  }
}

// Features Section
.features {
  padding: 80px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 64px;
    
    .section-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 16px;
      @include text-gradient;
    }
    
    .section-subtitle {
      font-size: 1.125rem;
      color: $dark-text-secondary;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
  }
  
  .feature-card {
    @include modern-card;
    text-align: center;
    
    .feature-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      padding: 16px;
      background: rgba($primary, 0.1);
      border-radius: 16px;
      color: $primary;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: $dark-text-primary;
    }
    
    .feature-description {
      color: $dark-text-secondary;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    
    .feature-specs {
      font-size: 0.875rem;
      color: $secondary;
      font-weight: 500;
    }
  }
}

// Benefits Section
.benefits {
  padding: 80px 0;
  background: rgba($dark-surface, 0.5);
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .benefits-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 40px;
    @include text-gradient;
  }
  
  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .benefit-item {
    display: flex;
    gap: 20px;
    
    .benefit-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      padding: 12px;
      background: rgba($primary, 0.1);
      border-radius: 12px;
      color: $primary;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    .benefit-content {
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: $dark-text-primary;
      }
      
      p {
        color: $dark-text-secondary;
        line-height: 1.6;
      }
    }
  }
  
  .comparison-card {
    @include modern-card;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 24px;
      text-align: center;
      color: $dark-text-primary;
    }
    
    .comparison-item {
      display: grid;
      grid-template-columns: 100px 1fr 80px;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .comparison-label {
        font-size: 0.875rem;
        color: $dark-text-secondary;
      }
      
      .comparison-bar {
        height: 8px;
        background: rgba($gray-600, 0.3);
        border-radius: 4px;
        overflow: hidden;
        
        .comparison-fill {
          height: 100%;
          background: linear-gradient(90deg, $primary, $secondary);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
      }
      
      .comparison-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: $dark-text-primary;
        text-align: right;
      }
    }
  }
}

// Case Study Section
.case-study {
  padding: 80px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .case-study-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .case-badge {
    display: inline-block;
    padding: 4px 12px;
    background: rgba($secondary, 0.1);
    color: $secondary;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .case-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: $dark-text-primary;
  }
  
  .case-description {
    color: $dark-text-secondary;
    line-height: 1.6;
    margin-bottom: 32px;
  }
  
  .case-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    
    .case-metric {
      text-align: center;
      
      .metric-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: $secondary;
        margin-bottom: 4px;
      }
      
      .metric-label {
        color: $dark-text-muted;
        font-size: 0.875rem;
      }
    }
  }
  
  .time-comparison {
    @include modern-card;
    
    .time-item {
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .time-label {
        font-size: 0.875rem;
        color: $dark-text-secondary;
        margin-bottom: 8px;
      }
      
      .time-bar {
        height: 32px;
        background: rgba($gray-600, 0.2);
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 8px;
        
        .time-fill {
          height: 100%;
          border-radius: 16px;
          transition: width 0.8s ease;
        }
        
        &.old .time-fill {
          background: linear-gradient(90deg, #ef4444, #f97316);
        }
        
        &.new .time-fill {
          background: linear-gradient(90deg, $primary, $secondary);
        }
      }
      
      .time-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: $dark-text-primary;
      }
    }
  }
}

// Integration Section
.integration {
  padding: 80px 0;
  background: linear-gradient(135deg, $dark-bg 0%, rgba($dark-surface, 0.3) 50%, $dark-bg 100%);
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .integration-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .integration-badge {
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, rgba($neon-primary, 0.1), rgba($neon-orange, 0.1));
    color: $neon-primary;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 16px;
    border: 1px solid rgba($neon-primary, 0.2);
  }
  
  .integration-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    line-height: 1.2;
    
    .gaznetcad-text {
      background: linear-gradient(135deg, $neon-primary, $neon-cyan);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 20px rgba($neon-primary, 0.3);
    }
    
    .datagazcore-text {
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 20px rgba(#ff6b35, 0.3);
    }
  }
  
  .integration-description {
    color: $dark-text-secondary;
    line-height: 1.7;
    margin-bottom: 32px;
    font-size: 1.125rem;
    
    .gaznetcad-text {
      color: $neon-primary;
      font-weight: 500;
    }
    
    .datagazcore-text {
      color: #ff6b35;
      font-weight: 500;
    }
  }
  
  .integration-features {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
    
    .integration-feature {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: rgba($dark-surface, 0.5);
      border-radius: 16px;
      border: 1px solid rgba($dark-border, 0.5);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        border-color: rgba($neon-primary, 0.3);
        box-shadow: 0 8px 32px rgba($neon-primary, 0.1);
      }
      
      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        svg {
          width: 24px;
          height: 24px;
        }
        
        &.gaznetcad-icon {
          background: linear-gradient(135deg, rgba($neon-primary, 0.1), rgba($neon-cyan, 0.1));
          border: 1px solid rgba($neon-primary, 0.3);
          color: $neon-primary;
        }
        
        &.datagazcore-icon {
          background: linear-gradient(135deg, rgba(#ff6b35, 0.1), rgba(#f7931e, 0.1));
          border: 1px solid rgba(#ff6b35, 0.3);
          color: #ff6b35;
        }
      }
      
      .feature-content {
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: $dark-text-primary;
        }
        
        p {
          color: $dark-text-secondary;
          line-height: 1.5;
          margin: 0;
        }
      }
    }
  }
  
  .integration-benefits {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .benefit-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba($secondary, 0.1);
        color: $secondary;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
      
      span {
        color: $dark-text-secondary;
        font-size: 0.875rem;
      }
    }
  }
  
  .ecosystem-diagram {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 40px;
    background: rgba($dark-surface, 0.3);
    border-radius: 24px;
    border: 1px solid rgba($dark-border, 0.5);
    position: relative;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 20px;
    }
    
    .ecosystem-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      border-radius: 16px;
      transition: all 0.3s ease;
      
      .node-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          width: 32px;
          height: 32px;
        }
      }
      
      .node-label {
        font-size: 1.125rem;
        font-weight: 600;
        text-align: center;
      }
      
      .node-description {
        font-size: 0.875rem;
        color: $dark-text-secondary;
        text-align: center;
      }
      
      &.gaznetcad-node {
        background: linear-gradient(135deg, rgba($neon-primary, 0.05), rgba($neon-cyan, 0.05));
        border: 1px solid rgba($neon-primary, 0.2);
        
        .node-icon {
          background: linear-gradient(135deg, rgba($neon-primary, 0.1), rgba($neon-cyan, 0.1));
          border: 1px solid rgba($neon-primary, 0.3);
          color: $neon-primary;
        }
        
        .node-label {
          color: $neon-primary;
        }
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba($neon-primary, 0.15);
        }
      }
      
      &.datagazcore-node {
        background: linear-gradient(135deg, rgba(#ff6b35, 0.05), rgba(#f7931e, 0.05));
        border: 1px solid rgba(#ff6b35, 0.2);
        
        .node-icon {
          background: linear-gradient(135deg, rgba(#ff6b35, 0.1), rgba(#f7931e, 0.1));
          border: 1px solid rgba(#ff6b35, 0.3);
          color: #ff6b35;
        }
        
        .node-label {
          color: #ff6b35;
        }
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(#ff6b35, 0.15);
        }
      }
    }
    
    .ecosystem-connection {
      position: relative;
      width: 80px;
      height: 4px;
      
      @media (max-width: 768px) {
        width: 4px;
        height: 40px;
      }
      
      .connection-line {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, $neon-primary, #ff6b35);
        border-radius: 2px;
        position: relative;
        overflow: hidden;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: pulse-flow 2s infinite;
        }
      }
      
      .connection-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: $neon-primary;
        border-radius: 50%;
        animation: pulse 2s infinite;
        
        @media (max-width: 768px) {
          top: 50%;
          left: 50%;
        }
      }
    }
  }
}

@keyframes pulse-flow {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.5;
  }
}

// CTA Section
.cta {
  padding: 80px 0;
  background: rgba($dark-surface, 0.5);
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .cta-content {
    text-align: center;
    
    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      @include text-gradient;
    }
    
    .cta-subtitle {
      font-size: 1.125rem;
      color: $dark-text-secondary;
      line-height: 1.6;
      margin-bottom: 40px;
    }
    
    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}

// Contact Section
.contact {
  padding: 80px 0;
  background: $dark-bg;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .contact-content {
    .section-header {
      text-align: center;
      margin-bottom: 60px;
      
      .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 16px;
        @include text-gradient;
      }
      
      .section-subtitle {
        font-size: 1.125rem;
        color: $dark-text-secondary;
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
      }
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
    
    .contact-card {
      @include modern-card;
      text-align: center;
      padding: 40px 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 60px rgba($primary, 0.15);
      }
      
      .contact-icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba($primary, 0.1), rgba($neon-cyan, 0.1));
        border: 1px solid rgba($primary, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        transition: all 0.3s ease;
        
        svg {
          width: 32px;
          height: 32px;
          color: $primary;
        }
      }
      
      .contact-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: $dark-text-primary;
        margin-bottom: 12px;
      }
      
      .contact-link {
        color: $primary;
        text-decoration: none;
        font-size: 1.125rem;
        font-weight: 500;
        transition: all 0.2s ease;
        
        &:hover {
          color: $neon-cyan;
          text-decoration: underline;
        }
      }
    }
  }
}

// Button Styles
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  .icon {
    width: 20px;
    height: 20px;
  }
  
  &.btn-large {
    padding: 16px 32px;
    font-size: 1.125rem;
    
    .icon {
      width: 24px;
      height: 24px;
    }
  }
  
  &.btn-primary {
    @include modern-button($primary);
  }
  
  &.btn-secondary {
    background: rgba($secondary, 0.1);
    border: 1px solid rgba($secondary, 0.3);
    color: $secondary;
    
    &:hover {
      background: rgba($secondary, 0.2);
      border-color: $secondary;
      transform: translateY(-2px);
      @include subtle-glow($secondary);
    }
  }
  
  &.btn-outline {
    background: transparent;
    border: 1px solid rgba($dark-text-secondary, 0.3);
    color: $dark-text-secondary;
    
    &:hover {
      background: rgba($primary, 0.1);
      border-color: $primary;
      color: $primary;
      transform: translateY(-2px);
    }
  }
}

// Footer Styles
.footer {
  background: $dark-surface;
  border-top: 1px solid rgba($gray-600, 0.2);
  padding: 60px 0 20px;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 60px;
    margin-bottom: 40px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .footer-section {
    .footer-brand {
      margin-bottom: 24px;
      
      .footer-logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: $primary;
        margin-bottom: 12px;
      }
      
      .footer-description {
        color: $dark-text-secondary;
        line-height: 1.6;
        font-size: 0.875rem;
      }
    }
    
    .footer-social {
      display: flex;
      gap: 12px;
      
      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: rgba($gray-600, 0.2);
        color: $dark-text-secondary;
        transition: all 0.2s ease;
        
        svg {
          width: 20px;
          height: 20px;
        }
        
        &:hover {
          background: $primary;
          color: white;
          transform: translateY(-2px);
        }
      }
    }
    
    .footer-title {
      font-size: 1rem;
      font-weight: 600;
      color: $dark-text-primary;
      margin-bottom: 20px;
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 12px;
        
        a {
          color: $dark-text-secondary;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
          
          &:hover {
            color: $primary;
          }
        }
      }
    }
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid rgba($gray-600, 0.2);
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .footer-copyright {
      p {
        color: $dark-text-muted;
        font-size: 0.875rem;
        margin: 0;
      }
    }
    
    .footer-version {
      span {
        color: $dark-text-muted;
        font-size: 0.875rem;
        padding: 4px 12px;
        background: rgba($gray-600, 0.2);
        border-radius: 12px;
      }
    }
  }
}
</style>