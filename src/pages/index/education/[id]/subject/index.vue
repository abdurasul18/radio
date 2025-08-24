<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { RoleType } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ddmmyyyy } from "/@src/utils/date";
import { ISubject, SubjectService } from "/@src/services/subject";
import { ILesson, LessonService } from "/@src/services/lesson";
const { user } = toRefs(useAuthStore());
const { educations } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();
const educationName = computed(() => {
  const education = educations.value.find((item) => item.code == route.params.id);
  return education ? education.name : "";
});
let routeId = computed(() => route.params.id);
let paramsAdd = computed(() => {
  return {
    query: {
      menu: routeId.value,
    },
  };
});
const { list, loading, search, fetchData } = useApiServiceAll<ISubject>(
  SubjectService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});
//
let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<ISubject | null>(null);
//
async function deleteItem(item: ISubject) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await SubjectService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
//
async function deleteLesson(item: ILesson) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await LessonService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>

<template>
  <n-spin :show="loading">
    <AppTitle>
      <n-breadcrumb>
        <n-breadcrumb-item @click="$router.push(`/education`)">
          <div class="text-lg">{{ educationName }}</div>
        </n-breadcrumb-item>
        <n-breadcrumb-item><div class="text-lg">Ta'lim</div></n-breadcrumb-item>
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
    <n-card class="base-card">
      <n-collapse v-if="list.length">
        <n-collapse-item v-for="item in list" :name="item.id" :key="item.id">
          <template #header>
            <div class="flex justify-between w-full items-center">
              <div class="font-semibold text-base flex gap-2 items-center">
                <img
                  class="w-10 rounded-lg"
                  :src="$withBaseUrl(item.file?.path)"
                  alt=""
                />
                {{ item.title_uz }}
              </div>
              <div class="flex gap-2">
                <CIconButton
                  @click="$router.push(`/lesson/create?subject_id=${item.id}`)"
                  icon="plus"
                  type="success"
                />
                <CIconButton
                  icon="edit"
                  @click.stop="
                    currentItem = item;
                    addShow = true;
                    mode = 'update';
                  "
                />
                <CIconButton icon="delete" type="error" @click="deleteItem(item)" />
              </div>
            </div>
          </template>
          <n-list hoverable clickable v-if="item.lesson.length">
            <n-list-item
              v-for="child in item.lesson"
              :key="child.id"
              @click.stop="$router.push(`/lesson/${child.id}`)"
            >
              <div class="flex justify-between gap-4 items-center">
                <div class="flex gap-2 items-center pl-4">
                  <img class="w-8" :src="$withBaseUrl(child.file?.path)" alt="" />
                  {{ child.title_uz }}
                </div>
                <div class="flex gap-2">
                  <CIconButton
                    icon="edit"
                    size="small"
                    @click.stop="$router.push(`/lesson/create?id=${child.id}`)"
                  />
                  <CIconButton
                    size="small"
                    icon="delete"
                    type="error"
                    @click.stop="deleteLesson(child)"
                  />
                </div>
              </div>
            </n-list-item>
          </n-list>
        </n-collapse-item>
      </n-collapse>
      <AppNotFound v-else />
    </n-card>
  </n-spin>
  <CModal
    v-model:show="addShow"
    :title="mode == 'create' ? 'Qo\'shish' : 'Tahrirlash'"
    class="max-w-[500px]"
  >
    <AddUpSubject
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
