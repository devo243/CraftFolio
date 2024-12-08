<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { marked } from "marked";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const props = defineProps(["post", "content"]);
const currentContent = ref("");
const editing = ref(false);

const { currentUsername } = storeToRefs(useUserStore());

const emit = defineEmits(["refreshPost"]);
const renderedContent = computed(() => marked(props.content || ""));

const editMD = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/`, "PATCH", {
      body: { id: props.post._id, title: props.post.title, content: currentContent.value },
    });
  } catch (_) {
    console.log(_);
    return;
  }

  editing.value = false;
  emit("refreshPost");
};

const toggleEdit = () => {
  currentContent.value = props.content;
  editing.value = true;
};

const cancelEdit = () => {
  editing.value = false;
  currentContent.value = "";
};
</script>

<template>
  <div class="container">
    <!-- <p v-if="!editing">{{ props.content }}</p> -->
    <div v-if="!editing" v-html="renderedContent" class="markdown-render"></div>
    <textarea v-else class="markdown" v-model="currentContent" placeholder="Write a markdown..."></textarea>
    <div v-if="currentUsername === props.post.author">
      <button v-if="editing" class="cancel" @click="cancelEdit">Cancel</button>
      <button v-if="editing" class="save" @click="editMD">Save</button>
      <button v-else class="edit" @click="toggleEdit">Edit</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  /* height: 35vh; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  /* margin: 0 0 0 1em; */
  background-color: var(--base-bg);
  border-radius: 1em;
}

.markdown-render {
  padding: 1em;
  font-size: 1.5em;
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.3;
}

.buttons {
  display: flex;
  flex-direction: row;
}

.markdown {
  resize: none;
  margin: 1em;
  width: 97%;
  height: 55vh;
  background-color: var(--grey);
  border: none;
  font-size: 1.5em;
  padding: 0;
}

.markdown:focus {
  outline: none;
  /* background-color: aqua; */
}

button {
  width: 4em;
  margin: 1em;
  padding: 0.5em 0 0.5em 0;
  font-size: 1.5em;
  border-radius: 1em;
  color: white;
  border: none;
}
.edit {
  background-color: #0078e7;
}

.save {
  background-color: var(--earthy-green);
}

.cancel {
  background-color: var(--red);
}
</style>
