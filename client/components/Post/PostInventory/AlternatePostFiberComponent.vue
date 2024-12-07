<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";

const props = defineProps(["fiber", "id","post_author"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshFibers"]);

const fiber = ref(props.fiber);
const editing = ref(false);

watchEffect(() => {
  fiber.value = props.fiber;
});

const deleteFiber = async () => {
  try {
    await fetchy(`/api/posts/${props.id}/fibers/${props.fiber._id}`, "DELETE");
  } catch (_) {
    console.log(_);
    return;
  }
  emit("refreshFibers");
};

const editFiber = async () => {
  try {
    await fetchy(`/api/posts/${props.id}/fibers/${props.fiber._id}`, "PATCH", {
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
        <span v-if="!editing">{{ fiber.type }}</span>
        <input v-else type="text" id="type" v-model="fiber.type" :placeholder="fiber.type" />
      </div>
      <div class="block">
        <span v-if="!editing">{{ fiber.remainingYardage }} yd</span>
        <input v-else type="number" step="any" id="yardage" v-model="fiber.remainingYardage" :placeholder="fiber.remainingYardage" />
      </div>
    </div>
    <div v-if="props.post_author === currentUsername" class="editing-buttons">
      <button v-if="!editing" v-on:click="toggleEditing"><img src="@/assets/icons/pencil.svg" /></button>
      <button v-else v-on:click="toggleEditing" class="edit"><img src="@/assets/icons/check.svg" /></button>
      <button v-if="editing" v-on:click="cancel" class="cancel"><img src="@/assets/icons/cancel.svg" /></button>
      <button v-on:click="deleteFiber" class="trash"><img src="@/assets/icons/thrash.svg" /></button>
    </div>
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
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5em;

}

.block {
  display: flex;
  align-items: center;
  width: 20%;
  overflow: hidden;
  justify-content: center;
  height: 40px;
  padding: 0px 10px 0px 10px;
  box-shadow: 0px 4px 0px rgba(181, 181, 181, 0.6);  
  background-color: var(--grey);
  border-radius: 1em;
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

.editing-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}
</style>
