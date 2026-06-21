<script lang="ts" setup>
import { CATEGORY_ENUM } from '/@src/services/category';

const props = defineProps<{
  isTransport?: boolean;
}>()

let options = computed(() => {
  let opts = CATEGORY_ENUM;
  if (props.isTransport) {
    opts = opts.filter(item => ['car', 'truck'].includes(item.id));
  }
  return opts;
})

</script>
<template>
  <CSelect label="Kategoriya" icon="category" :options="options" v-bind="$attrs" />
</template>
<style lang="scss"></style>
