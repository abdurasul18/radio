<script lang="ts" setup>
import { TaskService, ITask } from "/@src/services/task";
import { useApiService } from "/@src/composable/getList";

const { list, loading, fetchData } = useApiService<ITask>(TaskService.getList, ref({}), false);
onMounted(() => {
  fetchData();
});
let options = computed(() => {
  return list.value.map((item) => ({
    name: `${item.title}-(${item.criterion?.name})`,
    id: item.id,
  }));
});
</script>

<template>
  <CSelect :options="options" :loading="loading" v-bind="$attrs" />
</template>
