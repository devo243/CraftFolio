<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["post", "content", "type"]);
const emit = defineEmits(["editTip", "refreshTips"]);
const newContent = ref(props.content);

const editTip = async (newContent: string) => {
  try {
    if (props.type === "tip") {
      await fetchy(`/api/posts/${props.post._id}/tips/`, "PATCH", {
        body: { oldTip: props.content, newTip: newContent },
      });
    } else {
      await fetchy(`/api/posts/${props.post._id}/mistakes/`, "PATCH", {
        body: { oldMistake: props.content, newMistake: newContent },
      });
    }
  } catch (_) {
    console.log(_);
    return;
  }
  emit("editTip");
  emit("refreshTips");
};
</script>

<template>
  <form @submit.prevent="editTip(newContent)" class="container">
    <div class="flex-container1">
      <img v-if="props.type === 'tip'" src="@/assets/icons/check.svg" class="tip" />
      <img v-else-if="props.type === 'mistake'" src="@/assets/icons/mistake.svg" class="mistake" />
      <textarea id="newContent" v-model="newContent" class="hint"></textarea>
    </div>
    <div class="flex-container2">
      <button class="edit" type="submit"><img src="@/assets/icons/check.svg" /></button>
    </div>
  </form>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* background-color: rgb(226, 226, 226); */
  border-radius: 2em;
}

form {
  width: 100%;
  margin-left: 1em;
  font-size: 1.5em;
  /* margin: 0; */
  padding: 0.5em;
  border-radius: 0.5em;
  flex-direction: column;
  display: flex;
}

input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}
.flex-container1 {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 100%;
}

.flex-container2 {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

button {
  border-radius: 1em;
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

.edit {
  background-color: var(--earthy-green);
}
</style>
