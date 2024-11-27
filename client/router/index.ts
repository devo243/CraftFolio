import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CreateProjectView from "../views/CreateProjectView.vue";
import HomeView from "../views/HomeView.vue";
import InventoryView from "../views/InventoryView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProjectListView from "../views/ProjectListView.vue";
import ProjectPageView from "../views/ProjectPageView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/inventory",
      name: "Inventory",
      component: InventoryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/projects",
      name: "Projects",
      component: ProjectListView,
      meta: { requiresAuth: true },
    },
    {
      path: "/projects/:id",
      name: "ProjectPage",
      component: ProjectPageView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/create/project",
      name: "CreateProjects",
      component: CreateProjectView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
