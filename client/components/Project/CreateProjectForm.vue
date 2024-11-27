<script setup lang="ts">
import { ref } from "vue";

const title = ref("");
const status = ref("");

const createProject = async () => {
  return;
};
</script>

<template>
  <form @submit.prevent="createProject()">
    <div class="field">
      <div class="text">
        <label for="content">Title</label>
        <input id="content" v-model="title" placeholder="Type Title" required />
      </div>
      <div class="text">
        <label for="content">Status</label>
        <input id="content" v-model="status" placeholder="Type Status" required />
      </div>
    </div>
    <div class="buttons">
      <button type="button" class="button-error btn-small pure-button">Cancel</button>
      <button type="submit" class="pure-button-primary pure-button">Create</button>
    </div>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 40em;
  max-width: 60em;
  margin: 5em auto;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background-color: var(--base-bg);
  border-radius: 1em;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2em;
}

label {
  font-size: 1.5em;
}
</style>
