<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
import { IRegion, RegionService } from "/@src/services/region";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IRegion;
  mode: "create" | "update";
}>();
let form = ref({
  name: "",
});
const rules = {
  name: { required },
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
      };
      if (props.mode === "update") {
        await RegionService.update(props.item?.id!, payload);
      } else {
        await RegionService.create(payload);
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
        v-model:value="form.name"
        :schema="v$.title"
        label="Nomi"
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
