<script lang="ts" setup>
import { IconName } from "../components/ui/CIcon.vue";
import AppTooltip from "./AppTooltip.vue";
import NavTooltip from "./NavTooltip.vue";
import RatingSubSidebar from "./RatingSubSidebar.vue";
import BotSvg from "/@src/assets/img/svg/bot.svg";
import { onClickOutside } from "@vueuse/core";
import { useAuthStore } from "../store/auth";
const { user } = toRefs(useAuthStore());
let emits = defineEmits(["close"]);
const { routes } = toRefs(useAuthStore());
let sidebarRef = ref<HTMLElement | null>(null);
let show = ref(false);
onClickOutside(sidebarRef, (e) => {
  show.value = false;
});

const route = useRoute();
let activeRoute = computed(() => {
  if (route.name == "//") {
    return "home";
  }
  if (route.fullPath.startsWith("/notification")) {
    return "notification";
  } else if (route.fullPath.startsWith("/contact")) {
    return "contact";
  } else if (route.fullPath.startsWith("/services")) {
    return "services";
  } else if (route.fullPath.startsWith("/category")) {
    return "category";
  } else if (route.fullPath.startsWith("/organization")) {
    return "organization";
  } else {
    return "";
  }
});
function openSidebar(name: string) {
  if (show.value && activeSidebar.value === name) {
    show.value = false;
  } else {
    show.value = true;
  }
  activeSidebar.value = name;
}
let activeSidebar = ref("");
onMounted(() => {
  activeSidebar.value = activeRoute.value;
});
//
</script>
<template>
  <div class="relative z-50" ref="sidebarRef">
    <div
      class="p-4 h-full md:h-screen flex flex-col justify-between bg-grey-50 w-full md:w-[250px] border-r border-grey-100 relative z-50"
    >
      <div class="relative">
        <RouterLink
          to="/"
          class="flex gap-2 text-[#0a2457] text-lg justify-center items-center font-bold"
          style="line-height: 1"
        >
          <img class="w-[120px]" src="/img/logo.png" alt="" />
        </RouterLink>
        <n-divider style="margin: 10px" />
        <ul class="flex flex-col mt-4">
          <li
            class="py-[2px] border-b border-grey-50"
            v-for="(item, index) in routes"
            :key="index"
          >
            <RouterLink
              :to="item.to"
              class="nav-link"
              :class="{ 'nav-link-active': activeRoute == item.name }"
              @click="emits('close')"
            >
              <CIcon :name="item.icon" />
              {{ item.text }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.nav-link {
  &:hover {
    @apply bg-blue-100;
  }
  &.nav-link-active {
    path,
    circle {
      stroke: #fff !important;
    }
    @apply bg-blue-500 text-white;
    &:hover {
      @apply bg-blue-500;
    }
  }
  @apply py-2 flex px-2 pl-4 rounded-lg text-grey-900 gap-2  items-center;

  svg {
    path,
    circle {
      stroke: #141b34;
    }
  }
}
</style>
