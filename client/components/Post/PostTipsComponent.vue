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
  <section class="header">
    <h1 class="title">Tips/Mistakes</h1>
  </section>
  <section class="container">
    <div class="tips" v-if="currentOptions.tips.length !== 0">
      <a class="tip" v-for="(tip, index) in currentOptions.tips" :key="index" >- {{ tip }}</a>
    </div>
    <p class="placeholder" v-else>Add some tips...</p>
    <form @submit.prevent="addTip()" v-if="currentUsername===props.post.author">
      <!-- <label for="link">Add a new link:</label> -->
      <input id="tip" v-model="newTip" required />
      <button type="submit">+</button>
    </form>
  </section>
</template>

<style scoped>
.container {
  width: 100%;
  height: 35vh;
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
form {
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
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
  flex-direction: column;
  gap: 1em;
  align-items: left;
  margin: auto;
  max-width: 90em;
  max-height: 90%;
  padding-top: 1em;
}
</style>
