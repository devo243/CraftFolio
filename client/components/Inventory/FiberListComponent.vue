<script setup lang="ts">
import FiberComponent from "@/components/Inventory/FiberComponent.vue";
import { ref } from "vue";
import AddFiberForm from "./AddFiberForm.vue";

const fiber = ref({ name: "example", brand: "example", type: "example", color: "example", yardage: "10" });
const fibers = ref<Array<Record<string, string>>>([]);

fibers.value.push(fiber.value);
fibers.value.push(fiber.value);
</script>

<template>
  <section class="fibers" v-if="fibers.length !== 0">
    <h1>Inventory</h1>
    <article v-for="fiber in fibers" :key="fiber._id">
      <FiberComponent :fiber="fiber" />
    </article>
  </section>
  <p v-else>No inventory</p>
  <section>
    <h2>Add fiber:</h2>
    <AddFiberForm />
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

.fibers {
  padding: 1em;
}
</style>
