<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import PostInventoryComponent from "./PostInventory/PostInventoryComponent.vue";
import PostMarkdownComponent from "./PostMarkdownComponent.vue";
import PostTipsComponent from "./PostTipsComponent.vue";

const props = defineProps(["id"]);

let post = ref<Record<string, string>>();

const loaded = ref(false);

const currentPage = ref("");
const router = useRouter();

const goBack = async () => {
  await router.back();
};
const getPost = async () => {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET");
  } catch (_) {
    return;
  }

  for (const p of postResults) {
    if (p._id === props.id) {
      post.value = p;
      return;
    }
  }
  post.value = postResults;
};

onBeforeMount(async () => {
  await getPost();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded && post!==undefined">
    <section class="header">
      <img class="back" src="@/assets/icons/back-arrow.svg" @click="goBack" />
      <h1 class="title">{{ post.title }}</h1>
    </section>
    <PostTipsComponent :post="post" @refresh-post="getPost"/>
    <section>
      <PostMarkdownComponent :content="post.content" :post="post" @refresh-post="getPost"/>
    </section>
    <!-- <section> -->
      <PostInventoryComponent :fibers="post.fibers" :post_id="post._id" :author="post.author" @refresh-post="getPost"/>
    <!-- </section> -->
  </div>

</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

section {
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  padding-top: 1em;
}
form {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

input {
  appearance: none;
}

input:checked + .nav {
  background-color: rgb(160, 160, 160);
}

.nav {
  font-size: 1.5em;
  background-color: var(--base-bg);
  padding: 0.25em 1.5em 0.25em 1.5em;
  border-radius: 2em;
}

.back {
  width: 2em;
  /* margin: 0em 0em 0em 1em; */
}

.inv {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  padding-top: 1em;
}

h1 {
  margin: 0px;
  color: var(--earthy-green);
}
</style>
