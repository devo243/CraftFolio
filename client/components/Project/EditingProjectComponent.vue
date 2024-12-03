<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const props = defineProps(["project"]);
const emit = defineEmits(["refreshProject"]);
const project = ref(props.project);
const { currentUsername } = storeToRefs(useUserStore());
const statusColor = computed(() => {
  if (project.value.status === "Complete"){
    return "var(--green)";
  } else if (project.value.status === "In Progress") {
    return "var(--yellow)";
  } else if (project.value.status === "Abandoned") {
    return ("var(--red)");
  } else {
    return "#bbb";
  }
});

const saveProject = () => {
  emit("refreshProject", project.value.title, project.value.status, project.value._id);
}
</script>

<template>
  <div class="container">
    <div class="project">

      <div class="header">
        <input class="title" type="text" id="title" v-model="project.title" :placeholder="project.title" />
        <p class="date" :style="{ color: 'grey'}">{{ formatDate(project.dateUpdated) }}</p>
      </div>
      <div class="status">
        <span class="dot" :style="{ backgroundColor: statusColor}"></span>
        <select v-model="project.status" required class="status">
            <option>To Do</option>
            <option>In Progress</option>
            <option>Complete</option>
            <option>Abandoned</option>
        </select>
      </div>
    </div>
    <button v-on:click="saveProject" class="edit"><img src="@/assets/icons/check.svg" /></button>
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
  flex: 1;
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

.container {
  display: flex;
  flex-direction: row;
}

.edit {
  background-color: var(--earthy-green);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
