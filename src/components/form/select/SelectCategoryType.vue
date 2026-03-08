<script lang="ts" setup>
import { categoryTypes } from "/@src/services/category";
</script>

<template>
  <CSelect :options="categoryTypes" v-bind="$attrs" icon="category" />
</template>
