<script setup lang="ts">
import { IconName } from "../ui/CIcon.vue";

let props = withDefaults(
  defineProps<{
    label: string;
    type: string;
    clearable: boolean;
    showPasswordOn?: "click" | "mousedown";
    icon?: IconName;
    schema?: any;
    value?: any;
    message?: string;
    disabled?: boolean;
    small?: boolean;
    medium?: boolean;
    placeholder?: string;
    simple?: boolean;
  }>(),
  {
    label: "",
    medium: true,
    type: "text",
    clearable: true,
  }
);
let emits = defineEmits(["update:value"]);
let compVal = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("update:value", val);
  },
});

let focused = ref(false);
let id = Math.random().toString(36).substring(7);
let inputRef = ref();
function focus() {
  inputRef.value.focus();
}
</script>
<template>
  <div>
    <label
      :for="id"
      @click="focus"
      class="base-input flex items-center w-full bg-grey-50 rounded-[10px]"
      :class="[
        focused || compVal || compVal == '0' ? 'base-input-focus' : '',
        focused ? 'base-input-border' : '',
        schema?.$error ? 'error' : '',
        small ? 'small' : '',
        medium ? 'medium' : '',
        disabled ? 'disabled' : '',
        simple ? 'simple' : '',
      ]"
    >
      <div class="mr-4 flex" v-if="icon && type !== 'textarea'">
        <CIcon :width="!medium ? 24 : 20" :height="!medium ? 24 : 20" :name="icon" />
      </div>
      <div class="relative w-full">
        <div v-if="!simple" class="text">{{ label }}</div>
        <n-input
          :id="id"
          class="-mb-2"
          @focus="focused = true"
          @blur="focused = false"
          :status="schema?.$error ? 'error' : ''"
          v-bind="props"
          :placeholder="focused ? placeholder || ' ' : ' '"
          v-model:value="compVal"
          ref="inputRef"
          clearable
        >
        </n-input>
        <div class="absolute right-5 -top-[0px]">
          <slot name="suffix"> </slot>
        </div>
      </div>
    </label>
    <p
      v-if="schema?.$error"
      class="text-error text-sm mt-[2px]"
      :class="[small ? 'text-xs' : '']"
    >
      {{ message ? message : schema?.$model ? $t("error.invalid") : $t("error.empty") }}
    </p>
  </div>
</template>

<style lang="scss">
.base-input {
  @apply border border-grey-100;
  padding: 16px;
  &.simple {
    .n-input {
      margin-top: 0!important;
      bottom: 0!important;
    }
  }
  &.error {
    @apply border border-error;
  }
  &.disabled {
    .text {
      @apply text-grey-500;
    }
    svg {
      opacity: 0.5;
    }
  }
  &.medium {
    padding: 12px;
    .text {
      font-size: 14px;
      top: 0;
    }
    &.base-input-focus .text {
      top: -8px;
    }
    .n-input__input-el {
      font-size: 14px !important;
    }
  }
  &.small {
    padding: 9px 14px;
    .text {
      font-size: 14px;
      top: 0;
    }
    .n-input__input-el {
      font-size: 14px;
    }
  }
  .n-input {
    background: transparent !important;
    border: 0;
    position: relative;
    bottom: -5px;
  }
  .n-input__border {
    display: none;
  }
  .n-input__state-border {
    display: none;
  }
  .n-input-wrapper {
    padding: 0;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
  }
  .n-input__input-el, .n-input__textarea-el {
    font-size: 16px;
    height: 20px;
    @apply text-grey-800;
    font-weight: 600;
  }
  //
  .text {
    position: absolute;
    top: -2px;
    left: 0;
    font-size: 16px;
    transition: all 0.1s;
  }
  &.base-input-focus {
    &.small {
      .text {
        top: -8px;
      }
    }
    .text {
      top: -10px;
      font-size: 12px;
      @apply text-grey-800;
    }
  }
  &.base-input-border {
    @apply border-blue-500;
    box-shadow: 0px 0px 0px 4px #00aaff40;
  }
  &.error {
    @apply border-error;
    &.base-input-border {
      box-shadow: 0px 0px 0px 4px #f0abab40;
    }
  }
}
</style>
