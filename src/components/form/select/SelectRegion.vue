<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { IRegion, RegionService } from "/@src/services/region";
let props = defineProps<{
  category_id?: string;
}>();
let paramsAdd = computed(() => {
  return {
    query: {},
  };
});
let { loading, list, search, fetchData } = useApiServiceAll<IRegion>(
  RegionService.getList,
  paramsAdd,
  true
);
onMounted(() => {
  fetchData();
});
</script>
<template>
  <CSelect
    label="Shtatlar"
    icon="location"
    :options="list"
    :loading="loading"
    v-bind="$attrs"
  />
</template>
<style lang="scss"></style>
