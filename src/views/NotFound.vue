<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <!-- Animated 404 -->
        <div class="error-visual">
          <div class="error-number">
            <span class="digit four-1">4</span>
            <span class="digit zero">0</span>
            <span class="digit four-2">4</span>
          </div>
          
          <!-- Pipeline Animation -->
          <div class="pipeline-animation">
            <svg viewBox="0 0 400 100" class="pipeline-svg">
              <defs>
                <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0099cc;stop-opacity:1" />
                </linearGradient>
              </defs>
              
              <!-- Main pipeline -->
              <rect x="0" y="45" width="150" height="10" fill="url(#pipeGradient)" rx="5" />
              <rect x="250" y="45" width="150" height="10" fill="url(#pipeGradient)" rx="5" />
              
              <!-- Broken section -->
              <rect x="160" y="40" width="30" height="5" fill="#ff6b6b" rx="2" />
              <rect x="160" y="55" width="30" height="5" fill="#ff6b6b" rx="2" />
              <rect x="210" y="40" width="30" height="5" fill="#ff6b6b" rx="2" />
              <rect x="210" y="55" width="30" height="5" fill="#ff6b6b" rx="2" />
              
              <!-- Leak animation -->
              <g class="leak-drops">
                <circle cx="185" cy="65" r="2" fill="#00d4ff" opacity="0.7">
                  <animate attributeName="cy" values="65;75;65" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="180" cy="65" r="1.5" fill="#00d4ff" opacity="0.5">
                  <animate attributeName="cy" values="65;80;65" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="225" cy="65" r="2" fill="#00d4ff" opacity="0.6">
                  <animate attributeName="cy" values="65;75;65" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </g>
              
              <!-- Warning signs -->
              <text x="200" y="35" font-family="Arial" font-size="16" fill="#ff6b6b" text-anchor="middle">⚠️</text>
            </svg>
          </div>
        </div>
        
        <!-- Error Message -->
        <div class="error-message">
          <h1 class="error-title">Страница не найдена</h1>
          <p class="error-description">
            Похоже, в нашей сети произошёл разрыв! Запрашиваемая страница не существует 
            или была перемещена в другое место.
          </p>
          
          <div class="error-suggestions">
            <h3>Что можно сделать:</h3>
            <ul>
              <li>Проверить правильность URL-адреса</li>
              <li>Вернуться на главную страницу</li>
              <li>Воспользоваться поиском</li>
              <li>Обратиться в техподдержку</li>
            </ul>
          </div>
        </div>
        
        <!-- Search Section -->
        <div class="search-section">
          <h3>Поиск по сайту</h3>
          <div class="search-form">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Что вы ищете?"
              class="search-input"
              @keyup.enter="performSearch"
            />
            <button @click="performSearch" class="search-btn">
              🔍 Найти
            </button>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="quick-links">
          <h3>Популярные разделы</h3>
          <div class="links-grid">
            <router-link to="/" class="quick-link">
              <div class="link-icon">🏠</div>
              <div class="link-content">
                <h4>Главная</h4>
                <p>Вернуться на главную страницу</p>
              </div>
            </router-link>
            
            <router-link to="/demo" class="quick-link">
              <div class="link-icon">🚀</div>
              <div class="link-content">
                <h4>Демо</h4>
                <p>Попробовать GazNetCAD</p>
              </div>
            </router-link>
            
            <router-link to="/about" class="quick-link">
              <div class="link-icon">ℹ️</div>
              <div class="link-content">
                <h4>О нас</h4>
                <p>Узнать больше о системе</p>
              </div>
            </router-link>
            
            <router-link to="/documentation" class="quick-link">
              <div class="link-icon">📚</div>
              <div class="link-content">
                <h4>Документация</h4>
                <p>Руководства и справка</p>
              </div>
            </router-link>
            
            <router-link to="/contact" class="quick-link">
              <div class="link-icon">📞</div>
              <div class="link-content">
                <h4>Контакты</h4>
                <p>Связаться с нами</p>
              </div>
            </router-link>
            
            <router-link to="/about" class="quick-link">
              <div class="link-icon">ℹ️</div>
              <div class="link-content">
                <h4>О нас</h4>
                <p>Узнать больше о системе</p>
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="goBack" class="btn-secondary">
            ← Назад
          </button>
          <router-link to="/" class="btn-primary">
            🏠 На главную
          </router-link>
          <router-link to="/contact" class="btn-outline">
            📞 Поддержка
          </router-link>
        </div>
        
        <!-- Fun Stats -->
        <div class="fun-stats">
          <div class="stat-item">
            <span class="stat-icon">🔧</span>
            <span class="stat-text">Время на ремонт: {{ repairTime }}с</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⚡</span>
            <span class="stat-text">Давление в системе: 0.404 МПа</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🛠️</span>
            <span class="stat-text">Статус ремонта: В процессе</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Background Animation -->
    <div class="background-animation">
      <div class="floating-element" v-for="n in 6" :key="n" :style="getRandomPosition()">
        {{ getRandomIcon() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const repairTime = ref(120)

const icons = ['⚙️', '🔧', '🛠️', '⚡', '💧', '🔩', '📊', '📈']

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // В реальном приложении здесь был бы переход на страницу поиска
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const getRandomPosition = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (5 + Math.random() * 10) + 's'
  }
}

const getRandomIcon = () => {
  return icons[Math.floor(Math.random() * icons.length)]
}

