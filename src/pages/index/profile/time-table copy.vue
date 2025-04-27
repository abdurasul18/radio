<script lang="ts" setup>
import { UserService } from "/@src/services/user";
import { TimeTableService } from "/@src/services/time-table";
import { addDays, isYesterday } from "date-fns";
import { useAuthStore } from "/@src/store/auth";
const { user } = toRefs(useAuthStore());
let loading = ref(false);
let addShow = ref(false);
let list = ref([]);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "") || user.value.id;
});
let activeDate = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});
let from_date = computed(() => {
  return new Date(activeDate.value.year, activeDate.value.month - 1, 1)
    .toISOString()
    .split("T")[0];
});
let to_date = computed(() => {
  return new Date(activeDate.value.year, activeDate.value.month, 0)
    .toISOString()
    .split("T")[0];
});
async function getList() {
  try {
    loading.value = true;
    let res = await TimeTableService.getOwn({
      from_date: from_date.value,
      to_date: to_date.value,
    });
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getList();
});
watch(
  () => [from_date.value, to_date.value],
  () => {
    getList();
  }
);

function onPanelChange(info: { year: number; month: number }) {
  activeDate.value = {
    month: info.month,
    year: info.year,
  };
}
let value = ref(addDays(Date.now(), 1).valueOf());
</script>
<template>
  <div>
    <n-spin :show="loading" size="large">
      <n-card class="base-card" :bordered="false">
        <div class="flex justify-between mb-9">
          <div class="text-[28px] font-semibold">Dars jadvali</div>
        </div>
        <div class="-m-4 pt-6">
          <n-calendar
            v-model:value="value"
            #="{ year, month, date }"
            @panel-change="onPanelChange"
          >
           <div v-if="activeDate.month == month && activeDate.year == year"> 
            {{ date }}.{{ month }}.{{ year }}
           </div>
          </n-calendar>
        </div>
      </n-card>
    </n-spin>
  </div>
</template>
<style lang="scss"></style>
