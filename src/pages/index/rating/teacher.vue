<script lang="ts" setup>
import highchart from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import { Chart, ChartProps } from "highcharts-vue";
import VariablePie from "highcharts/modules/variable-pie.js";
import {
  generateHighChartColumnOpt,
  generateHighChartDonutOpt,
  generateHighChartPieOpt,
} from "./utils/highChartOpt";
import { ITeacherRating, RatingService } from "/@src/services/rating";
highcharts3d(highchart);
VariablePie(highchart);
const { t } = useI18n();
let data = ref<ITeacherRating[]>([]);
let chartOpt = computed<any>(() => {
  let labels = data.value.map(
    (item) =>
      `${item.last_name} ${item.first_name} ${item.middle_name}-( ${item.degree_name} )`
  );
  let values = data.value.map((item) => item.total_rate);
  return generateHighChartColumnOpt("O'qituvchilar", labels, values);
});

let loading = ref(false);
async function getData() {
  try {
    loading.value = true;
    let res = await RatingService.byTeacher();
    data.value = res.data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getData();
});
let search = ref("");
let filteredData = computed(() => {
  return data.value.filter((item) => {
    let fullName = `${item.last_name} ${item.first_name} ${item.middle_name}`;
    return fullName.toLowerCase().includes(search.value.toLowerCase());
  });
});
</script>
<template>
  <div>
    <AppTitle> Reytinglar / O'qituvchilar bo'yicha </AppTitle>

    <n-spin :show="loading">
      <div class="grid gap-4">
        <n-card class="base-card min-h-[700px]" :bordered="false">
          <n-scrollbar x-scrollable>
            <Chart :options="chartOpt"></Chart>
          </n-scrollbar>
        </n-card>
        <n-card class="base-card" :bordered="false">
          <div class="px-4 flex mb-4 items-center justify-between">
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
          </div>
          <div class="-m-6 pt-6">
            <table class="c-table2">
              <thead>
                <tr>
                  <th style="width: 50px">№</th>
                  <th>F.I.O</th>
                  <th>Darajasi</th>
                  <th class="one-line">Ball</th>
                </tr>
              </thead>
              <tbody v-if="filteredData.length">
                <tr v-for="(item, i) in filteredData" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>
                    {{ item.last_name }} {{ item.first_name }} {{ item.middle_name }}
                  </td>
                  <td>{{ item.degree_name }}</td>
                  <td>{{ item.total_rate }}</td>
                </tr>
              </tbody>
              <AppNotFound v-else mode="table" />
            </table>
          </div>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>
<style lang="scss">
.highcharts-credits {
  display: none;
}
</style>
