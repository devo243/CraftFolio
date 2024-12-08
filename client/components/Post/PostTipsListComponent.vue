<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import TipComponent from "./TipComponent.vue";
import TipEditComponent from "./TipEditComponent.vue";

const props = defineProps(["post"]);
const { currentUsername } = storeToRefs(useUserStore());

const newTip = ref("");
const tips = ref(Array<string>);
const newMistake = ref("");
const mistakes = ref(Array<string>);
const editingTip = ref({ type: "", index: 0 });

const emit = defineEmits(["refreshPost"]);

const addTip = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/tips/`, "POST", {
      body: { newTip: newTip.value },
    });
    newTip.value = "";
  } catch (_) {
    console.log(_);
    return;
  }
  await getTips();
};

const getTips = async () => {
  let tipResults = Array<string>;
  try {
    tipResults = await fetchy(`/api/posts/${props.post._id}/tips/`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }
  tips.value = tipResults;
  emit("refreshPost");
};

const addMistake = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/mistakes/`, "POST", {
      body: { newMistake: newMistake.value },
    });
    newMistake.value = "";
  } catch (_) {
    console.log(_);
    return;
  }
  await getMistakes();
};

const getMistakes = async () => {
  let mistakeResults = Array<string>;
  try {
    mistakeResults = await fetchy(`/api/posts/${props.post._id}/mistakes/`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }
  mistakes.value = mistakeResults;
  emit("refreshPost");
};

const toggleEditing = async (type: string, index: number) => {
  if (!editingTip.value.type) {
    editingTip.value = { type: type, index: index };
  } else {
    editingTip.value = { type: "", index: 0 };
  }
};

onBeforeMount(async () => {
  await getTips();
  await getMistakes();
});
</script>

<template>
  <section class="header" v-if="tips.length !== 0 || currentUsername === props.post.author">
    <h2 class="title">Tips</h2>
  </section>
  <section>
    <div class="hints" v-if="tips.length !== 0">
      <div v-for="(tip, index) in tips" :key="index" class="hint">
        <TipComponent
          v-if="editingTip.type !== 'tip' || editingTip.index != Number.parseInt(index.toString())"
          :post="props.post"
          :content="tip"
          :type="'tip'"
          @refresh-tips="getTips"
          @edit-tip="toggleEditing('tip', Number.parseInt(index.toString()))"
        />
        <TipEditComponent v-else :post="props.post" :content="tip" :type="'tip'" @refresh-tips="getTips" @edit-tip="toggleEditing('tip', Number.parseInt(index.toString()))" />
      </div>
    </div>

    <form @submit.prevent="addTip()" v-if="currentUsername === props.post.author" class="input-form">
      <input id="tip" v-model="newTip" placeholder="Add some tips..." required />
      <button type="submit">+</button>
    </form>
  </section>

  <section class="header" v-if="mistakes.length !== 0 || currentUsername === props.post.author">
    <h2 class="title">Mistakes</h2>
  </section>
  <section>
    <div class="hints" v-if="mistakes.length !== 0">
      <div v-for="(mistake, index) in mistakes" :key="index" class="hint">
        <TipComponent
          v-if="editingTip.type !== 'mistake' || editingTip.index != Number.parseInt(index.toString())"
          :post="props.post"
          :content="mistake"
          :type="'mistake'"
          @refresh-tips="getMistakes"
          @edit-tip="toggleEditing('mistake', Number.parseInt(index.toString()))"
        />
        <TipEditComponent v-else :post="props.post" :content="mistake" :type="'mistake'" @refresh-tips="getMistakes" @edit-tip="toggleEditing('mistake', Number.parseInt(index.toString()))" />
      </div>
    </div>

    <form @submit.prevent="addMistake()" v-if="currentUsername === props.post.author" class="input-form">
      <input id="mistake" v-model="newMistake" placeholder="Add some mistakes..." required />
      <button type="submit">+</button>
    </form>
  </section>
</template>

<style scoped>
.hint {
  width: 100%;
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

a,
p,
form {
  margin-left: 1em;
  font-size: 1.5em;
  /* margin: 0; */
  background-color: var(--grey);
  border-radius: 0.5em;
}

p {
  font-size: small;
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
  width: 95%;
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
