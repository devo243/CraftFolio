<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["post", "tip"]);
const emit = defineEmits(["editTip", "refreshTips"]);
const newTip = ref("");

const editTip = async (newTip:string) => {
  try {
    console.log(props.tip, newTip);
    await fetchy(`/api/posts/${props.post._id}/tips/`, "PATCH",{
      body: { oldTip: props.tip, newTip:newTip},
    });
  } catch (_) {
    console.log(_);
    return;
  }
  emit("editTip");
  emit("refreshTips");
};


</script>

<template>
    <div class="container">
        <form @submit.prevent="editTip(newTip)">
            <div class="flex-container1">
                <img src="@/assets/icons/check.svg" class="tip"/>
                <textarea id="newTip" v-model="newTip" class="hint"></textarea>
            </div>
            <div class="flex-container2">
                <button class="edit" type="submit"><img src="@/assets/icons/check.svg" /></button>
            </div>
        </form>
        
        
    </div>
    
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


a,
p,
form {
  margin-left: 1em;
  font-size: 1.5em;
  /* margin: 0; */
  padding: 0.5em;
  background-color: var(--grey);
  border-radius: 0.5em;
}




input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}
.flex-container1 {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 100%;
}


.flex-container2 {
  display:flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

button{
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

.edit {
  background-color: var(--earthy-green);
}
</style>
