<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
import { BannerService, IBanner } from "/@src/services/banner";
import { FileService } from "/@src/services/file";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IBanner;
  mode: "create" | "update";
}>();
let form = ref({
  order: "",
});
const rules = {
  order: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.order = props.item?.order || "";
  uploadedFile.value = props.item?.file;

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
        order : Number(form.value.order),
        file_id: uploadedFile.value?.id || null,
      };
      if (files.value?.[0]) {
        payload.file_id = (await FileService.upload(files.value)).data?.data?.[0]?.id;
      }
      if (props.mode === "update") {
        await BannerService.update(props.item?.id!, payload);
      } else {
        await BannerService.create(payload);
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
        icon="hashtag"
        v-model:value="form.order"
        :schema="v$.order"
        label="Tartib raqami"
      />
      <FileShow
        v-if="uploadedFile"
        :data="uploadedFile"
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
