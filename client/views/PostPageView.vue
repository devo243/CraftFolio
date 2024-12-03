<script setup lang="ts">
import PostInterfaceComponent from "@/components/Post/PostInterfaceComponent.vue";

const props = defineProps(["id"]);

</script>

<template>
  <div>
    <PostInterfaceComponent :id="id" />
  </div>
</template>

<style scoped></style>
