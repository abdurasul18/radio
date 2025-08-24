<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { FileService } from "/@src/services/file";
import { toastSuccess } from "/@src/plugins/toast";
import { IFile } from "/@src/services/types";
import { LessonService } from "/@src/services/lesson";
const route = useRoute();
const router = useRouter();
const defaultContent = `<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`;

let form = ref({
  title_uz: "",
  title_ru: "",
  title_en: "",
  description_uz: "",
  description_ru: "",
  description_en: "",
});
const rules = {
  title_uz: { required },
  title_ru: {},
  title_en: {},
  description_uz: {},
  description_ru: {},
  description_en: {},
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let loading = ref(false);
let data = ref();
async function save() {
  if (!(await validate())) return;
  loading.value = true;
  try {
    let payload = {
      ...form.value,
      file_id: uploadedFile.value ? uploadedFile.value.id : null,
      subject_id: data.value?.subject_id || +String(route.query.subject_id || ""),
      description_uz: form.value.description_uz.replaceAll(defaultContent, ""),
      description_ru: form.value.description_ru.replaceAll(defaultContent, ""),
      description_en: form.value.description_en.replaceAll(defaultContent, ""),
    };
    if (files.value.length > 0) {
      let res = await FileService.upload(files.value);
      payload.file_id = res.data.data?.[0]?.id || null;
    }
    if (route.query.id) {
      await LessonService.update(String(route.query.id), payload);
    } else {
      await LessonService.create(payload);
    }
    toastSuccess();
    router.back();
  } finally {
    loading.value = false;
  }
}
//
let uploadedFile = ref<IFile>();
let editorRef = ref();
onMounted(async () => {
  if (route.query.id) {
    let res = await LessonService.getById(String(route.query.id));
    data.value = res.data.data;
    form.value.title_uz = res.data.data.title_uz;
    form.value.title_ru = res.data.data.title_ru;
    form.value.title_en = res.data.data.title_en;
    form.value.description_uz = res.data.data.description_uz;
    form.value.description_ru = res.data.data.description_ru;
    form.value.description_en = res.data.data.description_en;
    uploadedFile.value = res.data.data.file;
    await nextTick();
    editorRef.value?.reInit();
  }
});
</script>
<template>
  <div class="grid gap-4">
    <AppTitle> Dars qo'shish </AppTitle>
    <n-card class="base-card" :bordered="false">
      <div class="grid gap-4 grid-cols-2">
        <CInput
          v-model:value="form.title_uz"
          :schema="v$.title_uz"
          label="Sarlavha (O'zbekcha)"
          icon="draft"
        />
        <CInput
          v-model:value="form.title_ru"
          :schema="v$.title_ru"
          label="Sarlavha (Русский)"
          icon="draft"
        />
        <CInput
          v-model:value="form.title_en"
          :schema="v$.title_en"
          label="Sarlavha (English)"
          icon="draft"
        />
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Tavsif</div>
      <n-tabs type="segment">
        <n-tab-pane name="uz">
          <template #tab> O'zbekcha </template>
          <div>
            <Editor ref="editorRef" v-model:value="form.description_uz" />
          </div>
        </n-tab-pane>
        <n-tab-pane name="ru">
          <template #tab> Русский </template>
          <div>
            <Editor ref="editorRef" v-model:value="form.description_ru" />
          </div>
        </n-tab-pane>
        <n-tab-pane name="en">
          <template #tab> English </template>
          <div>
            <Editor ref="editorRef" v-model:value="form.description_en" />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <n-card class="base-card" :bordered="false">
      <DropFile v-if="!uploadedFile" v-model:value="files" :not-multiple="true" />
      <FileShow
        v-if="uploadedFile"
        :data="uploadedFile"
        @delete="uploadedFile = undefined"
      />
    </n-card>

    <div class="flex justify-end mt-8 gap-4">
      <CButton @click="$router.back()" type="default"> Bekor qilish </CButton>
      <CButton @click="save" type="primary" :loading="loading"> Saqlash </CButton>
    </div>
  </div>
</template>
<style lang="scss"></style>
