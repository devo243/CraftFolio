<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["post", "content"]);
const currentContent = ref("");
const editing = ref(false);

const { currentUsername } = storeToRefs(useUserStore());

const emit = defineEmits(["refreshPost"]);

const editMD = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/`, "PATCH", {
      body: { id: props.post._id, title:props.post.title, content: currentContent.value },
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
</script>

<template>
  <div class="container">
    <p v-if="!editing">{{ props.content }}</p>
    <textarea v-else class="markdown" v-model="currentContent" placeholder="Write a markdown..."></textarea>
    <div v-if="currentUsername===props.post.author">
        <button v-if="editing" class="save" @click="editMD">Save</button>
        <button v-else class="edit" @click="toggleEdit">Edit</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 35vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  /* margin: 0 0 0 1em; */
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
}
p {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
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
  background-color: rgb(226, 226, 226);
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
  background-color: var(--red);
}
</style>
