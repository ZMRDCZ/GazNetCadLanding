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
@import '@/styles/tokens.scss';

.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    $color-background 0%, 
    lighten($color-background, 2%) 50%,
    $color-background 100%);
  position: relative;
  overflow: hidden;
  
  // Animated background pattern
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba($color-primary, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba($color-secondary, 0.03) 0%, transparent 50%),
      linear-gradient(0deg, rgba($color-surface-elevated, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba($color-surface-elevated, 0.02) 1px, transparent 1px);
    background-size: 400px 400px, 400px 400px, 40px 40px, 40px 40px;
    opacity: 0.6;
    z-index: -1;
    animation: backgroundShift 60s ease-in-out infinite;
  }
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-8;
  position: relative;
  
  @media (max-width: $breakpoint-lg) {
    padding: $space-6;
    order: 2;
  }
}

.form-container {
  width: 100%;
  max-width: 420px;
  @include glassmorphism;
  border-radius: $radius-2xl;
  border: 1px solid rgba($color-primary, 0.2);
  box-shadow: $shadow-2xl;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      $color-primary 0%, 
      $color-secondary 50%, 
      $color-accent 100%);
  }
}

.form-header {
  text-align: center;
  padding: $space-8 $space-6 $space-6;
  border-bottom: 1px solid rgba($color-border, 0.3);
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-3;
    margin-bottom: $space-6;
    
    .logo-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 10px rgba($color-primary, 0.5));
    }
    
    .logo-text {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $color-text-primary;
      text-shadow: 0 0 20px rgba($color-primary, 0.3);
    }
  }
  
  .form-title {
    margin: 0 0 $space-3 0;
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    text-shadow: 0 0 20px rgba($color-primary, 0.2);
  }
  
  .form-subtitle {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-relaxed;
  }
}

.login-form {
  padding: $space-6;
  
  .form-group {
    margin-bottom: $space-5;
    
    label {
      display: block;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      margin-bottom: $space-2;
    }
    
    input {
      width: 100%;
      padding: $space-4;
      border: 1px solid rgba($color-border, 0.5);
      border-radius: $radius-lg;
      background: rgba($color-surface, 0.8);
      color: $color-text-primary;
      font-size: $font-size-sm;
      transition: all $duration-normal ease;
      
      &::placeholder {
        color: $color-text-secondary;
        opacity: 0.7;
      }
      
      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba($color-primary, 0.1), $shadow-neon-sm;
        background: rgba($color-surface, 0.95);
      }
      
      &.error {
        border-color: $color-error;
        box-shadow: 0 0 0 3px rgba($color-error, 0.1);
      }
    }
    
    .error-text {
      display: block;
      font-size: $font-size-xs;
      color: $color-error;
      margin-top: $space-1;
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
      color: $color-text-secondary;
      cursor: pointer;
      padding: $space-1;
      border-radius: $radius-sm;
      transition: all $duration-fast ease;
      
      &:hover {
        color: $color-text-primary;
        background: rgba($color-surface-elevated, 0.5);
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
      color: $color-text-secondary;
      
      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        border: 2px solid rgba($color-border, 0.5);
        border-radius: $radius-sm;
        background: rgba($color-surface, 0.8);
        cursor: pointer;
        position: relative;
        
        &:checked {
          background: linear-gradient(45deg, $color-primary, $color-secondary);
          border-color: $color-primary;
          
          &::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
          }
        }
      }
      
      .checkbox-custom {
        // Custom checkbox styling handled in input above
      }
    }
    
    .forgot-link {
      font-size: $font-size-sm;
      color: $color-primary;
      text-decoration: none;
      transition: all $duration-fast ease;
      
      &:hover {
        color: $color-primary-light;
        text-shadow: 0 0 10px rgba($color-primary, 0.3);
      }
    }
  }
  
  .submit-btn {
    width: 100%;
    padding: $space-4;
    border: none;
    border-radius: $radius-lg;
    background: linear-gradient(45deg, $color-primary, $color-secondary);
    color: white;
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all $duration-normal ease;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(white, 0.2) 50%,
        transparent 100%);
      transition: left $duration-normal ease;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: $shadow-lg, $shadow-neon-md;
      
      &::before {
        left: 100%;
      }
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    &.loading {
      pointer-events: none;
      
      &::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(white, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  
  .social-divider {
    text-align: center;
    margin: $space-6 0;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba($color-border, 0.3);
    }
    
    span {
      background: rgba($color-surface, 0.95);
      padding: 0 $space-3;
      font-size: $font-size-sm;
      color: $color-text-secondary;
      position: relative;
    }
  }
  
  .social-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-3;
    
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $space-2;
      padding: $space-3;
      border: 1px solid rgba($color-border, 0.5);
      border-radius: $radius-lg;
      background: rgba($color-surface-elevated, 0.8);
      color: $color-text-primary;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $duration-normal ease;
      
      .social-icon {
        font-size: $font-size-lg;
      }
      
      &:hover {
        border-color: $color-primary;
        background: rgba($color-primary, 0.05);
        transform: translateY(-1px);
        box-shadow: $shadow-md;
      }
      
      &.google {
        &:hover {
          border-color: #4285f4;
          background: rgba(66, 133, 244, 0.05);
        }
      }
      
      &.microsoft {
        &:hover {
          border-color: #0078d4;
          background: rgba(0, 120, 212, 0.05);
        }
      }
    }
  }
}

