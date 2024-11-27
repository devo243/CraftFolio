<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["notes"]);
const currentPage = ref("");

// const emit = defineEmits(["goBackToList"]);
</script>

<template>
  <div class="container">
    <p v-if="props.notes !== ''">{{ props.notes }}</p>
    <p>Write some notes...</p>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 60vh;
  /* margin: 0 0 0 1em; */
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
}

p {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}
</style>
