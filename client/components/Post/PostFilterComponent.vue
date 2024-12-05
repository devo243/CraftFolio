<script setup lang="ts">
import { ref } from "vue";

const ratingType = ref("");
const minScore = ref(0);
const emit = defineEmits(["getPostsByRating", "getPosts"]);

const clearFilters = () => {
  ratingType.value = "";
  minScore.value = 0;

  emit("getPosts");
};
</script>

<template>
  <form @submit.prevent="emit('getPostsByRating', ratingType, minScore)">
    <label for="ratingType">Choose rating type:</label>
    <select id="ratingType" v-model="ratingType" required>
      <option disabled value="">Please select one</option>
      <option value="eco">Eco Friendly</option>
      <option value="beginner">Beginner Friendly</option>
    </select>
    <label for="minScore">Set minimum score:</label>
    <input type="number" id="minScore" step="any" max="5" min="0"  v-model="minScore" placeholder="0" required />
    <button class="submit" type="submit">Apply Filters</button>
    <button class="clear" type="button" @click="clearFilters">Clear Filters</button>
  </form>
</template>

<style scoped>
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
  align-items: center;
  gap: 0.5em;
  width: 100%;
}

input {
  width: 10%;
  border-radius: 0.5em;
  /* padding-left: 0.5em; */
  padding: 0.3em 0.3em 0.3em 0.5em;
  border-color: var(--dark-green);
  font-size: 0.8em;
  height: auto;
}

select {
  width: 30%;
  font-size: 0.8em;
}

.submit,
.clear {
  border-radius: 2em;
  border-color: black;
  background-color: var(--dark-green);
  color: #fcf2cf;
  font-size: 0.8em;
}

label {
  font-size: 0.9em;
}
</style>
