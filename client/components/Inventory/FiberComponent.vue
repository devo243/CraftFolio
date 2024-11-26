<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["fiber"]);
const { currentUsername } = storeToRefs(useUserStore());

const fiber = ref(props.fiber);
</script>

<template>
  <div class="container">
    <span class="block">{{ fiber.name }}</span>
    <div class="vl"></div>
    <span class="block">{{ fiber.brand }}</span>
    <div class="vl"></div>
    <span class="block">{{ fiber.type }}</span>
    <div class="vl"></div>
    <span class="block">{{ fiber.color }}</span>
    <div class="vl"></div>
    <span class="block">{{ fiber.yardage }} ft</span>
  </div>
</template>

<style scoped>
.container {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 20px;
  height: 20px;
  background-color: grey;
}

.block {
  flex-grow: 1;
}

.vl {
  border-left: 1px solid black;
  align-items: stretch;
  flex-grow: 1;
}
</style>
