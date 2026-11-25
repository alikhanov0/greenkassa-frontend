<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import { type Cashbox, type Cashier } from "../composables/useCashboxes";

const route = useRoute();
const router = useRouter();

const cashbox = ref<Cashbox | null>(null);
const cashier = ref<Cashier | null>(null);

async function loadWorkspace() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    await router.push({ name: "login" });
    return;
  }

  const cashboxId = route.params.id;
  const headers = { Authorization: `Bearer ${token}` };

  const [cashboxRes, profileRes] = await Promise.all([
    fetch(`/api/v1/cashboxes/${cashboxId}`, { headers }),
    fetch("/api/v1/profile", { headers }),
  ]);

  if (cashboxRes.status === 401 || profileRes.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    await router.push({ name: "login" });
    return;
  }

  if (cashboxRes.ok) {
    const cashboxJson = await cashboxRes.json();
    cashbox.value = cashboxJson.data ?? cashboxJson;
  }

  if (profileRes.ok) {
    const profileJson = await profileRes.json();
    cashier.value = profileJson.data ?? profileJson;
  }
}

function handleChangeCashbox() {
  router.push({ name: "cashboxes" });
}

onMounted(() => {
  loadWorkspace();
});
</script>

<template>
  <AppHeader
    title="касса"
    :cashbox="cashbox"
    :cashier="cashier"
    @change-cashbox="handleChangeCashbox"
  />
  <main class="workspace">
    <p class="text-caption">РАБОЧЕЕ ПРОСТРАНСТВО</p>

    <h1 class="text-page-title">{{ cashbox?.name }}</h1>

    <p class="text-body">Касса выбрана. Здесь будет рабочее место кассира.</p>

    <RouterLink to="/cashboxes" class="btn btn-secondary">
      ← Назад к кассам
    </RouterLink>
  </main>
</template>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-6);

  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-12);
}

@media (max-width: 600px) {
  .workspace {
    padding: var(--space-6);
  }
}
</style>
