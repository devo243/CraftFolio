<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["tips","mistakes"]);
const tips = ref(props.tips);
const mistakes = ref(props.mistakes);
const newTip = ref("");
const newMistake = ref("");
const emit = defineEmits(["createTipsMistakes", "goBack", "finish"]);

const updateTips = async (tips:string[], mistakes: string[]) => {
    emit("createTipsMistakes",tips, mistakes);
};

const addTip = async () => {
    tips.value.push(newTip.value);
}
const addMistake = async () => {
    mistakes.value.push(newMistake.value);
}

</script>

<template>
  <form @submit.prevent="updateTips(tips, mistakes)">
    <section class="header">
    <h1 class="title">Tips</h1>
    </section>
    <section class="container">
        <div class="tips" v-if="tips.length !== 0">
            <a class="tip" v-for="(tip, index) in tips" :key="index" >+ {{ tip }}</a>
        </div>
        <p class="placeholder" v-else>Add some tips...</p>
        <form class="add" @submit.prevent="addTip()">
            <!-- <label for="link">Add a new link:</label> -->
            <input id="tip" v-model="newTip" required />
            <button type="submit">+</button>
        </form>
    </section>
    <section class="header">
    <h1 class="title">Mistakes</h1>
    </section>
    <section class="container">
        <div class="tips" v-if="mistakes.length !== 0">
            <a class="tip" v-for="(mistake, index) in mistakes" :key="index" >x {{ mistake }}</a>
        </div>
        <p class="placeholder" v-else>Add some tips...</p>
        <form class="add" @submit.prevent="addMistake()">
            <!-- <label for="link">Add a new link:</label> -->
            <input id="tip" v-model="newMistake" required />
            <button type="submit">+</button>
        </form>
    </section>
    <section class="header"></section>
    <div class="buttons">
      <button type="button" class="pure-button-primary pure-button" @click="emit('goBack')">Back</button>
      <button type="submit" class="pure-button-primary pure-button" @click="emit('finish')">Submit</button>
    </div>
  </form>
</template>

<style scoped>
.container {
  width: 100%;
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  /* margin: 0 0 0 1em; */
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
}
a,
p,
.add {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}

.add {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  gap: 0.5em;
}

.add {
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

.tips {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

.tip {
  padding: 0;
}

section {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: left;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  padding-top: 1em;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2em;
}

</style>
