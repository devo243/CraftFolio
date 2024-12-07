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

const deleteFiber = async () => {
  try {
    await fetchy(`/api/fibers/${props.fiber._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFibers");
};

const editFiber = async () => {
  try {
    console.log("updating to be: ", fiber.value);
    fiber.value.type = fiber.value.type === "custom" ? customType.value : fiber.value.type;
    await fetchy(`/api/fibers/${props.fiber._id}`, "PATCH", {
      body: {
        name: fiber.value.name,
        brand: fiber.value.brand,
        type: fiber.value.type,
        color: fiber.value.color,
        yardage: fiber.value.remainingYardage,
      },
    });
  } catch {
    return;
  }
  emit("refreshFibers");
};

const toggleEditing = async () => {
  if (!editing.value) {
    editing.value = true;
  } else {
    await editFiber();
    editing.value = false;
  }
};

const cancel = async () => {
  editing.value = false;
  fiber.value = props.fiber;
  emit("refreshFibers");
}
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
        <select v-else v-model="fiber.type" required>
          <option disabled value="">Please select one</option>
          <option v-for="(type, index) of availableTypes" :key="index">{{ type }}</option>
          <option value="custom">Custom...</option>
        </select>
        <input 
          type="text" 
          v-model="customType" 
          placeholder="Enter custom type" 
          v-if="fiber.type === 'custom' && editing"
          style="margin-top: 0.5em;"
        />
      </div>
      <div class="vl"></div>
      <div class="block">
        <span v-if="!editing && fiber.color.startsWith('#') && fiber.color.length === 7">    <div
      :style="{ backgroundColor: fiber.color, width: 'auto', height: '15px', border: `1px solid grey` }"
    ></div></span>
        <span v-else-if="!editing">{{ fiber.color }}</span>
        <input v-else type="color" id="color" v-model="fiber.color" :placeholder="fiber.color" />
      </div>
      <div class="vl"></div>
      <div class="block">
        <span v-if="!editing">{{ fiber.remainingYardage }} yd</span>
        <input v-else type="number" step="any" id="yardage" v-model="fiber.remainingYardage" :placeholder="fiber.remainingYardage" />
      </div>
    </div>
    <button v-if="!editing" v-on:click="toggleEditing"><img src="@/assets/icons/pencil.svg" /></button>
    <button v-else v-on:click="toggleEditing" class="edit"><img src="@/assets/icons/check.svg" /></button>
    <button v-if="editing" v-on:click="cancel" class="cancel"><img src="@/assets/icons/cancel.svg" /></button>
    <button v-on:click="deleteFiber" class="trash"><img src="@/assets/icons/thrash.svg" /></button>
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
  background-color: #E8E8E8;
  border-radius: 1em;
}

.block {
  width: 20%;
  overflow: hidden;
  text-align: center;
  gap: 1em;
}

input,
select {
  width: 90%;
  overflow: hidden;
  text-align: center;
  background-color: var(--base-bg);
  border: none;
  border-radius: 1em;
  box-shadow: none;
}

img {
  width: 25px;
  height: 100%;
}

button {
  width: 40px;
  height: 40px;
  background-color: var(--earthy-green);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit {
  background-color: var(--green);
  border-color: var(--green);
}

.trash {
  background-color: var(--red);
}

.cancel {
  background-color: var(--grey);
}

.vl {
  border-left: 1px solid white;
  height: 100%;
}
</style>
