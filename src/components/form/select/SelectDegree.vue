<script lang="ts" setup>
import { DegreeService, IDegree } from "/@src/services/degree";
import { useApiService } from "/@src/composable/getList";

const { list, loading, fetchData } = useApiService<IDegree>(
  DegreeService.getList,
  ref({}),
  false
);
onMounted(() => {
  fetchData();
});
let options = computed(() => {
  return list.value.map((item) => ({
    ...item,
    name: item.name,
    id: item.id,
  }));
});
</script>

<template>
  <CSelect :options="options" :loading="loading" v-bind="$attrs" />
</template>
