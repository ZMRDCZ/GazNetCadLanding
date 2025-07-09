<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Form -->
      <div class="login-form-section">
        <div class="form-container">
          <!-- Logo and Title -->
          <div class="form-header">
            <div class="logo">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">GazNetCAD</span>
            </div>
            <h1 class="form-title">Вход в систему</h1>
            <p class="form-subtitle">
              Добро пожаловать! Войдите в свой аккаунт, чтобы продолжить проектирование.
            </p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                :class="{ error: errors.email }"
                placeholder="your.email@company.com"
                autocomplete="email"
              />
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>
            
            <div class="form-group">
              <label for="password">Пароль *</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password" 
                  v-model="form.password" 
                  required
                  :class="{ error: errors.password }"
                  placeholder="Введите пароль"
                  autocomplete="current-password"
                />
                <button 
                  type="button" 
                  @click="togglePassword" 
                  class="password-toggle"
                  :title="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
            </div>
            
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.rememberMe" />
                <span class="checkbox-custom"></span>
                Запомнить меня
              </label>
              
              <router-link to="/forgot-password" class="forgot-link">
                Забыли пароль?
              </router-link>
            </div>
            
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="isSubmitting"
              :class="{ loading: isSubmitting }"
            >
              <span v-if="!isSubmitting">Войти</span>
              <span v-else>Вход...</span>
            </button>
            
            <!-- Social Login -->
            <div class="social-divider">
              <span>или войдите через</span>
            </div>
            
            <div class="social-buttons">
              <button type="button" @click="loginWithGoogle" class="social-btn google">
                <span class="social-icon">🌐</span>
                Google
              </button>
              <button type="button" @click="loginWithMicrosoft" class="social-btn microsoft">
                <span class="social-icon">🏢</span>
                Microsoft
              </button>
            </div>
          </form>
          
          <!-- Register Link -->
          <div class="form-footer">
            <p>
              Нет аккаунта? 
              <router-link to="/register" class="register-link">
                Зарегистрироваться
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side - Info -->
      <div class="login-info-section">
        <div class="info-content">
          <h2 class="info-title">Начните проектировать уже сегодня</h2>
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">🚀</div>
              <div class="feature-content">
                <h3>Быстрый старт</h3>
                <p>Создайте первый проект за 5 минут</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div class="feature-content">
                <h3>Точные расчёты</h3>
                <p>99.9% точность гидравлических расчётов</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🤝</div>
              <div class="feature-content">
                <h3>Командная работа</h3>
                <p>Совместное редактирование проектов</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div class="feature-content">
                <h3>Аналитика</h3>
                <p>Детальная отчётность по проектам</p>
              </div>
            </div>
          </div>
          
          <!-- Testimonial -->
          <div class="testimonial">
            <blockquote>
              "GazNetCAD сократил время проектирования на 60%. 
              Теперь мы можем сосредоточиться на качестве, а не на рутине."
            </blockquote>
            <cite>
              <strong>Александр Иванов</strong><br>
              Главный инженер, ГазТехПроект
            </cite>
          </div>
        </div>
        
        <!-- Background Animation -->
        <div class="background-animation">
          <div class="floating-shape" v-for="n in 5" :key="n" :style="getRandomShapeStyle()"></div>
        </div>
      </div>
    </div>
    
    <!-- Demo Banner -->
    <div class="demo-banner">
      <div class="banner-content">
        <span class="banner-text">
          Хотите попробовать без регистрации?
        </span>
        <router-link to="/demo" class="demo-link">
          Запустить демо →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const showPassword = ref(false)

const validateForm = () => {
  errors.value = {}
  
  if (!form.email.trim()) {
    errors.value.email = 'Email обязателен для заполнения'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Введите корректный email'
  }
  
  if (!form.password) {
    errors.value.password = 'Пароль обязателен для заполнения'
  } else if (form.password.length < 6) {
    errors.value.password = 'Пароль должен содержать минимум 6 символов'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // В реальном приложении здесь был бы API-запрос
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Успешный вход
    router.push('/app')
  } catch (error) {
    errors.value.general = 'Неверный email или пароль'
  } finally {
    isSubmitting.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const loginWithGoogle = () => {
  // В реальном приложении здесь была бы интеграция с Google OAuth
  console.log('Login with Google')
}

const loginWithMicrosoft = () => {
  // В реальном приложении здесь была бы интеграция с Microsoft OAuth
  console.log('Login with Microsoft')
}

const getRandomShapeStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (10 + Math.random() * 10) + 's'
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: $color-background;
  position: relative;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

// Form Section
.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-8;
  background: white;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: $space-8;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    margin-bottom: $space-6;
    
    .logo-icon {
      font-size: $font-size-2xl;
      color: $color-primary;
    }
    
    .logo-text {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $color-text-primary;
    }
  }
  
  .form-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $space-2;
  }
  
  .form-subtitle {
    color: $color-text-secondary;
    line-height: $line-height-relaxed;
  }
}

