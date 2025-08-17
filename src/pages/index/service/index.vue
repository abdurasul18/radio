<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { RoleType } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ddmmyyyy } from "/@src/utils/date";
import { ServiceService, IService } from "/@src/services/service";
const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();
let category_id = ref(route.query.category_id ? Number(route.query.category_id) : "");
let paramsAdd = computed(() => {
  return {
    query: {
      category_id: category_id.value,
    },
  };
});
const { list, loading, search, fetchData } = useApiServiceAll<IService>(
  ServiceService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});
//
let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<IService | null>(null);
//
async function deleteItem(item: IService) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await ServiceService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>

<template>
  <n-spin :show="loading">
    <AppTitle> Xizmat turlari </AppTitle>
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
        <SelectCategory class="w-[300px]" v-model:value="category_id" />
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
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" v-if="list.length">
      <div
        v-for="item in list"
        @click="$router.push(`/organization?service_id=${item.id}`)"
        class="flex p-5 rounded-2xl border border-grey-100 bg-white cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all duration-200 relative"
      >
        <div class="absolute top-2 right-2">
          <CDropdown>
            <template #trigger>
              <CActionIcon icon="more" @click.stop />
            </template>
            <n-list hoverable clickable>
              <n-list-item @click="$router.push(`/organization?service_id=${item.id}`)">
                <div class="flex">
                  <CIcon class="w-4 mr-2" name="eye" />
                  Xizmatlar
                </div>
              </n-list-item>
              <n-list-item
                @click="
                  mode = 'update';
                  currentItem = item;
                  addShow = true;
                "
              >
                <div class="flex text-blue-500">
                  <CIcon class="w-4 mr-2 info-svg" name="edit" />
                  Tahrirlash
                </div>
              </n-list-item>
              <n-list-item @click="deleteItem(item)">
                <div class="flex text-error">
                  <CIcon class="w-4 mr-2 error-svg" name="delete" />
                  O'chirish
                </div>
              </n-list-item>
            </n-list>
          </CDropdown>
        </div>
        <div class="flex gap-4 items-center">
          <img class="w-[60px]" :src="$withBaseUrl(item.file?.path)" alt="" />
          <div class="font-semibold text-lg leading-5">{{ item.name_uz }}</div>
        </div>
      </div>
    </div>
    <AppNotFound v-else />
  </n-spin>
  <CModal
    v-model:show="addShow"
    :title="mode == 'create' ? 'Qo\'shish' : 'Tahrirlash'"
    class="max-w-[500px]"
  >
    <AddUpService
      :mode="mode"
      :item="currentItem!"
      :category_id="category_id"
      @success="
        addShow = false;
        fetchData();
      "
      @close="addShow = false"
    />
  </CModal>
</template>
<style lang="scss"></style>
