<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ModelsService, IModel } from "/@src/services/models";

let { loading, list, search, fetchData } = useApiServiceAll<IModel>(
  ModelsService.getList,
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
