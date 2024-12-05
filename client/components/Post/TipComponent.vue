<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["post", "tip"]);
const emit = defineEmits(["editTip", "refreshTips"]);



const deleteTip = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/tips/${props.tip}`, "DELETE");
  } catch (_) {
    console.log(_);
    return;
  }
  emit("refreshTips");
};


</script>

<template>
    <div class="container">
        <div class="flex-container1">
            <img src="@/assets/icons/check.svg" class="tip"/>
            <a class="hint"> {{ props.tip }}</a>
        </div>
        <div class="flex-container2">
            <button @click="emit('editTip')" class="edit edit-button"><img src="@/assets/icons/pencil.svg" /></button>
            <button class="button-error btn-small pure-button " @click="deleteTip()" type="button"><img src="@/assets/icons/thrash.svg" /></button>
        </div>
        
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: left;
    height: 100%;
}


.flex-container2 {
  width: 100%;
  display:flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

button{
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
