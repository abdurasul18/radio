<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { TaskService, ITask } from "/@src/services/task";
import { toastSuccess } from "/@src/plugins/toast";
let emits = defineEmits(["success", "close"]);
let props = withDefaults(
  defineProps<{
    item?: ITask;
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
    form.value.volume = props.item?.volume || "";
    form.value.criterion_id = props.item?.criterion.id || "";
    form.value.degreeIds = [];
  }
});
let form = ref({
  title: "",
  status: 1 as 1 | 0,
  volume: "",
  criterion_id: "",
  degreeIds: [],
});
const rules = {
  title: { required },
  status: { required },
  volume: { required },
  criterion_id: { required },
  degreeIds: { required },
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
        await TaskService.create(form.value);
      } else {
        await TaskService.update(props.item?.id!, form.value);
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
        v-model:value="form.title"
        :schema="v$.title"
        label="Nomi"
        type="textarea"
      />
      <SelectCriterion
        v-model:value="form.criterion_id"
        label="Me'zoni"
        icon="category"
      />
      <SelectDegree
        v-model:value="form.degreeIds"
        multiple
        label="Darajalar"
        icon="category"
      />
      <CInput
        icon="hashtag"
        v-model:value="form.volume"
        :schema="v$.volume"
        label="Miqdori"
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
