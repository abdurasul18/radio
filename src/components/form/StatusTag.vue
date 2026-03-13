<script lang="ts" setup>
import { ProductStatus } from "/@src/services/organization";

const props = defineProps<{
  status: number;
}>();
</script>
<template>
  <n-tag
  class="w-max"
  round
  v-bind="$attrs"
    :type="
      props.status == 1
        ? 'warning'
        : props.status == 2
        ? 'success'
        : props.status == 3
        ? 'error'
        : 'default'
    "
  >
    {{ ProductStatus[props.status] }}
  </n-tag>
</template>
<style lang="scss"></style>