.form-footer {
  text-align: center;
  padding: $space-4 $space-6 $space-6;
  border-top: 1px solid rgba($color-border, 0.3);
  
  p {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
  
  .register-link {
    color: $color-primary;
    text-decoration: none;
    font-weight: $font-weight-medium;
    transition: all $duration-fast ease;
    
    &:hover {
      color: $color-primary-light;
      text-shadow: 0 0 10px rgba($color-primary, 0.3);
    }
  }
}

.login-info-section {
  background: linear-gradient(135deg, 
    rgba($color-primary, 0.1) 0%, 
    rgba($color-secondary, 0.1) 100%);
  padding: $space-8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: $breakpoint-lg) {
    padding: $space-6;
    order: 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba($color-primary, 0.05),
      transparent,
      rgba($color-secondary, 0.05),
      transparent
    );
    animation: backgroundRotation 60s linear infinite;
  }
}

.info-content {
  position: relative;
  z-index: 1;
  max-width: 480px;
  
  .info-title {
    margin: 0 0 $space-6 0;
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    text-shadow: 0 0 30px rgba($color-primary, 0.3);
    line-height: $line-height-tight;
  }
}

.features-list {
  margin-bottom: $space-8;
  
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    margin-bottom: $space-6;
    padding: $space-4;
    background: rgba($color-surface, 0.3);
    border-radius: $radius-lg;
    border: 1px solid rgba($color-border, 0.2);
    transition: all $duration-normal ease;
    
    &:hover {
      background: rgba($color-surface, 0.5);
      border-color: rgba($color-primary, 0.3);
      transform: translateX(10px);
    }
    
    .feature-icon {
      font-size: $font-size-2xl;
      filter: drop-shadow(0 0 10px rgba($color-primary, 0.5));
    }
    
    .feature-content {
      h3 {
        margin: 0 0 $space-1 0;
        font-size: $font-size-lg;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
      }
      
      p {
        margin: 0;
        font-size: $font-size-sm;
        color: $color-text-secondary;
        line-height: $line-height-relaxed;
      }
    }
  }
}

.testimonial {
  @include glassmorphism;
  padding: $space-6;
  border-radius: $radius-xl;
  border: 1px solid rgba($color-primary, 0.2);
  
  blockquote {
    margin: 0 0 $space-4 0;
    font-size: $font-size-lg;
    font-style: italic;
    color: $color-text-primary;
    line-height: $line-height-relaxed;
    
    &::before,
    &::after {
      content: '"';
      font-size: $font-size-2xl;
      color: $color-primary;
      opacity: 0.5;
    }
  }
  
  cite {
    font-style: normal;
    color: $color-text-secondary;
    
    strong {
      color: $color-text-primary;
      display: block;
      margin-bottom: $space-1;
    }
  }
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .floating-shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 20s ease-in-out infinite;
  }
}

.demo-banner {
  position: fixed;
  bottom: $space-6;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  
  .banner-content {
    display: flex;
    align-items: center;
    gap: $space-4;
    padding: $space-3 $space-6;
    @include glassmorphism;
    border-radius: $radius-full;
    border: 1px solid rgba($color-secondary, 0.3);
    box-shadow: $shadow-xl;
    
    .banner-text {
      font-size: $font-size-sm;
      color: $color-text-secondary;
    }
    
    .demo-link {
      color: $color-secondary;
      text-decoration: none;
      font-weight: $font-weight-medium;
      transition: all $duration-fast ease;
      
      &:hover {
        color: $color-secondary-light;
        text-shadow: 0 0 10px rgba($color-secondary, 0.5);
      }
    }
  }
}

// Animations
@keyframes backgroundShift {
  0%, 100% { 
    background-position: 0% 0%, 0% 0%, 0 0, 0 0; 
  }
  25% { 
    background-position: 25% 25%, 75% 25%, 10px 0, 0 10px; 
  }
  50% { 
    background-position: 50% 50%, 50% 50%, 20px 20px, 20px 20px; 
  }
  75% { 
    background-position: 75% 75%, 25% 75%, 10px 40px, 40px 10px; 
  }
}

@keyframes backgroundRotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Responsive design
@media (max-width: $breakpoint-lg) {
  .login-info-section {
    .info-title {
      font-size: $font-size-3xl;
    }
    
    .features-list .feature-item {
      flex-direction: column;
      text-align: center;
      gap: $space-2;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .login-form-section {
    padding: $space-4;
  }
  
  .form-container {
    max-width: none;
  }
  
  .form-header {
    padding: $space-6 $space-4 $space-4;
    
    .form-title {
      font-size: $font-size-2xl;
    }
  }
  
  .login-form {
    padding: $space-4;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
  
  .demo-banner {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin-top: $space-6;
    
    .banner-content {
      flex-direction: column;
      text-align: center;
      gap: $space-2;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .form-options {
    flex-direction: column;
    gap: $space-3;
    align-items: flex-start;
  }
}
</style> 