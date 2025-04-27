<script lang="ts" setup>
import { EduYearService, IAcademicYear } from "/@src/services/edu-year";
import { useApiService } from "/@src/composable/getList";

const { list, loading, fetchData } = useApiService<IAcademicYear>(EduYearService.getList, ref({}), false);
onMounted(() => {
  fetchData();
});
let options = computed(() => {
  return list.value.map((item) => {
    return {
      name: item.title,
      id: item.id,
    };
  });
});
</script>

<template>
  <CSelect :options="options" :loading="loading" v-bind="$attrs" />
</template>
