<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { IMake, MakesService } from "/@src/services/makes";

const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();

let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);

let paramsAdd = computed(() => {
  return {
    query: {
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
    },
  };
});

const { list, loading, search, fetchData, total } = useApiServiceAll<IMake>(
  MakesService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});

let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<IMake | null>(null);

async function deleteItem(item: IMake) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await MakesService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>

<template>
  <div>
    <AppTitle>Avtomobil markalari</AppTitle>

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
                  <th>Slug</th>
                  <th>Rasm</th>
                  <th>Modellar soni</th>
                  <th>Status</th>
                  <th>Tartib</th>
                  <th class="min-w-[120px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody v-if="list.length">
                <tr v-for="(item, i) in list" :key="i">
                  <td>{{ $paginate(i, page, limit) }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.slug }}</td>
                  <td>
                    <n-image
                      v-if="item.image"
                      class="max-w-[80px] max-h-[80px] rounded-lg object-cover"
                      :src="`${item.image.base_url}/${item.image.path}`"
                    />
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td>{{ item.models_count }}</td>
                  <td>
                    <n-tag :type="item.status === 1 ? 'success' : 'error'">
                      {{ item.status === 1 ? 'Faol' : 'Nofaol' }}
                    </n-tag>
                  </td>
                  <td>{{ item.sort }}</td>
                  <td>
                    <div class="flex justify-end gap-2">
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
        <n-pagination
          class="c-pagination"
          :page-count="Math.ceil(total / limit)"
          :page-size="limit"
          v-model:page="page"
        />
      </div>
    </n-spin>

    <CModal
      v-model:show="addShow"
      :title="mode === 'create' ? 'Marka qo\'shish' : 'Markani tahrirlash'"
      class="max-w-[600px]"
    >
      <AddUpMakes
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
