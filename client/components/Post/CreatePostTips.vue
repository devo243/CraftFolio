<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["tips", "mistakes"]);
const tips = ref(props.tips);
const mistakes = ref(props.mistakes);
const newTip = ref("");
const newMistake = ref("");
const emit = defineEmits(["createTipsMistakes", "goBack", "finish"]);

const updateTips = async (tips: string[], mistakes: string[]) => {
  emit("createTipsMistakes", tips, mistakes);
};

const addTip = async () => {
  tips.value.push(newTip.value);
  newTip.value = "";
};
const addMistake = async () => {
  mistakes.value.push(newMistake.value);
  newMistake.value = "";
};

const deleteTip = async (index: number) => {
  tips.value.splice(index, 1);
};

const deleteMistake = async (index: number) => {
  mistakes.value.splice(index, 1);
};
</script>

<template>
  <form @submit.prevent="updateTips(tips, mistakes)">
    <section class="header">
      <h1 class="title">Tips</h1>
    </section>
    <section class="container">
      <div class="content" v-if="tips.length !== 0">
        <a class="tip" v-for="(tip, index) in tips" :key="index">
          <div class="flex-container1">+ {{ tip }}</div>
          <div class="flex-container2">
            <button class="button-error btn-small pure-button" @click="deleteTip(index)" type="button"><img src="@/assets/icons/thrash.svg" /></button>
          </div>
        </a>
      </div>
      <form class="add" @submit.prevent="addTip()">
        <input id="tip" v-model="newTip" required />
        <button type="submit">+</button>
      </form>
    </section>
    <section class="header">
      <h1 class="title">Mistakes</h1>
    </section>
    <section class="container">
      <div class="content" v-if="mistakes.length !== 0">
        <a class="tip" v-for="(mistake, index) in mistakes" :key="index">
          <div class="flex-container1">x {{ mistake }}</div>
          <div class="flex-container2">
            <button class="button-error btn-small pure-button" @click="deleteMistake(index)" type="button"><img src="@/assets/icons/thrash.svg" /></button>
          </div>
        </a>
      </div>
      <form class="add" @submit.prevent="addMistake()">
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
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: rgb(226, 226, 226);
  border-radius: 2em;
}

.content {
  width: 95%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

a,
p,
.add {
  padding: 0.5em;
  font-size: 1.5em;
}

.add {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  gap: 0.5em;
}

.add {
  width: 70%;
  border-radius: 2em;
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
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

.tip {
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

section {
  display: flex;
  flex-direction: row;
  align-items: left;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2em;
  margin-top: 1em;
}

.flex-container1 {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 100%;
}

.flex-container2 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}
</style>
