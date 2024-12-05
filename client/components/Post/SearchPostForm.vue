<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPostsByAuthor"]);
</script>

<template>
    <form @submit.prevent="emit('getPostsByAuthor', author)">
      <!-- <label for="link">Add a new link:</label> -->
      <input id="author" v-model="author" placeholder="Search by Author" required />
      <button class="submit" type="submit">Search</button>
    </form>
</template>

<style scoped>
form {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}

form {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
  gap: 0.5em;
  width: 70%;
}

input {
  width: 100%;
  border-radius: 0.5em;
  /* padding-left: 0.5em; */
  padding: 0.3em 0.3em 0.3em 0.5em;
  border-color: var(--dark-green);
  font-size: 0.8em;
}

.submit {
  border-radius: 2em;
  border-color: black;
  background-color: var(--dark-green);
  color: #fcf2cf;
  font-size: 0.8em;
}
</style>
