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
import { IUser, IUserListItem, UserService } from "/@src/services/user";

const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();

let paramsAdd = computed(() => {
  return {
    query: {},
  };
});
const { list, loading, search, fetchData } = useApiServiceAll<IUserListItem>(
  UserService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});

let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<IUserListItem | null>(null);

async function deleteItem(item: IUserListItem) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await UserService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
let excelLoading = ref(false);

function railStyle({ focused, checked }: { focused: boolean; checked: boolean }) {
  const style: any = {};
  if (checked) {
    style.background = "#40c040";
    if (focused) {
      style.boxShadow = "0 0 0 2px #40c04040";
    }
  } else {
    style.background = "#ccc";
    if (focused) {
      style.boxShadow = "0 0 0 2px #ccc40";
    }
  }
  return style;
}
async function toggleStatus(value: boolean, item: IUserListItem) {
  try {
    await UserService.toggleStatus(item.id);
    toastSuccess();
    fetchData();
  } finally {
  }
}
</script>

<template>
  <div>
    <AppTitle>Foydalanuvchilar</AppTitle>

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
            <!-- <CButton
              icon="plus"
              @click="
                mode = 'create';
                addShow = true;
              "
            >
              {{ $t("actions.add") }}
            </CButton> -->
          </div>
        </div>
        <div class="-m-6 pt-6">
          <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
            <table class="c-table2 min-w-[1000px]">
              <thead>
                <tr>
                  <th style="width: 80px">№</th>
                  <th>Familiya, Ism</th>
                  <th>Telefon</th>
                  <th class="!text-center">Verifikatsiya</th>
                  <th class="w-[150px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody v-if="list.length">
                <tr v-for="(item, i) in list" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>
                    <div class="flex gap-3 items-center text-base font-semibold">
                      <n-image
                        class="w-[60px] h-[80px] rounded-md flex-shrink-0 border border-gray-200"
                        object-fit="cover"
                        :src="$withBaseUrl2(item.avatar)"
                      />
                      {{ item.last_name }} {{ item.first_name }}
                    </div>
                  </td>
                  <td class="text-blue-500">{{ item.phone }}</td>
                  <td class="!text-center">
                    <n-switch
                      :rail-style="railStyle"
                      :value="item.is_verified"
                      @update:value="toggleStatus($event, item)"
                    >
                      <template #checked> Checked </template>
                      <template #unchecked> Unchecked </template>
                    </n-switch>
                  </td>
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
      :title="mode === 'create' ? 'Foydalanuvchi qo\'shish' : 'Foydalanuvchi tahrirlash'"
      class="max-w-[500px]"
    >
      <AddUpUser
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
