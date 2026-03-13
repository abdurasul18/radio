<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { INotification, NotificationService } from "/@src/services/notification";
import { dateToYMD, dmyToYMD } from "/@src/utils/date";
import { IVersion, VersionService } from "/@src/services/version";
let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IVersion;
  mode: "create" | "update";
}>();
let form = ref({
  platform: "android",
  version: "",
  build_number: "",
  force_update: false,
  message: "",
  url: "",
});
const rules = {
  platform: {},
  version: {},
  build_number: {},
  force_update: {},
  message: {},
  url: {},
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let uploadedFile = ref();
onMounted(() => {
  if (props.mode === "update") {
    form.value.platform = props.item?.platform || "";
    form.value.version = props.item?.version || "";
    form.value.build_number = props.item?.build_number.toString() || "";
    form.value.force_update = props.item?.force_update || false;
    form.value.message = props.item?.message || "";
    form.value.url = props.item?.url || "";
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
        build_number: Number(form.value.build_number),
      };
      if (props.mode === "update") {
        await VersionService.update(props.item?.id!, payload);
      } else {
        await VersionService.create(payload);
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
      <n-radio-group
        class="c-radiogroup"
        v-model:value="form.platform"
        name="platform"
        size="large"
      >
        <n-radio-button value="android"> Android </n-radio-button>
        <n-radio-button value="ios"> IOS </n-radio-button>
      </n-radio-group>
      <CInput
        icon="draft"
        v-model:value="form.version"
        :schema="v$.version"
        label="Version"
      />
      <CInput
        icon="draft"
        v-model:value="form.build_number"
        :schema="v$.build_number"
        label="Build number"
      />

      <CInput
        icon="draft"
        v-model:value="form.message"
        :schema="v$.message"
        label="Message"
      />
      <CInput icon="draft" v-model:value="form.url" :schema="v$.url" label="Url" />
      <div class="flex items-center gap-2">
        <n-switch v-model:value="form.force_update" />
        <span>Force update</span>
      </div>
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
