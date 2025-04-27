<script lang="ts" setup>
import { IconName } from "../components/ui/CIcon.vue";
import AppTooltip from "./AppTooltip.vue";
import NavTooltip from "./NavTooltip.vue";
import RatingSubSidebar from "./RatingSubSidebar.vue";
import BotSvg from "/@src/assets/img/svg/bot.svg";
import { onClickOutside } from "@vueuse/core";
import { useAuthStore } from "../store/auth";
const {user} = toRefs(useAuthStore());
let emits = defineEmits(['close'])
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
  if (route.fullPath.startsWith("/faculty")) {
    return "faculty";
  } else if (route.fullPath.startsWith("/direction")) {
    return "direction";
  } else if (route.fullPath.startsWith("/user")) {
    return "user";
  } else if (route.fullPath.startsWith("/criterion")) {
    return "criterion";
  } else if (route.fullPath.startsWith("/time-table")) {
    return "time-table";
  } else if (route.fullPath.startsWith("/task")) {
    return "task";
  } else if (route.fullPath.startsWith("/rating/faculty")) {
    return "rating-faculty";
  } else if (route.fullPath.startsWith("/rating/direction")) {
    return "rating-direction";
  } else if (route.fullPath.startsWith("/rating/teacher")) {
    return "rating-teacher";
  } else if (route.fullPath.startsWith("/attendance")) {
    return "attendance";
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
let filteredRoutes = computed(()=>{
  return routes.value.filter(route => {
    if(route.roles?.length){
      return route.roles.includes(user.value?.role!);
    }
    else {
      return true;
    }
  });
})
</script>
<template>
  <div class="relative z-50" ref="sidebarRef">
    <div
      class="p-4 h-full md:h-screen flex flex-col justify-between bg-grey-50 w-full md:w-[250px]  border-r border-grey-100 relative z-50"
    >
      <div class="relative">
        <RouterLink
          to="/"
          class="flex gap-2 text-[#0a2457] text-lg items-center font-bold ml-6"
          style="line-height: 1"
        >
          <img class="w-10" src="/img/logo-blue.svg" alt="" />
          University of Business and Science
        </RouterLink>
        <ul class="flex flex-col mt-4">
          <li
            class="py-[2px] border-b border-grey-50"
            v-for="(item, index) in filteredRoutes"
            :key="index"
          >
            <RouterLink
              v-if="!item.children"
              :to="item.to"
              class="nav-link"
              :class="{ 'nav-link-active': activeRoute == item.name }"
              @click="emits('close')"
            >
              <CIcon :name="item.icon" />
              {{ item.text }}
            </RouterLink>
            <n-collapse
              v-else
              :default-expanded-names="[1]"
              class="pl-4"
              arrow-placement="right"
            >
              <n-collapse-item arrow-placement="right" :name="1">
                <template #header>
                  <div class="flex gap-2">
                    <CIcon :name="item.icon" /> {{ item.text }}
                  </div>
                </template>
                <RouterLink
                  v-for="child in item.children"
                  :to="child.to"
                  class="nav-link"
                  :class="{ 'nav-link-active': activeRoute == child.name }"
              @click="emits('close')"

                >
                  {{ child.text }}
                </RouterLink>
              </n-collapse-item>
            </n-collapse>
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
    path {
      stroke: #fff !important;
    }
    @apply bg-blue-500 text-white;
    &:hover {
      @apply bg-blue-500;
    }
  }
  @apply py-2 flex px-2 pl-4 rounded-lg text-grey-900 gap-2  items-center;

  svg {
    path {
      stroke: #141b34;
    }
  }
}
</style>
