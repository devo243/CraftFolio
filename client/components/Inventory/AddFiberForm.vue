<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const emit = defineEmits(["refreshFibers"]);

const { currentUsername } = storeToRefs(useUserStore());

const name = ref("");
const brand = ref("");
const type = ref("");
const color = ref("");
const yardage = ref("");

const createFiber = async () => {
  try {
    await fetchy("/api/fibers", "POST", {
      body: {
        name: name.value,
        brand: brand.value,
        type: type.value,
        color: color.value,
        remainingYardage: yardage.value,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshFibers");
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  brand.value = "";
  type.value = "";
  color.value = "";
  yardage.value = "";
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

input {
  width: 18%;
}
</style>
