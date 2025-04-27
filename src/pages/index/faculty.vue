<script lang="ts" setup>
import { FacultyService, IFaculty } from "/@src/services/faculty";
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
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
} = useApiService<IFaculty>(FacultyService.getList);
onMounted(() => {
  fetchData();
});
//
let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<IFaculty | null>(null);
async function deleteItem(item: IFaculty) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await FacultyService.delete(item.id);
    fetchData();
    toastSuccess();
  }
}
</script>
<template>
  <div>
    <AppTitle>Fakultet</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div class="px-2 flex-col-reverse sm:flex-row sm:px-9 flex mb-4 gap-4 items-center justify-between">
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
            icon="plus"
            class="ml-auto"
            @click="
              mode = 'create';
              addShow = true;
            "
          >
            {{ $t("actions.add") }}
          </CButton>
        </div>
        <div class="-m-6 pt-6">
          <table class="c-table2">
            <thead>
              <tr>
                <th style="width: 50px">№</th>
                <th>Fakultet nomi</th>
                <th>Holati</th>
                <th class="w-[120px] text-right">Amallar</th>
              </tr>
            </thead>
            <tbody v-if="list.length">
              <tr v-for="(item, i) in list" :key="i">
                <td>{{ $paginate(i, page, per_page) }}</td>
                <td>{{ item.title }}</td>
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
          <div></div>
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
      :title="mode == 'create' ? 'Fakultet qo\'shish' : 'Fakultetni tahrirlash'"
      class="max-w-[350px] sm:max-w-[500px]"
    >
      <AddUpFaculty
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
<style lang="scss"></style>
