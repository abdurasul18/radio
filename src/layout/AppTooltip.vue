<script lang="ts" setup>
import { IconName } from "../components/ui/CIcon.vue";
import AppTooltipItem from "./AppTooltipItem.vue";

const projects: {
  icon: IconName;
  text: string;
  isLocked: boolean;
  isActive?: boolean;
  url?: string;
}[] = [
  {
    icon: "docflow",
    text: "Docflow",
    isLocked: false,
    isActive: true,
    url: import.meta.env.VITE_API_DOCFLOW,
  },
  {
    icon: "hrm",
    text: "HRM",
    isLocked: false,
    url: import.meta.env.VITE_API_HRM,
  },
  {
    icon: "faceID",
    text: "Turniket",
    isLocked: false,
    url: import.meta.env.VITE_API_TURNIKET,
  },
  {
    icon: "task",
    text: "Loyihalar boshqaruvi",
    isLocked: false,
    url: import.meta.env.VITE_API_PM,
  },
  {
    icon: "lms",
    text: "LMS",
    isLocked: true,
  },
  {
    icon: "news",
    text: "Yangiliklar",
    isLocked: true,
  },
  {
    icon: "meeting",
    text: "Majlislar",
    isLocked: true,
  },
  {
    icon: "chat",
    text: "Chat",
    isLocked: true,
  },
  {
    icon: "task",
    text: "Topshiriqlar",
    isLocked: true,
  },
  {
    icon: "folder",
    text: "FTP",
    isLocked: true,
  },
];
</script>
<template>
  <n-tooltip
    trigger="click"
    placement="right"
    :show-arrow="false"
    :keep-alive-on-hover="true"
    :raw="true"
    class="app-tooltip"
  >
    <template #trigger>
      <button
        class="flex justify-center items-center rounded-xl w-12 h-12 bg-blue-50 border border-blue-100"
      >
        <CIcon name="geometric" />
      </button>
    </template>
    <div class="text-grey-800 app-tooltip-menu">
      <div class="grid grid-cols-3 gap-5 text-sm">
        <AppTooltipItem
          v-for="project in projects"
          :key="project.text"
          :icon="project.icon"
          :text="project.text"
          :isLocked="project.isLocked"
          :isActive="project.isActive"
          :url="project.url"
        />
      </div>
    </div>
  </n-tooltip>
</template>
<style lang="scss">
.app-tooltip {
  @apply bg-white border border-grey-50 rounded-2xl;
  box-shadow: 0px 24px 56px 0px #0000001f;
  width: 400px;
  margin-left: 30px !important;
  padding: 24px;
}
.app-item-icon {
  @apply w-16 h-16 rounded-2xl  flex justify-center items-center mb-2 rounded-full;
  background: linear-gradient(180deg, #f6f7f9 0%, #ffffff 100%);
}
.app-tooltip-menu {
  .active {
    .app-item-icon {
      background: radial-gradient(96.09% 96.09% at 49.22% 50%, #00aaff 0%, #a8e2ff 100%);
      path {
        fill: #fff;
        opacity: 0.5 !important;
      }
    }
  }
}
</style>
