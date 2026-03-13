<script lang="ts" setup>
import { ProductStatus } from "/@src/services/organization";
const props = defineProps<{
  value?: any;
  isAll?: boolean;
}>();
let emits = defineEmits(["update:value"]);
const options = Object.keys(ProductStatus).map((key) => {
  return {
    name: (ProductStatus as any)[key] as string,
    id: key as any,
  };
});

let compVal = computed({
  get: () => props.value,
  set: (v) => {
    emits("update:value", v);
  },
});
</script>

<template>
  <select class="c-select-grey" v-model="compVal"
    :class="[
    value == 1
      ? 'text-yellow-500'
      : value == 2
      ? 'text-green-500'
      : value == 3
      ? 'text-red-500'
      : '',
    ]"
  >
   <option :value="null" v-if="isAll">
      Barchasi
    </option>
    <option
      v-for="option in options"
      :value="option.id"
      :class="[
        option.id == 1
          ? 'text-yellow-500'
          : option.id == 2
          ? 'text-green-500'
          : option.id == 3
          ? 'text-red-500'
          : '',
      ]"
    >
      {{ option.name }}
    </option>
   
  </select>
</template>
