<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { IFile } from "/@src/services/types";
import { QuestionService } from "/@src/services/question";
import { FileService } from "/@src/services/file";
import { toastSuccess } from "/@src/plugins/toast";
import { useAuthStore } from "/@src/store/auth";
const { testTypes } = useAuthStore();
const route = useRoute();
const router = useRouter();
let form = ref({
  title: "",
  type: route.query.type ? String(route.query.type) : "1",
  answers: [
    {
      title: "",
      file: null as any,
      file_id: null as any,
    },
  ],
  correctIndex: null as any,
});
const rules = {
  title: { required },
};
const v$ = useVuelidate(rules, form);
async function validate() {
  return await v$.value.$validate();
}
const files = ref<File[]>([]);
let uploadedFile = ref<IFile | null>(null);
let loading = ref(false);
let data = ref();
onMounted(async () => {
  if (route.query.id) {
    let res = await QuestionService.getById(String(route.query.id));
    data.value = res.data.data;
    form.value.title = res.data.data.title;
    form.value.type = res.data.data.type;
    form.value.answers = res.data.data.answer.map((answer) => ({
      title: answer.title,
      file: answer.file,
      file_id: answer.file_id,
    }));
    form.value.correctIndex = res.data.data.answer.findIndex(
      (answer) => answer.is_correct == 1
    );
    uploadedFile.value = res.data.data.file;
  }
});

async function save() {
  if (!(await validate())) return;
  loading.value = true;
  try {
    let payload = {
      ...form.value,
      type: +form.value.type,
      answers: form.value.answers.map((answer, index) => ({
        title: answer.title,
        file_id: answer.file_id ? answer.file_id : null,
        is_correct: form.value.correctIndex === index ? 1 : 0,
        file: answer.file ? answer.file : null,
      })),
      file_id: uploadedFile.value ? uploadedFile.value.id : null,
      menu: route.query.menu ? Number(route.query.menu) : null,
    };
    if (files.value.length > 0) {
      let res = await FileService.upload(files.value);
      payload.file_id = res.data.data?.[0]?.id || null;
    }
    await Promise.all(
      payload.answers.map(async (answer, index) => {
        if (answer.file && answer.file instanceof File) {
          let res = await FileService.upload([answer.file]);
          payload.answers[index].file_id = res.data.data?.[0]?.id || null;
        }
        delete payload.answers[index].file;
      })
    );
    if (route.query.id) {
      await QuestionService.update(String(route.query.id), payload);
    } else {
      await QuestionService.create(payload);
    }
    toastSuccess();
    router.back();
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="grid gap-4">
    <AppTitle> Test qo'shish </AppTitle>

    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Test savoli</div>
      <n-tabs class="c-tabs mb-4" v-model:value="form.type" type="segment" size="large">
        <n-tab-pane :name="val.code" v-for="val in testTypes">
          <template #tab>
            <div class="flex gap-2">
              <img class="h-5" :src="val.img" alt="" />
              {{ val.name }}
            </div>
          </template>
        </n-tab-pane>
      </n-tabs>
      <div class="grid gap-4 mb-3">
        <CInput
          v-model:value="form.title"
          :schema="v$.title"
          label="Savol"
          icon="draft"
          type="textarea"
        />
      </div>

      <DropFile v-if="!uploadedFile" v-model:value="files" :not-multiple="true" />
      <FileShow v-if="uploadedFile" :data="uploadedFile" @delete="uploadedFile = null" />
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Javob variantlari</div>
      <n-radio-group class="w-full" v-model:value="form.correctIndex">
        <div class="grid gap-6 grid-cols-2">
          <div v-for="(answer, index) in form.answers" class="flex gap-2">
            <n-radio :value="index" />
            <div class="grid gap-1 w-full">
              <div class="flex gap-1">
                <CInput
                  type="textarea"
                  :rows="1"
                  class="w-full"
                  v-model:value="answer.title"
                  label="Javob varianti"
                />
                <CIconButton
                  v-if="form.answers.length > 1"
                  @click="form.answers.splice(index, 1)"
                  class="error-svg"
                  :circle="false"
                  style="height: 100%"
                  icon="delete"
                />
              </div>
              <CFileSelect
                v-if="!answer.file_id"
                v-model:value="answer.file"
                label="Fayl yuklang"
              />
              <FileShow
                v-else
                :data="answer.file"
                @delete="
                  answer.file = null;
                  answer.file_id = null;
                "
              />
            </div>
          </div>
          <CButton
            @click="form.answers.push({ title: '', file: null, file_id: null })"
            class="w-full col-span-full"
            size="small"
            ghost
            icon="plus"
          >
            Javob varianti qo'shish
          </CButton>
        </div>
      </n-radio-group>
    </n-card>

    <div class="flex justify-end mt-8 gap-4">
      <CButton @click="$router.back()" type="default"> Bekor qilish </CButton>
      <CButton @click="save" type="primary" :loading="loading"> Saqlash </CButton>
    </div>
  </div>
</template>
<style lang="scss"></style>
