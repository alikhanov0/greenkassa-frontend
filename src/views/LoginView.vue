<script setup lang="ts">
import AppHeader from "../components/AppHeader.vue";
import LoginForm from "../components/LoginForm.vue";
</script>

<template>
  <div class="login-page">
    <AppHeader />

    <main class="login-page__content">
      <section class="welcome-panel">
        <p class="welcome-panel__eyebrow">УПРАВЛЕНИЕ ПРОДАЖАМИ</p>

        <h2 class="welcome-panel__title">
          Уверенно<br />
          за кассой.
        </h2>

        <p class="welcome-panel__description">
          Все кассовые операции — в одном понятном рабочем пространстве.
        </p>

        <ol class="welcome-panel__steps">
          <li class="welcome-step">
            <span class="welcome-step__number"> 01 </span>

            <div>
              <h3 class="welcome-step__title">Выберите кассу</h3>

              <p class="welcome-step__description">
                У каждой — свой каталог и баланс.
              </p>
            </div>
          </li>

          <li class="welcome-step">
            <span class="welcome-step__number"> 02 </span>

            <div>
              <h3 class="welcome-step__title">Откройте смену</h3>

              <p class="welcome-step__description">
                Наличный остаток перенесётся автоматически.
              </p>
            </div>
          </li>

          <li class="welcome-step">
            <span class="welcome-step__number"> 03 </span>

            <div>
              <h3 class="welcome-step__title">Проведите первую продажу</h3>

              <p class="welcome-step__description">
                Добавьте товары, примите оплату и выдайте чек.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div class="login-page__form">
        <LoginForm />
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-page__content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
}

/* Левая информационная панель */
.welcome-panel {
  display: flex;
  flex-direction: column;

  min-height: 540px;
  padding: 32px;

  border-radius: var(--radius-lg);
  background: var(--color-dark-green);
  color: var(--color-surface);
}

.welcome-panel__eyebrow {
  margin-bottom: 48px;

  font-size: 10px;
  line-height: 16px;
  color: #d1ded3;
}

.welcome-panel__title {
  margin-bottom: 20px;

  font-size: clamp(32px, 4vw, 44px);
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.welcome-panel__description {
  max-width: 320px;

  font-size: 14px;
  line-height: 20px;
  color: #d1ded3;
}

.welcome-panel__steps {
  display: flex;
  flex-direction: column;
  gap: 30px;

  margin: 44px 0 0;
  padding: 0;
  list-style: none;
}

.welcome-step {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 18px;
}

.welcome-step__number {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

.welcome-step__title {
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 17px;
  font-weight: 500;
}

.welcome-step__description {
  color: #b8c9bc;
  font-size: 10px;
  line-height: 15px;
}

/* Правая часть */
.login-page__form {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  padding: 76px 24px 24px;
}

/* Планшеты */
@media (max-width: 768px) {
  .login-page__content {
    grid-template-columns: 1fr;
  }

  .welcome-panel {
    min-height: auto;
    padding: 32px;
  }

  .welcome-panel__eyebrow {
    margin-bottom: 24px;
  }

  .welcome-panel__steps {
    gap: 20px;
    margin-top: 28px;
  }

  .login-page__form {
    padding: 32px 16px 48px;
  }
}

/* Телефоны */
@media (max-width: 480px) {
  .login-page__content {
    padding: 12px;
    gap: 12px;
  }

  .welcome-panel {
    padding: 24px;
  }

  .welcome-panel__title {
    font-size: 32px;
  }

  .login-page__form {
    padding: 24px 8px 40px;
  }
}
</style>
