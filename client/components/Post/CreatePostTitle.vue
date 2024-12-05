<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";

const props = defineProps(["title","content","links"]);
const title = ref(props.title);
const content = ref(props.content);
const links = ref(props.links);
const currentLink = ref("");
const emit = defineEmits(["createTitleMD"]);

const updateTitleMD = async (title:string, content: string, links: string[]) => {
    emit("createTitleMD",title,content,links);
};

const addLink = () => {
  if (!URL.canParse(currentLink.value)) {
    useToastStore().showToast({ message: `${currentLink.value} is not a valid link`, style: "error" });
  } else {
    if (links.value.includes(currentLink.value)) {
      useToastStore().showToast({ message: `${currentLink.value} is already added`, style: "error" });
      currentLink.value = "";
      return;
    }
    links.value = links.value.concat([currentLink.value]);
    currentLink.value = "";
  }
}

</script>

<template>
  <form @submit.prevent="updateTitleMD(title, content, links)">
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
      <div class="text">
        <label for="content">Add Resources:</label>
        <a v-for="(link, index) of links" :key="index">{{link}}</a>
        <div>
          <input id="content" type="url" v-model="currentLink" placeholder="Add a link..."> </input>
          <button v-on:click="addLink" type="button">+</button>
        </div>
        
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
