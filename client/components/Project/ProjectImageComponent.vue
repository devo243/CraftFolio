<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["images", "id"]);

const imageLink = ref("");
const emit = defineEmits(["refreshProject"]);

const addImage = async () => {
  try {
    await fetchy(`/api/projects/${props.id}/image`, "POST", {
      body: { image: imageLink.value },
    });
  } catch (_) {
    return;
  }

  imageLink.value = "";
  emit("refreshProject");
  console.log(imageLink.value);
};
</script>

<template>
  <div class="container">
    <div class="images" v-if="props.images.length !== 0">
      <img v-for="(image, index) in props.images" :key="index" :src="image" />
    </div>
    <p class="placeholder" v-else>Add some images...</p>
    <form @submit.prevent="addImage()">
      <!-- <label for="link">Add a new link:</label> -->
      <input id="link" v-model="imageLink" required />
      <button type="submit">+</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 65vh;
  /* margin: 0 0 0 1em; */
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

p,
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
}

form {
  background-color: rgb(177, 175, 175);
  width: 70%;
  border-radius: 2em;
  margin: 0 0 1em 0;
}

input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}

button {
  border-radius: 1em;
}

.images {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
  padding: 1em;
  max-height: 70%;
  overflow-y: hidden;
}

img {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
}
</style>
