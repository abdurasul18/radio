<script lang="ts" setup>
import { IOrganization, OrganizationService } from "/@src/services/organization";

let route = useRoute();
let routeId = computed(() => {
  return route.params.id ? String(route.params.id) : "";
});
let loading = ref(false);
let data = ref<IOrganization>();
async function getData() {
  try {
    loading.value = true;
    let res = await OrganizationService.getById(routeId.value);
    data.value = res.data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(getData);
// 
const salaryTypes = [
  { id: 1, name: "Soatbay" },
  { id: 2, name: "Kunlik" },
  { id: 3, name: "Oylik" },
];

</script>

<template>
  <n-spin :show="loading">
    <AppTitle> {{ data?.name }} </AppTitle>
    <CButton type="default" @click="$router.back()">Orqaga</CButton>

    <div class="grid grid-cols-3 mt-4 gap-4">
      <n-card class="base-card col-span-2">
        <!-- Carousel -->
        <template #cover>
          <div v-if="data?.files?.length" class="cursor-default" @click.stop>
            <n-carousel show-arrow draggable slides-per-view="1" :space-between="10">
              <n-image
                v-for="(file, fileIndex) in data.files"
                :key="fileIndex"
                class="w-full h-[400px] n-img-cover rounded-2xl overflow-hidden"
                :src="$withBaseUrl(file.file?.path)"
              />
            </n-carousel>
          </div>
        </template>

        <div class="grid gap-3">
          <!-- Name -->
          <div v-if="data?.name" class="font-bold text-lg leading-5">
            {{ data.name }}
          </div>

          <n-divider v-if="data?.name" class="!my-1" />

          <!-- Phone -->
          <div v-if="data?.phone_number" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="phone" />
            <span class="text-gray-500 font-medium">Telefon:</span>
            <span>{{ data.phone_number }}</span>
          </div>

          <!-- Email -->
          <div v-if="data?.email" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="mail" />
            <span class="text-gray-500 font-medium">Email:</span>
            <a :href="`mailto:${data.email}`" class="text-blue-600 hover:underline">
              {{ data.email }}
            </a>
          </div>

          <!-- Website -->
          <div v-if="data?.website" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="cube" />
            <span class="text-gray-500 font-medium">Vebsayt:</span>
            <a
              :href="data.website"
              target="_blank"
              class="text-blue-600 hover:underline truncate"
            >
              {{ data.website }}
            </a>
          </div>

          <!-- Address -->
          <div v-if="data?.address" class="flex items-start gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0 mt-0.5" width="20" name="location" />
            <span class="text-gray-500 font-medium">Manzil:</span>
            <span>{{ data.address }}</span>
          </div>

          <!-- Contact name -->
          <div v-if="data?.contact_name" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="user" />
            <span class="text-gray-500 font-medium">Aloqa shaxsi:</span>
            <span>{{ data.contact_name }}</span>
          </div>

          <!-- Service -->
          <div v-if="data?.service?.name_uz" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="category" />
            <span class="text-gray-500 font-medium">Xizmat:</span>
            <span>{{ data.service.name_uz }}</span>
          </div>

          <!-- Position -->
          <div v-if="data?.position" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="user" />
            <span class="text-gray-500 font-medium">Lavozim:</span>
            <span>{{ data.position }}</span>
          </div>

          <!-- Salary -->
          <div v-if="data?.salary" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="money" />
            <span class="text-gray-500 font-medium">Maosh:</span>
            <span>
              {{ data.salary }}
              <span v-if="data.salary_type"> ({{ salaryTypes.find((t) => t.id === data?.salary_type)?.name }})</span>
            </span>
          </div>

          <!-- Work time -->
          <div v-if="data?.is_24_7" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="clock" />
            <span class="text-gray-500 font-medium">Ish vaqti:</span>
            <span class="text-green-600 font-semibold">24/7</span>
          </div>
          <div
            v-else-if="data?.work_time_from || data?.work_time_to"
            class="flex items-center gap-2 text-sm"
          >
            <CIcon class="info-svg flex-shrink-0" width="20" name="clock" />
            <span class="text-gray-500 font-medium">Ish vaqti:</span>
            <span>
              {{ data.work_time_from ?? "—" }} – {{ data.work_time_to ?? "—" }}
            </span>
          </div>

          <!-- Status -->
          <div v-if="data?.status" class="flex items-center gap-2 text-sm">
            <CIcon class="info-svg flex-shrink-0" width="20" name="info" />
            <span class="text-gray-500 font-medium">Holat:</span>
            <StatusTag :status="data.status" />
          </div>

          <n-divider v-if="data?.description" class="!my-1" />

          <!-- Description -->
          <div v-if="data?.description" class="text-sm">
            <div class="text-gray-500 font-medium mb-1">Tavsif:</div>
            <div class="prose prose-sm max-w-none" v-html="data.description" />
          </div>

          <!-- Map -->
          <div v-if="data?.lat || data?.lon">
            <n-divider class="!my-1" />
            <div class="text-gray-500 font-medium text-sm mb-2">Joylashuv:</div>
            <SelectLocation
              :lat="Number(data.lat) || null"
              :lon="Number(data.lon) || null"
              :view-mode="true"
            />
          </div>
        </div>
      </n-card>
      <n-card class="base-card h-max">
        <div class="title">Izohlar</div>
        <n-divider />
        <ProductComment :product_id="routeId" />
      </n-card>
    </div>
  </n-spin>
</template>

<style lang="scss"></style>
