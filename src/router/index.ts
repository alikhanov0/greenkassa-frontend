import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import CashboxesView from "../views/CashboxesView.vue";
import WorkspaceView from "../views/WorkspaceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/cashboxes",
      name: "cashboxes",
      component: CashboxesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/cashboxes/:id",
      name: "workspace",
      component: WorkspaceView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/cashboxes",
    },
  ],
});

router.beforeEach((to) => {
  const hasToken = Boolean(localStorage.getItem("access_token"));

  if (to.meta.requiresAuth && !hasToken) {
    return { name: "login" };
  }

  if (to.name === "login" && hasToken) {
    return { name: "cashboxes" };
  }
});

export default router;
