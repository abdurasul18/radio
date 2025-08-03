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
</script>
<template>
  <CSelect
    label="Xizmat turi"
    icon="geometric"
    :options="list"
    :loading="loading"
    v-bind="$attrs"
  />
</template>
<style lang="scss"></style>
