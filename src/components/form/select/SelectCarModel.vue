<script lang="ts" setup>
import { useApiServiceAll } from "/@src/composable/getListAll";
import { ModelsService, IModel } from "/@src/services/models";
const props = defineProps<{
  make_id?: string
}>()
let { loading, list, search, fetchData } = useApiServiceAll<IModel>(
  ModelsService.getList,
  computed(() => {
    return {
      query: {
        make_id: props.make_id
      }
    }
  }),
  true
);
onMounted(() => {
  fetchData();
});
</script>
<template>
  <CSelect icon="category" :options="list" :loading="loading" label-field="name" v-bind="$attrs" />
</template>
<style lang="scss"></style>
