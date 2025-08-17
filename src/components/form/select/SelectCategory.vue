<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { CategoryService, ICategory } from "/@src/services/category";

let { loading, list, search, fetchData } = useApiServiceAll<ICategory>(
  CategoryService.getList,
  ref({}),
  true
);
onMounted(() => {
  fetchData();
});
</script>
<template>
  <CSelect
    label="Kategoriya"
    icon="category"
    :options="list"
    :loading="loading"
    label-field="name_uz"
    v-bind="$attrs"
  />
</template>
<style lang="scss"></style>
