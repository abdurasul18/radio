<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { NotificationService } from "/@src/services/notification";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
import { FileService } from "/@src/services/file";
import { IService, ServiceService } from "/@src/services/service";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IService;
  mode: "create" | "update";
  category_id?: any;
}>();
let form = ref({
  name: "",
  category_id: "",
});
const rules = {
  name: { required },
  category_id: { required },
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
    form.value.category_id = props.item?.category_id || "";
  }
  else {
    form.value.category_id = props?.category_id || "";
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
        file_id: uploadedFile.value ? props.item?.file.id || null : null,
      };
      if (files.value.length) {
        let res = await FileService.upload(files.value);
        payload.file_id = res.data.data?.[0]?.id || null;
      }
      if (props.mode === "update") {
        await ServiceService.update(props.item?.id!, payload);
      } else {
        await ServiceService.create(payload);
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
      <SelectCategory v-model:value="form.category_id" :schema="v$.category_id" />
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
