<script lang="ts" setup>
import { useModal } from "naive-ui";
import { useApiService } from "/@src/composable/getList";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { confirmDelete } from "/@src/composable/helpers";
import { IListing, ListingService } from "/@src/services/listing";
import { toastSuccess } from "/@src/plugins/toast";
import { CATEGORY_ENUM } from "/@src/services/category";
const modal = useModal();
const route = useRoute();
let category = ref(route.query.category ? String(route.query.category) : CATEGORY_ENUM[0].id);
let soldType = ref(String(route.query.sold_type || ''));
let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);

const SOLD_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Sold', value: 'sold' },
  { label: 'Active', value: 'not_sold' },
] as const;

let paramsAdd = computed(() => {
  const query: Record<string, any> = {
    category: category.value,
    offset: (page.value - 1) * limit.value,
    limit: limit.value,
    sold_type: soldType.value
  }
  return { query };
});
const { list, loading, search, fetchData, total } = useApiServiceAll<IListing>(
  ListingService.getList,
  paramsAdd
);
watch(
  () => [search.value, category.value, soldType.value],
  () => {
    page.value = 1;
  },
  { deep: true }
);
onMounted(() => {
  fetchData();
});
//
async function deleteItem(item: IListing) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await ListingService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>
<template>
  <div>
    <AppTitle> Servislar </AppTitle>
    <div class="-mt-2 mb-4">
      <n-tabs class="c-tabs w-full" type="segment" size="large" v-model:value="category">
        <n-tab v-for="item in CATEGORY_ENUM" :name="item.id" :tab="item.name" />
      </n-tabs>
    </div>
    <n-spin :show="loading" size="large">
      <div class="px-2 sm:px-9 flex flex-col gap-3 mb-4">
        <div class="flex flex-col-reverse sm:flex-row gap-4 items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex justify-between">
              <n-input v-model:value="search" clearable size="large" :placeholder="$t('actions.search')"
                class="search-input min-w-[400px]">
                <template #prefix>
                  <CIcon name="search" class="mr-4" />
                </template>
              </n-input>
            </div>
          </div>
          <div class="flex gap-2">
            <CButton icon="plus" @click="$router.push(`/listings/add?category=${category}`)">
              {{ $t("actions.add") }}
            </CButton>
          </div>
        </div>

        <!-- Sold type filter -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 font-medium whitespace-nowrap">Sale status:</span>
          <div class="flex gap-1.5">
            <button v-for="opt in SOLD_TYPE_OPTIONS" :key="String(opt.value)" @click="soldType = opt.value" :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
              soldType === opt.value
                ? opt.value === 'sold'
                  ? 'bg-red-500 text-white border-red-500 shadow-sm'
                  : opt.value === 'not_sold'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-gray-800 text-white border-gray-800 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
            ]">
              <span v-if="opt.value === 'sold'" class="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span v-else-if="opt.value === 'not_sold'"
                class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="pt-3">
        <TransitionGroup name="list" tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            class="w-full max-w-sm bg-white rounded-[28px] shadow-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300"
            v-for="item in list" :key="item.id" @click="$router.push(`/listings/view/${item.id}`)">
            <div class="relative h-48">
              <n-carousel show-arrow draggable :slides-per-view="1" class="h-48">
                <img v-for="img in item.images" :src="`${img.file.base_url}/${img.file.path}`"
                  class="w-full h-full object-cover" />
              </n-carousel>

              <!-- Sold overlay -->
              <div v-if="item.sold_at !== null && item.sold_at !== undefined"
                class="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                <div
                  class="bg-red-500/90 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg tracking-wide rotate-[-8deg] border-2 border-white/50">
                  ✓ SOLD
                </div>
              </div>

              <n-tag
                :type="item.moderation_status == 'rejected' ? 'error' : item.moderation_status == 'approved' ? 'success' : 'default'"
                round size="small" class="absolute top-3 left-3 shadow-sm bg-white z-20">
                {{ item.moderation_status }}
              </n-tag>

              <!-- Rating badge -->
              <div
                class="absolute top-3 right-3 flex items-center gap-1 bg-white/95 text-gray-900 text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm z-20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  viewBox="0 0 24 24" stroke="none">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{{ item.rating }}</span>
              </div>
            </div>
            <!-- Content -->
            <div class="px-4 pt-3 pb-4">
              <h3 class="text-base font-bold text-gray-900">{{ item.title }}</h3>

              <div class="flex items-center gap-1.5 mt-1.5 text-gray-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span class="truncate">{{ item.region.name }}{{ item.address }}</span>
              </div>

              <div class="border-t border-dashed border-gray-200 my-3"></div>

              <!-- Sold / Active badge -->
              <div class="flex items-center gap-2 mb-2">
                <template v-if="item.sold_at !== null && item.sold_at !== undefined">
                  <span
                    class="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Sold
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ new Date(item.sold_at).toLocaleDateString('uz-UZ', {
                      day: '2-digit', month: '2-digit', year:
                        'numeric'
                    }) }}
                  </span>
                </template>
                <template v-else>
                  <span
                    class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active
                  </span>
                </template>
              </div>

              <div class="flex items-center justify-between">
                <span class="bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  {{ item.type }}
                </span>

                <div class="flex items-center gap-1 text-gray-400 text-sm">
                  <CIconButton icon="delete" type="error" @click.stop="deleteItem(item)" />
                  <CIconButton icon="edit"
                    @click.stop="$router.push(`/listings/add?id=${item.id}&category=${item.category}`)" />
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
        <AppNotFound v-if="!list.length" />
        <div class="mt-5 ml-4 mb-5">
          <n-pagination class="c-pagination" :page-count="Math.ceil(total / limit)" :page-size="limit"
            v-model:page="page" />
        </div>
      </div>
    </n-spin>
  </div>
</template>
<style lang="scss"></style>
