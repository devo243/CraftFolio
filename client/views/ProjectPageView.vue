<script setup lang="ts">
import ProjectInterfaceComponent from "@/components/Project/ProjectInterfaceComponent.vue";

const props = defineProps(["id"]);
</script>

<template>
  <div>
    <ProjectInterfaceComponent :id="props.id" />
  </div>
</template>

<style scoped></style>
