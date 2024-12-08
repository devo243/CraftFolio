<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import LinkComponent from "./LinkComponent.vue";
import LinkEditComponent from "./LinkEditComponent.vue";

const props = defineProps(["post"]);
const { currentUsername } = storeToRefs(useUserStore());

const newLink = ref("");
const links = ref(Array<string>);
const editinglink = ref(-1);

const emit = defineEmits(["refreshPost"]);

const addLink = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/links/`, "POST", {
      body: { newLink: newLink.value },
    });
    newLink.value = "";
  } catch (_) {
    console.log(_);
    return;
  }
  await getLinks();
  emit("refreshPost");
};

const getLinks = async () => {
  let linkResults = Array<string>;
  try {
    linkResults = await fetchy(`/api/posts/${props.post._id}/links/`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }
  links.value = linkResults;
};

const toggleEditing = async (index: number) => {
  if (editinglink.value === -1) {
    editinglink.value = index;
  } else {
    editinglink.value = -1;
  }
};

onBeforeMount(async () => {
  await getLinks();
});
</script>

<template>
  <section class="header" v-if="links.length !== 0 || currentUsername === props.post.author">
    <h2 class="title">Links</h2>
  </section>
  <section>
    <div class="hints" v-if="links.length !== 0">
      <div v-for="(link, index) in links" :key="index" class="hint">
        <LinkComponent
          v-if="editinglink != Number.parseInt(index.toString())"
          :post="props.post"
          :content="link"
          @refresh-links="getLinks"
          @edit-link="toggleEditing(Number.parseInt(index.toString()))"
        />
        <LinkEditComponent v-else :post="props.post" :content="link" @refresh-links="getLinks" @edit-link="toggleEditing(Number.parseInt(index.toString()))" />
      </div>
    </div>

    <form @submit.prevent="addLink()" v-if="currentUsername === props.post.author">
      <!-- <label for="link">Add a new link:</label> -->
      <p class="placeholder" v-if="links.length === 0">Add some links...</p>
      <input id="link" v-model="newLink" required />
      <button type="submit">+</button>
    </form>
  </section>
</template>

<style scoped>
.hint {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: small;
}

.title {
  color: var(--dark-blue);
}

.hint a {
  padding: 0.5em;
  box-shadow: 0px 4px 0px rgba(181, 181, 181, 0.3);
}

a,
p,
form {
  margin-left: 1em;
  font-size: 1.5em;
  /* margin: 0; */
  background-color: var(--grey);
  border-radius: 0.5em;
}

p {
  font-size: small;
}

form {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  gap: 0.5em;
}

form {
  background-color: rgb(177, 175, 175);
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
  border-radius: 1em;
}

.hints {
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 0em 1em 1em;
}

.link {
  background-color: var(--green);
}

.mistake {
  background-color: var(--red);
}

img {
  width: 32px;
  height: 100%;
  border-radius: 1em;
  padding: 0.5em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: left;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  /* padding-top: 1em; */
}
</style>
