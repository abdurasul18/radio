<script lang="ts" setup>
import { NotificationService, INotification } from "/@src/services/notification";
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { RoleType } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ddmmyyyy } from "/@src/utils/date";
const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();

let paramsAdd = computed(() => {
  return {
    query: {

    },
  };
});
const {
  list,
  loading,
  search,
  fetchData,
} = useApiServiceAll<INotification>(NotificationService.getList, paramsAdd);

onMounted(() => {
  fetchData();
});

let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<INotification | null>(null);

async function deleteItem(item: INotification) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await NotificationService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
let excelLoading = ref(false);

</script>

<template>
  <div>
    <AppTitle>Bildirishnomalar</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div
          class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
        >
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex">
              <!-- <n-input
                v-model:value="search"
                clearable
                size="large"
                :placeholder="$t('actions.search')"
                class="search-input min-w-[200px]"
              >
                <template #prefix>
                  <CIcon name="search" class="mr-4" />
                </template>
              </n-input> -->
             
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
                  <th>Sarlavha</th>
                  <th class="w-1/4">Matni</th>
                  <th>E'lon qilingan sana</th>
                  <th>Yaratilgan sana</th>
                  <!-- <th>Tahrirlangan sana</th> -->
                  <th class="one-line">Poster</th>
                  <!-- <th>Status</th> -->
                  <th class="min-w-[120px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody v-if="list.length">
                <tr v-for="(item, i) in list" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.title }}</td>
                  <td>
                    <n-scrollbar class="max-h-[100px]" trigger="none">
                      {{ item.description }}
                    </n-scrollbar>
                  </td>
                  <td>{{item.published_at ? ddmmyyyy( new Date(item.published_at)) : '-' }}</td>
                  <td>{{item.created_at ? ddmmyyyy( new Date(item.created_at)) : '-' }}</td>
                  <!-- <td>{{item.updated_at ? ddmmyyyy( new Date(item.updated_at)) : '-' }}</td> -->
                  <td>
                    <n-image
                    class="max-w-[100px] max-h-[100px]"
                      :src="$withBaseUrl(item.poster)"
                    />
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
      <div class="mt-5 ml-4 mb-5">
        <!-- <n-pagination
          class="c-pagination"
          v-model:page="page"
          v-model:page-size="per_page"
          :page-count="Math.ceil(total / per_page)"
        /> -->
      </div>
    </n-spin>

    <CModal
      v-model:show="addShow"
      :title="mode === 'create' ? 'Bildirishnoma qo\'shish' : 'Bildirishnoma tahrirlash'"
      class="max-w-[600px]"
    >
      <AddUpNotification
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
