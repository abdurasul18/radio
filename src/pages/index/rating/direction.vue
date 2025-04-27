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
import { IDirectionRating, RatingService } from "/@src/services/rating";
highcharts3d(highchart);
VariablePie(highchart);
const { t } = useI18n();
let data = ref<IDirectionRating[]>([]);
let chartOpt = computed<any>(() => {
  let labels = data.value.map((item) => item.name);
  let values = data.value.map((item) => item.total_rate);
  return generateHighChartColumnOpt("Kafedralar", labels, values);
});
let chartOpt2 = computed<any>(() => {
  return generateHighChartDonutOpt(`Kafedralar`, data.value.map((item) => {
    return [
      item.name,
      item.total_rate
    ]
  }));
});
let loading = ref(false);
async function getData() {
  try {
    loading.value = true;
    let res = await RatingService.byDirection();
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
    <AppTitle> Reytinglar / Kafedralar bo'yicha </AppTitle>

    <n-spin :show="loading">
      <div class="grid gap-4 md:grid-cols-2">
        <n-card class="base-card min-h-[700px]" :bordered="false">
          <Chart :options="chartOpt"></Chart>
        </n-card>
        <n-card class="base-card " :bordered="false">
          <div class="px-4 flex mb-4 items-center justify-between">
            <div class="title"> O'rni</div>
          </div>
          <div class="-m-6 pt-6">
            <table class="c-table2">
              <thead>
                <tr>
                  <th style="width: 50px">№</th>
                  <th>Kafedra nomi</th>
                  <th class="one-line">Reytingi</th>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(item, i) in data" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td >{{ item.total_rate }}</td>
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
