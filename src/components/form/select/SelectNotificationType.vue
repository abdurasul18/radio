<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { NotificationType } from "/@src/services/notification";
const props = defineProps<{
  value?: any;
}>();
let emits = defineEmits(["update:value"]);
let options = Object.keys(NotificationType).map((item) => {
  return {
    name: NotificationType[item],
    id: +item,
  };
});
let compVal = computed({
  get: () => props.value,
  set: (v) => {
    emits("update:value", v);
  },
});
</script>

<template>
  <CSelect
    v-model:value="compVal"
    :options="options"
    :clearable="false"
    label="Turi"
    v-bind="$attrs"
  />
</template>
