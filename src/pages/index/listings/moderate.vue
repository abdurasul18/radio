<script lang="ts" setup>
import { useModal } from "naive-ui";
import { useApiService } from "/@src/composable/getList";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { confirmAction, confirmDelete } from "/@src/composable/helpers";
import { IListing, ListingService } from "/@src/services/listing";
import { toastSuccess } from "/@src/plugins/toast";
import { CATEGORY_ENUM } from "/@src/services/category";
const modal = useModal();
const route = useRoute();
let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);
let paramsAdd = computed(() => {
  return {
    query: {
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
    },
  };
});
const { list, loading, search, fetchData, total } = useApiServiceAll<IListing>(
  ListingService.getListAll,
  paramsAdd
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
const acceptLoading = ref(false);
const rejectLoading = ref(false);
const currentItem = ref<IListing | null>(null);
const rejectReason = ref("");
const rejectShow = ref(false);
async function rejectItem() {
  try {
    rejectLoading.value = true;
    let res = await ListingService.reject(currentItem.value!.id!, {
      reason: rejectReason.value,
      status: "rejected",
    });
    toastSuccess();
    fetchData();
    rejectReason.value = "";
    rejectShow.value = false;
  } finally {
    rejectLoading.value = false;
  }
}
async function acceptItem(item: IListing) {
  currentItem.value = item;
  acceptLoading.value = true;
  try {
    const isAccepted = await confirmAction(modal, "Qabul qilasizmi?");
    if (!isAccepted) return;
    await ListingService.approve(item.id!);
    toastSuccess();
    fetchData();
  } catch (error) {
    console.error(error);
  } finally {
    acceptLoading.value = false;
  }
}
</script>
<template>
  <div>
    <AppTitle> Moderatsiya </AppTitle>
    <n-spin :show="loading" size="large">
      <div
        class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
      >
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="flex justify-between">
            <n-input
              v-model:value="search"
              clearable
              size="large"
              :placeholder="$t('actions.search')"
              class="search-input min-w-[400px]"
            >
              <template #prefix>
                <CIcon name="search" class="mr-4" />
              </template>
            </n-input>
          </div>
        </div>
      </div>
      <div class="pt-3">
        <TransitionGroup
          name="list"
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            class="w-full max-w-sm bg-white rounded-[28px] shadow-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300"
            v-for="item in list"
            :key="item.id"
            @click="$router.push(`/listings/view/${item.id}`)"
          >
            <div class="relative h-48">
              <n-carousel show-arrow draggable :slides-per-view="1" class="h-48">
                <img
                  v-for="img in item.images"
                  :src="`${img.file.base_url}/${img.file.path}`"
                  class="w-full h-full object-cover"
                />
              </n-carousel>

              <n-tag round size="small" class="absolute top-3 left-3 shadow-sm">
                {{ item.moderation_status }}
              </n-tag>

              <!-- Rating badge -->
              <div
                class="absolute top-3 right-3 flex items-center gap-1 bg-white/95 text-gray-900 text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                <span>{{ item.rating }}</span>
              </div>
            </div>
            <!-- Content -->
            <div class="px-4 pt-3 pb-4">
              <h3 class="text-base font-bold text-gray-900">{{ item.title }}</h3>

              <div class="flex items-center gap-1.5 mt-1.5 text-gray-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span class="truncate">{{ item.region.name }}{{ item.address }}</span>
              </div>

              <div class="border-t border-dashed border-gray-200 my-3"></div>

              <div class="flex items-center justify-between">
                <span
                  class="bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                >
                  {{ item.type }}
                </span>

                <div class="flex items-center gap-1 text-gray-400 text-sm">
                  <CIconButton
                    icon="delete"
                    type="error"
                    @click.stop="deleteItem(item)"
                  />
                  <CIconButton
                    icon="edit"
                    @click.stop="
                      $router.push(
                        `/listings/add?id=${item.id}&category=${item.category}`
                      )
                    "
                  />
                </div>
              </div>
              <div class="grid gap-2 mt-3">
                <CButton
                  size="small"
                  :loading="currentItem?.id == item.id && acceptLoading"
                  icon="check"
                  @click.stop="acceptItem(item)"
                >
                  Qabul qilish
                </CButton>
                <CButton
                  size="small"
                  type="error"
                  icon="times"
                  :loading="currentItem?.id == item.id && rejectLoading"
                  @click.stop="
                    currentItem = item;
                    rejectShow = true;
                  "
                >
                  Rad qilish
                </CButton>
              </div>
            </div>
          </div>
        </TransitionGroup>
        <AppNotFound v-if="!list.length" />
        <div class="mt-5 ml-4 mb-5">
          <n-pagination
            class="c-pagination"
            :page-count="Math.ceil(total / limit)"
            :page-size="limit"
            v-model:page="page"
          />
        </div>
      </div>
    </n-spin>
    <CModal v-model:show="rejectShow" title="Rad qilish sababi" class="max-w-[450px]">
      <CInput
        v-model:value="rejectReason"
        type="textarea"
        placeholder="Rad qilish sababini kiriting"
      />
      <div class="flex justify-end gap-2 mt-4">
        <CButton @click="rejectShow = false" type="default">Yopish</CButton>
        <CButton type="error" :loading="rejectLoading" @click="rejectItem()">
          Rad etish
        </CButton>
      </div>
    </CModal>
  </div>
</template>
<style lang="scss"></style>
