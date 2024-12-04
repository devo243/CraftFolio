<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["title","content"]);
const title = ref(props.title);
const content = ref(props.content);
const emit = defineEmits(["createTitleMD"]);

const updateTitleMD = async (title:string, content: string) => {
    emit("createTitleMD",title,content);
};

</script>

<template>
  <form @submit.prevent="updateTitleMD(title, content)">
    <div class="field">
      <label>Write Your Guide</label>
      <div class="text">
        <label for="content">Title</label>
        <input id="content" v-model="title" placeholder="Type Title" required />
      </div>
      <div class="text">
        <label for="content">Post Contents:</label>
        <textarea id="content" v-model="content" placeholder="Write a markdown..." required> </textarea>
      </div>
    </div>
    <div class="buttons">
      <button type="submit" class="pure-button-primary pure-button">Next</button>
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

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