.login-form {
  .form-group {
    margin-bottom: $space-6;
    
    label {
      display: block;
      margin-bottom: $space-2;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
    }
    
    input {
      width: 100%;
      padding: $space-4;
      border: 1px solid $color-border;
      border-radius: $radius-lg;
      background: $color-surface;
      color: $color-text-primary;
      font-size: $font-size-base;
      transition: all $duration-normal;
      
      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
      }
      
      &.error {
        border-color: $color-error;
      }
      
      &::placeholder {
        color: $color-text-tertiary;
      }
    }
    
    .error-text {
      display: block;
      margin-top: $space-1;
      font-size: $font-size-sm;
      color: $color-error;
    }
  }
  
  .password-input-wrapper {
    position: relative;
    
    .password-toggle {
      position: absolute;
      right: $space-3;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: $font-size-lg;
      color: $color-text-secondary;
      
      &:hover {
        color: $color-text-primary;
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-6;
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: $space-2;
      cursor: pointer;
      font-size: $font-size-sm;
      color: $color-text-primary;
      
      input[type="checkbox"] {
        width: auto;
        margin: 0;
        opacity: 0;
        position: absolute;
        
        &:checked + .checkbox-custom {
          background: $color-primary;
          border-color: $color-primary;
          
          &::after {
            opacity: 1;
          }
        }
      }
      
      .checkbox-custom {
        width: 18px;
        height: 18px;
        border: 2px solid $color-border;
        border-radius: $radius-sm;
        background: $color-surface;
        position: relative;
        transition: all $duration-normal;
        
        &::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          color: white;
          font-size: 12px;
          opacity: 0;
          transition: opacity $duration-normal;
        }
      }
    }
    
    .forgot-link {
      color: $color-primary;
      text-decoration: none;
      font-size: $font-size-sm;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.submit-btn {
  width: 100%;
  padding: $space-4;
  background: $color-primary;
  color: white;
  border: none;
  border-radius: $radius-lg;
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-normal;
  margin-bottom: $space-6;
  
  &:hover:not(:disabled) {
    background: $color-primary-dark;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &.loading {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      right: $space-4;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

.social-divider {
  text-align: center;
  margin-bottom: $space-4;
  position: relative;
  
  span {
    background: white;
    padding: 0 $space-3;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: $color-border;
    z-index: -1;
  }
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3;
  margin-bottom: $space-6;
  
  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    padding: $space-3;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    background: white;
    color: $color-text-primary;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $duration-normal;
    
    &:hover {
      border-color: $color-primary;
      background: rgba(0, 212, 255, 0.05);
    }
    
    .social-icon {
      font-size: $font-size-lg;
    }
    
    &.google:hover {
      border-color: #4285f4;
      background: rgba(66, 133, 244, 0.05);
    }
    
    &.microsoft:hover {
      border-color: #0078d4;
      background: rgba(0, 120, 212, 0.05);
    }
  }
}

.form-footer {
  text-align: center;
  
  p {
    color: $color-text-secondary;
    margin: 0;
    
    .register-link {
      color: $color-primary;
      text-decoration: none;
      font-weight: $font-weight-medium;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// Info Section
.login-info-section {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-8;
  position: relative;
  overflow: hidden;
}

.info-content {
  max-width: 500px;
  position: relative;
  z-index: 2;
  
  .info-title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-8;
    color: white;
  }
}

.features-list {
  margin-bottom: $space-12;
  
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    margin-bottom: $space-6;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .feature-icon {
      font-size: $font-size-2xl;
      flex-shrink: 0;
    }
    
    .feature-content {
      h3 {
        color: white;
        margin-bottom: $space-1;
        font-size: $font-size-lg;
        font-weight: $font-weight-semibold;
      }
      
      p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        line-height: $line-height-relaxed;
      }
    }
  }
}

.testimonial {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: $space-6;
  border-radius: $radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  blockquote {
    font-style: italic;
    font-size: $font-size-lg;
    line-height: $line-height-relaxed;
    margin-bottom: $space-4;
    color: rgba(255, 255, 255, 0.9);
  }
  
  cite {
    font-style: normal;
    
    strong {
      color: white;
    }
  }
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  .floating-shape {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 50%;
    animation: floatUpDown linear infinite;
  }
}

@keyframes floatUpDown {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

// Demo Banner
.demo-banner {
  position: fixed;
  bottom: $space-4;
  left: 50%;
  transform: translateX(-50%);
  background: $color-primary;
  color: white;
  padding: $space-3 $space-6;
  border-radius: $radius-full;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
  z-index: 1000;
  
  .banner-content {
    display: flex;
    align-items: center;
    gap: $space-4;
    
    .banner-text {
      font-size: $font-size-sm;
    }
    
    .demo-link {
      color: white;
      text-decoration: none;
      font-weight: $font-weight-medium;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// Responsive Design
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  
  .login-info-section {
    order: -1;
    min-height: 400px;
  }
  
  .login-form-section {
    padding: $space-6 $space-4;
  }
  
  .info-content {
    .info-title {
      font-size: $font-size-2xl;
    }
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
  
  .demo-banner {
    position: static;
    transform: none;
    margin: $space-4;
    
    .banner-content {
      flex-direction: column;
      text-align: center;
      gap: $space-2;
    }
  }
}
</style> 