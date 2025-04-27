<script lang="ts" setup>
let emits = defineEmits(["success", "cancel"]);
</script>
<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <img src="/img/trash.png" alt="" />
      <div class="text-[28px] font-semibold">{{ $t("actions.delete") }}</div>
      <div class="mt-3">{{ $t("confirm.sureDelete") }}</div>
      <div class="flex justify-center gap-6 mt-6">
        <CButton @click="emits('cancel')" type="default">{{
          $t("actions.cancel")
        }}</CButton>
        <CButton @click="emits('success')" type="error">{{
          $t("actions.delete")
        }}</CButton>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
