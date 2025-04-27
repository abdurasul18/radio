<script lang="ts" setup>
let emits = defineEmits(["success", "cancel"]);
let pros = defineProps<{
  title?: string;
}>();
</script>
<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <div class="mb-4">
        <CIcon name="info" width="60" height="60" class="info-svg" />
      </div>
      <div class="text-[28px] font-semibold">{{title || $t("actions.confirm") }}</div>
      <div class="flex justify-center gap-6 mt-6">
        <CButton @click="emits('cancel')" type="default">{{
          $t("actions.cancel")
        }}</CButton>
        <CButton @click="emits('success')" type="success">{{
          $t("actions.confirm")
        }}</CButton>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
