<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { content: content } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(content)">
    <p class="author">{{ props.post.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
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
