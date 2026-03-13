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
        <TransitionGroup name="list" tag="div" class="grid grid-cols-4 gap-5">
          <n-card
            class="base-card base-card-hover overflow-hidden hover:bg-blue-50 cursor-pointer"
            v-for="(item, index) in list"
            @click="$router.push(`/organization/view/${item.id}`)"
          >
            <template #cover>
              <div class="cursor-default" @click.stop>
                <n-carousel show-arrow draggable :slides-per-view="1">
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
                <CIcon class="info-svg flex-shrink-0" width="16" name="location" />
                {{ item.address }}
              </div>
              <div class="flex gap-2">
                <CIcon class="info-svg" width="16" name="phone" /> {{ item.phone_number }}
              </div>
                <div class="flex gap-2 text-blue-500">
                <CIcon class="info-svg" width="16" name="category" /> {{ item.service?.name_uz }}
              </div>
            <StatusTag :status="item.status" />
            </div>
            <n-divider />
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
