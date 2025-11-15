<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { FileService } from "/@src/services/file";
import { ITestCategory, TestCategoryService } from "/@src/services/test-category";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: ITestCategory;
  menu: any;
  mode: "create" | "update";
}>();
let form = ref({
  name: "",
});
const rules = {
  name: { required },
};
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
        menu: +props.menu,
      };
     
      if (props.mode === "update") {
        await TestCategoryService.update(props.item?.id!, payload);
      } else {
        await TestCategoryService.create(payload);
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
        :schema="v$.name"
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
