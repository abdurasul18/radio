<script lang="ts" setup>
import { IListing, ListingService } from "/@src/services/listing";
import { IUserListItem } from "/@src/services/user";
import ListingComment from "/@src/components/pages/ListingComment.vue";
import { useClipboard } from "@vueuse/core";
import { toastSuccess } from "/@src/plugins/toast";

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
            <div class="absolute top-4 left-4 z-10 hidden md:block">
              <!-- optional back button inside image for mobile, but we have it in header -->
            </div>
            <div class="absolute top-4 right-4 z-10">
              <CTag :type="data.moderation_status == 'approved' ? 'success' : 'warning'" round size="small">
                {{ data.moderation_status }}
              </CTag>
            </div>
          </div>

          <div class="p-4 md:p-6 grid gap-4">
            <!-- Badges: Rating, Views -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-yellow-500 font-bold">
                <CIcon name="star" class="w-4 h-4" /> <!-- Assuming star exists, or use star char -->
                ★ <span class="text-gray-800 text-sm ml-1">{{ data?.rating || '0' }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-gray-400 text-sm">
                <CIcon name="eye" class="w-4 h-4" />
                <span>{{ data?.views_count || '0' }}</span>
              </div>
            </div>

            <!-- Name -->
            <div v-if="data?.title" class="font-bold text-2xl text-grey-900 leading-tight">
              {{ data.title }}
            </div>

            <!-- Address -->
            <div v-if="data?.address" class="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <CIcon name="location" class="w-4 h-4" />
              <span>{{ data.address }}</span>
              <button @click="copyAddress" class="ml-2 hover:text-blue-500 transition-colors">
                <CIcon name="copy" class="w-4 h-4" />
              </button>
            </div>

            <!-- Description -->
            <div v-if="data?.description" class="mt-2 text-sm text-gray-600 leading-relaxed">
              <div v-html="data.description"></div>
            </div>

            <n-divider class="!my-2" />

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Sub category / Type of business -->
              <div v-if="data?.sub_category"
                class="flex items-center gap-3 p-3 rounded-xl bg-grey-50 border border-grey-100">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 flex-shrink-0">
                  <CIcon class="success-svg" width="20" name="category" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-grey-800">{{ data.sub_category.name_uz }}</span>
                  <span class="text-xs text-grey-400 font-medium">Turkum</span>
                </div>
              </div>

              <!-- Phone -->
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

              <!-- Work time -->
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

              <!-- Website -->
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
            </div>

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

<style lang="scss">
// Make sure base-card has no border or shadow inside this page if we want flat design,
// but the project seems to use .base-card for standard cards.
</style>
