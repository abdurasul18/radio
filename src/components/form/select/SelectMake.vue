<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { IMake, MakesService } from "/@src/services/makes";

let { loading, list, search, fetchData } = useApiServiceAll<IMake>(
  MakesService.getList,
  ref({}),
  true
);
onMounted(() => {
  fetchData();
});
</script>
<template>
  <CSelect
    icon="category"
    :options="list"
    :loading="loading"
    label-field="name"
    v-bind="$attrs"
  />
</template>
<style lang="scss"></style>
