<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import EditingProjectComponent from "./EditingProjectComponent.vue";
import ProjectComponent from "./ProjectComponent.vue";

const projects = ref(ref<Array<Record<string, string>>>([]));
const router = useRouter();

const editing = ref(false);
const editingProject = ref("");

const createProject = async () => {
  await router.push("/create/project");
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

const openProject = async (id: string) => {
  await router.push(`/projects/${id}`);
};

const deleteProject = async (id: string) => {
  try {
    await fetchy(`/api/projects/${id}`, "DELETE");
  } catch {
    return;
  }
  getProjects();
};

const editProject = async (title: string, status: string, project_id: string) => {
  try {
    await fetchy(`/api/projects/${project_id}`, "PATCH", {body : {
      title, status
    }});
  } catch {
    return;
  }
  getProjects();
}

const toggleEditing = async (title: string, status: string, project_id: string) => {
  if (!editing.value) {
    editing.value = true;
    editingProject.value = project_id;
  } else {
    await editProject(title, status, editingProject.value);
    editing.value = false;
    if (project_id === editingProject.value) {
      editingProject.value = "";
    } else {
      editingProject.value = project_id;
    }
    
  }
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
        <ProjectComponent :project="project" @click="openProject(project._id)" class="project" v-if="project._id!==editingProject"/>
        <EditingProjectComponent :project="project" class="project" v-else @refresh-project="toggleEditing"/>
        <button v-if="project._id!==editingProject" v-on:click="toggleEditing('', '', project._id)" class="edit edit-button"><img src="@/assets/icons/pencil.svg" /></button>
        <button v-on:click="deleteProject(project._id)" class="trash edit-button"><img src="@/assets/icons/thrash.svg" /></button>
      </article>
    </section>
    <p v-else>No Projects</p>
  </div>
  <section class="create">
    <button v-on:click="createProject" class="pure-button custom-button">Create Project</button>
  </section>
  <!-- <div>{{ currentProject }}</div> -->
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
  border-radius: 1em;
}

h1 {
  color: var(--earthy-green);
}


img {
  width: 36px;
  height: 100%;
}

.edit-button {
  height: 100%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.trash {
  background-color: var(--red);
}

article {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

.project{
  flex: 1;
}

.custom-button {
  box-shadow: 0px 4px 0px lightgrey;  
  margin: 1em 0 5% 0;
}

.edit {
  background-color: var(--earthy-green);
  border-color: var(--earthy-green);
}
</style>
