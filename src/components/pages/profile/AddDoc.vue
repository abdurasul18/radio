<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { TimeTableService } from "/@src/services/time-table";
import { toastSuccess } from "/@src/plugins/toast";
import { UserService } from "/@src/services/user";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{ id: string }>();
let form = ref({
  comment: "",
});
const rules = {
  comment: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let loading = ref(false);
async function save() {
  if (await validate()) {
    if (loading.value) return;
    try {
      loading.value = true;
      await UserService.addDocument({
        ...form.value,
        file: files.value?.[0],
      });
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
      <CInput v-model:value="form.comment" label="Izoh" type="textarea" />
      <DropFile v-model:value="files" :not-multiple="true" />
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
