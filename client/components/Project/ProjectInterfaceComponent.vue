<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import ProjectImageComponent from "./ProjectImageComponent.vue";
import ProjectLinkComponent from "./ProjectLinkComponent.vue";
import ProjectNoteComponent from "./ProjectNoteComponent.vue";

const props = defineProps(["id"]);
const currentPage = ref("");
const router = useRouter();
const project = ref(ref<Record<string, string>>({}));

const goToList = async () => {
  await router.push("/projects");
};

const getProject = async () => {
  let projectResults;
  try {
    projectResults = await fetchy("/api/projects", "GET");
  } catch (_) {
    return;
  }

  for (const p of projectResults) {
    if (p._id === props.id) {
      project.value = p;
      return;
    }
  }

  await goToList();
};

onBeforeMount(async () => {
  currentPage.value = "note";
  await getProject();
  console.log(project.value);
});
</script>

<template>
  <section class="header">
    <img class="back" src="@/assets/icons/back-arrow.svg" @click="goToList" />
    <h1 class="title">{{ project.title }}</h1>
  </section>
  <section>
    <form>
      <input type="radio" id="c1" name="Notes" value="note" v-model="currentPage" checked />
      <label class="nav" for="c1">Notes</label>
      <input type="radio" id="c2" name="Links" value="link" v-model="currentPage" />
      <label class="nav" for="c2">Links</label>
      <input type="radio" id="c3" name="Images" value="image" v-model="currentPage" />
      <label class="nav" for="c3">Images</label>
      <input type="radio" id="c4" name="Materials" value="material" v-model="currentPage" />
      <label class="nav" for="c4">Materials</label>
    </form>
  </section>
  <section>
    <ProjectNoteComponent v-if="currentPage == 'note'" :notes="project.notes" :id="props.id" @refreshProject="getProject" />
    <ProjectLinkComponent v-else-if="currentPage == 'link'" :links="project.links" />
    <ProjectImageComponent v-else-if="currentPage == 'image'" :images="project.images" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  padding-top: 1em;
}
form {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

input {
  appearance: none;
}

input:checked + .nav {
  background-color: rgb(160, 160, 160);
}

.nav {
  font-size: 1.5em;
  background-color: var(--base-bg);
  padding: 0.25em 1.5em 0.25em 1.5em;
  border-radius: 2em;
}

.back {
  width: 2em;
  /* margin: 0em 0em 0em 1em; */
}
</style>
