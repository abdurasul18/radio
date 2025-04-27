<script lang="ts" setup>
import { IconName } from "./CIcon.vue";

defineProps<{
  icon: IconName;
}>();
</script>
<template>
  <button
    class="flex justify-center items-center cursor-pointer w-9 h-9 rounded-full hover:bg-grey-50"
  >
    <CIcon width="20" class="c-icon-hover" :name="icon" />
  </button>
</template>
<style lang="scss"></style>
