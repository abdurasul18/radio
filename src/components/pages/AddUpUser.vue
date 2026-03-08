<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { IUserListItem, UserService } from "/@src/services/user";
import { FileService } from "/@src/services/file";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IUserListItem;
  mode: "create" | "update";
}>();
let form = ref({
  first_name: "",
  last_name: "",
});
const rules = {
  first_name: { required },
  last_name: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.first_name = props.item?.first_name || "";
    form.value.last_name = props.item?.last_name || "";
    uploadedFile.value = props.item?.avatar;
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
        avatar_id: uploadedFile.value ? props.item?.avatar?.id || null : null,
      };
      if (files.value.length) {
        let res = await FileService.upload(files.value);
        payload.avatar_id = res.data.data?.[0]?.id || null;
      }
      if (props.mode === "update") {
        await UserService.update(props.item?.id!, payload);
      } else {
        await UserService.create(payload);
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
        icon="user"
        v-model:value="form.last_name"
        :schema="v$.last_name"
        label="Familiya"
      />
      <CInput
        icon="user"
        v-model:value="form.first_name"
        :schema="v$.first_name"
        label="Ism"
      />
      <FileShow v-if="uploadedFile" :data="uploadedFile" @delete="uploadedFile = null" />
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
