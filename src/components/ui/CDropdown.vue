<script lang="ts" setup></script>
<template>
  <n-tooltip
    class="c-dropdown"
    placement="bottom-end"
    trigger="click"
    raw
    :show-arrow="false"
  >
    <template #trigger>
      <slot name="trigger">
        <CIconButton icon="menu" />
      </slot>
    </template>
    <n-card class="base-card-small">
      <slot></slot>
    </n-card>
  </n-tooltip>
</template>
<style lang="scss">
.c-dropdown {
  border-radius: 12px;
  box-shadow: 0 12px 24px 0 #0000001f;
  overflow: hidden;
  .n-card {
    border-radius: 12px;
    max-width: 300px;
  }
  .n-card__content {
    padding: 0!important;
  }
  .c-dropdown-content {
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  .c-dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
      @apply bg-grey-50;
    }
    svg {
      flex-shrink: 0;
    }
  }
}
</style>
