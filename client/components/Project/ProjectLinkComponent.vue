<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { computed, ref } from "vue";

const props = defineProps(["links", "id"]);
const editing = ref(false);

const guideLinks = computed(() => props.links.filter((link: string) => link.startsWith("https://craft-folio.vercel.app/")));
const otherLinks = computed(() => props.links.filter((link: string) => !link.startsWith("https://craft-folio.vercel.app/")));

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

const deleteLink = async (link: string) => {
  try {
    await fetchy(`/api/projects/${props.id}/link`, "PATCH", {
      body: { link: link },
    });
  } catch (_) {
    console.log(_);
    return;
  }

  emit("refreshProject");
};

const toggleEditing = () => {
  editing.value = !editing.value;
};
</script>

<template>
  <div class="container">
    <div class="links" v-if="props.links.length !== 0">
      <div class="guideLinks" v-if="guideLinks.length !== 0">
        <h2>Guide Links</h2>
        <a class="link" v-for="(link, index) in guideLinks" :key="index" :href="link">- {{ link }}</a>
      </div>
      <h2>Other Links</h2>
      <div class="otherLinkContainer" v-for="(link, index) in otherLinks" :key="index">
        <a class="link" :href="link">- {{ link }}</a>
        <button v-if="editing" v-on:click="deleteLink(link)" class="trash"><img src="@/assets/icons/thrash.svg" /></button>
      </div>
    </div>
    <p class="placeholder" v-else></p>
    <div class="bar">
      <button v-if="editing" class="save" @click="toggleEditing">Save</button>
      <button v-else class="edit" @click="toggleEditing">Edit</button>
      <form @submit.prevent="addLink()">
        <!-- <label for="link">Add a new link:</label> -->
        <input type="url" id="link" placeholder="Add links to resources and more..." v-model="newLink" required />
        <button class="submit" type="submit">+</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 65vh;
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
}

input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}

.submit {
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

.trash {
  width: 40px;
  height: 40px;
  background-color: var(--red);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

img {
  width: 25px;
  height: 100%;
}

.otherLinkContainer {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

.guideLinks {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.edit {
  width: 4em;
  margin: 1em;
  padding: 0.5em 0 0.5em 0;
  font-size: 1.5em;
  border-radius: 1em;
  color: white;
  border: none;
  background-color: var(--dark-blue);
}

.save {
  width: 4em;
  margin: 1em;
  padding: 0.5em 0 0.5em 0;
  font-size: 1.5em;
  border-radius: 1em;
  color: white;
  border: none;
  background-color: var(--red);
}

.bar {
  display: flex;
  flex-direction: row;
  gap: 3em;
  align-items: center;
  margin: 0 0 1em 0;
}
</style>
