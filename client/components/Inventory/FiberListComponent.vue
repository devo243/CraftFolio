<script setup lang="ts">
import FiberComponent from "@/components/Inventory/FiberComponent.vue";
import { ref } from "vue";

const fiber = ref({ name: "example", brand: "example", type: "example", color: "example", yardage: "10" });
</script>

<template>
  <div>
    <FiberComponent :fiber="fiber" />
  </div>
</template>

<style scoped></style>
