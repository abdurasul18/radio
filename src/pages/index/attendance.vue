<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { AttendanceService, IAttedance } from "/@src/services/attendance";
import { ddmmyyyy } from "/@src/utils/date";

let {
  fetchData,
  loading,
  page,
  limits,
  list,
  per_page,
  total,
  search,
} = useApiService<IAttedance>(AttendanceService.getList);

onMounted(() => {
  fetchData();
});
let mode = ref<"create" | "update">("create");
let currentItem = ref<IAttedance | null>(null);
</script>
<template>
  <div>
    <AppTitle>Davomat</AppTitle>
    <n-spin :show="loading" size="large">
      <n-card class="base-card" :bordered="false">
        <div class="px-9 flex mb-4 items-center justify-between">
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
          <div class="flex gap-2"></div>
        </div>
        <div class="-m-6 pt-6">
          <table class="c-table2" v-if="list.length">
            <thead>
              <tr>
                <th style="width: 80px">
                  {{ $t("field.number") }}
                </th>
                <th>FIO</th>
                <th class="one-line">Sanadan</th>
                <th class="one-line">Sanagacha</th>
                <th class="one-line">Dars soati</th>
                <th class="one-line">Bajarilgan dars soati</th>
                <th class="one-line text-right">{{ $t("actions.title") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <n-image class="c-avatar" :src="$withBaseUrl(item?.user?.avatar)" />
                    <div>
                      {{ item?.user?.last_name }}
                      {{ item?.user?.first_name }}
                      {{ item?.user?.middle_name }}
                     
                    </div>
                  </div>
                </td>

                <td>
                  {{ ddmmyyyy(new Date(`${item.month}-${item.start_day}-${item.year}`)) }}
                </td>
                <td>
                  {{ ddmmyyyy(new Date(`${item.month}-${item.end_day}-${item.year}`)) }}
                </td>
                <td></td>
                <td></td>

                <td></td>
              </tr>
            </tbody>
          </table>
          <AppNotFound v-else />
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
  </div>
</template>
<style lang="scss"></style>
