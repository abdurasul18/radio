<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { ISubcategory, SubcategoryService } from "/@src/services/subcategory";

let emits = defineEmits(["success", "close"]);
let props = defineProps<{
  item?: ISubcategory;
  mode: "create" | "update";
}>();

let form = ref({
  category: "car",
  name: "",
  name_uz: "",
  name_ru: "",
  name_en: "",
  order: 1,
  status: 1,
});

const rules = {
  category: { required },
  name: { required },
};

const v$ = useVuelidate(rules, form.value);

async function validate() {
  return await v$.value.$validate();
}

let loading = ref(false);

onMounted(() => {
  if (props.mode === "update" && props.item) {
    form.value.category = props.item.category || "car";
    form.value.name = props.item.name || "";
    form.value.name_uz = props.item.name_uz || "";
    form.value.name_ru = props.item.name_ru || "";
    form.value.name_en = props.item.name_en || "";
    form.value.order = props.item.order ?? 1;
    form.value.status = props.item.status ?? 1;
  }
});

let categoryOptions = [
  { id: "car", name: "Avtomobil" },
  { id: "real_estate", name: "Ko'chmas mulk" },
  { id: "job", name: "Ish o'rinlari" },
  { id: "service", name: "Xizmatlar" }
];

async function save() {
  if (await validate()) {
    if (loading.value) return;
    try {
      loading.value = true;
      let payload: any = {
        ...form.value,
      };

      if (props.mode === "update") {
        await SubcategoryService.update(props.item?.id!, payload);
      } else {
        await SubcategoryService.create(payload);
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
        v-model:value="form.category"
        :options="categoryOptions"
        :schema="v$.category"
        label="Asosiy Kategoriya"
      />
      <CInput
        icon="draft"
        v-model:value="form.name"
        :schema="v$.name"
        label="Nomi"
      />
      <CInput
        v-model:value="form.name_uz"
        label="Nomi (O'zbekcha)"
      />
      <CInput
        v-model:value="form.name_ru"
        label="Nomi (Ruscha)"
      />
      <CInput
        v-model:value="form.name_en"
        label="Nomi (Inglizcha)"
      />
      <CInput
        v-model:value="form.order"
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
