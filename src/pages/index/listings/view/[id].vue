<script lang="ts" setup>
import { IListing, ListingService } from "/@src/services/listing";
import { IUserListItem } from "/@src/services/user";
import ListingComment from "/@src/components/pages/ListingComment.vue";
import { useClipboard } from "@vueuse/core";
import { toastSuccess } from "/@src/plugins/toast";
import { CategoryCode } from "/@src/services/category";

const route = useRoute();
const routeId = computed(() => {
  return route.params.id ? String(route.params.id) : "";
});

let loading = ref(false);
let data = ref<IListing>();
const createdUser = ref<IUserListItem | null>(null);

const { copy, copied } = useClipboard();

function copyAddress() {
  if (data.value?.address) {
    copy(data.value.address);
    toastSuccess();
  }
}

/** add.vue dagi isVisible() funksiyasiga mos */
function isVisible(categories: CategoryCode[]) {
  return categories.includes((data.value?.category ?? "") as CategoryCode);
}

async function getData() {
  try {
    loading.value = true;
    let res = await ListingService.getById(routeId.value);
    data.value = res.data.data;
    createdUser.value = res.data.data.user;
  } finally {
    loading.value = false;
  }
}

onMounted(getData);
</script>

<template>
  <n-spin :show="loading">
    <div class="flex items-center gap-4 mb-4">
      <AppTitle class="!mb-0" style="margin-bottom: 0;">
        <CIconButton icon="right" style="transform: rotate(180deg);" @click="$router.back()" />
        {{ data?.title || 'E`lon' }}
      </AppTitle>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 relative pb-20">
      <!-- Left Main Column -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <n-card class="base-card overflow-hidden !p-0" :bordered="false">
          <!-- Carousel Cover -->
          <div v-if="data?.images?.length" class="relative cursor-default overflow-hidden">
            <n-carousel show-arrow draggable slides-per-view="1" class="h-[250px] md:h-[400px]">
              <n-image v-for="(item, index) in data.images" :key="index" class="w-full h-full object-cover"
                :src="$withBaseUrl(item.file?.path)" />
            </n-carousel>

            <!-- Sold overlay on image -->
            <div v-if="data?.sold_at !== null && data?.sold_at !== undefined"
              class="absolute inset-0 bg-black/45 backdrop-blur-[1.5px] flex items-center justify-center z-10 pointer-events-none">
              <div class="flex flex-col items-center gap-2">
                <div class="bg-red-500/95 text-white font-bold text-lg px-6 py-2 rounded-full shadow-xl tracking-widest rotate-[-6deg] border-2 border-white/60">
                  ✓ SOLD
                </div>
                <div class="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                  {{ data.sold_at ? new Date(data.sold_at).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '' }}
                </div>
              </div>
            </div>

            <div class="absolute top-4 right-4 z-20">
              <n-tag
                :type="data.moderation_status == 'rejected' ? 'error' : data.moderation_status == 'approved' ? 'success' : 'default'"
                round size="small" class="shadow-sm bg-white">
                {{ data.moderation_status }}
              </n-tag>
            </div>
          </div>

          <div class="p-4 md:p-6 grid gap-4">
            <!-- Badges: Rating, Views -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-yellow-500 font-bold">
                ★ <span class="text-gray-800 text-sm ml-1">{{ data?.rating || '0' }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-gray-400 text-sm">
                <CIcon name="eye" class="w-4 h-4" />
                <span>{{ data?.views_count || '0' }}</span>
              </div>
            </div>

            <!-- Title -->
            <div v-if="data?.title" class="font-bold text-2xl text-grey-900 leading-tight">
              {{ data.title }}
            </div>

            <!-- Category & Type -->
            <div class="flex flex-wrap items-center gap-2">
              <n-tag v-if="data?.category" type="info" size="small" round>
                {{ data.category }}
              </n-tag>
              <n-tag v-if="data?.type" type="success" size="small" round>
                {{ data.type }}
              </n-tag>
              <n-tag v-if="data?.status" size="small" round>
                status: {{ data.status }}
              </n-tag>

              <!-- Sold / Active badge (inline with tags) -->
              <span v-if="data?.sold_at !== null && data?.sold_at !== undefined"
                class="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                SOLD
              </span>
              <span v-else
                class="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            <!-- Sub Category -->
            <div v-if="data?.sub_category"
              class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 flex-shrink-0">
                <CIcon class="success-svg" width="20" name="category" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-grey-800">{{ (data.sub_category as any)?.name_uz ??
                  data.sub_category }}</span>
                <span class="text-xs text-grey-400 font-medium">Turkum</span>
              </div>
            </div>

            <!-- Address -->
            <div v-if="data?.address" class="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <CIcon name="location" class="w-4 h-4" />
              <span>{{ data.address }}</span>
              <button @click="copyAddress" class="ml-2 hover:text-blue-500 transition-colors">
                <CIcon name="copy" class="w-4 h-4" />
              </button>
            </div>

            <!-- Region -->
            <div v-if="data?.region" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                <CIcon class="info-svg" width="20" name="location" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-grey-800">{{ data.region?.name }}</span>
                <span class="text-xs text-grey-400 font-medium">Viloyat / Hudud</span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="data?.description" class="mt-2 text-sm text-gray-600 leading-relaxed">
              <div v-html="data.description"></div>
            </div>

            <n-divider class="!my-2" />

            <!-- ===== Details Grid ===== -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Price (real_estate | car | truck) -->
              <div v-if="isVisible(['real_estate', 'car', 'truck']) && data?.price"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 flex-shrink-0">
                  <CIcon class="success-svg" width="20" name="money" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">
                    {{ data.price }} {{ data.currency }}
                  </span>
                  <span class="text-xs text-grey-400 font-medium">Narx</span>
                </div>
              </div>

              <!-- Make (car | truck) -->
              <div v-if="isVisible(['car', 'truck']) && data?.details?.make_id"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="cube" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.make?.name || data.details.make_name
                  }}</span>
                  <span class="text-xs text-grey-400 font-medium">Marka (Make)</span>
                </div>
              </div>

              <!-- Model (car | truck) -->
              <div v-if="isVisible(['car', 'truck']) && data?.details?.model_id"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="cube" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.model?.name ||
                    data.details.model_name
                    }}</span>
                  <span class="text-xs text-grey-400 font-medium">Model</span>
                </div>
              </div>

              <!-- Year (car | truck | real_estate) -->
              <div v-if="isVisible(['car', 'truck', 'real_estate']) && data?.details?.year"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex-shrink-0">
                  <CIcon class="warning-svg" width="20" name="clock" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.year }}</span>
                  <span class="text-xs text-grey-400 font-medium">Yil</span>
                </div>
              </div>

              <!-- Mileage (car | truck) -->
              <div v-if="isVisible(['car', 'truck']) && data?.details?.mileage"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex-shrink-0">
                  <CIcon class="warning-svg" width="20" name="hashtag" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.mileage }} km</span>
                  <span class="text-xs text-grey-400 font-medium">Millage</span>
                </div>
              </div>

              <!-- Property Type (real_estate) -->
              <div v-if="isVisible(['real_estate']) && data?.details?.property_type"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 flex-shrink-0">
                  <CIcon class="success-svg" width="20" name="category" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.property_type }}</span>
                  <span class="text-xs text-grey-400 font-medium">Mulk turi</span>
                </div>
              </div>

              <!-- Bedrooms Count (real_estate) -->
              <div v-if="isVisible(['real_estate']) && data?.details?.bedrooms_count"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex-shrink-0">
                  <CIcon class="primary-svg" width="20" name="hashtag" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.bedrooms_count }}</span>
                  <span class="text-xs text-grey-400 font-medium">Yotoqxonalar soni</span>
                </div>
              </div>

              <!-- Bathrooms Count (real_estate) -->
              <div v-if="isVisible(['real_estate']) && data?.details?.bathrooms_count"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex-shrink-0">
                  <CIcon class="primary-svg" width="20" name="hashtag" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.bathrooms_count }}</span>
                  <span class="text-xs text-grey-400 font-medium">Hammomlar soni</span>
                </div>
              </div>

              <!-- Area (real_estate) -->
              <div v-if="isVisible(['real_estate']) && data?.details?.area"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex-shrink-0">
                  <CIcon class="primary-svg" width="20" name="hashtag" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.area }} m²</span>
                  <span class="text-xs text-grey-400 font-medium">Maydon</span>
                </div>
              </div>

              <!-- Floor (real_estate) -->
              <div v-if="isVisible(['real_estate']) && data?.details?.floor"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex-shrink-0">
                  <CIcon class="primary-svg" width="20" name="hashtag" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.details.floor }}</span>
                  <span class="text-xs text-grey-400 font-medium">Qavat</span>
                </div>
              </div>

              <!-- Phone (all categories) -->
              <div v-if="data?.phone"
                class="flex items-center justify-between p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 flex-shrink-0">
                    <CIcon class="success-svg" width="20" name="phone" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.phone }}</span>
                    <span class="text-xs text-grey-400 font-medium">Telefon raqami</span>
                  </div>
                </div>
                <a :href="`tel:${data.phone}`"
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500">
                  <CIcon class="info-svg" width="16" name="copy" />
                </a>
              </div>

              <!-- Email (all categories) -->
              <div v-if="data?.email" class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                  <CIcon class="info-svg" width="20" name="mail" />
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-sm font-semibold text-grey-800 truncate">{{ data.email }}</span>
                  <span class="text-xs text-grey-400 font-medium">Email</span>
                </div>
              </div>

              <!-- Website (all categories) -->
              <div v-if="data?.website"
                class="flex items-center justify-between p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 flex-shrink-0">
                    <CIcon class="error-svg" width="20" name="cube" />
                  </div>
                  <div class="flex flex-col overflow-hidden">
                    <span class="text-sm font-semibold text-grey-800 truncate">{{ data.website }}</span>
                    <span class="text-xs text-grey-400 font-medium">Vebsayt</span>
                  </div>
                </div>
                <a :href="data.website" target="_blank"
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500">
                  <CIcon class="info-svg" width="16" name="info" />
                </a>
              </div>

              <!-- Work time (all categories) -->
              <div v-if="data?.is_24_7 || data?.work_time_from || data?.work_time_to"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex-shrink-0">
                  <CIcon class="warning-svg" width="20" name="clock" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">
                    <span v-if="data?.is_24_7">Ochiq - 24/7</span>
                    <span v-else>Ochiq - {{ data.work_time_from ?? "" }} – {{ data.work_time_to ?? "" }}</span>
                  </span>
                  <span class="text-xs text-grey-400 font-medium">Ish vaqti</span>
                </div>
              </div>

            </div>
            <!-- end Details Grid -->

            <!-- Map -->
            <div v-if="data?.lat && data?.lon" class="mt-4 relative">
              <div class="rounded-xl overflow-hidden border border-grey-100 h-[200px]">
                <SelectLocation :lat="Number(data.lat) || null" :lon="Number(data.lon) || null" :view-mode="true" />
              </div>
              <a :href="`https://maps.google.com/?q=${data.lat},${data.lon}`" target="_blank"
                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center py-2.5 rounded-lg text-sm font-medium shadow-md transition-colors">
                <CIcon name="location" class="w-4 h-4 mr-2" /> Open in Maps
              </a>
            </div>

            <!-- Extra details fields (condition, fuel, transmission, etc.) -->
            <template v-if="data?.details">
              <n-divider class="!my-2" />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- Condition -->
                <div v-if="data.details.condition"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 flex-shrink-0">
                    <CIcon class="success-svg" width="20" name="star" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.condition }}</span>
                    <span class="text-xs text-grey-400 font-medium">Holat</span>
                  </div>
                </div>

                <!-- Engine Volume -->
                <div v-if="data.details.engine_volume"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex-shrink-0">
                    <CIcon class="warning-svg" width="20" name="hashtag" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.engine_volume }} L</span>
                    <span class="text-xs text-grey-400 font-medium">Dvigatel hajmi</span>
                  </div>
                </div>

                <!-- Fuel Type -->
                <div v-if="data.details.fuel_type"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex-shrink-0">
                    <CIcon class="warning-svg" width="20" name="hashtag" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.fuel_type }}</span>
                    <span class="text-xs text-grey-400 font-medium">Yoqilg'i turi</span>
                  </div>
                </div>

                <!-- Transmission -->
                <div v-if="data.details.transmission"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                    <CIcon class="info-svg" width="20" name="category" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.transmission }}</span>
                    <span class="text-xs text-grey-400 font-medium">Transmissiya</span>
                  </div>
                </div>

                <!-- Floors Count -->
                <div v-if="data.details.floors_count"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex-shrink-0">
                    <CIcon class="primary-svg" width="20" name="hashtag" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.floors_count }}</span>
                    <span class="text-xs text-grey-400 font-medium">Qavatlar soni</span>
                  </div>
                </div>

                <!-- Lot Area -->
                <div v-if="data.details.lot_area"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex-shrink-0">
                    <CIcon class="primary-svg" width="20" name="hashtag" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.lot_area }} m²</span>
                    <span class="text-xs text-grey-400 font-medium">Er maydoni</span>
                  </div>
                </div>


                <!-- Heating Type -->
                <div v-if="data.details.heating_type"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 flex-shrink-0">
                    <CIcon class="error-svg" width="20" name="hashtag" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.heating_type }}</span>
                    <span class="text-xs text-grey-400 font-medium">Isitish turi</span>
                  </div>
                </div>

                <!-- Parking Spaces -->
                <div v-if="data.details.parking_spaces"
                  class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                    <CIcon class="info-svg" width="20" name="hashtag" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-grey-800">{{ data.details.parking_spaces }}</span>
                    <span class="text-xs text-grey-400 font-medium">Parking joylari</span>
                  </div>
                </div>

              </div>
            </template>

          </div>
        </n-card>
      </div>

      <!-- Right Sidebar Column -->
      <div class="flex flex-col gap-6">
        <!-- User Profile Card -->
        <n-card class="base-card" :bordered="false" v-if="createdUser">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <n-avatar round :size="50" :src="$withBaseUrl2(createdUser.avatar)"
                class="border border-grey-100 shadow-sm" />
              <div class="overflow-hidden">
                <div class="font-bold text-sm text-grey-900 truncate">
                  {{ createdUser.first_name }} {{ createdUser.last_name }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ data?.created_at ? new Date(data.created_at).toLocaleString('uz-UZ', {
                    day: '2-digit', month:
                      '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : '' }}
                </div>
              </div>
            </div>
            <button class="text-gray-400 hover:text-gray-600 p-2">
              <CIcon name="more" width="20" />
            </button>
          </div>
        </n-card>

        <!-- Meta Info Card -->
        <n-card class="base-card" :bordered="false">
          <div class="title mb-3 text-base font-bold">Meta ma'lumotlar</div>
          <div class="flex flex-col gap-2 text-sm">
            <div v-if="data?.id" class="flex justify-between">
              <span class="text-grey-400">ID</span>
              <span class="font-semibold text-grey-800 truncate ml-2">{{ data.id }}</span>
            </div>
            <div v-if="data?.user_id" class="flex justify-between">
              <span class="text-grey-400">User ID</span>
              <span class="font-semibold text-grey-800 truncate ml-2">{{ data.user_id }}</span>
            </div>
            <div v-if="data?.region_id" class="flex justify-between">
              <span class="text-grey-400">Region ID</span>
              <span class="font-semibold text-grey-800 truncate ml-2">{{ data.region_id }}</span>
            </div>
            <div v-if="data?.sub_category_id" class="flex justify-between">
              <span class="text-grey-400">Sub Category ID</span>
              <span class="font-semibold text-grey-800 truncate ml-2">{{ data.sub_category_id }}</span>
            </div>
            <div v-if="data?.moderation_status" class="flex justify-between">
              <span class="text-grey-400">Moderation</span>
              <n-tag
                :type="data.moderation_status == 'rejected' ? 'error' : data.moderation_status == 'approved' ? 'success' : 'default'"
                round size="small">
                {{ data.moderation_status }}
              </n-tag>
            </div>
            <div v-if="data?.rejection_reason" class="flex justify-between">
              <span class="text-grey-400">Rad etish sababi</span>
              <span class="font-semibold text-red-500 truncate ml-2">{{ data.rejection_reason }}</span>
            </div>

            <!-- Sold status in meta card -->
            <div class="flex justify-between items-center pt-1 border-t border-dashed border-gray-100">
              <span class="text-grey-400">Status</span>
              <template v-if="data?.sold_at !== null && data?.sold_at !== undefined">
                <span class="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Sold
                </span>
              </template>
              <template v-else>
                <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </template>
            </div>
            <div v-if="data?.sold_at" class="flex justify-between">
              <span class="text-grey-400">Sold at</span>
              <span class="font-semibold text-red-500 ml-2 text-xs">
                {{ new Date(data.sold_at).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
            <div v-if="data?.created_at" class="flex justify-between">
              <span class="text-grey-400">Yaratilgan</span>
              <span class="font-semibold text-grey-800 ml-2">
                {{ new Date(data.created_at).toLocaleDateString('uz-UZ') }}
              </span>
            </div>
            <div v-if="data?.updated_at" class="flex justify-between">
              <span class="text-grey-400">Yangilangan</span>
              <span class="font-semibold text-grey-800 ml-2">
                {{ new Date(data.updated_at).toLocaleDateString('uz-UZ') }}
              </span>
            </div>
            <div v-if="data?.deleted_at" class="flex justify-between">
              <span class="text-grey-400">O'chirilgan</span>
              <span class="font-semibold text-red-500 ml-2">{{ data.deleted_at }}</span>
            </div>
          </div>
        </n-card>

        <!-- Comments Card -->
        <n-card class="base-card" :bordered="false">
          <div class="title mb-1 text-xl font-bold">Sharhlar</div>

          <!-- Rating Summary -->
          <div class="flex items-center gap-4 mb-4 py-4 border-b border-gray-100">
            <div class="text-3xl font-bold text-gray-900">{{ data?.rating || '0.0' }}</div>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-gray-800">Umumiy</div>
              <div class="flex items-center gap-1 text-yellow-500 mt-1">
                ★★★★★ <span class="text-gray-400 text-xs ml-1">{{ data?.reviews_count || '0' }} sharhlar</span>
              </div>
            </div>
          </div>

          <ListingComment :listing_id="routeId" />
        </n-card>
      </div>
    </div>

    <!-- Fixed Call Action (Mobile style) -->
    <div v-if="data?.phone"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <a :href="`tel:${data.phone}`"
        class="w-full bg-green-500 hover:bg-green-600 text-white flex justify-center items-center py-3 rounded-xl font-bold text-base transition-colors">
        <CIcon name="phone" class="w-5 h-5 mr-2" /> Qong'iroq qilish
      </a>
    </div>
  </n-spin>
</template>

<style lang="scss"></style>
