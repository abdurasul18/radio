<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { FileService } from "/@src/services/file";
import { toastSuccess } from "/@src/plugins/toast";
import { IFile } from "/@src/services/types";
import { ifNullDeleteIt } from "/@src/services/api";
import { IUser, IUserListItem } from "/@src/services/user";
import { ListingService } from "/@src/services/listing";
import { CategoryCode } from "/@src/services/category";
const defaultContent = `<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`;

const route = useRoute();
const category = computed(() => {
  return (route.query.category ? String(route.query.category) : "") as CategoryCode;
});
const router = useRouter();
const TypesEnum = [
  {
    id: "sale",
    name: "Sale",
  },
  {
    id: "rent",
    name: "Rent",
  },
];
const PropertyTypesEnum = [
  // house, apartment, townhome, villa, village_house
  { id: 'house', name: "House" },
  { id: 'apartment', name: "Apartment" },
  { id: 'townhome', name: "Townhome" },
  { id: 'villa', name: "Villa" },
  { id: 'village_house', name: "Village House" },
];
let form = ref({
  type: "",
  title: "",
  phone: "",
  address: "",
  price: "",
  currency: "USD",
  region_id: "",
  lat: null as number | null,
  lon: null as number | null,
  make_id: null as number | null,
  model_id: null as number | null,
  year: null as number | null,
  mileage: null as number | null,
  sub_category_id: null as number | null,
  //
  property_type: null as string | null,
  bedrooms_count: null as number | null,
  bathrooms_count: null as number | null,
  area: null as number | null,
  floor: null as number | null,
  //
  website: "",
  work_time_from: "",
  work_time_to: "",
  is_24_7: false,
  email: "",
});
const rules = {
  title: {},
  phone: {},
  region_id: {},
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
      price: form.value.price ? Number(form.value.price) : null,
      year: form.value.year ? Number(form.value.year) : null,
      mileage: form.value.mileage ? Number(form.value.mileage) : null,
      area: form.value.area ? Number(form.value.area) : null,
      category: category.value,
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
      await ListingService.update(String(route.query.id), payload);
    } else {
      await ListingService.create(payload);
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
const createdUser = ref<IUserListItem | null>(null);
onMounted(async () => {
  if (route.query.id) {
    let res = await ListingService.getById(String(route.query.id));
    form.value.description = res.data.data.description;
    form.value.title = res.data.data.title;
    form.value.type = res.data.data.type;
    form.value.price = res.data.data.price;
    form.value.currency = res.data.data.currency;
    form.value.make_id = res.data.data.make_id;
    form.value.model_id = res.data.data.model_id;
    form.value.year = res.data.data.year;
    form.value.mileage = res.data.data.mileage;
    form.value.sub_category_id = res.data.data.sub_category_id;
    form.value.property_type = res.data.data.property_type;
    form.value.bedrooms_count = res.data.data.bedrooms_count;
    form.value.bathrooms_count = res.data.data.bathrooms_count;
    form.value.area = res.data.data.area;
    form.value.floor = res.data.data.floor;
    form.value.address = res.data.data.address;
    form.value.lat = res.data.data.lat ? Number(res.data.data.lat) : null;
    form.value.lon = res.data.data.lon ? Number(res.data.data.lon) : null;
    form.value.region_id = res.data.data.region_id;
    form.value.phone = res.data.data.phone;
    form.value.email = res.data.data.email;
    form.value.website = res.data.data.website;
    form.value.work_time_from = res.data.data.work_time_from;
    form.value.work_time_to = res.data.data.work_time_to;
    form.value.is_24_7 = res.data.data.is_24_7;
    form.value.address = res.data.data.address;
    form.value.lat = res.data.data.lat ? Number(res.data.data.lat) : null;
    form.value.lon = res.data.data.lon ? Number(res.data.data.lon) : null;
    form.value.status = res.data.data.status;
    uploadedFiles.value = res.data.data.images.map((el) => el.file);
    createdUser.value = res.data.data.user;
    await nextTick();
    keyIndex.value += 1;
  }
});
const salaryTypes = [
  { id: 1, name: "Soatbay" },
  { id: 2, name: "Kunlik" },
  { id: 3, name: "Oylik" },
];
function isVisible(categoires: CategoryCode[]) {
  return categoires.includes(category.value as CategoryCode);
}
const countOptions = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5+" },
];
</script>
<template>
  <n-spin :show="loading">
    <div class="flex items-center justify-between gap-4">
      <AppTitle>
          {{ $route.query.id ? "Servisni tahrirlash" : "Yangi servis qo'shish" }} |
        {{ category }}
      </AppTitle>
    </div>
    <!-- Creator Info -->
    <n-card
      class="base-card mb-2"
      title="Yaratuvchi"
      :segmented="{ content: true }"
      v-if="createdUser"
    >
      <div class="flex items-center gap-3">
        <n-avatar
          round
          :size="54"
          :src="$withBaseUrl2(createdUser.avatar)"
          class="border border-grey-100 shadow-sm"
        />
        <div class="overflow-hidden">
          <div class="font-bold text-base text-grey-800 truncate">
            {{ createdUser.first_name }} {{ createdUser.last_name }}
          </div>
          <a
            :href="`tel:${createdUser.phone}`"
            class="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-semibold mt-1"
          >
            <CIcon class="info-svg" width="14" name="phone" />
            <span>{{ createdUser.phone }}</span>
          </a>
        </div>
      </div>
    </n-card>

    <div class="grid grid-cols-1 gap-6">
      <!-- Main Content Column -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- General Info -->
        <n-card class="base-card">
          <div class="title mb-4">Umumiy ma'lumotlar</div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
            <CSelect
              v-if="isVisible(['car', 'truck', 'real_estate'])"
              icon="category"
              v-model:value="form.type"
              :options="TypesEnum"
              label="Purpose of ads"
              :schema="v$.type"
            />
            <SelectSubCategory
              :key="category"
              :category="category"
              label="Type of product"
              v-model:value="form.sub_category_id"
              :schema="v$.sub_category_id"
            />
              <CSelect
              v-if="isVisible(['real_estate'])"
              icon="category"
              label="Property Type"
              v-model:value="form.property_type"
              :schema="v$.property_type"
              :options="PropertyTypesEnum"
            />
            <SelectMake
              v-if="isVisible(['car', 'truck'])"
              label="Make"
              v-model:value="form.make_id"
              :schema="v$.make_id"
            />
            <SelectCarModel
              v-if="isVisible(['car', 'truck'])"
              label="Model"
              v-model:value="form.model_id"
              :schema="v$.model_id"
            />
            <CYearPicker
              v-if="isVisible(['car', 'truck'])"
              v-model:value="form.year"
              label="Year of manufacture"
              :schema="v$.year"
            />
            <CInput
              type="number"
              v-if="isVisible(['car', 'truck'])"
              v-model:value="form.mileage"
              :schema="v$.mileage"
              label="Mileage"
              icon="hashtag"
            >
              <template #suffix>
                <span class="text-grey-500 text-sm">km</span>
              </template>
            </CInput>
            <div
              class="flex items-center gap-1"
              v-if="isVisible(['car', 'truck', 'real_estate'])"
            >
              <CInput
                type="number"
                class="flex-1"
                v-model:value="form.price"
                :schema="v$.price"
                label="Price"
                icon="money"
              />

              <select v-model="form.currency" class="c-select-grey">
                <option value="USD">USD</option>
                <option value="UZS">UZS</option>
              </select>
            </div>
           
            <CInput
              class="col-span-full"
              v-model:value="form.title"
              :schema="v$.title"
              label="Description"
              type="textarea"
            />
            <CSelect
              v-if="isVisible(['real_estate'])"
              icon="category"
              v-model:value="form.bedrooms_count"
              :schema="v$.bedrooms_count"
              label="Bedrooms Count"
              :options="countOptions"
            />
            <CSelect
              v-if="isVisible(['real_estate'])"
              icon="category"
              v-model:value="form.bathrooms_count"
              :schema="v$.bathrooms_count"
              label="Bathrooms"
              :options="countOptions"
            />
            <CInput
              v-if="isVisible(['real_estate'])"
              type="number"
              icon="hashtag"
              label="Area"
              v-model:value="form.area"
              :schema="v$.area"
            />
          
            <SelectRegion
              label="Region"
              v-model:value="form.region_id"
              :schema="v$.region_id"
            />
            <CInput
              icon="location"
              label="Address"
              v-model:value="form.address"
              :schema="v$.address"
            />
          </div>
        </n-card>

        <!-- Contact Info -->
        <n-card class="base-card">
          <div class="title mb-4">Kontakt ma'lumotlari</div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
            <CInput
              v-model:value="form.phone"
              :schema="v$.phone"
              label="Phone number"
              icon="phone"
            />
            <CInput
              v-model:value="form.email"
              :schema="v$.email"
              label="Email (Optional)"
              icon="mail"
            />
            <CInput
              v-model:value="form.website"
              :schema="v$.website"
              label="Website (Optional)"
              icon="info"
            />
          </div>
        </n-card>

        <!-- Salary (if applicable) -->
        <n-card class="base-card" v-slot:header-extra>
          <div class="title mb-4">Ish haqi (Maosh)</div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 items-center">
            <CInput
              icon="money"
              label="Narxi"
              v-model:value="form.price"
              :schema="v$.price"
            />
          </div>
        </n-card>
      </div>

      <!-- Right Sidebar Column -->
      <div class="flex flex-col gap-6">
        <!-- Files Upload -->
        <n-card class="base-card">
          <div class="title mb-3">Fayllar</div>
          <DropFile v-model:value="files" label="Rasmlar yoki hujjatlar" icon="draft" />
          <div class="mt-4 flex flex-col gap-2">
            <FileShow
              v-for="value in uploadedFiles"
              :key="value.id"
              :data="value"
              @delete="
                uploadedFiles = uploadedFiles.filter((file) => file.id !== value.id)
              "
            />
          </div>
        </n-card>

        <!-- Location (Map) -->
        <n-card class="base-card">
          <div class="title mb-3">Geolokatsiya (Xarita)</div>
          <div class="rounded-xl overflow-hidden border border-grey-100">
            <SelectLocation v-model:lat="form.lat" v-model:lon="form.lon" />
          </div>
          <div class="grid grid-cols-2 gap-3 mt-4">
            <CInput
              v-model:value="form.lat"
              label="Kenglik (Lat)"
              type="number"
              icon="hashtag"
            />
            <CInput
              v-model:value="form.lon"
              label="Uzunlik (Lon)"
              type="number"
              icon="hashtag"
            />
          </div>
        </n-card>
      </div>
    </div>

    <!-- Action buttons at the bottom -->
    <div class="flex justify-end gap-3 mt-6 border-t border-grey-100 pt-6">
      <CButton @click="$router.back()" type="default"> Bekor qilish </CButton>
      <CButton @click="save" type="primary" :loading="loading"> Saqlash </CButton>
    </div>
  </n-spin>
</template>
<style lang="scss"></style>
