<script lang="ts" setup>
import { useApiService } from "/@src/composable/getList";
import { RoleType } from "/@src/services/auth";
let emits = defineEmits(["update:value"]);
let options = Object.keys(RoleType).map((item) => {
  return {
    name: RoleType[item],
    id: item,
  };
});

</script>

<template>
  <CSelect :options="options" v-bind="$attrs" />
</template>
