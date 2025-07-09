<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Свяжитесь с нами</h1>
          <p class="hero-subtitle">
            Готовы ответить на ваши вопросы и помочь выбрать оптимальное решение для ваших задач
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-section">
            <h2 class="form-title">Напишите нам</h2>
            <p class="form-subtitle">
              Заполните форму, и мы свяжемся с вами в течение 1 рабочего дня
            </p>
            
            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                <label for="name">Имя *</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  required
                  :class="{ error: errors.name }"
                />
                <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
              </div>
              
              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  required
                  :class="{ error: errors.email }"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>
              
              <div class="form-group">
                <label for="company">Компания</label>
                <input 
                  type="text" 
                  id="company" 
                  v-model="form.company"
                />
              </div>
              
              <div class="form-group">
                <label for="phone">Телефон</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                />
              </div>
              
              <div class="form-group">
                <label for="subject">Тема обращения *</label>
                <select 
                  id="subject" 
                  v-model="form.subject" 
                  required
                  :class="{ error: errors.subject }"
                >
                  <option value="">Выберите тему</option>
                  <option value="demo">Запрос демонстрации</option>
                  <option value="pricing">Вопросы по тарифам</option>
                  <option value="technical">Техническая поддержка</option>
                  <option value="partnership">Партнёрство</option>
                  <option value="integration">Интеграция</option>
                  <option value="other">Другое</option>
                </select>
                <span v-if="errors.subject" class="error-text">{{ errors.subject }}</span>
              </div>
              
              <div class="form-group">
                <label for="message">Сообщение *</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  rows="5" 
                  required
                  :class="{ error: errors.message }"
                  placeholder="Расскажите подробнее о ваших задачах и требованиях..."
                ></textarea>
                <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="form.consent" 
                    required
                    :class="{ error: errors.consent }"
                  />
                  <span class="checkbox-custom"></span>
                  Я согласен на обработку персональных данных *
                </label>
                <span v-if="errors.consent" class="error-text">{{ errors.consent }}</span>
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.newsletter" />
                  <span class="checkbox-custom"></span>
                  Подписаться на новости и обновления продукта
                </label>
              </div>
              
              <button 
                type="submit" 
                class="submit-btn" 
                :disabled="isSubmitting"
                :class="{ loading: isSubmitting }"
              >
                <span v-if="!isSubmitting">Отправить сообщение</span>
                <span v-else>Отправка...</span>
              </button>
            </form>
            
            <!-- Success Message -->
            <div v-if="isSubmitted" class="success-message">
              <div class="success-icon">✅</div>
              <h3>Сообщение отправлено!</h3>
              <p>Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="contact-info-section">
            <div class="contact-methods">
              <h3>Контактная информация</h3>
              
              <div class="contact-method">
                <div class="method-icon">📧</div>
                <div class="method-content">
                  <h4>Email</h4>
                  <a href="mailto:info@gaznetcad.com">info@gaznetcad.com</a>
                  <a href="mailto:support@gaznetcad.com">support@gaznetcad.com</a>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="method-icon">📞</div>
                <div class="method-content">
                  <h4>Телефон</h4>
                  <a href="tel:+74951234567">+7 (495) 123-45-67</a>
                  <span class="method-note">Пн-Пт: 9:00-18:00 (МСК)</span>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="method-icon">📍</div>
                <div class="method-content">
                  <h4>Адрес</h4>
                  <p>
                    г. Москва, ул. Технологическая, д. 15<br>
                    БЦ "Инновации", офис 507
                  </p>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="method-icon">💬</div>
                <div class="method-content">
                  <h4>Мессенджеры</h4>
                  <div class="messenger-links">
                    <a href="#" class="messenger-link telegram">Telegram</a>
                    <a href="#" class="messenger-link whatsapp">WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Office Hours -->
            <div class="office-hours">
              <h3>Время работы</h3>
              <div class="hours-list">
                <div class="hours-item">
                  <span class="day">Понедельник - Пятница</span>
                  <span class="time">9:00 - 18:00</span>
                </div>
                <div class="hours-item">
                  <span class="day">Суббота</span>
                  <span class="time">10:00 - 16:00</span>
                </div>
                <div class="hours-item">
                  <span class="day">Воскресенье</span>
                  <span class="time">Выходной</span>
                </div>
              </div>
              <p class="hours-note">
                Техническая поддержка работает круглосуточно для клиентов корпоративного тарифа
              </p>
            </div>
            
            <!-- FAQ Link -->
            <div class="quick-help">
              <h3>Нужна быстрая помощь?</h3>
              <p>Возможно, ответ на ваш вопрос уже есть в нашей базе знаний</p>
              <button @click="$router.push('/documentation')" class="help-btn">
                Перейти к документации
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section (placeholder) -->
    <section class="map-section">
      <div class="container">
        <h2 class="section-title">Как нас найти</h2>
        <div class="map-container">
          <div class="map-placeholder">
            <div class="map-icon">🗺️</div>
            <p>Интерактивная карта</p>
            <p class="map-note">г. Москва, ул. Технологическая, д. 15</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы начать?</h2>
          <p>Попробуйте GazNetCAD бесплатно уже сегодня</p>
          <div class="cta-actions">
            <button class="btn-primary" @click="$router.push('/demo')">
              Запустить демо
            </button>
            <button class="btn-secondary" @click="$router.push('/pricing')">
              Посмотреть тарифы
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
  newsletter: false
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Имя обязательно для заполнения'
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'Email обязателен для заполнения'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Введите корректный email'
  }
  
  if (!form.subject) {
    errors.value.subject = 'Выберите тему обращения'
  }
  
  if (!form.message.trim()) {
    errors.value.message = 'Сообщение обязательно для заполнения'
  } else if (form.message.trim().length < 10) {
    errors.value.message = 'Сообщение должно содержать минимум 10 символов'
  }
  
  if (!form.consent) {
    errors.value.consent = 'Необходимо согласие на обработку данных'
  }
  
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // В реальном приложении здесь был бы API-запрос
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    isSubmitted.value = true
    
    // Сброс формы
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'boolean') {
        form[key] = false
      } else {
        form[key] = ''
      }
    })
  } catch (error) {
    console.error('Ошибка отправки формы:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact-page {
  background: $color-background;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-4;
}

// Hero Section
.contact-hero {
  padding: $space-16 0 $space-8;
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
    max-width: 600px;
    margin: 0 auto;
  }
}

