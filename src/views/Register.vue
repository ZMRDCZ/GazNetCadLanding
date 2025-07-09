<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Side - Form -->
      <div class="register-form-section">
        <div class="form-container">
          <!-- Progress Indicator -->
          <div class="progress-indicator">
            <div class="progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <span class="step-number">1</span>
              <span class="step-label">Аккаунт</span>
            </div>
            <div class="progress-line" :class="{ active: currentStep > 1 }"></div>
            <div class="progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <span class="step-number">2</span>
              <span class="step-label">Компания</span>
            </div>
            <div class="progress-line" :class="{ active: currentStep > 2 }"></div>
            <div class="progress-step" :class="{ active: currentStep >= 3 }">
              <span class="step-number">3</span>
              <span class="step-label">Тариф</span>
            </div>
          </div>

          <!-- Header -->
          <div class="form-header">
            <div class="logo">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">GazNetCAD</span>
            </div>
            <h1 class="form-title">Создание аккаунта</h1>
            <p class="form-subtitle">
              Присоединяйтесь к тысячам инженеров, которые уже используют GazNetCAD
            </p>
          </div>

          <!-- Registration Form -->
          <form @submit.prevent="handleNext" class="register-form">
            <!-- Step 1: Account -->
            <div v-if="currentStep === 1" class="form-step">
              <h3 class="step-title">Личная информация</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Имя *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    v-model="form.firstName" 
                    required
                    :class="{ error: errors.firstName }"
                    placeholder="Имя"
                  />
                  <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
                </div>
                
                <div class="form-group">
                  <label for="lastName">Фамилия *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    v-model="form.lastName" 
                    required
                    :class="{ error: errors.lastName }"
                    placeholder="Фамилия"
                  />
                  <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Рабочий email *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  required
                  :class="{ error: errors.email }"
                  placeholder="your.email@company.com"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>
              
              <div class="form-group">
                <label for="phone">Телефон</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  placeholder="+7 (999) 123-45-67"
                />
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
                    placeholder="Минимум 8 символов"
                  />
                  <button 
                    type="button" 
                    @click="togglePassword" 
                    class="password-toggle"
                  >
                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div>
                  </div>
                  <span class="strength-text">{{ passwordStrength.text }}</span>
                </div>
                <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Подтверждение пароля *</label>
                <input 
                  type="password"
                  id="confirmPassword" 
                  v-model="form.confirmPassword" 
                  required
                  :class="{ error: errors.confirmPassword }"
                  placeholder="Повторите пароль"
                />
                <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
              </div>
            </div>

            <!-- Step 2: Company -->
            <div v-if="currentStep === 2" class="form-step">
              <h3 class="step-title">Информация о компании</h3>
              
              <div class="form-group">
                <label for="company">Название компании *</label>
                <input 
                  type="text" 
                  id="company" 
                  v-model="form.company" 
                  required
                  :class="{ error: errors.company }"
                  placeholder="ООО 'ГазПроект'"
                />
                <span v-if="errors.company" class="error-text">{{ errors.company }}</span>
              </div>
              
              <div class="form-group">
                <label for="position">Должность *</label>
                <select 
                  id="position" 
                  v-model="form.position" 
                  required
                  :class="{ error: errors.position }"
                >
                  <option value="">Выберите должность</option>
                  <option value="engineer">Инженер</option>
                  <option value="lead_engineer">Ведущий инженер</option>
                  <option value="project_manager">Руководитель проектов</option>
                  <option value="technical_director">Технический директор</option>
                  <option value="ceo">Генеральный директор</option>
                  <option value="other">Другое</option>
                </select>
                <span v-if="errors.position" class="error-text">{{ errors.position }}</span>
              </div>
              
              <div class="form-group">
                <label for="companySize">Размер компании</label>
                <select id="companySize" v-model="form.companySize">
                  <option value="">Выберите размер</option>
                  <option value="1-10">1-10 сотрудников</option>
                  <option value="11-50">11-50 сотрудников</option>
                  <option value="51-200">51-200 сотрудников</option>
                  <option value="201-1000">201-1000 сотрудников</option>
                  <option value="1000+">Более 1000 сотрудников</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="industry">Отрасль</label>
                <select id="industry" v-model="form.industry">
                  <option value="">Выберите отрасль</option>
                  <option value="gas_distribution">Газораспределение</option>
                  <option value="oil_gas">Нефтегазовая отрасль</option>
                  <option value="engineering">Инжиниринг</option>
                  <option value="construction">Строительство</option>
                  <option value="consulting">Консалтинг</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="experience">Опыт работы с CAD</label>
                <select id="experience" v-model="form.experience">
                  <option value="">Выберите опыт</option>
                  <option value="beginner">Начинающий (менее 1 года)</option>
                  <option value="intermediate">Средний (1-3 года)</option>
                  <option value="advanced">Продвинутый (3-5 лет)</option>
                  <option value="expert">Эксперт (более 5 лет)</option>
                </select>
              </div>
            </div>

            <!-- Step 3: Plan -->
            <div v-if="currentStep === 3" class="form-step">
              <h3 class="step-title">Выберите тарифный план</h3>
              
              <div class="plans-grid">
                <div 
                  class="plan-card" 
                  :class="{ selected: form.plan === 'starter' }"
                  @click="form.plan = 'starter'"
                >
                  <div class="plan-header">
                    <h4>Стартовый</h4>
                    <div class="plan-price">
                      <span class="currency">₽</span>
                      <span class="price">9,990</span>
                      <span class="period">/мес</span>
                    </div>
                  </div>
                  <ul class="plan-features">
                    <li>До 10 проектов</li>
                    <li>Базовые расчёты</li>
                    <li>Email поддержка</li>
                  </ul>
                  <div class="plan-trial">30 дней бесплатно</div>
                </div>
                
                <div 
                  class="plan-card featured" 
                  :class="{ selected: form.plan === 'professional' }"
                  @click="form.plan = 'professional'"
                >
                  <div class="popular-badge">Популярный</div>
                  <div class="plan-header">
                    <h4>Профессиональный</h4>
                    <div class="plan-price">
                      <span class="currency">₽</span>
                      <span class="price">19,990</span>
                      <span class="period">/мес</span>
                    </div>
                  </div>
                  <ul class="plan-features">
                    <li>Безлимит проектов</li>
                    <li>3D визуализация</li>
                    <li>ИИ-оптимизация</li>
                    <li>Приоритетная поддержка</li>
                  </ul>
                  <div class="plan-trial">30 дней бесплатно</div>
                </div>
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="form.terms" 
                    required
                    :class="{ error: errors.terms }"
                  />
                  <span class="checkbox-custom"></span>
                  Я принимаю <a href="/terms" target="_blank">условия использования</a> 
                  и <a href="/privacy" target="_blank">политику конфиденциальности</a> *
                </label>
                <span v-if="errors.terms" class="error-text">{{ errors.terms }}</span>
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.newsletter" />
                  <span class="checkbox-custom"></span>
                  Подписаться на новости продукта и специальные предложения
                </label>
              </div>
            </div>
            
            <!-- Navigation Buttons -->
            <div class="form-navigation">
              <button 
                v-if="currentStep > 1"
                type="button" 
                @click="goBack" 
                class="nav-btn secondary"
              >
                ← Назад
              </button>
              
              <button 
                type="submit" 
                class="nav-btn primary" 
                :disabled="isSubmitting"
                :class="{ loading: isSubmitting }"
              >
                <span v-if="currentStep < 3">Далее →</span>
                <span v-else-if="!isSubmitting">Создать аккаунт</span>
                <span v-else>Создание...</span>
              </button>
            </div>
          </form>
          
          <!-- Social Registration (only on step 1) -->
          <div v-if="currentStep === 1" class="social-section">
            <div class="social-divider">
              <span>или зарегистрируйтесь через</span>
            </div>
            
            <div class="social-buttons">
              <button type="button" @click="registerWithGoogle" class="social-btn google">
                <span class="social-icon">🌐</span>
                Google
              </button>
              <button type="button" @click="registerWithMicrosoft" class="social-btn microsoft">
                <span class="social-icon">🏢</span>
                Microsoft
              </button>
            </div>
          </div>
          
          <!-- Login Link -->
          <div class="form-footer">
            <p>
              Уже есть аккаунт? 
              <router-link to="/login" class="login-link">
                Войти
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side - Benefits -->
      <div class="register-info-section">
        <div class="info-content">
          <h2 class="info-title">Присоединяйтесь к лидерам отрасли</h2>
          
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-icon">🚀</div>
              <div class="benefit-content">
                <h3>Быстрый старт</h3>
                <p>Начните проектировать через 5 минут после регистрации</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">💡</div>
              <div class="benefit-content">
                <h3>Инновационные технологии</h3>
                <p>ИИ-оптимизация и автоматические расчёты</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">📊</div>
              <div class="benefit-content">
                <h3>Аналитика проектов</h3>
                <p>Детальная отчётность и KPI-дашборды</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">🤝</div>
              <div class="benefit-content">
                <h3>Поддержка 24/7</h3>
                <p>Техническая поддержка и обучение</p>
              </div>
            </div>
          </div>
          
          <!-- Customer Logos -->
          <div class="customer-logos">
            <h4>Нам доверяют</h4>
            <div class="logos-grid">
              <div class="logo-item">ГазПром</div>
              <div class="logo-item">Лукойл</div>
              <div class="logo-item">Роснефть</div>
              <div class="logo-item">ТехноГаз</div>
            </div>
          </div>
        </div>
        
        <!-- Background Animation -->
        <div class="background-animation">
          <div class="floating-shape" v-for="n in 4" :key="n" :style="getRandomShapeStyle()"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  company: '',
  position: '',
  companySize: '',
  industry: '',
  experience: '',
  plan: 'professional',
  terms: false,
  newsletter: false
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const showPassword = ref(false)

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { width: '0%', class: '', text: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  
  const strength = [
    { width: '20%', class: 'weak', text: 'Очень слабый' },
    { width: '40%', class: 'weak', text: 'Слабый' },
    { width: '60%', class: 'medium', text: 'Средний' },
    { width: '80%', class: 'strong', text: 'Сильный' },
    { width: '100%', class: 'very-strong', text: 'Очень сильный' }
  ]
  
  return strength[Math.min(score - 1, 4)] || strength[0]
})

