<script lang="ts" setup>
import { IconName } from "../ui/CIcon.vue";

let props = withDefaults(
  defineProps<{
    type?: "primary" | "info" | "success" | "warning" | "error" | "default";
    loading?: boolean;
    ghost?: boolean;
    icon?: IconName;
    size?: "small" | "medium" | "large";
  }>(),
  {
    type: "info",
    ghost: false,
    size: "medium",
  }
);
</script>
<template>
  <n-button class="base-button" :class="[props.size]" v-bind="props">
    <CIcon v-if="props.icon" :name="props.icon" class="mr-2" />
    <slot></slot>
  </n-button>
</template>
<style lang="scss">
.base-button {
  padding: 28px;
  border-radius: 10px;
  &.n-button--ghost {
    .n-button__border {
      border: 1px solid #d7d9e0 !important;
    }
  }
  .n-button__content {
    font-size: 16px;
    font-weight: 600;
  }
  path, circle {
    stroke: var(--n-text-color-focus) !important;
  }
  &:not(.n-button--disabled):focus {
    path, circle {
      stroke: var(--n-text-color-focus) !important;
    }
  }
  // medium
  &.medium {
    padding: 24px;
    .n-button__content {
      font-size: 14px;
    }
  }
  // small
  &.small {
    padding: 16px;
    .n-button__content {
      font-size: 12px;
      svg {
        width: 16px!important;
      }
    }
  }
}
</style>
