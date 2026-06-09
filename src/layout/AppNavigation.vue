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
  } else if (route.fullPath.startsWith("/banner")) {
    return "banner";
  } else if (route.fullPath.startsWith("/contact")) {
    return "contact";
  } else if (route.fullPath.startsWith("/service")) {
    return "service";
  } else if (route.fullPath.startsWith("/category")) {
    return "category";
  } else if (route.fullPath.startsWith("/organization")) {
    return "organization";
  } else if (route.fullPath.startsWith("/region")) {
    return "region";
  } else if (route.fullPath.startsWith("/education")) {
    return "education";
  } else if (route.fullPath.startsWith("/user")) {
    return "user";
  } else if (route.fullPath.startsWith("/chat")) {
    return "chat";
  } else if (route.fullPath.startsWith("/version")) {
    return "version";
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
    <div class="sidebar-container">
      <div class="sidebar-inner">
        <!-- Logo -->
        <div class="sidebar-logo">
          <RouterLink to="/" class="flex items-center justify-center">
            <img class="w-[110px] brightness-0 invert" src="/img/logo.png" alt="Radio" />
          </RouterLink>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <ul class="flex flex-col gap-1">
            <li
              v-for="(item, index) in routes"
              :key="index"
            >
              <RouterLink
                :to="item.to"
                class="nav-link"
                :class="{ 'nav-link-active': activeRoute == item.name }"
                @click="emits('close')"
              >
                <div class="nav-link-indicator"></div>
                <CIcon :name="item.icon" />
                <span>{{ item.text }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- User Profile at Bottom -->
      <div class="sidebar-user" v-if="user">
        <div class="sidebar-user-avatar">
          {{ user?.first_name?.charAt(0) || 'U' }}
        </div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">{{ user?.first_name }} {{ user?.last_name }}</div>
          <div class="sidebar-user-role">Administrator</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.sidebar-container {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #0a1628 0%, #142240 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-inner {
  padding: 24px 16px 0 16px;
}

.sidebar-logo {
  padding: 8px 0 24px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
  position: relative;
  text-decoration: none;

  .nav-link-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: #1DBF73;
    border-radius: 0 4px 4px 0;
    transition: height 0.25s ease;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    path, circle {
      stroke: rgba(255, 255, 255, 0.45) !important;
      transition: stroke 0.25s ease;
    }
  }

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.06);

    svg path, svg circle {
      stroke: rgba(255, 255, 255, 0.8) !important;
    }
  }

  &.nav-link-active {
    color: #FFFFFF;
    background: rgba(29, 191, 115, 0.12);

    .nav-link-indicator {
      height: 24px;
    }

    svg path, svg circle {
      stroke: #1DBF73 !important;
    }

    &:hover {
      background: rgba(29, 191, 115, 0.16);
    }
  }
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}

.sidebar-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1DBF73, #17A863);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}

.sidebar-user-info {
  overflow: hidden;
}

.sidebar-user-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}

// Mobile responsive
@media (max-width: 768px) {
  .sidebar-container {
    width: 280px;
  }
}
</style>
