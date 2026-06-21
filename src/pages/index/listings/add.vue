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
const TypesEnum: {
  id: string;
  name: string;
  categories: CategoryCode[];
}[] = [
    //  Type must be one of: sale, rent, restaurant, home_food, grocery, car_wash, tire_shop, repair_shop
    { id: "sale", name: "Sale", categories: ['real_estate', 'car', 'truck'] },
    { id: "rent", name: "Rent", categories: ['real_estate', 'car', 'truck'] },
    { id: "restaurant", name: "Restaurant", categories: ['halal_food'] },
    { id: "home_food", name: "Home Food", categories: ['halal_food'] },
    { id: "grocery", name: "Grocery", categories: ['halal_food'] },
    { id: "car_wash", name: "Car Wash", categories: ['auto_service'] },
    { id: "tire_shop", name: "Tire Shop", categories: ['auto_service'] },
    { id: "repair_shop", name: "Repair Shop", categories: ['auto_service'] },
  ];
const TypesEnumFiltered = computed(() => {
  return TypesEnum.filter((item) => item.categories.includes(category.value))
})
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
  description: "",
  phone: "",
  address: "",
  price: "",
  currency: "USD",
  region_id: "",
  lat: null as number | null,
  lon: null as number | null,
  make_id: null as string | null,
  model_id: null as string | null,
  year: null as string | null,
  mileage: null as string | null,
  sub_category_id: null as string | null,
  //
  property_type: null as string | null,
  bedrooms_count: null as string | null,
  bathrooms_count: null as string | null,
  area: null as string | null,
  floor: null as string | null,
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
let isStopWatching = ref(false);
onMounted(async () => {
  if (route.query.id) {
    isStopWatching.value = true;

    let res = await ListingService.getById(String(route.query.id));
    form.value.title = res.data.data.title;
    form.value.description = res.data.data.description;
    form.value.type = res.data.data.type;
    form.value.price = res.data.data.price;
    form.value.currency = res.data.data.currency;

    form.value.sub_category_id = res.data.data.sub_category_id;

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
    // 
    if (res.data.data.details) {
      form.value.make_id = res.data.data.details.make_id;
      form.value.model_id = res.data.data.details.model_id;
      form.value.year = String(res.data.data.details.year ?? "");
      form.value.mileage = res.data.data.details.mileage;
      form.value.property_type = res.data.data.details.property_type;
      form.value.bedrooms_count = res.data.data.details.bedrooms_count;
      form.value.bathrooms_count = res.data.data.details.bathrooms_count;
      form.value.area = res.data.data.details.area;
      form.value.floor = res.data.data.details.floor;
    }
    // 
    uploadedFiles.value = res.data.data.images.map((el) => el.file);
    createdUser.value = res.data.data.user;
    await nextTick();
    keyIndex.value += 1;
    isStopWatching.value = false
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
watch(() => form.value.make_id, (value) => {
  if (value && !isStopWatching.value) {
    form.value.model_id = null;
  }
})
</script>
<template>
  <n-spin :show="loading">
    <div class="flex items-center gap-4 mb-4">
      <AppTitle style="margin-bottom: 0;">
        <CIconButton icon="right" style="transform: rotate(180deg);" @click="$router.back()" />
        {{ $route.query.id ? "Servisni tahrirlash" : "Yangi servis qo'shish" }} |
        {{ category }}
      </AppTitle>
    </div>
    <!-- Creator Info -->
    <n-card class="base-card mb-2" title="Yaratuvchi" :segmented="{ content: true }" v-if="createdUser">
      <div class="flex items-center gap-3">
        <n-avatar round :size="54" :src="$withBaseUrl2(createdUser.avatar)" class="border border-grey-100 shadow-sm" />
        <div class="overflow-hidden">
          <div class="font-bold text-base text-grey-800 truncate">
            {{ createdUser.first_name }} {{ createdUser.last_name }}
          </div>
          <a :href="`tel:${createdUser.phone}`"
            class="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-semibold mt-1">
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
            <CSelect label="Type" icon="category" v-model:value="form.type" :options="TypesEnumFiltered"
              :schema="v$.type" />
            <SelectSubCategory v-if="['auto_service', 'car', 'truck', 'real_estate'].includes(category)" :key="category"
              :category="category" label="Category of product" v-model:value="form.sub_category_id"
              :schema="v$.sub_category_id" />
            <CSelect v-if="isVisible(['real_estate'])" icon="category" label="Property Type"
              v-model:value="form.property_type" :schema="v$.property_type" :options="PropertyTypesEnum" />
            <SelectMake v-if="isVisible(['car', 'truck'])" label="Make" v-model:value="form.make_id"
              :schema="v$.make_id" />
            <SelectCarModel v-if="isVisible(['car', 'truck'])" label="Model" v-model:value="form.model_id"
              :schema="v$.model_id" :make_id="form.make_id" />
            <CYearPicker v-if="isVisible(['car', 'truck', 'real_estate'])" v-model:value="form.year"
              label="Year of manufacture" :schema="v$.year" />
            <CInput type="number" v-if="isVisible(['car', 'truck'])" v-model:value="form.mileage" :schema="v$.mileage"
              label="Mileage" icon="hashtag">
              <template #suffix>
                <span class="text-grey-500 text-sm">km</span>
              </template>
            </CInput>
            <div class="flex items-center gap-1" v-if="isVisible(['car', 'truck', 'real_estate'])">
              <CInput type="number" class="flex-1" v-model:value="form.price" :schema="v$.price" label="Price"
                icon="money" />

              <select v-model="form.currency" class="c-select-grey">
                <option value="USD">USD</option>
                <option value="UZS">UZS</option>
              </select>
            </div>
            <CInput icon="draft" class="col-span-full" v-model:value="form.title" :schema="v$.title" label="Title" />

            <CInput class="col-span-full" v-model:value="form.description" :schema="v$.description" label="Description"
              type="textarea" />
            <CSelect v-if="isVisible(['real_estate'])" icon="category" v-model:value="form.bedrooms_count"
              :schema="v$.bedrooms_count" label="Bedrooms Count" :options="countOptions" />
            <CSelect v-if="isVisible(['real_estate'])" icon="category" v-model:value="form.bathrooms_count"
              :schema="v$.bathrooms_count" label="Bathrooms" :options="countOptions" />
            <CInput v-if="isVisible(['real_estate'])" type="number" icon="hashtag" label="Area"
              v-model:value="form.area" :schema="v$.area" />

            <SelectRegion label="Region" v-model:value="form.region_id" :schema="v$.region_id" />
            <CInput icon="location" label="Address" v-model:value="form.address" :schema="v$.address" />
          </div>
        </n-card>

        <!-- Contact Info -->
        <n-card class="base-card">
          <div class="title mb-4">Kontakt ma'lumotlari</div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
            <CInput v-model:value="form.phone" :schema="v$.phone" label="Phone number" icon="phone" />
            <CInput v-model:value="form.email" :schema="v$.email" label="Email (Optional)" icon="mail" />
            <CInput v-model:value="form.website" :schema="v$.website" label="Website (Optional)" icon="info" />
          </div>
        </n-card>

        <!-- Salary (if applicable) -->
        <n-card class="base-card" v-slot:header-extra>
          <div class="title mb-4">Ish haqi (Maosh)</div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 items-center">
            <CInput icon="money" label="Narxi" v-model:value="form.price" :schema="v$.price" />
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
            <FileShow v-for="value in uploadedFiles" :key="value.id" :data="value" @delete="
              uploadedFiles = uploadedFiles.filter((file) => file.id !== value.id)
              " />
          </div>
        </n-card>

        <!-- Location (Map) -->
        <n-card class="base-card">
          <div class="title mb-3">Geolokatsiya (Xarita)</div>
          <div class="rounded-xl overflow-hidden border border-grey-100">
            <SelectLocation v-model:lat="form.lat" v-model:lon="form.lon" />
          </div>
          <div class="grid grid-cols-2 gap-3 mt-4">
            <CInput v-model:value="form.lat" label="Kenglik (Lat)" type="number" icon="hashtag" />
            <CInput v-model:value="form.lon" label="Uzunlik (Lon)" type="number" icon="hashtag" />
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
