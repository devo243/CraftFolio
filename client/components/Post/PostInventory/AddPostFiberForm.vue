<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["post_id", "add_fiber"]);
const emit = defineEmits(["refreshFibers"]);

const { currentUsername } = storeToRefs(useUserStore());

const type = ref("");
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
    await props.add_fiber(type.value === "custom" ? customType.value : type.value, yardage.value);
  } catch (_) {
    return;
  }
  emit("refreshFibers");
  emptyForm();
};

const emptyForm = () => {
  type.value = "";
  customType.value = "";
  yardage.value = "";
};
</script>

<template>
  <form @submit.prevent="createFiber()">
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
        required
      />
    <input type="number"  step="any" id="yardage" v-model="yardage" placeholder="Yardage" required />
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
  align-items: center;
}

input {
  width: 18%;
}

.button-custom {
  background-color: var(--earthy-green);
}
</style>
