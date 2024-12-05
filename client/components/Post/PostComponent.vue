<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post", "inHome"]);
const emit = defineEmits(["refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const router = useRouter();

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
  router.push("/myposts");
};
</script>

<template>
  <div class="container">
    <img src="/client/assets/images/default_guide_thumbnail.jpg">
    <p class="title">{{ props.post.title }}</p>
    <p>by {{ props.post.author }}</p>
    <div class="base">
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
    <menu v-if="props.post.author == currentUsername && props.inHome">
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
  </div>
</template>

<style scoped>
p {
  margin: 0 0 0 1em;
}

.title {
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 0.8em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  /* justify-content: flex-start; */
  font-size: 0.8em;
  font-style: italic;
  /* margin: 0; */
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 100%;
  height: auto;
  border-radius: 1em 1em 0 0;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  padding-bottom: 1em;
}
</style>