// Countdown animation
onMounted(() => {
  const countdown = setInterval(() => {
    if (repairTime.value > 0) {
      repairTime.value--
    } else {
      repairTime.value = 120 // Reset
    }
  }, 1000)
  
  // Cleanup
  setTimeout(() => clearInterval(countdown), 30000)
})
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: $space-8 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 $space-4;
  position: relative;
  z-index: 2;
}

.not-found-content {
  text-align: center;
}

// Error Visual
.error-visual {
  margin-bottom: $space-12;
  
  .error-number {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $space-4;
    margin-bottom: $space-8;
    
    .digit {
      font-size: 8rem;
      font-weight: $font-weight-bold;
      background: linear-gradient(45deg, $color-primary, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: bounce 2s ease-in-out infinite;
      
      &.four-1 {
        animation-delay: 0s;
      }
      
      &.zero {
        animation-delay: 0.2s;
        transform: scale(1.2);
      }
      
      &.four-2 {
        animation-delay: 0.4s;
      }
    }
  }
  
  .pipeline-animation {
    max-width: 400px;
    margin: 0 auto;
    
    .pipeline-svg {
      width: 100%;
      height: 100px;
    }
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

// Error Message
.error-message {
  margin-bottom: $space-12;
  
  .error-title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-4;
    color: white;
  }
  
  .error-description {
    font-size: $font-size-lg;
    color: rgba(255, 255, 255, 0.8);
    line-height: $line-height-relaxed;
    margin-bottom: $space-8;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .error-suggestions {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: $radius-lg;
    padding: $space-6;
    margin: 0 auto;
    max-width: 500px;
    text-align: left;
    
    h3 {
      color: $color-primary;
      margin-bottom: $space-4;
      text-align: center;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        padding: $space-2 0;
        color: rgba(255, 255, 255, 0.9);
        position: relative;
        padding-left: $space-6;
        
        &::before {
          content: '→';
          position: absolute;
          left: 0;
          color: $color-primary;
          font-weight: bold;
        }
      }
    }
  }
}

// Search Section
.search-section {
  margin-bottom: $space-12;
  
  h3 {
    color: $color-primary;
    margin-bottom: $space-4;
    font-size: $font-size-xl;
  }
  
  .search-form {
    display: flex;
    max-width: 500px;
    margin: 0 auto;
    gap: $space-3;
    
    .search-input {
      flex: 1;
      padding: $space-4;
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
    
    .search-btn {
      padding: $space-4 $space-6;
      background: $color-primary;
      color: white;
      border: none;
      border-radius: $radius-lg;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $duration-normal;
      
      &:hover {
        background: $color-primary-dark;
        transform: translateY(-2px);
      }
    }
  }
}

// Quick Links
.quick-links {
  margin-bottom: $space-12;
  
  h3 {
    color: $color-primary;
    margin-bottom: $space-6;
    font-size: $font-size-xl;
  }
  
  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $space-4;
    max-width: 800px;
    margin: 0 auto;
    
    .quick-link {
      display: flex;
      align-items: center;
      gap: $space-4;
      padding: $space-4;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: $radius-lg;
      text-decoration: none;
      color: white;
      transition: all $duration-normal;
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: $color-primary;
        transform: translateY(-2px);
      }
      
      .link-icon {
        font-size: $font-size-2xl;
        flex-shrink: 0;
      }
      
      .link-content {
        text-align: left;
        
        h4 {
          margin: 0 0 $space-1 0;
          color: white;
          font-size: $font-size-lg;
        }
        
        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: $font-size-sm;
        }
      }
    }
  }
}

// Action Buttons
.action-buttons {
  display: flex;
  justify-content: center;
  gap: $space-4;
  margin-bottom: $space-12;
  flex-wrap: wrap;
  
  .btn-primary, .btn-secondary, .btn-outline {
    padding: $space-4 $space-8;
    border-radius: $radius-lg;
    font-weight: $font-weight-medium;
    text-decoration: none;
    display: inline-block;
    transition: all $duration-normal;
    cursor: pointer;
    border: none;
  }
  
  .btn-primary {
    background: $color-primary;
    color: white;
    
    &:hover {
      background: $color-primary-dark;
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
    }
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .btn-outline {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }
  }
}

// Fun Stats
.fun-stats {
  display: flex;
  justify-content: center;
  gap: $space-6;
  flex-wrap: wrap;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: $space-2;
    background: rgba(255, 255, 255, 0.1);
    padding: $space-3 $space-4;
    border-radius: $radius-lg;
    backdrop-filter: blur(10px);
    
    .stat-icon {
      font-size: $font-size-lg;
    }
    
    .stat-text {
      font-size: $font-size-sm;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

// Background Animation
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  
  .floating-element {
    position: absolute;
    font-size: $font-size-2xl;
    opacity: 0.1;
    animation: float linear infinite;
  }
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .error-visual {
    .error-number {
      .digit {
        font-size: 4rem;
      }
    }
  }
  
  .search-form {
    flex-direction: column;
    
    .search-btn {
      align-self: stretch;
    }
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    
    .btn-primary, .btn-secondary, .btn-outline {
      width: 100%;
      max-width: 300px;
    }
  }
  
  .fun-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .not-found-page {
    padding: $space-6 0;
  }
}

@media (max-width: 480px) {
  .error-visual {
    .error-number {
      gap: $space-2;
      
      .digit {
        font-size: 3rem;
      }
    }
  }
  
  .error-message {
    .error-title {
      font-size: $font-size-2xl;
    }
    
    .error-description {
      font-size: $font-size-base;
    }
  }
}
</style> 