<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { INotification, NotificationService } from "/@src/services/notification";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: INotification;
  mode: "create" | "update";
}>();
let form = ref({
  title: "",
  description: "",
  published_at: "",
});
const rules = {
  title: { required },
  description: { required },
  published_at: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.published_at = props.item?.published_at
      ? dateToYMD(new Date(props.item.published_at))
      : "";
    form.value.title = props.item?.title || "";
    form.value.description = props.item?.description || "";
    uploadedFile.value = props.item?.poster;
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
        image: files.value?.[0] || null,
      };
      if (uploadedFile.value) {
        delete payload.image;
      }
      if (props.mode === "update") {
        await NotificationService.update(props.item?.id!, payload);
      } else {
        await NotificationService.create(payload);
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
        v-model:value="form.title"
        :schema="v$.title"
        label="Sarlavha"
      />
      <CInput
        v-model:value="form.description"
        :schema="v$.description"
        label="Matni"
        type="textarea"
      />
      <CDatepicker
        v-model:value="form.published_at"
        label="Sana"
        :schema="v$.published_at"
      />
      <FileShow
        v-if="uploadedFile"
        :data="{
          uploadPath: uploadedFile,
          extension: uploadedFile.split('.').pop(),
          name: uploadedFile,
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
