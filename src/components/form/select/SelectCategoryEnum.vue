<script lang="ts" setup>
import { CATEGORY_ENUM } from '/@src/services/category';


</script>
<template>
  <CSelect
    label="Kategoriya"
    icon="category"
    :options="CATEGORY_ENUM"
    v-bind="$attrs"
  />
</template>
<style lang="scss"></style>
