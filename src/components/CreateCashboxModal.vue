<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useCashboxes } from "../composables/useCashboxes";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
}>();

const { createCashbox } = useCashboxes();

const name = ref("");
const address = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.open && !isSubmitting.value) {
    emit("close");
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      name.value = "";
      address.value = "";
      errorMessage.value = "";
      window.addEventListener("keydown", handleKeydown);
    } else {
      window.removeEventListener("keydown", handleKeydown);
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

async function handleSubmit() {
  const trimmedName = name.value.trim();
  if (!trimmedName) {
    errorMessage.value = "Введите название кассы";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await createCashbox({
      name: trimmedName,
      address: address.value.trim() || undefined,
    });
    emit("created");
    emit("close");
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : "Не удалось создать кассу";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-cashbox-title"
      @click.self="!isSubmitting && emit('close')"
    >
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 id="create-cashbox-title" class="modal-title">Создать кассу</h2>
          <button
            type="button"
            class="modal-close"
            aria-label="Закрыть окно"
            :disabled="isSubmitting"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <form class="modal-form" @submit.prevent="handleSubmit">
          <div class="modal-field">
            <label for="cashbox-name">Название кассы *</label>
            <input
              id="cashbox-name"
              v-model="name"
              type="text"
              placeholder="Новая касса"
              required
              autofocus
            />
          </div>

          <div class="modal-field">
            <label for="cashbox-address">Адрес</label>
            <input
              id="cashbox-address"
              v-model="address"
              type="text"
              placeholder="Необязательно"
            />
          </div>

          <p class="modal-meta">Баланс 0.00 ₸ · Смена закрыта · Каталог пуст</p>

          <p v-if="errorMessage" class="modal-error">
            {{ errorMessage }}
          </p>

          <div class="modal-footer">
            <button
              type="button"
              class="modal-btn modal-btn--secondary"
              :disabled="isSubmitting"
              @click="emit('close')"
            >
              Отмена
            </button>

            <button
              type="submit"
              class="modal-btn modal-btn--primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Создание..." : "Создать" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  background: rgba(15, 23, 42, 0.35);
}

.modal-dialog {
  width: 100%;
  max-width: 440px;
  padding: 24px;

  background: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 12px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
  color: var(--color-text, #18181b);
}

.modal-close {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;

  background: transparent;
  border: none;
  border-radius: var(--radius-sm, 6px);
  font-size: 20px;
  line-height: 1;
  color: var(--color-text-secondary, #71717a);
  cursor: pointer;
}

.modal-close:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-text, #18181b);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary, #52525b);
}

.modal-field input {
  height: 42px;
  padding: 0 12px;

  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #d4d4d8);
  border-radius: var(--radius-sm, 8px);
  font: inherit;
  font-size: 14px;
  color: var(--color-text, #18181b);
}

.modal-field input:focus {
  outline: none;
  border-color: #4ea819;
}

.modal-meta {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-text-secondary, #71717a);
}

.modal-error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}

.modal-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 4px;
}

.modal-btn {
  height: 42px;
  padding: 0 16px;
  border-radius: var(--radius-sm, 8px);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-btn--secondary {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #d4d4d8);
  color: var(--color-text, #18181b);
}

.modal-btn--secondary:hover:not(:disabled) {
  background: #f4f4f5;
}

.modal-btn--primary {
  background: #52b71c;
  border: 1px solid #52b71c;
  color: #ffffff;
}

.modal-btn--primary:hover:not(:disabled) {
  background: #469f16;
}
</style>
