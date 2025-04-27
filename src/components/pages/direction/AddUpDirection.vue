<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { DirectionService, IDirection } from "/@src/services/direction";
import { toastSuccess } from "/@src/plugins/toast";
let emits = defineEmits(["success", "close"]);
let props = withDefaults(
  defineProps<{
    item?: IDirection;
    mode: "create" | "update";
  }>(),
  {
    mode: "create",
  }
);
onMounted(() => {
  if (props.mode == "update") {
    form.value.name = props.item?.name || "";
    form.value.status = props.item?.status || (1 as any);
    form.value.faculty_id = props.item?.faculty_id || "";
  }
});
let form = ref({
  name: "",
  status: 1 as 1 | 0,
  faculty_id: "",
});
const rules = {
  name: { required },
  status: { required },
  faculty_id: { required },
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
        await DirectionService.create(form.value);
      } else {
        await DirectionService.update(props.item?.id!, form.value);
      }
      emits("success");
      toastSuccess();
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
        v-model:value="form.name"
        :schema="v$.name"
        label="Kafedra nomi"
        type="textarea"
      />
      <SelectFaulcty
        icon="department"
        v-model:value="form.faculty_id"
        label="Fakultet"
        :schema="v$.faculty_id"
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
