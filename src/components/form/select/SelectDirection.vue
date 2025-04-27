<script lang="ts" setup>
import { DirectionService, IDirection } from "/@src/services/direction";
import { useApiService } from "/@src/composable/getList";

const { list, loading, fetchData } = useApiService<IDirection>(DirectionService.getList, ref({}), false);
onMounted(() => {
  fetchData();
});
let options = computed(() => {
  return list.value.map((item) => ({
    name: `${item.name}`,
    id: item.id,
  }));
});
</script>

<template>
  <CSelect :options="options" :loading="loading" v-bind="$attrs" />
</template>
