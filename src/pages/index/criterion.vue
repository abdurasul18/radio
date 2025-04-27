<script lang="ts" setup>
import { CriterionService, ICriterion } from "/@src/services/criterion";
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
} = useApiService<ICriterion>(CriterionService.getList);

onMounted(() => {
  fetchData();
});

let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<ICriterion | null>(null);

async function deleteItem(item: ICriterion) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await CriterionService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
</script>

<template>
  <div>
    <AppTitle>Mezonlar</AppTitle>

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
                <th class="one-line">Ball</th>
                <th class="one-line">Turi</th>
                <th>Holati</th>
                <th class="w-[120px] text-right">Amallar</th>
              </tr>
            </thead>
            <tbody v-if="list.length">
              <tr v-for="(item, i) in list" :key="i">
                <td>{{ $paginate(i, page, per_page) }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.rate }}</td>
                <td>
                  <!-- 1 - O'quv , 2 - Ilmiy ,3 - Manaviy ,4 - Tashkiliy -->
                  {{
                    item.type === 1
                      ? "O'quv"
                      : item.type === 2
                      ? "Ilmiy"
                      : item.type === 3
                      ? "Manaviy"
                      : "Tashkiliy"
                  }}
                </td>
                <td>
                  <CTag v-if="item.status == 1" type="success">Active</CTag>
                  <CTag v-else type="error">Inactive</CTag>
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
      :title="mode === 'create' ? 'Me\'zon qo\'shish' : 'Me\'zon tahrirlash'"
      class="max-w-[500px]"
    >
      <AddUpCriterion
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
