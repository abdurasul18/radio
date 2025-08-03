<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { RoleType } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ddmmyyyy } from "/@src/utils/date";
import { IRegion, RegionService } from "/@src/services/region";
const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();

let paramsAdd = computed(() => {
  return {
    query: {},
  };
});
const { list, loading, search, fetchData } = useApiServiceAll<IRegion>(
  RegionService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});

let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<IRegion | null>(null);

async function deleteItem(item: IRegion) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await RegionService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
let excelLoading = ref(false);
</script>

<template>
  <div>
    <AppTitle>Shtatlar</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div
          class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
        >
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex">
              <n-input
                v-model:value="search"
                clearable
                size="large"
                :placeholder="$t('actions.search')"
                class="search-input min-w-[200px]"
              >
                <template #prefix>
                  <CIcon name="search" class="mr-4" />
                </template>
              </n-input>
            </div>
          </div>
          <div class="flex gap-2">
            <!-- <CButton
              :loading="excelLoading"
              class="text-green-500"
              type="default"
            >
              <img class="mr-3" src="/@src/assets/img/excel.png" alt="" />Excelga
              ko'chirish</CButton
            > -->
            <CButton
              icon="plus"
              @click="
                mode = 'create';
                addShow = true;
              "
            >
              {{ $t("actions.add") }}
            </CButton>
          </div>
        </div>
        <div class="-m-6 pt-6">
          <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
            <table class="c-table2 min-w-[1000px]">
              <thead>
                <tr>
                  <th style="width: 80px">№</th>
                  <th>Nomi</th>
                  <th class="w-[150px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody v-if="list.length">
                <tr v-for="(item, i) in list" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.name }}</td>

                  <td>
                    <div class="grid grid-cols-3 gap-1">
                      <CTooltip>
                        <template #trigger>
                          <CIconButton
                            size="small"
                            @click="
                              mode = 'update';
                              addShow = true;
                              currentItem = item;
                            "
                            icon="edit"
                            type="info"
                          />
                        </template>
                        <div>Tahrirlash</div>
                      </CTooltip>
                      <CTooltip>
                        <template #trigger>
                          <CIconButton
                            size="small"
                            icon="delete"
                            type="error"
                            @click="deleteItem(item)"
                          />
                        </template>
                        <div>O'chirish</div>
                      </CTooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
              <AppNotFound v-else mode="table" />
            </table>
          </div>
        </div>
      </n-card>
      <div class="mt-5 ml-4 mb-5"></div>
    </n-spin>

    <CModal
      v-model:show="addShow"
      :title="mode === 'create' ? 'Shtat qo\'shish' : 'Shtat tahrirlash'"
      class="max-w-[500px]"
    >
      <AddUpRegion
        :mode="mode"
        :item="currentItem!"
        @close="addShow = false"
        @success="
          addShow = false;
          fetchData();
        "
      />
    </CModal>
  </div>
</template>

<style lang="scss">
.c-badge {
  .n-badge-sup {
    left: 70% !important;
  }
}
</style>
