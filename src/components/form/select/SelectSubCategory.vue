<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { CategoryCode } from "/@src/services/category";
import { SubcategoryService, ISubcategory } from "/@src/services/subcategory";
const props = defineProps<{
  category: CategoryCode;
}>();
const paramsAdd = computed(() => {
  return {
   query: {
      category: props.category,
    },
  };
});
let { loading, list, search, fetchData } = useApiServiceAll<ISubcategory>(
  SubcategoryService.getList,
  paramsAdd,
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
