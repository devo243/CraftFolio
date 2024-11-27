<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import ProjectComponent from "./ProjectComponent.vue";

const projects = ref(ref<Array<Record<string, string>>>([]));
const router = useRouter();

const exampleProject = { title: "example", status: "who knows  ¯/_(ツ)_/¯", dateUpdated: "today" };
projects.value.push(exampleProject);

const createProject = async () => {
  await router.push("/projects/create");
};

const getProjects = async () => {
  let projectResults;

  try {
    projectResults = await fetchy("/api/projects", "GET");
  } catch (_) {
    return;
  }

  projects.value = projectResults;
};

onBeforeMount(async () => {
  await getProjects();
});
</script>

<template>
  <div class="page">
    <section>
      <h1>My Projects</h1>
    </section>
    <section class="projects" v-if="projects.length !== 0">
      <article v-for="project in projects" :key="project._id">
        <ProjectComponent :project="project" />
      </article>
    </section>
    <p v-else>No Projects</p>
  </div>
  <section class="create">
    <button v-on:click="createProject">Create Project</button>
  </section>
  <!-- <div>
    <FiberComponent :fiber="fiber" />
  </div> -->
</template>

<style scoped>
section {
  /* width: 80%; */
  max-width: 70em;
  max-height: 90%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p {
  margin: 0 auto;
  max-width: 70em;
}

.projects {
  padding: 1em;
}

.page {
  height: 80vh;
}

.create {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
