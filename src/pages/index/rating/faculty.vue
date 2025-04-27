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
import { IFacultyRating, RatingService } from "/@src/services/rating";
highcharts3d(highchart);
VariablePie(highchart);
const { t } = useI18n();
let data = ref<IFacultyRating[]>([]);
let langOpt = computed<any>(() => {
  let labels = data.value.map((item) => item.title);
  let values = data.value.map((item) => item.total_rate);
  return generateHighChartColumnOpt("Fakultetlar", labels, values);
});
let loading = ref(false);
async function getData() {
  try {
    loading.value = true;
    let res = await RatingService.byFaculty();
    data.value = res.data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getData();
});
</script>
<template>
  <div>
    <AppTitle> Reytinglar / Fakultet bo'yicha </AppTitle>

    <n-spin :show="loading">
      <div class="grid gap-4 md:grid-cols-2">
        <n-card class="base-card min-h-[700px]" :bordered="false">
          <Chart :options="langOpt"></Chart>
        </n-card>
        <n-card class="base-card" :bordered="false">
          <div class="px-4 flex mb-4 items-center justify-between">
            <div class="title"> O'rni</div>
          </div>
          <div class="-m-6 pt-6">
            <table class="c-table2">
              <thead>
                <tr>
                  <th style="width: 50px">№</th>
                  <th>Fakultet nomi</th>
                  <th class="one-line">Reytingi</th>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(item, i) in data" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.title }}</td>
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
