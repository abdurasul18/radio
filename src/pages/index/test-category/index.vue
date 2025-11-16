<script lang="ts" setup>
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ITestCategory, TestCategoryService } from "/@src/services/test-category";
const { user } = toRefs(useAuthStore());
const { educations } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();
const educationName = computed(() => {
  const education = educations.value.find((item) => item.code == route.query.menu);
  return education ? education.name : "";
});
let routeId = computed(() => route.query.menu as string);
let paramsAdd = computed(() => {
  return {
    query: {
      menu: routeId.value,
    },
  };
});
const { list, loading, search, fetchData } = useApiServiceAll<ITestCategory>(
  TestCategoryService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});
//
let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<ITestCategory | null>(null);
//
async function deleteItem(item: ITestCategory) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await TestCategoryService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
//
</script>

<template>
  <n-spin :show="loading">
    <AppTitle>
      <n-breadcrumb>
        <n-breadcrumb-item @click="$router.push(`/education`)">
          <div class="text-lg">{{ educationName }}</div>
        </n-breadcrumb-item>
        <n-breadcrumb-item><div class="text-lg">Test turi</div></n-breadcrumb-item>
      </n-breadcrumb>
    </AppTitle>
    <div
      class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
    >
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="flex gap-4 flex-wrap items-center">
          <n-input
            v-model:value="search"
            clearable
            size="large"
            :placeholder="$t('actions.search')"
            class="search-input w-[300px]"
          >
            <template #prefix>
              <CIcon name="search" class="mr-4" />
            </template>
          </n-input>
        </div>
      </div>
      <div class="flex gap-2">
        <CButton
          @click="
            mode = 'create';
            addShow = true;
          "
          icon="plus"
        >
          {{ $t("actions.add") }}
        </CButton>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        @click="$router.push(`/question?group_id=${item.id}&menu=${routeId}`)"
        v-for="(item, index) in list"
        class="flex flex-col p-5 rounded-2xl border border-grey-100 bg-white cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all duration-200 relative"
      >
        <div class="flex gap-4 items-center">
          <img class="w-[60px] max-h-[60px] object-contain" :src="$withBaseUrl(item.file?.path)" alt="" />
          <div class="font-semibold text-lg leading-5">{{ item.name_uz }}</div>
        </div>
        <div class="flex justify-end">
          <CActionIcon
            @click.stop="
              currentItem = item;
              mode = 'update';
              addShow = true;
            "
            icon="edit"
            class="info-svg"
          />
          <CActionIcon @click.stop="deleteItem(item)" class="error-svg" icon="delete" />
        </div>
      </div>
    </div>
  </n-spin>
  <CModal
    v-model:show="addShow"
    :title="mode == 'create' ? 'Qo\'shish' : 'Tahrirlash'"
    class="max-w-[500px]"
  >
    <AddUpTestCategory
      :mode="mode"
      :item="currentItem!"
      @success="
        addShow = false;
        fetchData();
      "
      :menu="routeId"
      @close="addShow = false"
    />
  </CModal>
</template>
<style lang="scss"></style>