const validateStep = (step: number) => {
  errors.value = {}
  
  if (step === 1) {
    if (!form.firstName.trim()) errors.value.firstName = 'Имя обязательно'
    if (!form.lastName.trim()) errors.value.lastName = 'Фамилия обязательна'
    if (!form.email.trim()) {
      errors.value.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.value.email = 'Неверный формат email'
    }
    if (!form.password) {
      errors.value.password = 'Пароль обязателен'
    } else if (form.password.length < 8) {
      errors.value.password = 'Пароль должен содержать минимум 8 символов'
    }
    if (form.password !== form.confirmPassword) {
      errors.value.confirmPassword = 'Пароли не совпадают'
    }
  }
  
  if (step === 2) {
    if (!form.company.trim()) errors.value.company = 'Название компании обязательно'
    if (!form.position) errors.value.position = 'Должность обязательна'
  }
  
  if (step === 3) {
    if (!form.terms) errors.value.terms = 'Необходимо принять условия использования'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleNext = async () => {
  if (!validateStep(currentStep.value)) {
    return
  }
  
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    await handleRegister()
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleRegister = async () => {
  isSubmitting.value = true
  
  try {
    // В реальном приложении здесь был бы API-запрос
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Успешная регистрация
    router.push('/login?registered=true')
  } catch (error) {
    errors.value.general = 'Ошибка при создании аккаунта'
  } finally {
    isSubmitting.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const registerWithGoogle = () => {
  console.log('Register with Google')
}

const registerWithMicrosoft = () => {
  console.log('Register with Microsoft')
}

const getRandomShapeStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (15 + Math.random() * 10) + 's'
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: $color-background;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

// Form Section
.register-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-8;
  background: white;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 500px;
}

// Progress Indicator
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $space-8;
  
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-1;
    
    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: $color-surface;
      border: 2px solid $color-border;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: $font-weight-medium;
      color: $color-text-secondary;
      transition: all $duration-normal;
    }
    
    .step-label {
      font-size: $font-size-xs;
      color: $color-text-secondary;
      font-weight: $font-weight-medium;
    }
    
    &.active .step-number {
      background: $color-primary;
      border-color: $color-primary;
      color: white;
    }
    
    &.completed .step-number {
      background: $color-success;
      border-color: $color-success;
      color: white;
    }
    
    &.active .step-label,
    &.completed .step-label {
      color: $color-text-primary;
    }
  }
  
  .progress-line {
    width: 60px;
    height: 2px;
    background: $color-border;
    margin: 0 $space-2;
    transition: background $duration-normal;
    
    &.active {
      background: $color-primary;
    }
  }
}

.form-header {
  text-align: center;
  margin-bottom: $space-8;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    margin-bottom: $space-4;
    
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

// Form Steps
.form-step {
  .step-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $space-6;
    text-align: center;
  }
}

// Form Elements
.register-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;
  }
  
  .form-group {
    margin-bottom: $space-4;
    
    label {
      display: block;
      margin-bottom: $space-2;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
    }
    
    input, select {
      width: 100%;
      padding: $space-3;
      border: 1px solid $color-border;
      border-radius: $radius-md;
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
      font-size: $font-size-base;
      color: $color-text-secondary;
    }
  }
  
  .password-strength {
    margin-top: $space-2;
    
    .strength-bar {
      height: 4px;
      background: $color-surface;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: $space-1;
      
      .strength-fill {
        height: 100%;
        transition: all $duration-normal;
        
        &.weak { background: #ef4444; }
        &.medium { background: #f59e0b; }
        &.strong { background: #10b981; }
        &.very-strong { background: #059669; }
      }
    }
    
    .strength-text {
      font-size: $font-size-xs;
      color: $color-text-secondary;
    }
  }
  
  .checkbox-group {
    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: $space-2;
      cursor: pointer;
      font-size: $font-size-sm;
      line-height: $line-height-relaxed;
      
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
        min-width: 18px;
        height: 18px;
        border: 2px solid $color-border;
        border-radius: $radius-sm;
        background: $color-surface;
        position: relative;
        transition: all $duration-normal;
        margin-top: 2px;
        
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
      
      a {
        color: $color-primary;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Plan Selection
.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
  margin-bottom: $space-6;
  
  .plan-card {
    border: 2px solid $color-border;
    border-radius: $radius-lg;
    padding: $space-4;
    cursor: pointer;
    transition: all $duration-normal;
    position: relative;
    
    &:hover {
      border-color: $color-primary;
      transform: translateY(-2px);
    }
    
    &.selected {
      border-color: $color-primary;
      background: rgba(0, 212, 255, 0.05);
    }
    
    &.featured {
      border-color: $color-primary;
      
      .popular-badge {
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        background: $color-primary;
        color: white;
        padding: $space-1 $space-3;
        border-radius: $radius-full;
        font-size: $font-size-xs;
        font-weight: $font-weight-medium;
      }
    }
    
    .plan-header {
      text-align: center;
      margin-bottom: $space-4;
      
      h4 {
        font-size: $font-size-lg;
        font-weight: $font-weight-semibold;
        margin-bottom: $space-2;
      }
      
      .plan-price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: $space-1;
        
        .currency {
          font-size: $font-size-sm;
          color: $color-text-secondary;
        }
        
        .price {
          font-size: $font-size-xl;
          font-weight: $font-weight-bold;
          color: $color-text-primary;
        }
        
        .period {
          font-size: $font-size-sm;
          color: $color-text-secondary;
        }
      }
    }
    
    .plan-features {
      list-style: none;
      padding: 0;
      margin-bottom: $space-4;
      
      li {
        font-size: $font-size-sm;
        color: $color-text-secondary;
        margin-bottom: $space-2;
        position: relative;
        padding-left: $space-4;
        
        &::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: $color-success;
        }
      }
    }
    
    .plan-trial {
      text-align: center;
      font-size: $font-size-xs;
      color: $color-success;
      font-weight: $font-weight-medium;
    }
  }
}

// Navigation
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: $space-4;
  margin-bottom: $space-6;
  
  .nav-btn {
    flex: 1;
    padding: $space-4;
    border-radius: $radius-lg;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $duration-normal;
    
    &.primary {
      background: $color-primary;
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background: $color-primary-dark;
        transform: translateY(-2px);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      
      &.loading::after {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-left: $space-2;
      }
    }
    
    &.secondary {
      background: $color-surface;
      color: $color-text-primary;
      border: 1px solid $color-border;
      
      &:hover {
        background: $color-surface-hover;
      }
    }
  }
}

// Social Section
.social-section {
  margin-bottom: $space-6;
  
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
    }
  }
}

