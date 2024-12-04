<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/snip.png" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Craftfolio</h1>
        </RouterLink>
      </div>
      <ul>
        <div :class="{ link: currentRouteName !== 'Home', selected: currentRouteName == 'Home' }">
          <li>
            <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
          </li>
        </div>
        <div v-if="isLoggedIn" :class="{ link: currentRouteName !== 'Settings', selected: currentRouteName == 'Settings' }">
          <li>
            <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
          </li>
        </div>
        <div v-else :class="{ link: currentRouteName !== 'Login', selected: currentRouteName == 'Login' }">
          <li>
            <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
          </li>
        </div>
        <div v-if="isLoggedIn" :class="{ link: currentRouteName !== 'MyPosts', selected: currentRouteName == 'MyPosts' }">
          <li>
            <RouterLink :to="{ name: 'MyPosts' }" :class="{ underline: currentRouteName == 'MyPosts' }"> MyGuides </RouterLink>
          </li>
        </div>
        <div v-if="isLoggedIn" :class="{ link: currentRouteName !== 'Inventory', selected: currentRouteName == 'Inventory' }">
          <li>
            <RouterLink :to="{ name: 'Inventory' }" :class="{ underline: currentRouteName == 'Inventory' }"> Inventory </RouterLink>
          </li>
        </div>
        <div v-if="isLoggedIn" :class="{ link: currentRouteName !== 'Projects' && currentRouteName !== 'CreateProjects' && currentRouteName !== 'ProjectPage', selected: currentRouteName == 'Projects' || currentRouteName == 'CreateProjects' || currentRouteName == 'ProjectPage' }">
          <li>
            <RouterLink :to="{ name: 'Projects' }" :class="{ underline: currentRouteName == 'Projects' || currentRouteName == 'CreateProjects' || currentRouteName == 'ProjectPage' }"> Projects </RouterLink>
          </li>
        </div>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em 0 2em;
  background-color: var(--dark-green);
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
  color: #fcf2cf;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0 0 1em 0;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: #fcf2cf;
  /* color: var(--dark-green); */
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
  height: 3.7em;
}

.link {
  display: flex;
  align-items: center;
  background-color: #2f3a2c;
  height: 100%;
  padding: 0 0.5em 0 0.5em;
  border-radius: 1em 1em 0 0;
  /* height: fit-content; */
}

.selected {
  display: flex;
  align-items: center;
  background-color: white;
  height: 100%;
  padding: 0 0.5em 0 0.5em;
  border-radius: 1em 1em 0 0;
  /* color: var(--dark-green); */
  /* height: fit-content; */
}

.underline {
  text-decoration: underline;
  color: var(--dark-green);
}
</style>
