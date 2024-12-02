<script setup lang="ts">
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
const emit = defineEmits(["refreshPosts"]);
const currentPage = ref(1);
const router = useRouter();

const handleTitleMDChange = async (titleUploaded:string, contentUploaded:string)=>{
  title.value = titleUploaded;
  content.value = contentUploaded;
  currentPage.value=2;
};

const handleTipsMistakesChange = async(tipsUploaded:string[], mistakesUploaded:string[])=>{
  tips.value = tipsUploaded;
  mistakes.value = mistakesUploaded;
  currentPage.value=3;
};
const handleBack = async()=>{
  currentPage.value-=1;
}
const handleFinish = async()=>{
  currentPage.value=1;
  await createPost(title.value,content.value, tips.value,mistakes.value);
  await router.push("/myposts");
}

const createPost = async (title:string, content: string, tips:string[], mistakes:string[]) => {
  try {
    const options = {tips:tips, mistakes: mistakes};
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
  <form @submit.prevent="createPost(title, content,tips, mistakes)">
    <CreatePostTitle v-if="currentPage===1" :title="title" :content="content" @create-title-m-d="handleTitleMDChange"/>
    <CreatePostTips v-else :tips="tips" :mistakes="mistakes" @create-tips-mistakes="handleTipsMistakesChange" @go-back="handleBack" @finish="handleFinish"/>
  </form>

</template>

<style scoped></style>
