<script setup lang="ts">
import CommentComponent from "@/components/CommentOnPost/CommentComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import CreateCommentForm from "./CreateCommentForm.vue";
import EditCommentForm from "./EditCommentForm.vue";

const props = defineProps(["post"]);

const loaded = ref(false);
let comments = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let pid = props.post._id;

async function getComments() {
  //let query: Record<string, string> = { pid };
  let commentResults;
  try {
    commentResults = await fetchy(`/api/posts/${pid}/comments`, "GET");
  } catch (_) {
    return;
  }
  comments.value = commentResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getComments();
  loaded.value = true;
});
</script>

<template>
  <section class="comments" v-if="loaded && comments.length !== 0">
    <article v-for="comment in comments" :key="comment._id">
      <CommentComponent v-if="editing !== comment._id" :post="post" :comment="comment" @refreshComments="getComments" @editComment="updateEditing" />
      <EditCommentForm v-else :post="post" :comment="comment" @refreshComments="getComments" @editComment="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No comments found</p>
  <p v-else>Loading...</p>
  <CreateCommentForm :post="props.post" @refresh-comments="getComments"></CreateCommentForm>
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
  align-self: flex-start;
  width:95%;
}

article {
  background-color: rgb(146, 146, 146);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
</style>