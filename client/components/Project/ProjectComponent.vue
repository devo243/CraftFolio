<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["project"]);
const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <div class="project">
    <div class="header">
      <p class="title">{{ props.project.title }}</p>
      <p class="date">{{ props.project.dateUpdated }}</p>
    </div>
    <div class="status">
      <span class="dot"></span>
      <p class="status-text">Status: {{ props.project.status }}</p>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 2em;
}

.project {
  display: flex;
  flex-direction: column;
  background-color: var(--base-bg);
  padding: 0.5em 1em 0.5em 1em;
  border-radius: 1.5em;
}

.status {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5em;
}

.dot {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}

.title {
  font-size: 1.75em;
  font-weight: bold;
}
</style>
