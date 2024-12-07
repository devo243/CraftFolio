<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["fiberTypes","fiberYards"]);
const fiberTypes = ref(props.fiberTypes);
const fiberYards = ref(props.fiberYards);
const emit = defineEmits(["createFibers", "goBack"]);

const updateFibers = async (fiberTypes:string[][], fiberYards: string[][]) => {
    emit("createFibers",fiberTypes, fiberYards);
};

const newType = ref("");
const alternateNewType = ref("");
const customType = ref("");
const alternateCustomType = ref("");
const newYards = ref("");
const alternateNewYards = ref("");
const availableTypes = [
  "cotton",
  "linen",
  "acrylic",
  "polyester",
  "flannel",
  "shiffon",
  "interfacing",
  "zipper",
  "button",
];
const emptyForm = ()=>{
    newType.value="";
    alternateNewType.value=""
    newYards.value = "";
    alternateNewYards.value = "";
};

const addFiber = async () => {
    if(newType.value==='custom')
    {
        newType.value = customType.value;
    }
    fiberTypes.value.push([newType.value]);
    fiberYards.value.push([newYards.value]);
    emptyForm();
}

const addAlternateFiber = async (row: number) => {
    if(alternateNewType.value==='custom')
    {
      alternateNewType.value = alternateCustomType.value;
    }
    fiberTypes.value[row].push(alternateNewType.value);
    fiberYards.value[row].push(alternateNewYards.value);
    emptyForm();
}

const deleteFiber = async (row: number, column: number)=>{
    if(fiberTypes.value.length<=row || fiberTypes.value[row].length<=column){
        throw Error("index out of bounds");
    }
    if(column==0){
        fiberTypes.value.splice(row,1);
        fiberYards.value.splice(row,1);
    }
    else{
        fiberTypes.value[row].splice(column,1);
        fiberYards.value[row].splice(column,1);
    }
};

</script>

<template>
  <form @submit.prevent="updateFibers(fiberTypes, fiberYards)">
    <section class="header">
    <h1 class="title">Fibers</h1>
    </section>
    
    <section v-for="(fibers,index) of fiberTypes" :key="index">
        <div class="container">
            <div class="block">
                <span>{{ fiberTypes[index][0] }} </span>
            </div>
            <div class="block">
                <span>{{ fiberYards[index][0] }} yd </span>
            </div>
            <div class="block">
                <button class="button-error btn-small pure-button" @click="deleteFiber(index, 0)" type="button">Delete</button>
            </div>
        </div>
        <div  v-if="fibers.length>=1" class="encapsulation">
            <h2>Alternate Fibers</h2>
            <div class="alternate" v-for="index2 in fibers.length-1" :key="index2">
                <div class="block">
                    <span>{{ fiberTypes[index][index2] }} </span>
                </div>
                <div class="block">
                    <span>{{ fiberYards[index][index2] }} yd</span>
                </div>
                <div class="block">
                    <button type="button" class="button-error btn-small pure-button" @click="deleteFiber(index, index2)">Delete</button>
                </div>
            </div>

            <form @submit.prevent="addAlternateFiber(index)" class="newFiberForm">
                <select v-model="alternateNewType" required>
                  <option disabled value="">Please select one</option>
                  <option v-for="(type, index) of availableTypes" :key="index">{{ type }}</option>
                  <option value="custom">Custom...</option>
                </select>
                <input 
                    type="text" 
                    v-model="alternateCustomType" 
                    placeholder="Enter custom type" 
                    v-if="alternateNewType === 'custom'"
                    class="custom"
                    required
                />
                <input type="number" step="any" id="yardage" v-model="alternateNewYards" placeholder="Yardage" required />
                <button type="submit" class="button-custom pure-button pure-button-primary">Add</button>
        </form>
        </div>

    </section>

    <section class="header">
    <h1 class="title">Add Fibers</h1>
    </section>
    <section>
        <form @submit.prevent="addFiber()" class="newFiberForm">
            <select v-model="newType" required>
            <option disabled value="">Please select one</option>
            <option v-for="(type, index) of availableTypes" :key="index">{{ type }}</option>
            <option value="custom">Custom...</option>
            </select>
            <input 
                type="text" 
                v-model="customType" 
                placeholder="Enter custom type" 
                v-if="newType === 'custom'"
                required
            />
            <input type="number" step="any" id="yardage" v-model="newYards" placeholder="Yardage" required />
            <button type="submit" class="button-custom pure-button pure-button-primary">Add</button>
        </form>
    </section>
    <section class="header"></section>
    <div class="buttons">
      <button type="button" class="pure-button-primary pure-button" @click="emit('goBack')">Back</button>
      <button type="submit" class="pure-button-primary pure-button">Next</button>
    </div>
  </form>
</template>

<style scoped>
a,
p{
  padding: 1em;
  font-size: 1.5em;
  margin: 0;
}

h2 {
  margin-bottom: 0px;
}

.custom {
  flex: 1;
}

input {
  width: 100%;
  border-radius: 0.5em;
  padding-left: 0.5em;
}

button {
  border-radius: 0.5em;
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

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2em;
}

.add {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 1em;
}

input {
  width: 10%;
}

.button-custom {
  background-color: var(--earthy-green);
}

.container {
  width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding: 0px 10px 0px 10px;
  height: 60px;
  background-color: #E8E8E8;
  border-radius: 1em;
}

.encapsulation{
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  padding: 0px 10px 10px 10px;
  /* background-color: #E8E8E8; */
  background-color: #676767;
  color: #E8E8E8;
  border-radius: 1em;
  gap: 1em;
  margin: 0px 20px;
}

.alternate {
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding: 0px 10px;
  margin: 0px 10px;
  height: 60px;
  /* background-color: #676767; */
  background-color: #E8E8E8;
  color:#676767;
  border-radius: 1em;
}

.block {
  width: 100%;
  overflow: hidden;
  text-align: center;
}

.fiber{
    width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 10px 0px 10px;
  height: 60px;
  background-color: #E8E8E8;
  border-radius: 1em;
}

.newFiberForm {
  display: flex;
  gap: 0.5em;
  padding: 0px 10px;
  width: auto;
}
</style>
