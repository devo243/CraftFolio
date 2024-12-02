<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

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
  currentNotes.value = props.notes;
  editing.value = true;
};
</script>

<template>
  <div class="container">
    <p v-if="!editing">{{ props.notes }}</p>
    <textarea v-else class="notes" v-model="currentNotes" placeholder="Write some notes..."></textarea>
    <button v-if="editing" class="save" @click="editNotes">Save</button>
    <button v-else class="edit" @click="toggleEdit">Edit</button>
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
  background-color: var(--base-bg);
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
  margin: 1em;
  width: 97%;
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

button {
  width: 4em;
  margin: 1em;
  padding: 0.5em 0 0.5em 0;
  font-size: 1.5em;
  border-radius: 1em;
  color: white;
  border: none;
}
.edit {
  background-color: var(--dark-blue);
}

.save {
  background-color: var(--red);
}
</style>
