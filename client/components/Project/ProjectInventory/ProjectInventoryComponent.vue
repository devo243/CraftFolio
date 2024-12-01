<script setup lang="ts">
import AddProjectFiberForm from "./AddProjectFiberForm.vue";
import ProjectFiberComponent from "./ProjectFiberComponent.vue";

const props = defineProps(["id", "fibers"]);
const emit = defineEmits(["refreshProject"]);

const getInventory = async () => {
  emit("refreshProject");
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
        <ProjectFiberComponent :fiber="fiber" :id="props.id" @refreshFibers="getInventory" />
      </article>
    </section>
    <p v-else>No inventory</p>
    <section>
      <h2>Add fiber:</h2>
      <AddProjectFiberForm :id="props.id" @refreshFibers="getInventory" />
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
