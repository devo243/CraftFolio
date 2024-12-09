<script setup lang="ts">
import CommentComponent from "@/components/CommentOnPost/CommentComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import CreateCommentForm from "./CreateCommentForm.vue";
import EditCommentForm from "./EditCommentForm.vue";

const props = defineProps(["post"]);

const loaded = ref(false);
let comments = ref<Array<Record<string, any>>>([]);
let editing = ref("");
const commentIsVisible = ref(true);
let pid = props.post._id;

enum CommentType {
  Question,    // 0
  Tip,  // 1
  Comment    // 2
}

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

const toggleContent = () => {
  commentIsVisible.value = !commentIsVisible.value;
}

onBeforeMount(async () => {
  await getComments();
  loaded.value = true;
});
</script>

<template>
  <section class="header">
    <h2>Comments</h2>
    <button @click="toggleContent" class="toggle-button">
      <span>{{ commentIsVisible ? 'Hide' : 'Show' }}</span>
      <span :class="commentIsVisible ? 'arrow-up' : 'arrow-down'" v-if="commentIsVisible">▲</span>
      <span :class="commentIsVisible ? 'arrow-up' : 'arrow-down'" v-else>▼</span>
    </button>
  </section>
  <section class="comments" v-if="loaded && comments.length !== 0 && commentIsVisible">
    <div  v-for="(comment, index) of comments" :key="index" class="container">
      <img v-if="comment.options.type === CommentType.Tip" src="@/assets/icons/bulb.svg"/>
      <img v-else-if="comment.options.type === CommentType.Question" src="@/assets/icons/question-mark.svg" />
      <img v-else>
      <article>
        <CommentComponent v-if="editing !== comment._id" :post="post" :comment="comment" @refreshComments="getComments" @editComment="updateEditing" />
        <EditCommentForm v-else :post="post" :comment="comment" @refreshComments="getComments" @editComment="updateEditing" />
      </article>
    </div>
    
  </section>
  <p v-else-if="loaded && commentIsVisible">No comments found</p>
  <p v-else-if="commentIsVisible">Loading...</p>
  <CreateCommentForm :post="props.post" @refresh-comments="getComments"></CreateCommentForm>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.header {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

section,
p,
.row {
  margin: 0 auto;
  align-self: flex-start;
  width:70%;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
  padding: 1em;
  flex: 1;
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

.toggle-button{
  font-size:unset;
}

.arrow-up, .arrow-down{
  transition: transform 0.2s;
  padding-left: 0.5em;
}

.arrow-up {
  transform: rotate(180deg);
}

button {
  box-shadow: 0px 4px 0px var(--grey);  
  width: fit-content;
  height: fit-content;
  font-size: 1.5em;
  padding: 0.5em;
  border-radius: 1em;
  border: none;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  align-items: center;
}


img {
  width: 32px;
  height: 100%;
  border-radius: 1em;
  padding: 0.5em;
}
</style>