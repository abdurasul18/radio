<script lang="ts" setup>
import type { VNode } from "vue";
import { h } from "vue";
import type { SelectOption } from "naive-ui";
import { NTooltip } from "naive-ui";
import { IconName } from "../ui/CIcon.vue";
let props = withDefaults(
  defineProps<{
    schema?: any;
    label?: string;
    icon?: IconName;
    value?: any;
    options?: SelectOption[];
    onUpdateShow?: any;
    loading?: boolean;
    defaultValueLabel?: string;
    valueObj?: any;
    simple?: boolean;
    light?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    small?: boolean;
    medium?: boolean;
    labelField?: string;
  }>(),
  {
    medium: true,
    labelField: "name",
  }
);
let emits = defineEmits(["update:value", "search", "update:show", "update:valueObj"]);
let focused = ref(false);
let compVal = computed({
  get: () => props.value,
  set: (v) => {
    emits(
      "update:valueObj",
      props.options?.find((el) => el.id == v)
    );
    emits("update:value", v);
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
let optionsComp = computed(() => {
  if (props.options?.some((el) => el.id == props.value)) {
    return props.options;
  } else if (props.defaultValueLabel && props.value) {
    return [{ id: props.value, name: props.defaultValueLabel }];
  }
  return props.options;
});
</script>
<template>
  <div>
    <label
      :for="id"
      class="base-select flex items-center w-full bg-grey-50 p-4 pb-3 rounded-[10px]"
      :class="[
        focused || (compVal && compVal?.length !== 0) || (compVal===0) ? 'base-select-focus' : '',
        focused ? 'base-select-border' : '',
        icon ? 'with-icon' : '',
        schema?.$error ? 'error' : '',
        simple ? 'simple' : '',
        light ? 'light' : '',
        multiple ? 'multiple' : '',
        small ? 'small' : '',
        medium ? 'medium' : '',
      ]"
    >
      <div class="mr-3 flex" v-if="icon">
        <CIcon :name="icon" width="20" height="20" />
      </div>
      <div class="relative w-full">
        <div class="text">{{ label }}</div>
        <n-select
          filterable
          clearable
          remote
          show-on-focus
          value-field="id"
          :status="schema?.$error ? 'error' : ''"
          :render-option="renderOption"
          :id="id"
          :placeholder="simple ? label : ' '"
          @focus="focused = true"
          @blur="focused = false"
          @search="(s:string) => $emit('search', s)"
          v-bind="props"
          v-model:value="compVal"
          :options="optionsComp"
        />
      </div>
    </label>
    <p
      v-if="schema?.$error"
      class="text-error text-sm mt-[2px]"
      :class="[small ? 'text-xs' : '']"
    >
      {{ $t("error.empty") }}
    </p>
  </div>
</template>
<style lang="scss">
.base-select {
  @apply border border-grey-100;
  &.error {
    @apply border-error;
  }
  &.medium {
    padding: 10px 12px;
    .text {
      top: 2px;
      font-size: 14px;
    }
    &.base-select-focus {
      .text {
        top: -5px !important;
      }
    }
    .n-base-selection-overlay__wrapper {
      font-size: 14px !important;
    }
  }
  &.small {
    padding: 5px 10px;
    .text {
      font-size: 14px;
    }
    &.base-select-focus {
      .text {
        top: -5px !important;
      }
    }
    .n-base-selection-overlay__wrapper {
      font-size: 14px !important;
    }
  }
  &.light {
    @apply bg-white;
  }
  &.multiple {
    padding: 11px;
    .text {
      top: 5px;
    }
  }

  &.with-icon {
    .n-select {
      margin-left: -55px !important;
      width: calc(100% + 70px) !important;
    }
  }

  //
  .n-select {
    margin-left: -20px !important;
    width: calc(100% + 30px) !important;
    margin-bottom: -8px;
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
    padding-left: 25px !important;
    font-size: 16px;
    @apply text-grey-800;
    font-weight: 600;
  }
  .n-base-selection-placeholder {
    .n-base-selection-overlay__wrapper {
      @apply text-grey-500;
      font-weight: normal;
    }
  }
  //
  .text {
    position: absolute;
    top: 0px;
    left: 0;
    font-size: 16px;
    transition: all 0.1s;
  }
  &.base-select-focus {
    .text {
      top: -8px;
      font-size: 12px;
      @apply text-grey-800;
    }
  }
  &.base-select-border {
    @apply border-blue-500;
    box-shadow: 0px 0px 0px 4px #00aaff40;
    &.error {
      box-shadow: 0px 0px 0px 4px #f0abab40;
    }
  }
  // error
  &.error {
    &.base-select-border {
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
  //
  &.simple {
    padding: 5px 10px;
    .n-base-selection-input {
      margin-top: -8px;
    }
    .n-base-selection-overlay__wrapper {
      margin-top: -8px;
      padding-left: 12px !important;
    }
    .n-base-selection--selected {
      .n-base-selection-overlay__wrapper {
        padding-left: 25px !important;
      }
    }
    .text {
      display: none;
    }
  }
}
.n-base-select-menu {
  @apply border border-grey-400 rounded-xl;
  top: 7px;
  box-shadow: 0px 12px 32px 0px #00000014;
  .n-base-select-option {
    padding: 12px 16px !important;
  }
  .n-base-select-option.n-base-select-option--pending::before {
    border-radius: 8px;
  }
}
</style>
