<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["notes", "id"]);
const currentNotes = ref("");
const editing = ref(false);

const emit = defineEmits(["refreshProject"]);

const editNotes = async () => {
  try {
    await fetchy(`/api/projects/${props.id}/notes`, "PATCH", {
      body: { id: props.id, notes: currentNotes.value },
    });
  } catch (_) {
    console.log(_);
    return;
  }

  editing.value = false;
  emit("refreshProject");
};

const toggleEdit = () => {
  editing.value = true;
};

onBeforeMount(() => {
  currentNotes.value = props.notes;
  console.log(currentNotes.value);
});
</script>

<template>
  <div class="container">
    <p v-if="!editing">{{ props.notes }}</p>
    <textarea v-else class="notes" v-model="currentNotes" placeholder="Write some notes..."></textarea>
    <button v-if="editing" class="save" @click="editNotes">Save</button>
    <button v-else class="save" @click="toggleEdit">Edit</button>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  /* margin: 0 0 0 1em; */
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
}

p {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}
.buttons {
  display: flex;
  flex-direction: row;
}

.notes {
  resize: none;
  margin: 1.5em;
  width: 95%;
  height: 55vh;
  background-color: rgb(226, 226, 226);
  border: none;
  font-size: 1.5em;
  padding: 0;
}

.notes:focus {
  outline: none;
  /* background-color: aqua; */
}

.save {
  width: 4em;
  margin: 1em;
  font-size: 1.5em;
}
</style>
