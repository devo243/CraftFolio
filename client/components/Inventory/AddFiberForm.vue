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
const availableTypes = [
  "cotton",
  "linen",
  "acrylic",
  "polyester",
  "flannel",
  "shiffon",
  "interfacing",
  "zipper",
  "button",
];
const customType = ref("");

const createFiber = async () => {
  try {
    await fetchy("/api/fibers", "POST", {
      body: {
        name: name.value,
        brand: brand.value,
        type: type.value === "custom" ? customType.value : type.value,
        color: color.value,
        yardage: yardage.value,
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
  customType.value = "";
  color.value = "";
  yardage.value = "";
};
</script>

<template>
  <form @submit.prevent="createFiber()">
    <input type="text" id="name" v-model="name" placeholder="Name" required />
    <input type="text" id="brand" v-model="brand" placeholder="Brand" />
    <select v-model="type" required>
      <option disabled value="">Please select one</option>
      <option v-for="(type, index) of availableTypes" :key="index">{{ type }}</option>
      <option value="custom">Custom...</option>
    </select>
      <input 
        type="text" 
        v-model="customType" 
        placeholder="Enter custom type" 
        v-if="type === 'custom'"
      />
    <input type="text" id="color" v-model="color" placeholder="Color" />
    <input type="text" id="yardage" v-model="yardage" placeholder="Yardage" required />
    <button type="submit" class="button-custom pure-button pure-button-primary">Add</button>
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

.button-custom {
  background-color: var(--earthy-green);
}
</style>
