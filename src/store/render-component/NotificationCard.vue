<script lang="ts" setup>
import { i18n } from "/@src/plugins/i18n";
import { INotification } from "/@src/services/notification";
let props = defineProps<{ data: INotification }>();
const router = useRouter();
function view() {
  router.push(`/docs/income?prefix=${props.data.prefix || ""}`);
}
</script>
<template>
  <div class="grid gap-1">
    <div class="font-semibold text-base flex gap-2" style="line-height: 1;">
      <CIcon name="info" /> Sizda imzolash uchun buyruq bor
    </div>
    <div class="flex gap-2">
      <div v-if="data.prefix" class="text-blue-500 flex gap-1"><CIcon width="16" class="info-svg" name="hashtag" /> {{ data.prefix }}</div>
      <div class="text-grey-800"> {{ data.title }}</div>
    </div>
    <div class="text-grey-500 text-xs ">{{ data.date }}</div>
    <div class="flex justify-end gap-4">
      <n-button class="ml-4" secondary type="info" @click="view()">
        {{ i18n.global.t("actions.view") }}
      </n-button>
    </div>
  </div>
</template>
<style lang="scss"></style>
