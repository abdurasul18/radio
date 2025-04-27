<script lang="ts" setup>
import type { VNode } from "vue";
import { h } from "vue";
import type { SelectOption } from "naive-ui";
import { NTooltip } from "naive-ui";
import { IconName } from "../ui/CIcon.vue";
let props = withDefaults(
  defineProps<{
    schema?: any;
    label: string;
    icon?: IconName;
    value?: any;
    options?: SelectOption[];
    onUpdateShow?: any;
    loading?: boolean;
    defaultExpandedKeys?: number[];
    medium?: boolean;
    multiple?: boolean;
    small?: boolean;
  }>(),
  {
    medium: true,
  }
);
let emits = defineEmits(["update:value", "search", "update:show", "update:valueObj"]);
let focused = ref(false);
let compVal = computed({
  get: () => props.value,
  set: (v) => {
    emits("update:value", v);
    if (props.multiple && Array.isArray(v)) {
      emits(
        "update:valueObj",
        v.map((el) => findElementById(props.options?.[0], el))
      );
    } else {
      emits("update:valueObj", findElementById(props.options?.[0], v));
    }
  },
});
let id = Math.random().toString(36).substring(7);
//
function renderOption({ node, option }: { node: VNode; option: SelectOption }) {
  if ((option.name as string).length > 50) {
    return h(
      NTooltip,
      { class: "select-tooltip", placement: "right" },
      {
        trigger: () => node,
        default: () => `${option.name}`,
      }
    );
  }
  return node;
}
function findElementById(tree: any, id: string) {
  if (tree?.id === id) {
    return tree;
  }
  if (Array.isArray(tree.children)) {
    for (const child of tree.children) {
      const result: any = findElementById(child, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
</script>
<template>
  <div>
    <label
      :for="id"
      class="base-tree-select flex items-center w-full bg-grey-50 pb-3 rounded-[10px]"
      :class="[
        focused || (multiple ? compVal.length : compVal) ? 'base-tree-select-focus' : '',
        focused ? 'base-tree-select-border' : '',
        icon ? 'with-icon' : '',
        schema?.$error ? 'error' : '',
        medium ? 'medium' : '',
        multiple ? 'multiple' : '',
        small ? 'small' : '',
      ]"
    >
      <div class="mr-3" v-if="icon">
        <CIcon :name="icon" />
      </div>
      <div class="relative w-full">
        <div class="text">{{ label }}</div>
        <n-tree-select
          filterable
          clearable
          remote
          key-field="id"
          label-field="name"
          :status="schema?.$error ? 'error' : ''"
          :id="id"
          class="-mb-2"
          placeholder=" "
          @focus="focused = true"
          @blur="focused = false"
          @search="(s:string) => $emit('search', s)"
          v-bind="props"
          v-model:value="compVal"
        />
      </div>
    </label>
    <p v-if="schema?.$error" class="text-error text-sm mt-[2px]">
      {{ $t("error.empty") }}
    </p>
  </div>
</template>
<style lang="scss">
.base-tree-select {
  @apply border border-grey-100;
  padding: 16px 16px 12px 16px;
  &.error {
    @apply border-error;
  }
  &.with-icon {
    .n-tree-select {
      margin-left: -55px !important;
      width: calc(100% + 70px) !important;
    }
  }
  &.medium {
    padding: 12px 12px 8px 12px;
    .text {
      font-size: 14px;
    }
  }
  &.small {
    padding: 5px 10px;
    .text {
      font-size: 14px;
      top: 2px;
    }
    &.base-tree-select-focus {
      .text {
        top: -5px !important;
      }
    }
    .n-base-selection-overlay__wrapper {
      font-size: 14px !important;
    }
  }
  
  //
  &.multiple {
    padding: 5px 11px;
    .text {
      top: 5px !important;
    }
    &.base-tree-select-focus {
      .text {
        top: -5px !important;
      }
    }

    .n-tag__content {
      line-height: 1 !important;
    }
  }
  .n-tree-select {
    margin-left: -15px !important;
    width: calc(100% + 30px) !important;
  }
  .n-base-selection-label {
    background: transparent !important;
    border: 0;
  }
  .n-base-suffix {
    top: 40% !important;
  }
  .n-base-selection__border {
    display: none;
  }
  .n-base-selection__state-border {
    display: none;
  }
  .n-base-selection-label__render-label {
    padding-left: 0 !important;
  }
  &.with-icon {
    .n-base-selection-input,
    .n-base-selection-overlay__wrapper {
      padding-left: 55px !important;
    }
  }
  .n-base-selection-input,
  .n-base-selection-overlay__wrapper {
    padding-left: 15px !important;
    font-size: 16px;
    @apply text-grey-800;
    font-weight: 600;
  }
  //
  .text {
    position: absolute;
    top: 0px;
    left: 0;
    font-size: 16px;
    transition: all 0.1s;
  }
  &.base-tree-select-focus {
    .text {
      top: -8px;
      font-size: 12px;
      @apply text-grey-800;
    }
  }
  &.base-tree-select-border {
    @apply border-blue-500;
    box-shadow: 0px 0px 0px 4px #00aaff40;
    &.error {
      box-shadow: 0px 0px 0px 4px #f0abab40;
    }
  }
  // error
  &.error {
    &.base-tree-select-border {
      @apply border-error;
    }
  }

  //
  .n-base-selection-tags {
    background-color: transparent !important;
    padding-left: 54px;
    margin-top: 7px;
    .n-tag {
      --n-height: auto !important;
      padding: 4px;
      border-radius: 6px;
      .n-base-close {
        border-radius: 50%;
      }
      .n-base-icon,
      svg {
        width: 12px !important;
        height: 12px !important;
        line-break: 12px !important;
      }
    }
  }
}
.n-tree-select-menu {
  @apply border border-grey-400 rounded-xl;
  top: 7px;
  box-shadow: 0px 12px 32px 0px #00000014;
  .n-tree-select-option {
    padding: 12px 16px !important;
  }
  .n-tree-select-option.n-tree-select-option--pending::before {
    border-radius: 8px;
  }
}
</style>
