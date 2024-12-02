<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const title = ref("");
const content = ref("");
const fibers = ref(undefined);
const tips = ref(undefined);
const mistakes = ref(undefined);
const emit = defineEmits(["refreshPosts"]);

const createPost = async (title:string, content: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { title, content },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <div>
    <CreatePostForm />
  </div>
</template>

<style scoped></style>
