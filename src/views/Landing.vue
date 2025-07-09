<template>
  <div class="landing">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="neon-grid"></div>
        <div class="floating-particles"></div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="highlight">GazNetCAD</span><br>
              Профессиональное проектирование<br>
              газораспределительных сетей
            </h1>
            <p class="hero-subtitle">
              Революционная платформа для 3D-моделирования, расчёта и оптимизации 
              газовых сетей с использованием ИИ и передовых технологий визуализации
            </p>
            
            <div class="hero-actions">
              <button @click="startDemo" class="btn-primary">
                <span class="btn-icon">🚀</span>
                Попробовать демо
              </button>
              <button @click="goToPricing" class="btn-secondary">
                <span class="btn-icon">💰</span>
                Тарифы
              </button>
              <button @click="goToAbout" class="btn-secondary">
                <span class="btn-icon">ℹ️</span>
                О нас
              </button>
            </div>
            
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-number">500+</span>
                <span class="stat-label">Проектов</span>
              </div>
              <div class="stat">
                <span class="stat-number">99.9%</span>
                <span class="stat-label">Точность</span>
              </div>
              <div class="stat">
                <span class="stat-number">50%</span>
                <span class="stat-label">Экономия времени</span>
              </div>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="demo-preview">
              <div class="preview-header">
                <div class="preview-controls">
                  <span class="control red"></span>
                  <span class="control yellow"></span>
                  <span class="control green"></span>
                </div>
                <span class="preview-title">GazNetCAD v2.0</span>
              </div>
              <div class="preview-content">
                <div class="pipeline-visualization">
                  <svg viewBox="0 0 300 200" class="pipeline-svg">
                    <defs>
                      <linearGradient id="pipelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#0099cc;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#006699;stop-opacity:1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <!-- Pipeline path -->
                    <path d="M 20 100 Q 100 50 180 100 Q 220 120 280 100" 
                          stroke="url(#pipelineGradient)" 
                          stroke-width="4" 
                          fill="none" 
                          filter="url(#glow)"
                          class="pipeline-path"/>
                    
                    <!-- Control points -->
                    <circle cx="20" cy="100" r="4" fill="#00ff88" class="control-point"/>
                    <circle cx="100" cy="50" r="4" fill="#00ff88" class="control-point"/>
                    <circle cx="180" cy="100" r="4" fill="#00ff88" class="control-point"/>
                    <circle cx="280" cy="100" r="4" fill="#00ff88" class="control-point"/>
                    
                    <!-- Gas flow animation -->
                    <circle r="3" fill="#00ff88" opacity="0.8">
                      <animateMotion dur="3s" repeatCount="indefinite">
                        <mpath href="#pipelinePath"/>
                      </animateMotion>
                    </circle>
                  </svg>
                  
                  <div class="pressure-indicators">
                    <div class="indicator high">
                      <span class="value">0.6 МПа</span>
                      <span class="label">Высокое</span>
                    </div>
                    <div class="indicator medium">
                      <span class="value">0.3 МПа</span>
                      <span class="label">Среднее</span>
                    </div>
                    <div class="indicator low">
                      <span class="value">0.005 МПа</span>
                      <span class="label">Низкое</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="features">
      <div class="container">
        <h2 class="section-title">Возможности платформы</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🏗️</div>
            <h3>3D Моделирование</h3>
            <p>Интерактивное 3D-проектирование газовых сетей с поддержкой всех современных стандартов</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🧮</div>
            <h3>Автоматические расчёты</h3>
            <p>Точные гидравлические расчёты давления, расхода и оптимизация диаметров трубопроводов</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>ИИ-оптимизация</h3>
            <p>Искусственный интеллект для автоматической оптимизации трассировки и снижения затрат</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Аналитика в реальном времени</h3>
            <p>KPI-дашборды, мониторинг эффективности и детальная отчётность по проектам</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔗</div>
            <h3>Интеграция CAD</h3>
            <p>Экспорт в AutoCAD, SolidWorks и другие популярные CAD-системы</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">☁️</div>
            <h3>Облачная синхронизация</h3>
            <p>Работа в команде с синхронизацией проектов и версионным контролем</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing">
      <div class="container">
        <h2 class="section-title">Тарифные планы</h2>
        
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Стартовый</h3>
              <div class="price">
                <span class="currency">₽</span>
                <span class="amount">9,990</span>
                <span class="period">/месяц</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>✅ До 10 проектов</li>
              <li>✅ Базовые расчёты</li>
              <li>✅ Экспорт в DWG</li>
              <li>✅ Email поддержка</li>
              <li>❌ ИИ-оптимизация</li>
              <li>❌ Командная работа</li>
            </ul>
            <button class="pricing-btn">Выбрать план</button>
          </div>
          
          <div class="pricing-card featured">
            <div class="pricing-badge">Популярный</div>
            <div class="pricing-header">
              <h3>Профессиональный</h3>
              <div class="price">
                <span class="currency">₽</span>
                <span class="amount">19,990</span>
                <span class="period">/месяц</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>✅ Неограниченно проектов</li>
              <li>✅ Все расчёты и анализ</li>
              <li>✅ ИИ-оптимизация</li>
              <li>✅ Экспорт во все форматы</li>
              <li>✅ Приоритетная поддержка</li>
              <li>✅ До 5 пользователей</li>
            </ul>
            <button class="pricing-btn primary">Выбрать план</button>
          </div>
          
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Корпоративный</h3>
              <div class="price">
                <span class="currency">₽</span>
                <span class="amount">49,990</span>
                <span class="period">/месяц</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>✅ Всё из Профессионального</li>
              <li>✅ Неограниченно пользователей</li>
              <li>✅ On-premise развёртывание</li>
              <li>✅ Кастомизация интерфейса</li>
              <li>✅ 24/7 поддержка</li>
              <li>✅ Персональный менеджер</li>
            </ul>
            <button class="pricing-btn">Связаться с нами</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы начать проектирование будущего?</h2>
          <p>Присоединяйтесь к сотням инженеров, которые уже используют GazNetCAD для создания эффективных газовых сетей</p>
          <div class="cta-actions">
            <button @click="startDemo" class="btn-primary large">
              Начать бесплатную демо-версию
            </button>
            <button class="btn-secondary large">
              Связаться с экспертом
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>GazNetCAD</h4>
            <p>Профессиональное решение для проектирования газораспределительных сетей</p>
          </div>
          <div class="footer-section">
            <h4>Продукт</h4>
            <ul>
              <li><a @click="scrollToFeatures" style="cursor: pointer;">Возможности</a></li>
              <li><a @click="goToPricing" style="cursor: pointer;">Цены</a></li>
              <li><a @click="startDemo" style="cursor: pointer;">Демо</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Поддержка</h4>
            <ul>
              <li><a @click="goToDocumentation" style="cursor: pointer;">Документация</a></li>
              <li><a @click="goToContact" style="cursor: pointer;">Контакты</a></li>
              <li><a @click="goToAbout" style="cursor: pointer;">О нас</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Контакты</h4>
            <p>📧 info@gaznetcad.ru</p>
            <p>📞 +7 (495) 123-45-67</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 GazNetCAD. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const featuresSection = ref<HTMLElement>()

