<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { IMake, MakesService } from "/@src/services/makes";
import { FileService } from "/@src/services/file";

let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IMake;
  mode: "create" | "update";
}>();

let form = ref({
  name: "",
  sort: 0,
  status: 1,
});

const rules = {
  name: { required },
};

const v$ = useVuelidate(rules, form.value);

async function validate() {
  return await v$.value.$validate();
}

let files = ref<File[]>([]);
let uploadedImage = ref();
let loading = ref(false);

onMounted(() => {
  if (props.mode === "update" && props.item) {
    form.value.name = props.item.name || "";
    form.value.sort = props.item.sort ?? 0;
    form.value.status = props.item.status ?? 1;
    uploadedImage.value = props.item.image;
  }
});

async function save() {
  if (await validate()) {
    if (loading.value) return;
    try {
      loading.value = true;
      let payload: any = {
        ...form.value,
        image_id: uploadedImage.value?.id || null,
      };

      if (files.value?.[0]) {
        payload.image_id = (await FileService.upload(files.value)).data?.data?.[0]?.id;
      }

      if (props.mode === "update") {
        await MakesService.update(props.item?.id!, payload);
      } else {
        await MakesService.create(payload);
      }
      
      emits("success");
      toastSuccess();
    } finally {
      loading.value = false;
    }
  }
}
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
      <CInput
        v-model:value="form.sort"
        label="Tartib raqami"
        type="number"
      />
      <CSelect
        v-model:value="form.status"
        label="Status"
        :options="[
          { name: 'Faol', id: 1 },
          { name: 'Nofaol', id: 0 },
        ]"
      />

      <!-- Image upload -->
      <div>
        <div class="mb-1 text-sm font-medium opacity-70">Rasm</div>
        <FileShow
          v-if="uploadedImage"
          :data="uploadedImage"
          @delete="uploadedImage = null"
        />
        <DropFile v-else v-model:value="files" :not-multiple="true" />
      </div>
    </div>

    <div class="mt-5">
      <div class="flex justify-end">
        <CButton type="default" @click="emits('close')">
          {{ $t("actions.close") }}
        </CButton>
        <CButton @click="save" :loading="loading" class="ml-4">
          {{ $t("actions.save") }}
        </CButton>
      </div>
    </div>
  </div>
</template>
