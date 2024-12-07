<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post", "comment"]);
const content = ref(props.comment.content);
const emit = defineEmits(["editComment", "refreshComments"]);

const editComment = async (content: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}/comments/${props.comment._id}`, "PATCH", { body: { content: content } });
  } catch (e) {
    console.log(e);
    console.log("broken");
    return;
  }
  emit("editComment");
  emit("refreshComments");
};
</script>

<template>
  <form @submit.prevent="editComment(content)">
    <p class="author">{{ props.comment.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a comment!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit" style="background-color: var(--dark-blue)">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editComment')" style="background-color: #bbb">Cancel</button></li>
      </menu>
      <p v-if="props.comment.dateCreated !== props.comment.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.comment.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.comment.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  /* background-color: var(--dark-blue);
  color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  /* padding: 1em; */
}

textarea {
  /* background-color: rgb(234, 245, 248); */
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>