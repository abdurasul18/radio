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
  ()=>[search.value, service_id.value],
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
    <AppTitle> Xizmatlar  </AppTitle>
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
        <TransitionGroup name="list" tag="div" class="grid grid-cols-4 gap-5">
          <n-card
            class="base-card base-card-hover overflow-hidden"
            v-for="(item, index) in list"
          >
            <template #cover>
              <div class="cursor-default" @click.stop>
                <n-carousel show-arrow draggable :slides-per-view="3" :space-between="10">
                  <img
                    v-for="(file, fileIndex) in item.files"
                    class="w-full h-[200px] object-cover rounded-2xl overflow-hidden"
                    :src="$withBaseUrl(file.file?.path)"
                  />
                </n-carousel>
              </div>
            </template>
            <div class="grid gap-2">
              <div class="flex justify-between gap-4">
                <div class="font-semibold leading-4 mb-4">
                  {{ item.name }}
                </div>
              </div>
              <div class="flex gap-2">
                <CIcon class="info-svg" width="20" name="phone" /> {{ item.phone_number }}
              </div>
              <div class="flex gap-2">
                <CIcon class="info-svg" width="20" name="location" /> {{ item.address }}
              </div>
            </div>
            <n-divider />
            <div class="flex justify-end gap-2">
              <CActionIcon @click="deleteItem(item)" icon="delete" class="error-svg" />
              <CActionIcon
                @click="$router.push(`/organization/add?id=${item.id}`)"
                class="info-svg"
                icon="edit"
              />
              <CActionIcon
                @click="$router.push(`/organization/view/${item.id}`)"
                icon="eye"
              />
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
