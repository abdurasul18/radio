<script lang="ts" setup>
import { useModal } from "naive-ui";
import { useApiService } from "/@src/composable/getList";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { confirmDelete } from "/@src/composable/helpers";
import { IOrganization, OrganizationService } from "/@src/services/organization";
import { toastSuccess } from "/@src/plugins/toast";
const modal = useModal();
const route = useRoute();
let service_id = ref(route.query.service_id ? Number(route.query.service_id) : null);
let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);
let paramsAdd = computed(() => {
  return {
    query: {
      service_id: service_id.value,
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
    },
  };
});
const { list, loading, search, fetchData, total } = useApiServiceAll<IOrganization>(
  OrganizationService.getList,
  paramsAdd
);
watch(
  () => [search.value, service_id.value],
  (v) => {
    page.value = 1;
  },
  { deep: true }
);
onMounted(() => {
  fetchData();
});
//
async function deleteItem(item: IOrganization) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await OrganizationService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>
<template>
  <div>
    <AppTitle> Xizmatlar </AppTitle>
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
          <SelectService v-model:value="service_id" />
        </div>
        <div class="flex gap-2">
          <CButton
            icon="plus"
            @click="$router.push(`/organization/add?service_id=${service_id}`)"
          >
            {{ $t("actions.add") }}
          </CButton>
        </div>
      </div>
      <div class="pt-3">
        <TransitionGroup name="list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <n-card
            class="base-card base-card-hover overflow-hidden cursor-pointer"
            v-for="(item, index) in list"
            :key="item.id"
            @click="$router.push(`/organization/view/${item.id}`)"
          >
            <template #cover>
              <div class="relative cursor-default overflow-hidden" @click.stop>
                <n-carousel show-arrow draggable :slides-per-view="1" class="h-[180px]">
                  <img
                    v-for="(file, fileIndex) in item.files"
                    :key="fileIndex"
                    class="w-full h-[180px] object-cover transition-transform duration-500 group-hover-zoom"
                    :src="$withBaseUrl(file.file?.path)"
                  />
                </n-carousel>
              </div>
            </template>
            <div class="flex flex-col justify-between h-full min-h-[140px]">
              <div class="grid gap-2">
                <div class="flex items-center justify-between gap-2 mt-1">
                  <span class="text-xs text-grey-400 font-semibold uppercase tracking-wider">Tashkilot</span>
                  <StatusTag :status="item.status" size="small" />
                </div>
                <div class="font-bold text-base text-grey-900 leading-tight line-clamp-2 min-h-[42px] mb-2">
                  {{ item.name }}
                </div>

                <div class="flex items-start gap-2 text-grey-500 text-sm">
                  <CIcon class="info-svg flex-shrink-0 mt-0.5" width="16" name="location" />
                  <span class="line-clamp-2 leading-tight">{{ item.address }}</span>
                </div>
                <div class="flex items-center gap-2 text-grey-500 text-sm">
                  <CIcon class="info-svg flex-shrink-0" width="16" name="phone" />
                  <span>{{ item.phone_number }}</span>
                </div>
              </div>
              <div>
                <n-divider class="my-3" />
                <div class="flex justify-end gap-2">
                  <CActionIcon @click.stop="deleteItem(item)" icon="delete" class="error-svg" />
                  <CActionIcon
                    @click.stop="$router.push(`/organization/add?id=${item.id}`)"
                    class="info-svg"
                    icon="edit"
                  />
                  <CActionIcon
                    @click.stop="$router.push(`/organization/view/${item.id}`)"
                    icon="eye"
                  />
                </div>
              </div>
            </div>
          </n-card>
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
  </div>
</template>
<style lang="scss"></style>
