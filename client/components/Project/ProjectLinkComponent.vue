<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { computed, ref } from "vue";

const props = defineProps(["links", "id"]);

const guideLinks = computed(() => props.links.filter((link: string) => link.startsWith('https://craft-folio.vercel.app/')));
const otherLinks = computed(() => props.links.filter((link: string) => !link.startsWith('https://craft-folio.vercel.app/'))); 

const newLink = ref("");
const emit = defineEmits(["refreshProject"]);

const addLink = async () => {
  try {
    await fetchy(`/api/projects/${props.id}/link`, "POST", {
      body: { link: newLink.value },
    });
  } catch (_) {
    return;
  }

  newLink.value = "";
  emit("refreshProject");
  console.log(newLink.value);
};
</script>

<template>
  <div class="container">
    <div class="links" v-if="props.links.length !== 0">
      <h2>Guide Links</h2>
      <a class="link" v-for="(link, index) in guideLinks" :key="index" :href="link">- {{ link }}</a>

      <h2>Other Links</h2>
      <a class="link" v-for="(link, index) in otherLinks" :key="index" :href="link">- {{ link }}</a>
    </div>
    <p class="placeholder" v-else>Add some links...</p>
    <form @submit.prevent="addLink()">
      <!-- <label for="link">Add a new link:</label> -->
      <input type="url" id="link" v-model="newLink" required />
      <button type="submit">+</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 65vh;
  /* margin: 0 0 0 1em; */
  background-color: var(--base-bg);
  border-radius: 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

a,
p,
form {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}

form {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
  gap: 0.5em;
}

form {
  background-color: var(--grey);
  width: 70%;
  border-radius: 2em;
  margin: 0 0 1em 0;
}

input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}

button {
  border-radius: 2em;
  border-color: var(--dark-blue);
  background-color: var(--dark-blue);
  color: var(--light-blue);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

.link {
  padding: 0;
}

h2 {
  color: var(--dark-blue);
}
</style>
