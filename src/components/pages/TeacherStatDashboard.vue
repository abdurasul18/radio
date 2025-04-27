<script lang="ts" setup>
import highchart from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import { Chart, ChartProps } from "highcharts-vue";
import VariablePie from "highcharts/modules/variable-pie.js";
import {
  generateHighChartColumnOpt,
  generateHighChartDonutOpt,
  generateHighChartPieOpt,
} from "/@src/pages/index/rating/utils/highChartOpt";
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
  let values = data.value
    .sort((a, b) => b.total_rate - a.total_rate)
    .slice(0, 10)
    .map((item) => item.total_rate);
  return generateHighChartColumnOpt("Reyting TOP-10", labels, values);
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
    <n-spin :show="loading">
      <div class="grid gap-4 xl:grid-cols-2">
        <n-card class="base-card min-h-[700px]" :bordered="false">
          <n-scrollbar x-scrollable>
            <Chart :options="chartOpt"></Chart>
          </n-scrollbar>
        </n-card>
        <n-card class="base-card h-max" :bordered="false">
          <div class="px-4 flex gap-4 mb-4 items-center justify-between">
            <n-input
              v-model:value="search"
              clearable
              size="large"
              :placeholder="$t('actions.search')"
              class="search-input "
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
                <template v-for="(item, i) in filteredData">
                  <tr v-if="i < 10">
                    <td>{{ i + 1 }}</td>
                    <td>
                      {{ item.last_name }} {{ item.first_name }} {{ item.middle_name }}
                    </td>
                    <td>{{ item.degree_name }}</td>
                    <td>{{ item.total_rate }}</td>
                  </tr>
                </template>
              </tbody>
              <AppNotFound v-else mode="table" />
            </table>
          </div>
        </n-card>
        <div class="col-span-full flex justify-center">
          <CButton ghost class="min-w-[300px]" @click="$router.push('/rating/teacher')">
            Barchasini ko'rish
            <CIcon name="right" class="ml-2" />
          </CButton>
        </div>
      </div>
    </n-spin>
  </div>
</template>
<style lang="scss">
.highcharts-credits {
  display: none;
}
</style>
