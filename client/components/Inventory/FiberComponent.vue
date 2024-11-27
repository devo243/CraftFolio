<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["fiber"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshFibers"]);

const fiber = ref(props.fiber);
const editing = ref(false);

const deleteFiber = async () => {
  try {
    await fetchy(`/api/fibers/${props.fiber._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFibers");
};

const toggleEditing = () => {
  if (!editing.value) {
    editing.value = true;
  } else {
    editing.value = false;
  }
};
</script>

<template>
  <div class="fiber">
    <div class="container">
      <div class="block">
        <span v-if="!editing">{{ fiber.name }}</span>
        <input v-else type="text" id="name" v-model="fiber.name" :placeholder="fiber.name" />
      </div>
      <div class="vl"></div>
      <div class="block">
        <span v-if="!editing">{{ fiber.brand }}</span>
        <input v-else type="text" id="brand" v-model="fiber.brand" :placeholder="fiber.brand" />
      </div>
      <div class="vl"></div>
      <div class="block">
        <span v-if="!editing">{{ fiber.type }}</span>
        <input v-else type="text" id="type" v-model="fiber.type" :placeholder="fiber.type" />
      </div>
      <div class="vl"></div>
      <div class="block">
        <span v-if="!editing">{{ fiber.color }}</span>
        <input v-else type="text" id="yardage" v-model="fiber.color" :placeholder="fiber.color" />
      </div>
      <div class="vl"></div>
      <div class="block">
        <span v-if="!editing">{{ fiber.remainingYardage }} ft</span>
        <input v-else type="text" id="yardage" v-model="fiber.remainingYardage" :placeholder="fiber.remainingYardage" />
      </div>
    </div>
    <button v-if="!editing" v-on:click="toggleEditing"><img src="@/assets/icons/pencil.svg" /></button>
    <button v-else v-on:click="toggleEditing" class="edit"><img src="@/assets/icons/pencil.svg" /></button>
    <button v-on:click="deleteFiber"><img src="@/assets/icons/thrash.svg" /></button>
  </div>
</template>

<style scoped>
.fiber {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

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

img {
  width: 25px;
  height: 100%;
}

button {
  width: 40px;
  height: 40px;
}

.edit {
  background-color: lightgray;
}

.vl {
  border-left: 1px solid black;
  height: 100%;
}
</style>
