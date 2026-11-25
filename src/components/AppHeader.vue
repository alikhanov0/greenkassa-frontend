<script setup lang="ts">
import type { PropType } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

export interface Cashier {
  name: string;
  login: string;
}

export interface Cashbox {
  id: string | number;
  name: string;
  code?: string;
  address?: string;
}

defineProps({
  title: {
    type: String,
    default: "greenkassa",
  },
  cashbox: {
    type: Object as PropType<Cashbox | null>,
    default: null,
  },
  cashier: {
    type: Object as PropType<Cashier | null>,
    default: null,
  },
});

const emit = defineEmits<{
  (e: "change-cashbox"): void;
  (e: "logout"): void;
}>();

const router = useRouter();
const { logout } = useAuth();

async function handleLogout() {
  logout();
  emit("logout");
  await router.push({ name: "login" });
}

function handleChangeCashbox() {
  emit("change-cashbox");
  router.push("/cashboxes"); // проверь путь до страницы выбора касс
}
</script>

<template>
  <header class="app-header">
    <!-- 1. Логотип -->
    <div class="app-header__left">
      <span class="app-header__logo">{{ title }}</span>
    </div>

    <!-- 2. Выбранная касса -->
    <div
      v-if="cashbox"
      class="app-header__section app-header__section--cashbox"
    >
      <div class="app-header__info">
        <strong class="app-header__title">{{ cashbox.name }}</strong>
        <span class="app-header__subtitle">
          {{ cashbox.code }} · {{ cashbox.address }}
        </span>
      </div>

      <button
        type="button"
        class="app-header__action"
        @click="handleChangeCashbox"
      >
        Сменить кассу
      </button>
    </div>

    <!-- 3. Кассир и кнопка выхода -->
    <div v-if="cashier" class="app-header__section app-header__section--user">
      <div class="app-header__info">
        <strong class="app-header__title">{{ cashier.name }}</strong>
        <span class="app-header__subtitle"> Кассир · {{ cashier.login }} </span>
      </div>

      <button type="button" class="app-header__action" @click="handleLogout">
        Выйти
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 72px;
  padding: 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.app-header__logo {
  font-size: 24px;
  font-weight: 700;
  color: #18181b;
  letter-spacing: -0.02em;
}

.app-header__section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.app-header__section--cashbox {
  flex: 1;
  max-width: 480px;
}

.app-header__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-header__title {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
}

.app-header__subtitle {
  font-size: 12px;
  color: #71717a;
}

.app-header__action {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 13px;
  color: #71717a;
  cursor: pointer;
  transition: color 0.15s;
}

.app-header__action:hover {
  color: #18181b;
}
</style>
