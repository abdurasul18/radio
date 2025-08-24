<script lang="ts" setup>
import { ILesson, LessonService } from "/@src/services/lesson";

let route = useRoute();
let routeId = computed(() => String(route.params.id || ""));
let loading = ref(false);
let data = ref<ILesson>();
async function getData() {
  try {
    loading.value = true;
    let res = await LessonService.getById(routeId.value);
    data.value = res.data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getData();
});
let lang = ref<"uz" | "ru" | "en">("uz");
</script>
<template>
  <n-spin :show="loading">
  <AppTitle> {{ data?.title_uz }} </AppTitle>
    <div class="grid max-w-[800px] mx-auto">
      <n-tabs class="c-tabs" v-model:value="lang" type="segment">
        <n-tab-pane name="uz" tab="O'zbekcha"></n-tab-pane>
        <n-tab-pane name="ru" tab="Русский"></n-tab-pane>
        <n-tab-pane name="en" tab="English"></n-tab-pane>
      </n-tabs>
      <n-card class="base-card min-h-[500px]">
        <div class="title" v-if="lang == 'uz'">{{ data?.title_uz }}</div>
        <div class="title" v-if="lang == 'ru'">{{ data?.title_ru }}</div>
        <div class="title" v-if="lang == 'en'">{{ data?.title_en }}</div>
        <div class="flex justify-center">
          <n-image
            class="max-w-[150px]"
            :src="$withBaseUrl(data?.file.path)"
            alt="Lesson Image"
          />
        </div>
        <div>
          <div v-if="lang == 'uz'" v-html="data?.description_uz"></div>
          <div v-if="lang == 'ru'" v-html="data?.description_ru"></div>
          <div v-if="lang == 'en'" v-html="data?.description_en"></div>
        </div>
      </n-card>
    </div>
  </n-spin>
</template>
<style lang="scss"></style>
