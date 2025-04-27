<script lang="ts" setup>
let props = withDefaults(
  defineProps<{
    type?: "primary" | "info" | "success" | "warning" | "error" | "default" | "purple";
    size?: "small" | "medium" | "large";
    color?: {
      color?: string;
      borderColor?: string;
      textColor?: string;
    };
  }>(),
  {
    type: "default",
    size: "large",
  }
);
</script>
<template>
  <n-tag
    :size="size"
    :type="props.type == 'purple' ? 'default' : props.type"
    round
    class="c-tag"
    bordered
    :color="
      props.type === 'purple'
        ? {
            color: '#F5EBFF',
            borderColor: '#E0C2FF',
            textColor: '#8319ED',
          }
        : color
    "
  >
    <slot></slot>
  </n-tag>
</template>
<style lang="scss">
.c-tag {
  &.n-tag--round {
    border-radius: 8px;
  }
  &.rounded {
    border-radius: 20px;
  }
}
.c-tag {
  path, circle {
    stroke: var(--n-text-color)!important;
  }
}
</style>
