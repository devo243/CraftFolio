<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
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
let editing = ref("");
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

function updateEditing(id: string) {
  editing.value = id;
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
</script>

<template>
  <div class="page">
    <div class="row" v-if="props.username!==currentUsername">
      <h2 v-if="!searchAuthor">Posts:</h2>
      <h2 v-else>Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm @getPostsByAuthor="getPosts" />
    </div>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
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
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
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
