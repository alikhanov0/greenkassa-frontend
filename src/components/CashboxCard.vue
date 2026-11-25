<script setup lang="ts">
import { computed } from "vue";
import type { Cashbox } from "../composables/useCashboxes";

const props = defineProps<{
  cashbox: Cashbox;
  index: number;
}>();

const emit = defineEmits<{
  open: [cashbox: Cashbox];
}>();

const formattedBalance = computed(() => {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(props.cashbox.cash_balance / 100);
});

const number = computed(() => String(props.index + 1).padStart(2, "0"));

async function copySerial() {
  try {
    await navigator.clipboard.writeText(props.cashbox.serial_number);
  } catch {}
}
</script>

<template>
  <article class="cashbox-card">
    <div class="cashbox-card__main">
      <p class="cashbox-card__number">КАССА {{ number }}</p>

      <h2 class="cashbox-card__title">
        {{ cashbox.name }}
      </h2>

      <div class="cashbox-card__serial">
        <span>{{ cashbox.serial_number }}</span>
        <span>·</span>
        <button type="button" @click="copySerial">Копировать</button>
      </div>

      <p class="cashbox-card__address">
        {{ cashbox.address || "Адрес не указан" }}
      </p>
    </div>

    <div class="cashbox-card__bottom">
      <p class="cashbox-card__balance-label">Наличный баланс</p>

      <p class="cashbox-card__balance">{{ formattedBalance }} ₸</p>

      <button
        class="btn btn-primary btn-full"
        type="button"
        @click="emit('open', cashbox)"
      >
        Открыть кассу
      </button>
    </div>
  </article>
</template>

<style scoped>
.cashbox-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-8);

  min-width: 0;
  min-height: 290px;
  padding: var(--space-6);

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.cashbox-card__number {
  margin-bottom: var(--space-4);
  font-size: 10px;
  line-height: 16px;
  color: var(--color-text-secondary);
}

.cashbox-card__title {
  margin-bottom: var(--space-2);
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.cashbox-card__serial {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  margin-bottom: var(--space-4);
  font-size: 12px;
  line-height: 17px;
  color: var(--color-text-secondary);
}

.cashbox-card__serial button {
  padding: 0;
  border: none;
  background: transparent;

  color: inherit;
  font: inherit;
  cursor: pointer;
}

.cashbox-card__serial button:hover {
  color: var(--color-text);
  text-decoration: underline;
}

.cashbox-card__address {
  font-size: 12px;
  line-height: 17px;
  color: var(--color-text-secondary);
}

.cashbox-card__balance-label {
  margin-bottom: var(--space-2);
  font-size: 12px;
  color: var(--color-text-secondary);
}

.cashbox-card__balance {
  margin-bottom: var(--space-6);
  font-size: 24px;
  line-height: 35px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 768px) {
  .cashbox-card {
    min-height: 260px;
  }
}
</style>
