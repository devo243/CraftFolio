<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import CommentListComponent from "../CommentOnPost/CommentListComponent.vue";
import PostInventoryComponent from "./PostInventory/PostInventoryComponent.vue";
import PostLinksListComponent from "./PostLinksListComponent.vue";
import PostMarkdownComponent from "./PostMarkdownComponent.vue";
import PostTipsComponent from "./PostTipsListComponent.vue";

const props = defineProps(["id"]);

let post = ref<Record<string, string>>();

const loaded = ref(false);

const ecoRating = ref(0);
const beginnerRating = ref(0);

const fiberTypes = ref(new Array<string>);
const fiberYards = ref(new Array<number>);

const router = useRouter();

const goBack = async () => {
  await router.back();
};
const getPost = async () => {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET");
  } catch (_) {
    return;
  }

  for (const p of postResults) {
    if (p._id === props.id) {
      post.value = p;
      return;
    }
  }
  post.value = postResults;
};

const createProject = async() => {
  console.log("clicked");
  try {
    console.log(post.value, fiberTypes.value, fiberYards.value);
    if(post.value!==undefined && fiberTypes.value!==undefined && fiberYards.value!==undefined){

      await fetchy("/api/projects", "POST", {
        body: {title: post.value.title,
          status: "To Do",
          guideId: post.value._id ,
          guideLink: `https://craft-folio.vercel.app/posts/${post.value._id}`,
          fiber_types: fiberTypes.value,
          fiber_yardages: fiberYards.value
        }
      });
      router.push("/projects");
    }
  } catch (_) {
    return;
  }

}

const updateFibersSelected = async(types:string[], yards: number[]) =>{
  console.log("updated fibers");
  // console.log(types);
  // console.log(yards);
  fiberTypes.value = types;
  fiberYards.value = yards;
}

const getRatings = async()=>{
  try {
    const ratings = await fetchy(`/api/posts/${props.id}/ratings`, "GET");
    console.log(ratings);
    ecoRating.value = ratings.ecoRating;
    beginnerRating.value = ratings.beginnerRating;
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  await getPost();
  await getRatings();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded && post!==undefined">
    <section class="header">
      <img class="back" src="@/assets/icons/back-arrow.svg" @click="goBack" />
      <h1 class="title">{{ post.title }}</h1>
      <p>Eco rating: {{ ecoRating }}, Beginner Rating: {{ beginnerRating }}</p>
    </section>
    <PostTipsComponent :post="post" @refresh-post="getPost"/>
    <section>
      <PostMarkdownComponent :content="post.content" :post="post" @refresh-post="getPost"/>
    </section>
    <!-- <section> -->
      <PostInventoryComponent :fibers="post.fibers" :post_id="post._id" :author="post.author" @refresh-post="getPost" @refresh-fibers="updateFibersSelected"/>
    <!-- </section> -->
    <PostLinksListComponent :post="post" @refresh-post="getPost" />
    <div class="buttons">
      <button class="pure-button-primary pure-button" @click="createProject">Import Guide</button>
    </div>
    <section class="header">
      <h2>Comments</h2>
    </section>
    <CommentListComponent :post="post"></CommentListComponent>
  </div>

</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

section {
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

.inv {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  padding-top: 1em;
}

h1 {
  margin: 0px;
  color: var(--earthy-green);
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2em;
  margin: 1em 0 5% 0;
}

button {
  box-shadow: 0px 4px 0px lightgrey;  
  width: fit-content;
  height: fit-content;
  font-size: 1.5em;
  padding: 0.5em;
  border-radius: 1em;
  
}
</style>
