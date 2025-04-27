<script lang="ts" setup>
import { CriterionService, ICriterion } from "/@src/services/criterion";
import { useApiService } from "/@src/composable/getList";

const { list, loading, fetchData } = useApiService<ICriterion>(CriterionService.getList, ref({}), false);
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
