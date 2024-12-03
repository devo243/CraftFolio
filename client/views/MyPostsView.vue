<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <div v-if="isLoggedIn">
    <PostListComponent :username="currentUsername" />
  </div>
  <div v-else>
    <h1>Please Log in!</h1>
  </div>
</template>

<style scoped></style>
