<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { IContact, ContactService } from "/@src/services/contact";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IContact;
  mode: "create" | "update";
  type:any
}>();
let form = ref({
  title: "",
  description: "",
  key: "",
  type: 100,
});
const rules = {
  title: { required },
  description: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.title = props.item?.title || "";
    form.value.description = props.item?.description || "";
    form.value.key = props.item?.key || "";
    form.value.type = props.item?.type || 100;
    uploadedFile.value = props.item?.icon;
  }
  else {
    form.value.type = Number(props.type) || 100;
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
        icon: files.value?.[0] || null,
      };
      if (uploadedFile.value) {
        delete payload.icon;
      }
      if (props.mode === "update") {
        await ContactService.update(props.item?.id!, payload);
      } else {
        await ContactService.create(payload);
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
let types = [
  {
    name: "Kontakt",
    id: 100,
  },
  {
    name: "About",
    id: 200,
  },
];
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
       <CSelect
        v-model:value="form.type"
        :options="types"
        icon="category"
        label="Turini tanlang"
        :schema="v$.type"
      />
      <CInput
        v-model:value="form.description"
        :schema="v$.description"
        label="Qiymati"
        icon="draft"
        :type="form.type === 100 ? 'input' : 'textarea'"
      />
      <CInput
        icon="hashtag"
        v-model:value="form.key"
        :schema="v$.key"
        label="Kalit so'z"
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
