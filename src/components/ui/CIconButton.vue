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
  transition: all 0.2s ease;
  border-radius: 10px !important;
  
  path {
    stroke: var(--n-text-color-focus);
  }
  &:not(.n-button--disabled):focus {
    path {
      stroke: var(--n-text-color-focus);
    }
  }
  &:not(.n-button--disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  &:not(.n-button--disabled):active {
    transform: translateY(0);
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
