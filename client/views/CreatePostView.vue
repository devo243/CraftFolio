<script setup lang="ts">
import CreatePostFibers from "@/components/Post/CreatePostFibers.vue";
import CreatePostTips from "@/components/Post/CreatePostTips.vue";
import CreatePostTitle from "@/components/Post/CreatePostTitle.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useRouter } from "vue-router";

const title = ref("");
const content = ref("");
const fiberTypes = ref(new Array<Array<string>>);
const fiberYards = ref(new Array<Array<number>>);
const tips = ref(new Array<string>);
const mistakes = ref(new Array<string>);
const links = ref(new Array<string>);
const emit = defineEmits(["refreshPosts"]);
const currentPage = ref(1);
const router = useRouter();

const handleTitleMDChange = async (titleUploaded:string, contentUploaded:string, linksUploaded: string[])=>{
  title.value = titleUploaded;
  content.value = contentUploaded;
  links.value = linksUploaded;
  currentPage.value=2;
};

const handleFiberChange = async (types:string[][], yards:number[][])=>{
  fiberTypes.value = types;
  fiberYards.value = yards;
  currentPage.value=3;
};

const handleTipsMistakesChange = async(tipsUploaded:string[], mistakesUploaded:string[])=>{
  tips.value = tipsUploaded;
  mistakes.value = mistakesUploaded;
  currentPage.value=4;
};
const handleBack = async()=>{
  currentPage.value-=1;
}
const handleFinish = async()=>{
  currentPage.value=1;
  await createPost(title.value,content.value, links.value, tips.value,mistakes.value);
  await router.push("/myposts");
}

const createPost = async (title:string, content: string, links: string[], tips:string[], mistakes:string[]) => {
  try {
    const options = {tips:tips, mistakes: mistakes, links: links};
    await fetchy("/api/posts", "POST", {
      body: { title, content, options },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
};


const emptyForm = () => {
  title.value = "";
  content.value = "";
  fiberTypes.value = new Array<Array<string>>;
  tips.value = new Array<string>;
  mistakes.value = new Array<string>;
};
</script>

<template>
  <form @submit.prevent="createPost(title, content, links, tips, mistakes)">
    <CreatePostTitle v-if="currentPage===1" :title="title" :content="content" :links="links" @create-title-m-d="handleTitleMDChange"/>
    <CreatePostFibers v-else-if="currentPage==2" :fiber-types="fiberTypes" :fiber-yards="fiberYards" @create-fibers="handleFiberChange" @go-back="handleBack"/>
    <CreatePostTips v-else :tips="tips" :mistakes="mistakes" @create-tips-mistakes="handleTipsMistakesChange" @go-back="handleBack" @finish="handleFinish"/>
  </form>

</template>

<style scoped></style>
