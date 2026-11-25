import { ref } from "vue";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface LoginResponse {
  data: AuthTokens;
}

export function useAuth() {
  const isLoading = ref(false);
  const error = ref("");
  const isAuthenticated = ref(Boolean(localStorage.getItem("access_token")));

  async function login(login: string, password: string) {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Неверный логин или пароль");
        }

        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const result: LoginResponse = await response.json();

      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);

      isAuthenticated.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Неизвестная ошибка";

      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    isAuthenticated.value = false;
  }

  return {
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  };
}
