<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../../utils/fetchy";
import AddPostFiberForm from "./AddPostFiberForm.vue";
import AlternatePostFiberComponent from "./AlternatePostFiberComponent.vue";
import PostFiberComponent from "./PostFiberComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["fibers", "post_id", "author"]);
const emit = defineEmits(["refreshPost"]);
const loaded = ref(false);
const presentFibers = ref(new Array<string>);
const selectedItems = ref(new Array<string>);

const getInventory = async () => {
  emit("refreshPost");
};

const getAvailableMaterialsPost = async () => {
  try {
    presentFibers.value = await fetchy(`/api/posts/${props.post_id}/presentfibers`, "GET");
  } catch (_) {
    return;
  }

};

const addRecommendedFiber = async (type: string, yardage: number) => {
  await fetchy(`/api/posts/${props.post_id}/fibers`, "POST", {
        body: {
          alternative_to: "",
          type,
          yardage,
        },
      });
}

const addAlternativeFiber = (alternative_to: string) => {
  const addFiber = async (type: string, yardage: number) => {
    await fetchy(`/api/posts/${props.post_id}/fibers`, "POST", {
        body: {
          alternative_to,
          type,
          yardage,
        },
      });
  }
  return addFiber;
}

onBeforeMount(async () => {
  await getAvailableMaterialsPost();
  loaded.value = true;
});

</script>

<template>
  <section v-if="loaded" class="main-container">
    <section class="header">
      <h1>Fibers</h1>
      <div>
        <div class="present presense-label"></div>
        In Inventory
      </div>
      <div>
        <div class="absent presense-label"></div>
        Not In Inventory
      </div>
    </section>
    <p v-if="props.fibers === undefined">No inventory</p>
    <section class="fibers" v-else-if="props.fibers.length !== 0">
      <div class="separation">
        <h2 class="grid-item">Recommended</h2>
        <h2 class="grid-item">Alternatives</h2>
      </div>
      <article v-for="fiber in props.fibers" :key="fiber._id">
        <div class="separation">
          <div class="fiber-selection grid-item recommended">
            <div :class="presentFibers.includes(fiber.recommended._id) ? 'present' : 'absent'">
            <input type="checkbox" v-model="selectedItems" :value="fiber.recommended._id"/>
            </div>
            <PostFiberComponent :fiber="fiber.recommended" :id="props.post_id" :post_author="author" @refreshFibers="getInventory" :style="{flex : 1}"/>
          </div>
          <div class="fiber-selection grid-item alternative">
            <div v-for="alternative_fiber of fiber.alternatives" class="recommended">
              <div :class="presentFibers.includes(alternative_fiber._id) ? 'present' : 'absent'">
                <input type="checkbox" v-model="selectedItems" :value="alternative_fiber._id"/>
              </div>
              <AlternatePostFiberComponent :fiber="alternative_fiber" :id="props.post_id" :post_author="author" @refreshFibers="getInventory" :style="{flex : 1}" />
            </div>
            <section v-if="currentUsername===props.author" class="add-fiber">
                <AddPostFiberForm :add_fiber="addAlternativeFiber(fiber.recommended._id)" :post_id="props.post_id" @refreshFibers="getInventory" />
            </section>
          </div>
        </div>
      </article>
    </section>
    <p v-else>No inventory</p>
    <section v-if="currentUsername===props.author">
      <h2>Add fiber:</h2>
      <AddPostFiberForm :add_fiber="addRecommendedFiber" :post_id="props.post_id" @refreshFibers="getInventory" />
    </section>
  </section>
  <!-- <div>
    <FiberComponent :fiber="fiber" />
  </div> -->
</template>

<style scoped>
.add-fiber {
  max-height: 100%;
}

.main-container {
  margin-bottom: 5em;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.header div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
}

.presense-label {
  width: 20px;
  height: 20px;
}

.fiber-selection input {
  width: 24px;
  height: 24px;
}

.present, .absent {
  border-radius: 0.5em;
  width: 24px;
  height: 24px;
}

.present {
  border: 5px solid var(--green);
  accent-color: var(--green);
}

.absent {
  border: 5px dashed var(--yellow);
  accent-color: var(--yellow);
}

.recommended{
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  align-items: flex-start;
}

.alternative {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.separation {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 4em;
}

article .separation {
  padding: 1em;
  box-shadow: 0px 4px 0px rgba(181, 181, 181, 0.3);  
  background-color: var(--base-bg);
  border-radius: 1em;
}

.grid-item {
  text-align: left;
  margin: 0px;
}

h1 {
  flex: 1;
}
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
  width: 100%;
}

.inv {
  width: 3000px;
}
</style>
