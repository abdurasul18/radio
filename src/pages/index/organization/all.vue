<script lang="ts" setup>
import { useModal } from "naive-ui";
import { useApiService } from "/@src/composable/getList";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { confirmDelete } from "/@src/composable/helpers";
import { IOrganization, OrganizationService } from "/@src/services/organization";
import { toastSuccess } from "/@src/plugins/toast";
import { CategoryService, ICategory } from "/@src/services/category";
const modal = useModal();
const route = useRoute();
const { list: categories, fetchData: getCategories } = useApiServiceAll<ICategory>(
  CategoryService.getList
);
onMounted(getCategories);
let service_id = ref(route.query.service_id ? Number(route.query.service_id) : null);
let category_id = ref(route.query.category_id ? Number(route.query.category_id) : null);
let status = ref(route.query.status ? Number(route.query.status) : 1);
let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);
let paramsAdd = computed(() => {
  return {
    query: {
      service_id: service_id.value,
      category_id: category_id.value,
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
      status: status.value,
    },
  };
});
const { list, loading, search, fetchData, total } = useApiServiceAll<IOrganization>(
  OrganizationService.getListAll,
  paramsAdd
);
watch(
  () => [search.value, service_id.value, status.value, category_id.value],
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
     <n-radio-group
          class=" c-radiogroup mb-4 px-2"
          v-model:value="category_id"
          name="radiobuttongroup2"
          size="large"
        >
         <n-radio-button   :value="null">
             Barchasi
          </n-radio-button>
          <n-radio-button v-for="item in categories" :key="item.id" :value="item.id">
            {{ item.name_uz }}
          </n-radio-button>
        </n-radio-group>
      <div
        class="px-2  flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between w-full"
      >
        <div class="flex flex-col sm:flex-row gap-2 w-full">
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
          <SelectService class="w-full" v-model:value="service_id" :category_id="category_id"/>
          <SelectStatus class="w-[250px]" v-model:value="status" />
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
            <div class="flex flex-col justify-between h-full min-h-[160px]">
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
                <div class="flex items-center gap-2 text-blue-500 text-sm font-semibold mt-1">
                  <CIcon class="info-svg flex-shrink-0" width="16" name="category" />
                  <span class="truncate">{{ item.service?.name_uz }}</span>
                </div>
              </div>
              <div>
                <n-divider class="my-3" />
                <div class="flex justify-end gap-2">
                  <CActionIcon
                    @click.stop="deleteItem(item)"
                    icon="delete"
                    class="error-svg"
                  />
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
