<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());

const name = ref("");
const brand = ref("");
const type = ref("");
const color = ref("");
const yardage = ref("");

const createFiber = async () => {
  return;
};
</script>

<template>
  <form @submit.prevent="createFiber()">
    <input type="text" id="name" v-model="name" placeholder="Name" required />
    <input type="text" id="brand" v-model="brand" placeholder="Brand" required />
    <input type="text" id="type" v-model="type" placeholder="Type" required />
    <input type="text" id="color" v-model="color" placeholder="Color" required />
    <input type="text" id="yardage" v-model="yardage" placeholder="Yardage" required />
    <button type="submit" class="pure-button pure-button-primary">Add</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 1em;
}
</style>
