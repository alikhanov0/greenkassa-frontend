<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const { login, isLoading, error, isAuthenticated } = useAuth();

async function handleSubmit() {
  if (!username.value.trim() || !password.value) {
    return;
  }

  await login(username.value.trim(), password.value);
}
</script>

<template>
  <section class="login-form">
    <template v-if="isAuthenticated">
      <div class="login-form__heading">
        <h1>Вход выполнен!</h1>
        <p>Авторизация прошла успешно. Можно переходить к выбору кассы.</p>
      </div>

      <span class="status status-success"> Вы авторизованы </span>
    </template>

    <template v-else>
      <div class="login-form__heading">
        <h1>Добро пожаловать</h1>
        <p>Войдите, чтобы начать работу с кассой.</p>
      </div>

      <form class="login-form__fields" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="login"> Логин </label>

          <input
            id="login"
            v-model="username"
            class="input"
            type="text"
            placeholder="Введите логин"
            autocomplete="username"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password"> Пароль </label>

          <div class="password-field">
            <input
              id="password"
              v-model="password"
              class="input password-field__input"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Введите пароль"
              autocomplete="current-password"
              :disabled="isLoading"
              required
            />

            <button
              type="button"
              class="password-field__toggle"
              :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
              :aria-pressed="showPassword"
              :disabled="isLoading"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Скрыть" : "Показать" }}
            </button>
          </div>
        </div>

        <p v-if="error" class="form-error" role="alert">
          {{ error }}
        </p>

        <button
          class="btn btn-primary btn-full"
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? "Входим..." : "Войти" }}
        </button>
      </form>
    </template>
  </section>
</template>

<style scoped>
.login-form {
  width: 100%;
  max-width: 304px;
}

.login-form__heading {
  margin-bottom: 28px;
}

.login-form__heading h1 {
  margin-bottom: 8px;

  font-size: 24px;
  line-height: 35px;
  font-weight: 600;
}

.login-form__heading p {
  color: var(--color-text-secondary);

  font-size: 12px;
  line-height: 17px;
}

.login-form__fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.password-field {
  position: relative;
}

.password-field__input {
  padding-right: 82px;
}

.password-field__toggle {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);

  padding: 4px;

  border: none;
  background: transparent;

  color: var(--color-text-secondary);
  font-size: 12px;

  cursor: pointer;
}

.password-field__toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-form__fields > .btn {
  margin-top: 6px;
}
</style>
