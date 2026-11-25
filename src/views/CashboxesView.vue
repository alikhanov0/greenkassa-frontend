<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CashboxCard from "../components/CashboxCard.vue";
import { useCashboxes, type Cashbox } from "../composables/useCashboxes";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";

const { cashboxes, cashier, isLoading, error, loadCashboxes } = useCashboxes();

const currentPage = ref(1);
const pageSize = 3;

const router = useRouter();

const pageCount = computed(() =>
  Math.max(1, Math.ceil(cashboxes.value.length / pageSize)),
);

const visibleCashboxes = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return cashboxes.value.slice(start, start + pageSize);
});

function openCashbox(cashbox: Cashbox) {
  router.push({
    name: "workspace",
    params: {
      id: cashbox.id,
    },
  });
}

onMounted(() => {
  loadCashboxes();
});
</script>

<template>
  <div class="cashboxes-page">
    <AppHeader title="greenkassa" :cashier="cashier" />

    <main class="cashboxes-content">
      <div class="cashboxes-heading">
        <div>
          <p class="cashboxes-eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</p>

          <h1>Выберите кассу</h1>

          <p class="cashboxes-description">
            Каталог, чеки и отчёты хранятся отдельно для каждой кассы.
          </p>
        </div>
      </div>

      <div v-if="isLoading" class="page-message">Загружаем кассы...</div>

      <div v-else-if="error" class="page-message">
        <p class="form-error">{{ error }}</p>

        <button type="button" class="btn btn-secondary" @click="loadCashboxes">
          Повторить
        </button>
      </div>

      <template v-else>
        <div v-if="cashboxes.length" class="cashboxes-grid">
          <CashboxCard
            v-for="(cashbox, index) in visibleCashboxes"
            :key="cashbox.id"
            :cashbox="cashbox"
            :index="(currentPage - 1) * pageSize + index"
            @open="openCashbox"
          />
        </div>

        <div v-else class="page-message">
          <p>Пока нет ни одной кассы.</p>
          <p>Кассы можно создать через API.</p>
        </div>

        <div v-if="cashboxes.length" class="cashboxes-pagination">
          <span>{{ cashboxes.length }} касс</span>

          <div class="pagination-controls">
            <button
              type="button"
              :disabled="currentPage === 1"
              aria-label="Предыдущая страница"
              @click="currentPage--"
            >
              ←
            </button>

            <span>{{ currentPage }} / {{ pageCount }}</span>

            <button
              type="button"
              :disabled="currentPage === pageCount"
              aria-label="Следующая страница"
              @click="currentPage++"
            >
              →
            </button>
          </div>
        </div>
      </template>

      <div class="cashboxes-notice">
        <strong>Продолжите с нужной кассы</strong>
        <p>Статус смены и доступные операции появятся после открытия кассы.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cashboxes-page {
  min-height: 100vh;
  background: var(--color-background);
}

.cashboxes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);

  min-height: 64px;
  padding: 0 clamp(20px, 4vw, 60px);

  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.cashboxes-header__logo {
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
}

.cashboxes-header__user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

.cashboxes-header__user span {
  color: var(--color-text-secondary);
}

.cashboxes-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 36px clamp(20px, 4vw, 60px) 48px;
}

.cashboxes-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-6);

  margin-bottom: 36px;
}

.cashboxes-eyebrow {
  margin-bottom: var(--space-3);
  font-size: 10px;
  line-height: 16px;
  color: var(--color-text-secondary);
}

.cashboxes-heading h1 {
  margin-bottom: var(--space-2);
  font-size: 32px;
  line-height: 46px;
  font-weight: 700;
}

.cashboxes-description {
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text-secondary);
}

.cashboxes-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.page-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  padding: 40px 0;
  color: var(--color-text-secondary);
}

.cashboxes-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);

  margin-top: var(--space-4);

  font-size: 12px;
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.pagination-controls button,
.pagination-controls span {
  display: grid;
  place-items: center;

  min-width: 36px;
  min-height: 36px;
  padding: 0 var(--space-2);

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);

  font: inherit;
  color: var(--color-text);
}

.pagination-controls button:disabled {
  opacity: 0.4;
}

.cashboxes-notice {
  margin-top: 48px;
  padding: var(--space-6);

  border-radius: var(--radius-md);
  background: var(--color-success);

  font-size: 12px;
  line-height: 17px;
}

.cashboxes-notice strong {
  display: block;
  margin-bottom: 4px;
}

.cashboxes-notice p {
  color: var(--color-text-secondary);
}

@media (max-width: 900px) {
  .cashboxes-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .cashboxes-header {
    padding: 0 20px;
  }

  .cashboxes-content {
    padding: 24px 16px;
  }

  .cashboxes-heading h1 {
    font-size: 26px;
    line-height: 36px;
  }

  .cashboxes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
