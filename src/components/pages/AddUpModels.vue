<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { IModel, ModelsService } from "/@src/services/models";
import { MakesService, IMake } from "/@src/services/makes";

let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: IModel;
  mode: "create" | "update";
}>();

let form = ref({
  make_id: null as number | null,
  name: "",
  sort: 0,
  status: 1,
});

const rules = {
  name: { required },
  make_id: { required },
};

const v$ = useVuelidate(rules, form.value);

async function validate() {
  return await v$.value.$validate();
}

let loading = ref(false);
let makesList = ref<IMake[]>([]);
let makesLoading = ref(false);

onMounted(async () => {
  if (props.mode === "update" && props.item) {
    form.value.name = props.item.name || "";
    form.value.sort = props.item.sort ?? 0;
    form.value.status = props.item.status ?? 1;
    form.value.make_id = props.item.make_id ?? null;
  }
  
  try {
    makesLoading.value = true;
    const res = await MakesService.getList({ limit: 100 } as any);
    makesList.value = res.data?.data || [];
  } finally {
    makesLoading.value = false;
  }
});

async function save() {
  if (await validate()) {
    if (loading.value) return;
    try {
      loading.value = true;
      let payload: any = {
        ...form.value,
      };

      if (props.mode === "update") {
        await ModelsService.update(props.item?.id!, payload);
      } else {
        await ModelsService.create(payload);
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
      <CSelect
        v-model:value="form.make_id"
        :options="makesList"
        :loading="makesLoading"
        :schema="v$.make_id"
        label="Marka"
      />
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
