<script lang="ts" setup>
import { FacultyService, IFaculty } from "/@src/services/faculty";
import { useApiService } from "/@src/composable/getList";

const { list, loading, fetchData } = useApiService<IFaculty>(FacultyService.getList , ref({}), false);
onMounted(() => {
  fetchData();
});
let options = computed(() => {
  return list.value.map((item) => ({
    name: item.title,
    id: item.id,
  }));
});
</script>

<template>
  <CSelect :options="options" :loading="loading" v-bind="$attrs" />
</template>
