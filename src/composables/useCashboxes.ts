import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "./useAuth";

export interface Cashbox {
  id: number;
  name: string;
  address: string;
  serial_number: string;
  cash_balance: number;
  created_at: string;
}

export interface Cashier {
  id: number;
  login: string;
  name: string;
}

export interface CreateCashboxPayload {
  name: string;
  address?: string;
}

export interface UpdateCashboxPayload {
  name: string;
  address?: string;
}

interface ApiResponse<T> {
  data: T;
}

export function useCashboxes() {
  const router = useRouter();
  const { logout } = useAuth();

  const cashboxes = ref<Cashbox[]>([]);
  const cashier = ref<Cashier | null>(null);

  const isLoading = ref(false);
  const error = ref("");

  async function loadCashboxes() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      logout();
      await router.push({ name: "login" });
      return;
    }

    isLoading.value = true;
    error.value = "";

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [cashboxesResponse, profileResponse] = await Promise.all([
        fetch("/api/v1/cashboxes?limit=100", { headers }),
        fetch("/api/v1/profile", { headers }),
      ]);

      if (cashboxesResponse.status === 401 || profileResponse.status === 401) {
        logout();
        await router.push({ name: "login" });
        return;
      }

      if (!cashboxesResponse.ok || !profileResponse.ok) {
        throw new Error("Не удалось загрузить данные");
      }

      const cashboxesResult: ApiResponse<Cashbox[]> =
        await cashboxesResponse.json();

      const profileResult: ApiResponse<Cashier> = await profileResponse.json();

      cashboxes.value = cashboxesResult.data;
      cashier.value = profileResult.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Неизвестная ошибка";
    } finally {
      isLoading.value = false;
    }
  }

  async function createCashbox(payload: CreateCashboxPayload) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      logout();
      await router.push({ name: "login" });
      return;
    }

    const response = await fetch("/api/v1/cashboxes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: payload.name,
        ...(payload.address ? { address: payload.address } : {}),
      }),
    });

    if (response.status === 401) {
      logout();
      await router.push({ name: "login" });
      return;
    }

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(json?.error?.message || "Не удалось создать кассу");
    }

    await loadCashboxes();
  }

  async function updateCashbox(id: number, payload: UpdateCashboxPayload) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      logout();
      await router.push({ name: "login" });
      return;
    }

    const response = await fetch(`/api/v1/cashboxes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: payload.name,
        ...(payload.address ? { address: payload.address } : {}),
      }),
    });

    if (response.status === 401) {
      logout();
      await router.push({ name: "login" });
      return;
    }

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(json?.error?.message || "Не удалось обновить кассу");
    }

    await loadCashboxes();
  }

  return {
    cashboxes,
    cashier,
    isLoading,
    error,
    loadCashboxes,
    createCashbox,
    updateCashbox,
  };
}
