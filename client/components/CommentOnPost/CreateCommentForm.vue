<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const props = defineProps(["post"]);

enum CommentType {
  Question,    // 0
  Tip,  // 1
  Comment    // 2
}
const type = ref(CommentType.Comment);
const emit = defineEmits(["refreshComments"]);

const createComment = async (content: string) => {
  console.log("type: ", type.value)
  try {
    await fetchy(`/api/posts/${props.post._id}/comments`, "POST", {
      body: { content, options: {type: type.value} },
    });
  } catch (_) {
    return;
  }
  emit("refreshComments");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createComment(content)">
    <h3 for="content">Leave a Comment!</h3>
    <div class="container">
      <textarea id="content" v-model="content" placeholder="Comment Contents" required> </textarea>
      <div class="buttons">
        <button type="submit" class="pure-button-primary pure-button" @click="type = CommentType.Question">Ask <img src="@/assets/icons/light-question-mark.svg" /></button>
        <button type="submit" class="pure-button-primary pure-button" @click="type = CommentType.Tip">Give Tip <img src="@/assets/icons/bulb.svg"/></button>
        <button type="submit" class="pure-button-primary pure-button" @click="type = CommentType.Comment">Comment</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
form {
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 65%;
  margin: 0 auto;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  /* height: 100%; */
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  flex: 1;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}

.buttons  {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>