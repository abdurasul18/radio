<script lang="ts" setup>
import { IOrganization, OrganizationService } from "/@src/services/organization";
import { IUser, IUserListItem } from "/@src/services/user";
let route = useRoute();
let routeId = computed(() => {
  return route.params.id ? String(route.params.id) : "";
});
let loading = ref(false);
let data = ref<IOrganization>();
  const createdUser = ref<IUserListItem | null>(null);
async function getData() {
  try {
    loading.value = true;
    let res = await OrganizationService.getById(routeId.value);
    data.value = res.data.data;
     createdUser.value = res.data.data.user;
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
    <div class="flex items-center justify-between mb-4 gap-4">
      <AppTitle> {{ data?.name || 'Tashkilot' }} </AppTitle>
      <CButton type="default" size="medium" @click="$router.back()">Orqaga</CButton>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Main Column -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <n-card class="base-card overflow-hidden">
          <!-- Carousel Cover -->
          <template #cover>
            <div v-if="data?.files?.length" class="relative cursor-default overflow-hidden" @click.stop>
              <n-carousel show-arrow draggable slides-per-view="1" class="h-[400px]">
                <n-image
                  v-for="(file, fileIndex) in data.files"
                  :key="fileIndex"
                  class="w-full h-[400px] n-img-cover"
                  :src="$withBaseUrl(file.file?.path)"
                />
              </n-carousel>
              <div class="absolute top-4 right-4 z-10" v-if="data?.status">
                <StatusTag :status="data.status" class="shadow-md" />
              </div>
            </div>
          </template>

          <div class="grid gap-4 mt-2">
            <!-- Name -->
            <div v-if="data?.name" class="font-bold text-2xl text-grey-900 leading-tight">
              {{ data.name }}
            </div>

            <n-divider v-if="data?.name" class="!my-2" />

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Phone -->
              <div v-if="data?.phone_number" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="phone" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-grey-400 font-medium">Telefon</span>
                  <span class="text-sm font-semibold text-grey-800">{{ data.phone_number }}</span>
                </div>
              </div>

              <!-- Email -->
              <div v-if="data?.email" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="mail" />
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-xs text-grey-400 font-medium">Email</span>
                  <a :href="`mailto:${data.email}`" class="text-sm font-semibold text-blue-600 hover:underline truncate">
                    {{ data.email }}
                  </a>
                </div>
              </div>

              <!-- Website -->
              <div v-if="data?.website" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="cube" />
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-xs text-grey-400 font-medium">Vebsayt</span>
                  <a :href="data.website" target="_blank" class="text-sm font-semibold text-blue-600 hover:underline truncate">
                    {{ data.website }}
                  </a>
                </div>
              </div>

              <!-- Contact name -->
              <div v-if="data?.contact_name" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="user" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-grey-400 font-medium">Aloqa shaxsi</span>
                  <span class="text-sm font-semibold text-grey-800">{{ data.contact_name }}</span>
                </div>
              </div>

              <!-- Service -->
              <div v-if="data?.service?.name_uz" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="category" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-grey-400 font-medium">Xizmat turi</span>
                  <span class="text-sm font-semibold text-grey-800">{{ data.service.name_uz }}</span>
                </div>
              </div>

              <!-- Position -->
              <div v-if="data?.position" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="user" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-grey-400 font-medium">Lavozim</span>
                  <span class="text-sm font-semibold text-grey-800">{{ data.position }}</span>
                </div>
              </div>

              <!-- Salary -->
              <div v-if="data?.salary" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="money" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-grey-400 font-medium">Maosh</span>
                  <span class="text-sm font-semibold text-grey-800">
                    {{ data.salary }}
                    <span class="text-xs font-normal text-grey-500" v-if="data.salary_type">
                      ({{ salaryTypes.find((t) => t.id === data?.salary_type)?.name }})
                    </span>
                  </span>
                </div>
              </div>

              <!-- Work time -->
              <div v-if="data?.is_24_7 || data?.work_time_from || data?.work_time_to" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="clock" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-grey-400 font-medium">Ish vaqti</span>
                  <span class="text-sm font-semibold text-grey-800">
                    <span v-if="data?.is_24_7" class="text-green-600 font-bold">24/7 (Kechayu-kunduz)</span>
                    <span v-else>{{ data.work_time_from ?? "—" }} – {{ data.work_time_to ?? "—" }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Address (Full Width) -->
            <div v-if="data?.address" class="flex items-start gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100 w-full">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                <CIcon class="info-svg" width="20" name="location" />
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-grey-400 font-medium">Manzil</span>
                <span class="text-sm font-semibold text-grey-800 leading-tight">{{ data.address }}</span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="data?.description" class="mt-4">
              <div class="text-sm text-grey-400 font-semibold mb-2 uppercase tracking-wider">Tavsif</div>
              <div class="prose prose-sm max-w-none p-4 rounded-xl bg-grey-50 border border-grey-100 text-grey-700" v-html="data.description" />
            </div>

            <!-- Map -->
            <div v-if="data?.lat || data?.lon" class="mt-4">
              <div class="text-sm text-grey-400 font-semibold mb-2 uppercase tracking-wider">Joylashuv (Xaritada)</div>
              <div class="rounded-xl overflow-hidden border border-grey-100">
                <SelectLocation
                  :lat="Number(data.lat) || null"
                  :lon="Number(data.lon) || null"
                  :view-mode="true"
                />
              </div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Right Sidebar Column -->
      <div class="flex flex-col gap-6">
        <!-- User Profile Card -->
        <n-card class="base-card" title="Tashkilotchi" :segmented="{ content: true }" v-if="createdUser">
          <div class="flex items-center gap-3">
            <n-avatar round :size="54" :src="$withBaseUrl2(createdUser.avatar)" class="border border-grey-100 shadow-sm" />
            <div class="overflow-hidden">
              <div class="font-bold text-base text-grey-800 truncate">
                {{ createdUser.first_name }} {{ createdUser.last_name }}
              </div>
              <a :href="`tel:${createdUser.phone}`" class="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-semibold mt-1">
                <CIcon class="info-svg" width="14" name="phone" />
                <span>{{ createdUser.phone }}</span>
              </a>
            </div>
          </div>
        </n-card>

        <!-- Comments Card -->
        <n-card class="base-card">
          <div class="title mb-3">Izohlar</div>
          <n-divider class="!my-2" />
          <ProductComment :product_id="routeId" />
        </n-card>
      </div>
    </div>
  </n-spin>
</template>

<style lang="scss"></style>
