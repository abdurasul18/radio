<script setup lang="ts">
import moment from "moment";
import { IconName } from "../ui/CIcon.vue";

let props = withDefaults(
  defineProps<{
    label: string;
    type: string;
    clearable: boolean;
    showPasswordOn?: "click" | "mousedown";
    schema?: any;
    value?: any;
    isNextDisabled?: boolean;
    beginDate?: string;
    endDate?: string;
    medium?: boolean;

  }>(),
  {
    label: "",
    type: "text",
    clearable: true,
    medium: true,

  }
);
let emits = defineEmits(["update:value"]);
let compVal = computed({
  get() {
    return props.value || null;
  },
  set(val) {
    emits("update:value", val);
  },
});

let focused = ref(false);
let id = Math.random().toString(36).substring(7);
function dateDisabled(ts: number) {
  if (props.isNextDisabled) {
    return ts + 24 * 60 * 60 * 1000 >= Date.now();
  } else if (props.beginDate) {
    return ts + 24 * 60 * 60 * 1000 <= moment(props.beginDate, "DD.MM.YYYY").valueOf();
  } else if (props.endDate) {
    return ts + 24 * 60 * 60 * 1000 >= moment(props.endDate, "DD.MM.YYYY").valueOf();
  } else {
    return false;
  }
}
</script>
<template>
  <div>
    <label
      :for="id"
      class="base-datepicker flex items-center w-full bg-grey-50 p-3 rounded-[10px]"
      :class="[
        focused || compVal ? 'base-datepicker-focus' : '',
        focused ? 'base-datepicker-border' : '',
        schema?.$error ? 'error' : '',
        medium ? 'medium' : '',

      ]"
    >
      <div class="mr-3">
        <CIcon name="calendar" />
      </div>
      <div class="relative w-full">
        <div class="text">{{ label }}</div>
        <n-date-picker
          class="-mb-2"
          v-model:formatted-value="compVal"
          type="year"
          :actions="null"
          :format="'yyyy'"
          value-format="yyyy"
          :placeholder="focused ? 'yyyy' : ' '"
          v-maska="'####'"
          :status="schema?.$error ? 'error' : 'success'"
          :first-day-of-week="0"
          @focus="focused = true"
          @blur="focused = false"
          clearable
          :is-date-disabled="dateDisabled"
          v-bind="$attrs"
        />
      </div>
    </label>
    <p v-if="schema?.$error" class="text-error text-sm mt-[2px]">
      {{ $t("error.empty") }}
    </p>
  </div>
</template>

<style lang="scss">
.base-datepicker {
  @apply border border-grey-100;
  &.error {
    @apply border border-red-500;
  }
  &.medium {
    padding: 10px;
    .text {
      top: 0;
      font-size: 14px;
    }
    .n-input__input-el {
      font-size: 14px !important;
    }
    .n-date-picker {
      margin-bottom: -11px;
    }
  }
  .n-input {
    background: transparent !important;
    border: 0;
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
  .n-input__input-el {
    font-size: 16px;
    @apply text-grey-800;
    font-weight: 600;
  }
  //
  .text {
    position: absolute;
    top: 2px;
    left: 0;
    font-size: 16px;
    transition: all 0.1s;
  }
  &.base-datepicker-focus {
    .text {
      top: -8px;
      font-size: 12px;
      @apply text-grey-800;
    }
  }
  &.base-datepicker-border {
    @apply border-blue-500;
    box-shadow: 0px 0px 0px 4px #00aaff40;
    &.error {
      box-shadow: 0px 0px 0px 4px #f0abab40;
    }
  }
  &.error {
    @apply border-red-500;
  }
  //
  .n-date-picker-icon {
    display: none !important;
  }
}
</style>
