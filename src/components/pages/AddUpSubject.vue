<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { NotificationService } from "/@src/services/notification";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
import { FileService } from "/@src/services/file";
import { ISubject, SubjectService } from "/@src/services/subject";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: ISubject;
  menu: any;
  mode: "create" | "update";
}>();
let form = ref({
  title_uz: "",
  title_ru: "",
  title_en: "",
});
const rules = {
  title_uz: { required },
  title_ru: { required },
  title_en: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.title_uz = props.item?.title_uz || "";
    form.value.title_ru = props.item?.title_ru || "";
    form.value.title_en = props.item?.title_en || "";
    uploadedFile.value = props.item?.file.path || null;
  }
});
let loading = ref(false);
async function save() {
  if (await validate()) {
    if (loading.value) return;
    try {
      loading.value = true;
      let payload = {
        ...form.value,
        menu: +props.menu,
        file_id: uploadedFile.value ? props.item?.file.id || null : null,
      };
      if (files.value.length) {
        let res = await FileService.upload(files.value);
        payload.file_id = res.data.data?.[0]?.id || null;
      }
      if (props.mode === "update") {
        await SubjectService.update(props.item?.id!, payload);
      } else {
        await SubjectService.create(payload);
      }
      //
      emits("success");
      toastSuccess();
    } finally {
      loading.value = false;
    }
  }
}
//
</script>

<template>
  <div>
    <div class="grid gap-4">
      <CInput
        icon="draft"
        v-model:value="form.title_uz"
        :schema="v$.title_uz"
        label="Nomi (O'zbekcha)"
      />
      <CInput
        icon="draft"
        v-model:value="form.title_ru"
        :schema="v$.title_ru"
        label="Nomi (Русский)"
      />
      <CInput
        icon="draft"
        v-model:value="form.title_en"
        :schema="v$.title_en"
        label="Nomi (English)"
      />

      <FileShow
        v-if="uploadedFile"
        :data="{
          uploadPath: uploadedFile,
          extension: uploadedFile.split('.').pop(),
          name: item?.file.name!,
        }"
        @delete="uploadedFile = null"
      />
      <DropFile v-else v-model:value="files" :not-multiple="true" />
    </div>
    <div class="mt-5">
      <div class="flex justify-end">
        <CButton type="default" @click="emits('close')">
          {{ $t("actions.close") }}</CButton
        >
        <CButton @click="save" :loading="loading" class="ml-4">
          {{ $t("actions.save") }}</CButton
        >
      </div>
    </div>
  </div>
</template>
