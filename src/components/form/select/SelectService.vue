<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ServiceService, IService } from "/@src/services/service";
let props = defineProps<{
  category_id?: string;
}>();
let paramsAdd = computed(() => {
  return {
    query: {
      category_id: props.category_id ? props.category_id : null,
    },
  };
});
let { loading, list, search, fetchData } = useApiServiceAll<IService>(
  ServiceService.getList, paramsAdd, true
);
onMounted(() => {
  fetchData();
});
let options = computed(() => {
  return list.value.map((el) => {
    return {
      ...el,
      id: el.id,
      name: el.name_uz,
    };
  });
});
</script>
<template>
  <CSelect
    label="Xizmat turi"
    icon="geometric"
    :options="options"
    :loading="loading"
    v-bind="$attrs"
  />
</template>
<style lang="scss"></style>
