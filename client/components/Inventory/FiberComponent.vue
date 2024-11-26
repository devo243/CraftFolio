<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["fiber"]);
const { currentUsername } = storeToRefs(useUserStore());

const fiber = ref(props.fiber);
const editing = ref(false);
</script>

<template>
  <div class="container">
    <div class="block">
      <span v-if="editing">{{ fiber.name }}</span>
      <input v-else type="text" id="name" v-model="fiber.name" :placeholder="fiber.name"></input>
    </div>
    <div class="vl"></div>
    <div class="block">
      <span v-if="editing">{{ fiber.brand }}</span>
      <input v-else type="text" id="brand" v-model="fiber.brand" :placeholder="fiber.brand"></input>
    </div>
    <div class="vl"></div>
    <div class="block">
      <span v-if="editing">{{ fiber.type }}</span>
      <input v-else type="text" id="type" v-model="fiber.type" :placeholder="fiber.type"></input>
    </div>
    <div class="vl"></div>
    <div class="block">
      <span v-if="editing">{{ fiber.color }}</span>
      <input v-else type="text" id="yardage" v-model="fiber.color" :placeholder="fiber.color"></input>
    </div>
    <div class="vl"></div>
    <div class="block">
      <span v-if="editing">{{ fiber.yardage }}</span>
      <input v-else type="text" id="yardage" v-model="fiber.yardage" :placeholder="fiber.yardage"></input>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 10px 0px 10px;
  height: 60px;
  background-color: rgb(190, 190, 190);
  border-radius: 2em;
}

.block {
  width: 20%;
  overflow: hidden;
  text-align: center;
}

input {
  width: 90%;
  overflow: hidden;
  text-align: center;
  background-color: rgb(238, 238, 238);
  border: none;
  border-radius: 2em;
  box-shadow: none;
}

.vl {
  border-left: 1px solid black;
  height: 100%;
}
</style>
