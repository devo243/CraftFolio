<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["images"]);
const currentPage = ref("");

// const emit = defineEmits(["goBackToList"]);
</script>

<template>
  <div class="container">
    <div v-if="props.images.length !== 0">
      <img v-for="(image, index) in props.images" :key="index" v-bind:src="image" />
    </div>
    <p>Add some images...</p>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 60vh;
  /* margin: 0 0 0 1em; */
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

p {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}

img {
  width: 200px;
  height: auto;
}
</style>
