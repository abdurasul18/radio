<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { UserService, IPersonalTask } from "/@src/services/user";
let emits = defineEmits(["success", "close"]);
let props = withDefaults(
  defineProps<{
    item?: IPersonalTask;
    mode: "create" | "update";
    userId?: string;
  }>(),
  {
    mode: "create",
  }
);
onMounted(() => {
  if (props.mode == "update") {
    form.value.task_id = props.item?.task.id || "";
    form.value.deadline = props.item?.deadline || "";
    form.value.year_id = props.item?.academicYear.id || "";
  }
});
let form = ref({
  task_id: "",
  deadline: "",
  year_id: "",
});
const rules = {
  task_id: { required },
  deadline: { required },
  year_id: { required },
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
        await UserService.addTask(props.userId!, form.value);
      } else {
        await UserService.updateTask(props.userId!, props.item?.id!, form.value);
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
      <SelectTask v-model:value="form.task_id" label="Topshiriq" icon="category" />
      <SelectEduYear v-model:value="form.year_id" label="O'quv yili" icon="category" />
      <CDatepicker v-model:value="form.deadline" :schema="v$.deadline" label="Deadline" />
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
