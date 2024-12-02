<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useRouter } from "vue-router";

const title = ref("");
const status = ref("");
const router = useRouter();

const createProject = async () => {
  try {
    await fetchy("/api/projects", "POST", {
      body: { title: title.value, status: status.value },
    });
  } catch (_) {
    return;
  }

  await router.push("/projects");
};

const cancelProject = async () => {
  await router.push("/projects");
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
        <select v-model="status" required class="status">
          <option disabled value="">Please select one</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Complete</option>
          <option>Abandoned</option>
        </select>
      </div>
    </div>
    <div class="buttons">
      <button type="button" class="button-error btn-small pure-button" v-on:click="cancelProject">Cancel</button>
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

.status {
  width: fit-content;
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
