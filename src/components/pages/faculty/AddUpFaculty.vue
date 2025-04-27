<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ILocaleText } from "/@src/services/lang";
import { toCyrill, toLatin } from "/@src/locales/translate";
import { FacultyService, IFaculty } from "/@src/services/faculty";
import { toastSuccess } from "/@src/plugins/toast";
let emits = defineEmits(["success", "close"]);
let props = withDefaults(
  defineProps<{
    item?: IFaculty;
    mode: "create" | "update";
  }>(),
  {
    mode: "create",
  }
);
onMounted(() => {
  if (props.mode == "update") {
    form.value.title = props.item?.title || "";
    form.value.status = props.item?.status || (1 as any);
  }
});
let form = ref({
  title: "",
  status: 1 as 1 | 0,
});
const rules = {
  title: { required },
  status: { required },
};
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
      if (props.mode == "create") {
        await FacultyService.create(form.value);
      } else {
        await FacultyService.update(props.item?.id!, form.value);
      }
      emits("success")
      toastSuccess()
    } finally {
      loading.value = false;
    }
  }
}
//
let status = [
  {
    name: "Active",
    id: 1,
  },
  {
    name: "Inactive",
    id: 0,
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
        label="Fakultet nomi"
        type="textarea"
      />
      <CSelect
        v-model:value="form.status"
        label="Holati"
        :options="status"
        :schema="v$.status"
        icon="info"
      />
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
