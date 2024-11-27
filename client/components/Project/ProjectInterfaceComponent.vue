<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import ProjectLinkComponent from "./ProjectLinkComponent.vue";
import ProjectNoteComponent from "./ProjectNoteComponent.vue";

const props = defineProps(["project"]);
const currentPage = ref("");

const emit = defineEmits(["goBackToList"]);

onBeforeMount(() => {
  currentPage.value = "note";
});
</script>

<template>
  <section class="header">
    <img class="back" src="@/assets/icons/back-arrow.svg" @click="emit('goBackToList')" />
    <h1 class="title">{{ props.project.title }}</h1>
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
    <ProjectNoteComponent v-if="currentPage == 'note'" :notes="props.project.notes" />
    <ProjectLinkComponent v-else-if="currentPage == 'link'" :links="props.project.links" />
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
