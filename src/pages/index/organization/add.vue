<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { FileService } from "/@src/services/file";
import { OrganizationService } from "/@src/services/organization";
import { toastSuccess } from "/@src/plugins/toast";
import { IFile } from "/@src/services/types";
import { useApiService } from "/@src/composable/getList";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { CategoryService, ICategory } from "/@src/services/category";
import CTimepicker from "/@src/components/form/CTimepicker.vue";
import { ifNullDeleteIt } from "/@src/services/api";
const defaultContent = `<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`;

const route = useRoute();
const router = useRouter();
const { list: categories, fetchData: getCategories } = useApiServiceAll<ICategory>(
  CategoryService.getList
);
onMounted(getCategories);
let form = ref({
  name: "",
  description: "",
  phone_number: "",
  category_id: 1 as any,
  service_id:
    route.query.service_id && !isNaN(Number(route.query.service_id))
      ? Number(route.query.service_id)
      : null,
  region_id: "",
  status: 1 as 1 | 2,
  address: "",
  website: "",
  work_time_from: "",
  work_time_to: "",
  is_24_7: false,
  email: "",
  position: "",
  salary: "",
  salary_type: 1 as 1 | 2 | 3,
  contact_name: "",
  lat: null as number | null,
  lon: null as number | null,
});
const rules = {
  name: { required },
  service_id: { required },
  region_id: { required },
  phone_number: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  const result = await v$.value.$validate();
  if (!result) {
    const errorEl = document.querySelector(".text-error");
    if (errorEl) {
      errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  return result;
}
let loading = ref(false);
async function save() {
  if (!(await validate())) return;
  loading.value = true;
  try {
    let payload = {
      ...form.value,
      type: CATEGORY_TYPE.value,
      description: form.value.description.replaceAll(defaultContent, ""),
      work_time_from: form.value.work_time_from,
      work_time_to: form.value.work_time_to,
      email: form.value.email,
      position: form.value.position,
      salary: form.value.salary,
      contact_name: form.value.contact_name,
      lat: form.value.lat ? String(form.value.lat) : null,
      lon: form.value.lon ? String(form.value.lon) : null,
      file_ids: uploadedFiles.value.map((el) => el.id),
    };
    payload = ifNullDeleteIt(payload);
    if (files.value.length > 0) {
      let res = await FileService.upload(files.value);
      payload.file_ids = [...payload.file_ids, ...res.data.data.map((el: any) => el.id)];
    }

    if (route.query.id) {
      await OrganizationService.update(String(route.query.id), payload);
    } else {
      await OrganizationService.create(payload);
    }
    toastSuccess();
    router.back();
  } finally {
    loading.value = false;
  }
}
//
let uploadedFiles = ref<IFile[]>([]);
const editorRef = ref();
let keyIndex = ref(0);
onMounted(async () => {
  if (route.query.id) {
    let res = await OrganizationService.getById(String(route.query.id));
    form.value.name = res.data.data.name;
    form.value.description = res.data.data.description;
    form.value.service_id = res.data.data.service_id
      ? Number(res.data.data.service_id)
      : null;
    form.value.region_id = res.data.data.region_id;
    form.value.phone_number = res.data.data.phone_number;
    form.value.email = res.data.data.email;
    form.value.website = res.data.data.website;
    form.value.work_time_from = res.data.data.work_time_from;
    form.value.work_time_to = res.data.data.work_time_to;
    form.value.is_24_7 = res.data.data.is_24_7;
    form.value.contact_name = res.data.data.contact_name;
    form.value.position = res.data.data.position;
    form.value.salary = res.data.data.salary;
    form.value.salary_type = res.data.data.salary_type;
    form.value.category_id = res.data.data.category_id;
    form.value.address = res.data.data.address;
    form.value.lat = res.data.data.lat ? Number(res.data.data.lat) : null;
    form.value.lon = res.data.data.lon ? Number(res.data.data.lon) : null;
    uploadedFiles.value = res.data.data.files.map((el) => el.file);
    await nextTick();
    keyIndex.value += 1;
  }
});
const salaryTypes = [
  { id: 1, name: "Soatbay" },
  { id: 2, name: "Kunlik" },
  { id: 3, name: "Oylik" },
];

const CATEGORY_TYPE = computed(() => {
  return categories.value.find((el) => el.id === form.value.category_id)?.type!;
});
</script>
<template>
  <div class="grid gap-4">
    <AppTitle> Yangi xizmat qo'shish </AppTitle>
    <n-card class="base-card" :bordered="false">
      <div>
        <div class="title mb-4">Kategoriya</div>
        <n-radio-group
          class="c-radiogroup"
          v-model:value="form.category_id"
          name="radiobuttongroup2"
          size="large"
        >
          <n-radio-button v-for="item in categories" :key="item.id" :value="item.id">
            {{ item.name_uz }}
          </n-radio-button>
        </n-radio-group>
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="flex justify-between items-center">
        <div class="font-semibold text-lg">Holati</div>
       <SelectStatus class="w-[250px]" v-model:value="form.status" :schema="v$.status" />
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Umumiy ma'lumotlar</div>
      <div class="grid gap-4 grid-cols-2">
        <SelectService
          v-model:value="form.service_id"
          :schema="v$.service_id"
          :category_id="form.category_id"
        />
        <CInput v-model:value="form.name" :schema="v$.name" label="Nomi" icon="draft" />
        <CInput
          v-if="[5].includes(CATEGORY_TYPE)"
          v-model:value="form.position"
          :schema="v$.position"
          label="Lavozim"
          icon="user"
        />
        <CInput
          v-if="[2, 3, 4].includes(CATEGORY_TYPE)"
          v-model:value="form.address"
          :schema="v$.address"
          label="Manzil"
          icon="location"
        />
        <SelectRegion v-model:value="form.region_id" :schema="v$.region_id" />
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Kontakt</div>
      <div class="grid gap-4 grid-cols-2">
        <CInput
          v-if="[5].includes(CATEGORY_TYPE)"
          v-model:value="form.contact_name"
          :schema="v$.contact_name"
          label="Bog'lanish uchun shaxs"
          icon="user"
        />
        <CInput
          v-model:value="form.phone_number"
          :schema="v$.phone_number"
          label="Telefon raqam"
          icon="phone"
        />
        <CInput
          v-if="[2, 3, 5, 4].includes(CATEGORY_TYPE)"
          v-model:value="form.email"
          :schema="v$.email"
          label="Elektron pochta"
          icon="mail"
        />
        <CInput
          v-if="[3, 5].includes(CATEGORY_TYPE)"
          v-model:value="form.website"
          :schema="v$.website"
          label="Veb-sayt"
          icon="cube"
        />
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false" v-if="[2, 3, 4].includes(CATEGORY_TYPE)">
      <div class="mb-4 flex justify-between">
        <div class="title">Ish vaqti</div>
        <div class="font-semibold text-lg">
          <n-switch size="large" v-model:value="form.is_24_7" /> 24 soat
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <CTimepicker
          :disabled="form.is_24_7"
          v-model:value="form.work_time_from"
          label="dan"
        />
        <CTimepicker
          :disabled="form.is_24_7"
          v-model:value="form.work_time_to"
          label="gacha"
        />
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false" v-if="[5].includes(CATEGORY_TYPE)">
      <div class="mb-4 flex justify-between">
        <div class="title">Ish haqi (Maosh)</div>
        <div class="font-semibold text-lg"></div>
      </div>
      <div class="grid gap-4 grid-cols-2">
        <CInput
          icon="money"
          label="Maosh"
          v-model:value="form.salary"
          :schema="v$.salary"
        />
        <div class="mt-1">
          <n-radio-group
            class="c-radiogroup"
            v-model:value="form.salary_type"
            name="radioButtonSalary"
            size="large"
          >
            <n-radio-button v-for="item in salaryTypes" :key="item.id" :value="item.id">
              {{ item.name }}
            </n-radio-button>
          </n-radio-group>
        </div>
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Tavsif</div>
      <Editor ref="editorRef" v-model:value="form.description" :key="keyIndex" />
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-2">Fayllar</div>
      <DropFile v-model:value="files" label="Fayllar" icon="draft" />
      <FileShow
        v-for="value in uploadedFiles"
        :key="value.id"
        :data="value"
        @delete="uploadedFiles = uploadedFiles.filter((file) => file.id !== value.id)"
      />
    </n-card>

    <n-card
      class="base-card"
      :bordered="false"
      v-if="[2, 3, 4, 5].includes(CATEGORY_TYPE)"
    >
      <div class="title mb-4">Lokatsiya</div>
      <SelectLocation v-model:lat="form.lat" v-model:lon="form.lon" />
      <div class="grid grid-cols-2 gap-4 mt-4">
        <CInput v-model:value="form.lat" label="Kenglik" type="number" icon="hashtag" />
        <CInput v-model:value="form.lon" label="Uzunlik" type="number" icon="hashtag" />
      </div>
    </n-card>
    <div class="flex justify-end mt-8 gap-4">
      <CButton @click="$router.back()" type="default"> Bekor qilish </CButton>
      <CButton @click="save" type="primary" :loading="loading"> Saqlash </CButton>
    </div>
  </div>
</template>
<style lang="scss"></style>
