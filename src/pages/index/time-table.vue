<script lang="ts" setup>
import { TimeTableService, ITimeTable } from "/@src/services/time-table";
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { ddmmyyyy } from "/@src/utils/date";
let modal = useModal();
const {
  list,
  loading,
  search,
  per_page,
  limits,
  fetchData,
  total,
  page,
} = useApiService<ITimeTable>(TimeTableService.getList);
onMounted(() => {
  fetchData();
});
//
let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<ITimeTable | null>(null);
async function deleteItem(item: ITimeTable) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await TimeTableService.delete(item.id);
    fetchData();
    toastSuccess();
  }
}
</script>
<template>
  <div>
    <AppTitle>Dars jadvali</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div class="px-2 sm:px-9 flex flex-col-reverse gap-4 sm:flex-row mb-4 items-center justify-between">
          <div class="flex">
            <n-input
              v-model:value="search"
              clearable
              size="large"
              :placeholder="$t('actions.search')"
              class="search-input"
            >
              <template #prefix>
                <CIcon name="search" class="mr-4" />
              </template>
            </n-input>
            <select v-model="per_page" class="w-[156px] c-select-grey ml-4">
              <option v-for="val in limits" :value="val">{{ val }}</option>
            </select>
          </div>
          <CButton
          class="ml-auto"
            icon="plus"
            @click="
              mode = 'create';
              addShow = true;
            "
          >
            {{ $t("actions.add") }}
          </CButton>
        </div>
        <div class="-m-6 pt-6">
          
          <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
            <table class="c-table2 min-w-[800px]">
            <thead>
              <tr>
                <th style="width: 80px">№</th>
                <th>Qaysi sanadan</th>
                <th>Qaysi sanagacha</th>
                <th>Kim tomondan yuklandi</th>
                <th>Qachon yuklandi</th>
                <th class="w-[120px] text-right">Amallar</th>
              </tr>
            </thead>
            <tbody v-if="list.length">
              <tr v-for="(item, i) in list" :key="i">
                <td>{{ $paginate(i, page, per_page) }}</td>
                <td>
                  {{ ddmmyyyy(new Date(`${item.month}-${item.start_day}-${item.year}`)) }}
                </td>
                <td>
                  {{ ddmmyyyy(new Date(`${item.month}-${item.end_day}-${item.year}`)) }}
                </td>
                <td>{{ item.created_by }}</td>
                <td>{{ item.created_at }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <a
                      class="p-2 rounded-full bg-blue-500 bg-opacity-30"
                      :href="item.file"
                      download
                    >
                      <CIcon name="download" />
                    </a>
                    <CIconButton icon="delete" type="error" @click="deleteItem(item)" />
                  </div>
                </td>
              </tr>
            </tbody>
            <AppNotFound v-else mode="table" />
          </table>
          </div>
          <!-- <AppNotFound /> -->
        </div>
      </n-card>
      <div class="mt-5 ml-4 mb-5">
        <n-pagination
          class="c-pagination"
          v-model:page="page"
          v-model:page-size="per_page"
          :page-count="Math.ceil(total / per_page)"
        />
      </div>
    </n-spin>
    <CModal v-model:show="addShow" title="Qo'shish" class="max-w-[500px]">
      <AddUpTimeTable
        @close="addShow = false"
        @success="
          addShow = false;
          fetchData();
        "
      />
    </CModal>
  </div>
</template>
<style lang="scss"></style>