// Contact Content
.contact-content {
  padding: $space-16 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: $space-12;
  align-items: start;
}

// Contact Form
.contact-form-section {
  .form-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-2;
    color: $color-text-primary;
  }
  
  .form-subtitle {
    color: $color-text-secondary;
    margin-bottom: $space-8;
    line-height: $line-height-relaxed;
  }
}

.contact-form {
  .form-group {
    margin-bottom: $space-6;
    
    label {
      display: block;
      margin-bottom: $space-2;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
    }
    
    input, select, textarea {
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
    
    textarea {
      resize: vertical;
      min-height: 120px;
      font-family: inherit;
    }
    
    .error-text {
      display: block;
      margin-top: $space-1;
      font-size: $font-size-sm;
      color: $color-error;
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

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

.success-message {
  text-align: center;
  padding: $space-8;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: $radius-lg;
  margin-top: $space-6;
  
  .success-icon {
    font-size: $font-size-3xl;
    margin-bottom: $space-4;
  }
  
  h3 {
    color: $color-success;
    margin-bottom: $space-2;
  }
  
  p {
    color: $color-text-secondary;
    margin: 0;
  }
}

// Contact Info
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: $space-8;
}

.contact-methods {
  background: $color-surface;
  padding: $space-6;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  
  h3 {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $space-6;
    color: $color-text-primary;
  }
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: $space-4;
  margin-bottom: $space-6;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .method-icon {
    font-size: $font-size-xl;
    flex-shrink: 0;
    margin-top: $space-1;
  }
  
  .method-content {
    h4 {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      margin-bottom: $space-2;
      color: $color-text-primary;
    }
    
    a {
      display: block;
      color: $color-primary;
      text-decoration: none;
      margin-bottom: $space-1;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    p {
      color: $color-text-secondary;
      margin: 0;
      line-height: $line-height-relaxed;
    }
    
    .method-note {
      font-size: $font-size-sm;
      color: $color-text-tertiary;
      display: block;
      margin-top: $space-1;
    }
  }
}

.messenger-links {
  display: flex;
  gap: $space-2;
  
  .messenger-link {
    padding: $space-2 $space-3;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    text-decoration: none;
    transition: all $duration-normal;
    
    &.telegram {
      background: #0088cc;
      color: white;
      
      &:hover {
        background: #006699;
      }
    }
    
    &.whatsapp {
      background: #25d366;
      color: white;
      
      &:hover {
        background: #1aad4b;
      }
    }
  }
}

.office-hours {
  background: $color-surface;
  padding: $space-6;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  
  h3 {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $space-4;
    color: $color-text-primary;
  }
}

.hours-list {
  margin-bottom: $space-4;
  
  .hours-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-2;
    
    .day {
      color: $color-text-primary;
      font-weight: $font-weight-medium;
    }
    
    .time {
      color: $color-text-secondary;
    }
  }
}

.hours-note {
  font-size: $font-size-sm;
  color: $color-text-tertiary;
  line-height: $line-height-relaxed;
  margin: 0;
}

.quick-help {
  background: $color-surface;
  padding: $space-6;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  text-align: center;
  
  h3 {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $space-2;
    color: $color-text-primary;
  }
  
  p {
    color: $color-text-secondary;
    margin-bottom: $space-4;
    line-height: $line-height-relaxed;
  }
  
  .help-btn {
    padding: $space-3 $space-6;
    background: $color-primary;
    color: white;
    border: none;
    border-radius: $radius-lg;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $duration-normal;
    
    &:hover {
      background: $color-primary-dark;
      transform: translateY(-1px);
    }
  }
}

// Map Section
.map-section {
  padding: $space-16 0;
  background: $color-surface;
  
  .section-title {
    text-align: center;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-8;
    color: $color-text-primary;
  }
}

.map-container {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  .map-placeholder {
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: $color-surface;
    
    .map-icon {
      font-size: $font-size-4xl;
      margin-bottom: $space-4;
    }
    
    p {
      color: $color-text-secondary;
      margin: $space-1 0;
      
      &.map-note {
        font-weight: $font-weight-medium;
        color: $color-text-primary;
      }
    }
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
  
  .cta-actions {
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
  .contact-grid {
    grid-template-columns: 1fr;
    gap: $space-8;
  }
  
  .contact-hero {
    padding: $space-12 0 $space-6;
    
    .hero-title {
      font-size: $font-size-3xl;
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
  
  .map-placeholder {
    height: 300px;
  }
}
</style> 