<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps(["project"]);
const { currentUsername } = storeToRefs(useUserStore());
const statusColor = computed(() => {
  if (props.project.status === "Complete"){
    return "var(--green)";
  } else if (props.project.status === "In Progress") {
    return "var(--yellow)";
  } else if (props.project.status === "Abandoned") {
    return ("var(--red)");
  } else {
    return "#bbb";
  }
});
</script>

<template>
  <div class="project">
    <div class="header">
      <p class="title">{{ props.project.title }}</p>
      <p class="date" :style="{ color: 'grey'}">{{ formatDate(props.project.dateUpdated) }}</p>
    </div>
    <div class="status">
      <span class="dot" :style="{ backgroundColor: statusColor}"></span>
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
  color: var(--dark-green);
}

.project {
  display: flex;
  flex-direction: column;
  background-color: var(--base-bg);
  padding: 0.5em 1em 0.5em 1em;
  border-radius: 1em;
  cursor: pointer;
  box-shadow: 0px 4px 0px lightgrey;  
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
  /* background-color: statusColor; */
  border-radius: 50%;
  display: inline-block;
}

.title {
  font-size: 1.5em;
  font-weight: bold;
}

p {
  margin: 0.5em 0;
}
</style>
