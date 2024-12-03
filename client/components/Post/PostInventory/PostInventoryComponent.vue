<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import AddPostFiberForm from "./AddPostFiberForm.vue";
import PostFiberComponent from "./PostFiberComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["fibers", "post_id", "author"]);
const emit = defineEmits(["refreshPost"]);

const getInventory = async () => {
  emit("refreshPost");
};
</script>

<template>
  <section>
    <section>
      <h1>Inventory</h1>
    </section>
    <p v-if="props.fibers === undefined">No inventory</p>
    <section class="fibers" v-else-if="props.fibers.length !== 0">
      <article v-for="fiber in props.fibers" :key="fiber._id">
        <PostFiberComponent :fiber="fiber.recommended" :id="props.post_id" @refreshFibers="getInventory" />
      </article>
    </section>
    <p v-else>No inventory</p>
    <section v-if="currentUsername===props.author">
      <h2>Add fiber:</h2>
      <AddPostFiberForm :id="props.post_id" @refreshFibers="getInventory" />
    </section>
  </section>
  <!-- <div>
    <FiberComponent :fiber="fiber" />
  </div> -->
</template>

<style scoped>
section {
  /* width: 80%; */
  max-width: 70em;
  max-height: 60%;
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
  max-width: 60em;
}

.fibers {
  padding: 1em;
}

.inv {
  width: 3000px;
}
</style>
