<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["post"]);
const { currentUsername } = storeToRefs(useUserStore());



let currentOptions = props.post.options;
if(currentOptions===null){
    const empty: string[] = [];
    currentOptions={fibers:undefined, tips:empty};
}
const newTip = ref("");

const emit = defineEmits(["refreshPost"]);

const addTip = async () => {
  currentOptions.tips.push(newTip.value);
  try {
    await fetchy(`/api/posts/${props.post._id}/`, "PATCH", {
      body: { id: props.post._id, title:props.post.title, content: props.post.content, options:currentOptions },
    });
  } catch (_) {
    console.log(_);
    return;
  }
  emit("refreshPost");
};


</script>

<template>
  <section class="header" v-if="currentOptions.tips.length !== 0 || currentUsername===props.post.author">
    <h2 class="title">Tips/Common Mistakes</h2>
  </section>
  <section class="container">
    <div class="hints" v-if="currentOptions.tips.length !== 0">
      <div v-for="(tip, index) in currentOptions.tips" :key="index" class="hint">
        <img src="@/assets/icons/check.svg" class="tip"/>
        <a > {{ tip }}</a>
      </div>
    </div>
    <div class="hints" v-if="currentOptions.mistakes.length !== 0">
      <div v-for="(mistake, index) in currentOptions.mistakes" :key="index" class="hint">
        <img src="@/assets/icons/mistake.svg" class="mistake"/>
        <a > {{ mistake }}</a>
      </div>
    </div>
    
    <form @submit.prevent="addTip()" v-if="currentUsername===props.post.author">
      <!-- <label for="link">Add a new link:</label> -->
      <p class="placeholder" v-if="currentOptions.mistakes.length === 0">Add some tips...</p>
      <input id="tip" v-model="newTip" required />
      <button type="submit">+</button>
    </form>
  </section>
</template>

<style scoped>
.hint{
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: small;
}

.title {
  color: var(--dark-blue);
}

.hint a {
  padding: 0.5em;
  box-shadow: 0px 4px 0px rgba(181, 181, 181, 0.3);  
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* background-color: rgb(226, 226, 226); */
  border-radius: 2em;
}
a,
p,
form {
  margin-left: 1em;
  font-size: 1.5em;
  /* margin: 0; */
  background-color: var(--grey);
  border-radius: 0.5em;
  box-shadow: darkgray;
}

form {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  gap: 0.5em;
}

form {
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

.hints {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 0em 1em 1em;
}

.tip {
  background-color: var(--green);
}

.mistake {
  background-color: var(--red);
}

img {
  width: 32px;
  height: 100%;
  border-radius: 1em;
  padding: 0.5em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: left;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  /* padding-top: 1em; */
}
</style>