.form-footer {
  text-align: center;
  
  p {
    color: $color-text-secondary;
    margin: 0;
    
    .login-link {
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
.register-info-section {
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

.benefits-list {
  margin-bottom: $space-12;
  
  .benefit-item {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    margin-bottom: $space-6;
    
    .benefit-icon {
      font-size: $font-size-2xl;
      flex-shrink: 0;
    }
    
    .benefit-content {
      h3 {
        color: white;
        margin-bottom: $space-1;
        font-size: $font-size-lg;
      }
      
      p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        line-height: $line-height-relaxed;
      }
    }
  }
}

.customer-logos {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: $space-6;
  border-radius: $radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  
  h4 {
    color: white;
    margin-bottom: $space-4;
    font-size: $font-size-lg;
  }
  
  .logos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-3;
    
    .logo-item {
      background: rgba(255, 255, 255, 0.1);
      padding: $space-3;
      border-radius: $radius-md;
      font-weight: $font-weight-medium;
      color: rgba(255, 255, 255, 0.9);
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
    width: 80px;
    height: 80px;
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
  to { transform: rotate(360deg); }
}

// Responsive Design
@media (max-width: 768px) {
  .register-container {
    grid-template-columns: 1fr;
  }
  
  .register-info-section {
    order: -1;
    min-height: 400px;
  }
  
  .register-form-section {
    padding: $space-6 $space-4;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
  
  .logos-grid {
    grid-template-columns: 1fr;
  }
}
</style> 