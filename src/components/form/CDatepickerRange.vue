<script setup lang="ts">
import { IconName } from "../ui/CIcon.vue";

let props = withDefaults(
  defineProps<{
    label: string;
    clearable: boolean;
    schema?: any;
    value?: any;
    simple?: boolean;
    small?: boolean;
    message?: string;
    light?: boolean;
    medium?: boolean;
  }>(),
  {
    medium: true,
    label: "",
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
let datepickerRef = ref<any>(null);
let show = ref(false);
function focus() {
  datepickerRef.value?.focus();
  show.value = true;
}
</script>
<template>
  <div>
    <label
      :for="id"
      class="base-datepicker-range flex items-center w-full bg-grey-50 rounded-[10px]"
      :class="[
        focused || compVal ? 'base-datepicker-focus' : '',
        focused ? 'base-datepicker-border' : '',
        schema?.$error ? 'error' : '',
        simple ? 'simple' : '',
        small ? 'small' : '',
        light ? 'bg-white' : '',
        medium ? 'medium' : '',
      ]"
    >
      <div class="mr-2" @click="focus">
        <CIcon name="calendar" />
      </div>
      <div class="relative w-full">
        <div class="text">{{ $t("tabel.fromDate") }} / {{ $t("tabel.endDate") }}</div>
        <n-date-picker
          class="-mb-2"
          v-model:formatted-value="compVal"
          end-placeholder=" "
          start-placeholder=" "
          :placeholder="$t('field.dateFormat')"
          type="daterange"
          clearable
          :format="'dd.MM.yyyy'"
          :value-format="'dd.MM.yyyy'"
          :actions="null"
          :update-value-on-close="true"
          :close-on-select="true"
          :first-day-of-week="0"
          :status="schema?.$error ? 'error' : 'success'"
          @focus="focused = true"
          @blur="focused = false"
          ref="datepickerRef"
          v-model:show="show"
          v-bind="$attrs"
        />
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
.base-datepicker-range {
  @apply border border-grey-100;
  padding: 14px;
  &.error {
    @apply border border-red-500;
  }
  &.medium {
    padding: 10px;
    .text {
      font-size: 14px;
      top: 2px;
    }
    .n-input__input-el {
      font-size: 14px;
    }
  }
  &.small {
    padding: 8px 14px;
    .text {
      font-size: 14px;
      top: 0;
    }
    .n-date-picker {
      margin-bottom: -12px;
    }
    .n-input__input-el {
      font-size: 14px;
    }
  }
  .n-input {
    background: transparent !important;
    border: 0;
    .n-input__input-el {
      text-align: left !important;
    }
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
  &.base-datepicker-focus {
    .n-input__separator {
      margin-left: -50px;
      margin-right: 20px;
      .n-date-picker-icon {
        display: block !important;
      }
    }
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
  //
  &.simple {
    padding: 3px 5px;
    .text {
      display: none;
    }
    .n-date-picker {
      margin-bottom: 0;
    }
    .n-input__input-el {
      font-size: 14px;
      @apply text-grey-800;
      font-weight: normal;
    }
  }
}
</style>
