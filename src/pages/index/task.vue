<script lang="ts" setup>
import { TaskService, ITask } from "/@src/services/task";
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
} = useApiService<ITask>(TaskService.getList);
onMounted(() => {
  fetchData();
});
//
let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<ITask | null>(null);
async function deleteItem(item: ITask) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await TaskService.delete(item.id);
    fetchData();
    toastSuccess();
  }
}
</script>
<template>
  <div>
    <AppTitle>Yuklamalar</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between">
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
                <th>Nomi</th>
                <th><div class="one-line">Miqdori</div></th>
                <th>
                  <div class="one-line">Me'zoni</div>
                </th>
                <th>Holati</th>
                <th class="w-[120px] text-right">Amallar</th>
              </tr>
            </thead>
            <tbody v-if="list.length">
              <tr v-for="(item, i) in list" :key="i">
                <td>{{ $paginate(i, page, per_page) }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <CTag>{{ item.volume }}</CTag>
                </td>
                <td>{{ item.criterion?.name }}</td>
                <td>
                  <CTag v-if="item.status == 1" type="success"> Active </CTag>
                  <CTag v-else type="error"> Inactive </CTag>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <CIconButton
                      @click="
                        mode = 'update';
                        addShow = true;
                        currentItem = item;
                      "
                      icon="edit"
                      type="info"
                    />
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
    <CModal
      v-model:show="addShow"
      :title="mode == 'create' ? 'Yuklama qo\'shish' : 'Yuklamani tahrirlash'"
      class="max-w-[500px]"
    >
      <AddUpTask
        @close="addShow = false"
        @success="
          addShow = false;
          fetchData();
        "
        :mode="mode"
        :item="currentItem!"
      />
    </CModal>
  </div>
</template>
<style lang="scss"></style>
