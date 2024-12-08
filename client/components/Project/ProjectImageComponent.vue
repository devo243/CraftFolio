<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["images", "id"]);
const editing = ref(false);

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

const deleteImage = async (image: string) => {
  try {
    await fetchy(`/api/projects/${props.id}/image`, "PATCH", {
      body: { image: image },
    });
  } catch (_) {
    return;
  }

  emit("refreshProject");
}

const toggleEditing = () => {
  editing.value = !editing.value;
}
</script>

<template>
  <div class="container">
    <div class="images" v-if="props.images.length !== 0">
      <div class="image" v-for="(image, index) in props.images" :key="index">
        <img :src="image" />
        <button v-if="editing" v-on:click="deleteImage(image)" class="trash"><img class="iconThrash" src="@/assets/icons/thrash.svg" /></button>
      </div>
    </div>
    <p class="placeholder" v-else>Add some images...</p>
    <div class="bar">
      <button v-if="editing" class="save" @click="toggleEditing">Save</button>
      <button v-else class="edit" @click="toggleEditing">Edit</button>
      <form @submit.prevent="addImage()">
        <!-- <label for="link">Add a new link:</label> -->
        <input type="url" id="link" v-model="imageLink" required />
        <button class="submit" type="submit">+</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 65vh;
  /* margin: 0 0 0 1em; */
  background-color: var(--base-bg);
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
  background-color: var(--grey);
  width: 70%;
  border-radius: 2em;
  /* margin: 0 0 1em 0; */
}

input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}

.submit {
  border-radius: 2em;
  border-color: var(--dark-blue);
  background-color: var(--dark-blue);
  color: var(--light-blue);
}

.trash {
  margin: 1em;
  width: 40px;
  height: 40px;
  background-color: var(--red);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.iconThrash {
  width: 25px;
  height: 100%;

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

.edit {
  width: 4em;
  margin: 1em;
  padding: 0.5em 0 0.5em 0;
  font-size: 1.5em;
  border-radius: 1em;
  color: white;
  border: none;
  background-color: var(--dark-blue);
}

.save {
  width: 4em;
  margin: 1em;
  padding: 0.5em 0 0.5em 0;
  font-size: 1.5em;
  border-radius: 1em;
  color: white;
  border: none;
  background-color: rgb(71, 249, 178);
}

.bar {
  display: flex;
  flex-direction: row;
  gap: 3em;
  align-items: center;
  margin: 0 0 1em 0;
}

.image {
  display: grid;
}

.image > * {
    grid-row: 1;
    grid-column: 1;
}
</style>
