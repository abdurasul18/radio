<script lang="ts" setup>
let props = withDefaults(
  defineProps<{
    mode?: "table" | "card";
  }>(),
  {
    mode: "card",
  }
);
</script>
<template>
  <div
    v-if="mode == 'card'"
    class="flex flex-col w-full justify-center items-center text-center min-h-[300px]"
  >
    <div class="mb-6"><img src="/img/not-found.png" alt="" /></div>
    <div class="font-semibold">Ma'lumot topilmadi</div>
  </div>
  <td colspan="10" v-else class="app-not-found">
    <div
      class="flex flex-col w-full justify-center items-center text-center min-h-[300px]"
    >
      <div class="mb-6"><img src="/img/not-found.png" alt="" /></div>
      <div class="font-semibold">Ma'lumot topilmadi</div>
    </div>
  </td>
</template>
<style lang="scss"></style>
