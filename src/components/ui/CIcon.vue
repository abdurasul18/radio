<script lang="ts" setup async>
import { defineAsyncComponent, render } from "vue";

export type IconName =
  | "plus"
  | "mail"
  | "income"
  | "send"
  | "folder"
  | "control"
  | "draft"
  | "file"
  | "info"
  | "notification"
  | "down"
  | "down2x"
  | "category"
  | "note"
  | "user"
  | "lock"
  | "bag"
  | "time"
  | "money"
  | "bed"
  | "sertificate"
  | "eye"
  | "more"
  | "search"
  | "filter"
  | "times"
  | "telephone"
  | "phone"
  | "key"
  | "geometric"
  | "docflow"
  | "hrm"
  | "scan"
  | "faceID"
  | "task"
  | "lms"
  | "news"
  | "chat"
  | "people"
  | "print"
  | "sign"
  | "clock"
  | "justify"
  | "upload"
  | "download"
  | "minus-circle"
  | "department"
  | "cube"
  | "delete"
  | "edit"
  | "calendar"
  | "hashtag"
  | "translate"
  | "menu"
  | "menu2"
  | "location"
  | "userID"
  | "book"
  | "award"
  | "users"
  | "plane"
  | "language"
  | "file-upload"
  | "pen"
  | "check"
  | "copy"
  | "lock2"
  | "meeting"
  | "receive"
  | "focus"
  | "target"
  | "lamp"
  | "list-number"
  | "percent"
  | "user-switch"
  | "check-double"
  | "task2"
  | "chart"
  | "tick"
  | "tick2x"
  | "right"
  | "home"
  | "education";
let props = withDefaults(
  defineProps<{
    name: IconName;
  }>(),
  {}
);
const icons = import.meta.glob("../../assets/img/svg/*.svg");

async function getIcon(fileName: string) {
  const module = (await icons[`../../assets/img/svg/${fileName}.svg`]()) as any;
  return module.default;
}
const AsyncSvgComponent = defineAsyncComponent(
  /* @vite-ignore */
  () => getIcon(props.name) // Path to your SVG component
);
</script>
<template>
  <AsyncSvgComponent />
</template>
<style lang="scss">
.light-svg {
  path {
    stroke: #fff !important;
  }
  circle {
    stroke: #fff !important;
  }
}
.info-svg {
  path {
    stroke: #00aaff !important;
  }
}
.success-svg {
  path {
    stroke: #43c073 !important;
  }
  circle {
    stroke: #43c073 !important;
  }
}
.error-svg {
  path {
    stroke: #ff2727 !important;
  }
  circle {
    stroke: #ff2727 !important;
  }
}
.warning-svg {
  path {
    stroke: #ff9f00 !important;
  }
  circle {
    stroke: #ff9f00 !important;
  }
}
</style>