const startDemo = () => {
  router.push('/demo')
}

const goToPricing = () => {
  router.push('/pricing')
}

const goToAbout = () => {
  router.push('/about')
}

const goToDocumentation = () => {
  router.push('/documentation')
}

const goToContact = () => {
  router.push('/contact')
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.landing {
  background: #0a0f1c;
  color: #ffffff;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.neon-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, rgba(0, 153, 255, 0.1) 1px, transparent 1px);
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  .highlight {
    background: linear-gradient(135deg, #00d4ff, #00ff88);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #b8c9d9;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &.large {
    padding: 1.25rem 2.5rem;
    font-size: 1.125rem;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  color: #0a0f1c;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.4);
  }
  
  &.primary {
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3);
    
    &:hover {
      box-shadow: 0 12px 40px rgba(0, 255, 136, 0.4);
    }
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(0, 212, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(0, 212, 255, 0.5);
    transform: translateY(-2px);
  }
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #00d4ff;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
  
  .stat-label {
    color: #b8c9d9;
    font-size: 0.875rem;
  }
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.demo-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  backdrop-filter: blur(20px);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27ca3f; }
}

.preview-title {
  font-size: 0.875rem;
  color: #b8c9d9;
}

.preview-content {
  padding: 2rem;
}

.pipeline-svg {
  width: 100%;
  height: 200px;
}

.pipeline-path {
  animation: pulse-pipeline 2s ease-in-out infinite;
}

@keyframes pulse-pipeline {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.control-point {
  animation: pulse-point 1.5s ease-in-out infinite;
}

@keyframes pulse-point {
  0%, 100% { r: 4; opacity: 1; }
  50% { r: 6; opacity: 0.8; }
}

.pressure-indicators {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.indicator {
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  
  .value {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .label {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  &.high {
    background: rgba(255, 87, 34, 0.2);
    color: #ff5722;
  }
  
  &.medium {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }
  
  &.low {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }
}

/* Features Section */
.features {
  padding: 8rem 0;
  background: linear-gradient(180deg, #0a0f1c 0%, #0f1829 100%);
}

.section-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 4rem;
  background: linear-gradient(135deg, #00d4ff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #00d4ff;
}

.feature-card p {
  color: #b8c9d9;
  line-height: 1.6;
}

/* Pricing Section */
.pricing {
  padding: 8rem 0;
  background: #0a0f1c;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.pricing-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 212, 255, 0.3);
  }
  
  &.featured {
    border-color: rgba(0, 255, 136, 0.5);
    box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
    
    &:hover {
      border-color: rgba(0, 255, 136, 0.7);
    }
  }
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  color: #0a0f1c;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #00d4ff;
  }
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  
  .currency {
    font-size: 1.25rem;
    color: #b8c9d9;
  }
  
  .amount {
    font-size: 3rem;
    font-weight: 700;
    color: #ffffff;
  }
  
  .period {
    color: #b8c9d9;
  }
}

.pricing-features {
  list-style: none;
  margin-bottom: 2rem;
  
  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.pricing-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(0, 212, 255, 0.5);
  }
  
  &.primary {
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #0a0f1c;
    border: none;
    
    &:hover {
      box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3);
    }
  }
}

/* CTA Section */
.cta {
  padding: 8rem 0;
  background: linear-gradient(135deg, #0f1829 0%, #1a2332 100%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
}

.cta-content p {
  font-size: 1.25rem;
  color: #b8c9d9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Footer */
.footer {
  background: #0a0f1c;
  padding: 4rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  color: #00d4ff;
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section p {
  color: #b8c9d9;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #b8c9d9;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #00d4ff;
  }
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #b8c9d9;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style> 