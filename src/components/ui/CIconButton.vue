<script lang="ts" setup>
import { IconName } from "./CIcon.vue";

let props = defineProps<{
  icon: IconName;
}>();
</script>
<template>
  <n-button class="c-icon-button" strong secondary circle size="large">
    <template #icon>
      <CIcon :name="icon" />
    </template>
  </n-button>
</template>
<style lang="scss">
.c-icon-button {
  path {
    stroke: var(--n-text-color-focus);
  }
  &:not(.n-button--disabled):focus {
    path {
      stroke: var(--n-text-color-focus);
    }
  }
  &.n-button--small-type {
    padding: 17px!important;
    .n-button__content {
      font-size: 12px;
      svg {
        width: 16px !important;
      }
    }
  }
}
</style>
