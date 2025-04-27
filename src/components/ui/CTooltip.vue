<script lang="ts" setup></script>
<template>
  <n-tooltip trigger="hover" raw class="c-tooltip" placement="top-end" v-bind="$attrs">
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
    <div class="text-grey-900 p-2 max-w-[250px] bg-white">
      <slot></slot>
    </div>
  </n-tooltip>
</template>
<style lang="scss">
.c-tooltip {
  .n-popover-arrow {
    background-color: #fff !important;
  }
}
</style>
