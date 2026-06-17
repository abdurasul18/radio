<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { useAuthStore } from "/@src/store/auth";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ISubcategory, SubcategoryService } from "/@src/services/subcategory";
import { ddmmyyyy } from "/@src/utils/date";

const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();

let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);

let category = ref(route.query.category ? String(route.query.category) : null);

let paramsAdd = computed(() => {
  return {
    query: {
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
      category: category.value,
    },
  };
});

const { list, loading, search, fetchData, total } = useApiServiceAll<ISubcategory>(
  SubcategoryService.getList,
  paramsAdd
);

onMounted(() => {
  fetchData();
});

watch([category], () => {
  page.value = 1;
});


let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<ISubcategory | null>(null);

async function deleteItem(item: ISubcategory) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await SubcategoryService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>

<template>
  <div>
    <AppTitle>Quyi Kategoriyalar</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div
          class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
        >
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex gap-2 items-center">
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
              <SelectCategoryEnum
                v-model:value="category"
                class="min-w-[400px]"
              />
            
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
                  <th>Kategoriya</th>
                  <th>Nomi</th>
                  <th>O'zbekcha</th>
                  <th>Ruscha</th>
                  <th>Inglizcha</th>
                  <th>Status</th>
                  <th>Tartib</th>
                  <th>Yaratilgan sana</th>
                  <th class="min-w-[120px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody v-if="list.length">
                <tr v-for="(item, i) in list" :key="i">
                  <td>{{ $paginate(i, page, limit) }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.name_uz }}</td>
                  <td>{{ item.name_ru }}</td>
                  <td>{{ item.name_en }}</td>
                  <td>
                    <n-tag :type="item.status === 1 ? 'success' : 'error'">
                      {{ item.status === 1 ? 'Faol' : 'Nofaol' }}
                    </n-tag>
                  </td>
                  <td>{{ item.order }}</td>
                  <td>
                    {{ item.created_at ? ddmmyyyy(new Date(item.created_at)) : "-" }}
                  </td>
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
      :title="mode === 'create' ? 'Quyi Kategoriya qo\'shish' : 'Quyi Kategoriyani tahrirlash'"
      class="max-w-[600px]"
    >
      <AddUpSubcategory
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
