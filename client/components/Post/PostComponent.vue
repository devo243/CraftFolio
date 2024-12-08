<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post", "inHome"]);
const emit = defineEmits(["refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const router = useRouter();

const ecoRating = ref(0);
const beginnerRating = ref(0);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
  router.push("/myposts");
};

const getRatings = async () => {
  try {
    const ratings = await fetchy(`/api/posts/${props.post._id}/ratings`, "GET");
    console.log(ratings);
    ecoRating.value = ratings.ecoRating;
    beginnerRating.value = ratings.beginnerRating;
  } catch (_) {
    return;
  }
};

onBeforeMount(async () => {
  await getRatings();
});
</script>

<template>
  <div class="container">
    <img src="/client/assets/images/default_guide_thumbnail.jpg" />
    <p class="title">{{ props.post.title }}</p>
    <p>by {{ props.post.author }}</p>
    <div class="ratings">
      <div class="rating">
        <span>Eco Rating: </span>
        <span class="stars">
          <img v-for="n in Math.round(ecoRating)" :key="'eco' + n" src="@/assets/icons/yellowstar.svg" alt="star" class="star" />
          <img v-for="n in Math.round(5 - ecoRating)" :key="'eco-empty' + n" src="@/assets/icons/star-border.svg" alt="star" class="star" />
        </span>
        <span>({{ Math.round(ecoRating) }})</span>
      </div>
      <div class="rating">
        <span>Beginner Rating: </span>
        <span class="stars">
          <img v-for="n in Math.round(beginnerRating)" :key="'beginner' + n" src="@/assets/icons/yellowstar.svg" alt="star" class="star" />
          <img v-for="n in Math.round(5 - beginnerRating)" :key="'beginner-empty' + n" src="@/assets/icons/star-border.svg" alt="star" class="star" />
        </span>
        <span>({{ Math.round(beginnerRating) }})</span>
      </div>
    </div>
    <div class="base">
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
    <menu v-if="props.post.author == currentUsername && props.inHome">
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
  </div>
</template>

<style scoped>
p {
  margin: 0 0 0 1em;
}

.title {
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 0.8em;
}

.ratings {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  margin-left: 1em;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.stars {
  display: flex;
  align-items: center;
}

.star {
  width: 1em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  /* justify-content: flex-start; */
  font-size: 0.8em;
  font-style: italic;
  /* margin: 0; */
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 100%;
  height: auto;
  border-radius: 1em 1em 0 0;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  padding-bottom: 1em;
}
</style>
