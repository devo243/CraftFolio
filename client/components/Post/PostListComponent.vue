<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import SearchPostForm from "./SearchPostForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const router = useRouter();
let posts = ref<Array<Record<string, string>>>([]);
let searchAuthor = ref("");
const props = defineProps(["username"]);

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

onBeforeMount(async () => {
  if (props.username) {
    await getPosts(props.username);
  } else {
    await getPosts();
  }
  loaded.value = true;
});

const createPost = async () => {
  await router.push("/create/post");
};

const openPost = async (id: string) => {
  await router.push(`/posts/${id}`);
};
</script>

<template>
  <div class="page">
    <div class="row">
      <SearchPostForm v-if="props.username!==currentUsername" @getPostsByAuthor="getPosts" />
    </div>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent :post="post" @click="openPost(post._id)" @refreshPosts="getPosts" :inHome="props.username===currentUsername" />
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </div>
  <section class="create" v-if="isLoggedIn && props.username===currentUsername">
      <button v-on:click="createPost">Write a Guide</button>
  </section>
</template>

<style scoped>

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 90em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 21.5%;
  height: fit-content;
}

.posts {
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1em;
  gap: 4em;
  row-gap: 2em;
}

.row {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 60em;
}

.create {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.page {
  height: 80vh;
}

button {
  width: fit-content;
  height: fit-content;
  font-size: 1.5em;
  padding: 0.5em;
  /* border: none; */
  border-radius: 2em;
}
</style>
