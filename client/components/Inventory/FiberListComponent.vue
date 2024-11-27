<script setup lang="ts">
import FiberComponent from "@/components/Inventory/FiberComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import AddFiberForm from "./AddFiberForm.vue";

const fiber = ref({ name: "example", brand: "example", type: "example", color: "example", yardage: "10" });
const fibers = ref<Array<Record<string, string>>>([]);

const getInventory = async () => {
  let inventory;
  try {
    inventory = await fetchy("/api/fibers", "GET");
  } catch (_) {
    return;
  }

  fibers.value = inventory;
};

onBeforeMount(async () => {
  await getInventory();
});
</script>

<template>
  <section>
    <h1>Inventory</h1>
  </section>
  <section class="fibers" v-if="fibers.length !== 0">
    <article v-for="fiber in fibers" :key="fiber._id">
      <FiberComponent :fiber="fiber" @refreshFibers="getInventory" />
    </article>
  </section>
  <p v-else>No inventory</p>
  <section>
    <h2>Add fiber:</h2>
    <AddFiberForm @refreshFibers="getInventory" />
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
</style>
