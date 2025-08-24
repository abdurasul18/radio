<script lang="ts" setup>
import { useModal } from "naive-ui";
import { useApiService } from "/@src/composable/getList";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { IQuestion, QuestionService } from "/@src/services/question";
import { useAuthStore } from "/@src/store/auth";
const { educations, testTypes } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();
const educationName = computed(() => {
  const education = educations.value.find((item) => item.code == route.query.menu);
  return education ? education.name : "";
});
let menu = ref(route.query.menu ? Number(route.query.menu) : null);
let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);
let type = ref(Number(route.query.type) || 1);
let paramsAdd = computed(() => {
  return {
    query: {
      menu: menu.value,
      type: type.value,
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
    },
  };
});
const { list, loading, search, fetchData, total } = useApiServiceAll<IQuestion>(
  QuestionService.getList,
  paramsAdd
);
watch(
  () => [search.value, menu.value],
  (v) => {
    page.value = 1;
  },
  { deep: true }
);
onMounted(() => {
  fetchData();
});
//
async function deleteItem(item: IQuestion) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await QuestionService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>
<template>
  <div>
    <AppTitle>
      <n-breadcrumb>
        <n-breadcrumb-item @click="$router.push(`/education`)">
          <div class="text-lg">{{ educationName }}</div>
        </n-breadcrumb-item>
        <n-breadcrumb-item><div class="text-lg">Test savollari</div></n-breadcrumb-item>
      </n-breadcrumb>
    </AppTitle>
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
        <div class="flex gap-2">
          <CButton
            icon="plus"
            @click="$router.push(`/question/add?menu=${menu}&type=${type}`)"
          >
            {{ $t("actions.add") }}
          </CButton>
        </div>
      </div>
      <n-tabs class="c-tabs" v-model:value="type" type="segment" size="large">
        <n-tab-pane :name="val.code" v-for="val in testTypes">
          <template #tab>
            <div class="flex gap-2">
              <img class="h-5" :src="val.img" alt="" />
              {{ val.name }}
            </div>
          </template>
        </n-tab-pane>
      </n-tabs>
      <div class="pt-3">
        <div class="grid gap-4" v-if="list.length">
          <n-card class="base-card" v-for="(item, index) in list" :key="item.id">
            <div class="mb-4 flex justify-between gap-4">
              <div class="title flex gap-2 items-center">
                {{ $paginate(index, page, limit) }}.
                <img
                  v-if="item.file?.path"
                  class="w-8"
                  :src="$withBaseUrl(item.file?.path)"
                  alt=""
                />
                {{ item.title }}
              </div>
              <div class="flex gap-2">
                <CIconButton
                  @click="$router.push(`/question/add?id=${item.id}&menu=${menu}`)"
                  type="info"
                  icon="edit"
                />
                <CIconButton type="error" @click="deleteItem(item)" icon="delete" />
              </div>
            </div>
            <n-list hoverable>
              <n-list-item v-for="answer in item.answer">
                <div class="flex items-center gap-2">
                  <n-radio :checked="answer.is_correct == 1" size="large" />
                  <img
                    v-if="answer.file?.path"
                    class="w-6"
                    :src="$withBaseUrl(answer.file?.path)"
                    alt=""
                  />
                  {{ answer.title }}
                </div>
              </n-list-item>
            </n-list>
          </n-card>
        </div>
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
