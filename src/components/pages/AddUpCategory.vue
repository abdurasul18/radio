<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { NotificationService } from "/@src/services/notification";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
import { CategoryService, ICategory } from "/@src/services/category";
import { FileService } from "/@src/services/file";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: ICategory;
  mode: "create" | "update";
}>();
let form = ref({
  name: "",
  order: "",
});
const rules = {
  name: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.name = props.item?.name || "";
    uploadedFile.value = props.item?.file.path || null;
    form.value.order = props.item?.order as any;
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
        order: +form.value.order,
        file_id: uploadedFile.value ? props.item?.file.id || null : null,
      };
      if (files.value.length) {
        let res = await FileService.upload(files.value);
        payload.file_id = res.data.data?.[0]?.id || null;
      }
      if (props.mode === "update") {
        await CategoryService.update(props.item?.id!, payload);
      } else {
        await CategoryService.create(payload);
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
      <CInput icon="draft" v-model:value="form.name" :schema="v$.name" label="Nomi" />
      <CInput
        icon="hashtag"
        v-model:value="form.order"
        :schema="v$.order"
        label="Tartib raqami"
        type="number"
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
