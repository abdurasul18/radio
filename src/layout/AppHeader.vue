<script lang="ts" setup>
import { useApiService } from "../composable/getList";
import { toastSuccess } from "../plugins/toast";
import { RoleType } from "../services/auth";
import { UserService } from "../services/user";
import { useAuthStore } from "../store/auth";
import NotificationCard from "../store/render-component/NotificationCard.vue";
import AppNavigation from "./AppNavigation.vue";
import LangSvg from "/@src/assets/img/svg/language.svg";
let { locale, t } = useI18n();
let { user } = toRefs(useAuthStore());
const { getCurrentUser } = useAuthStore();
onMounted(() => {
  // getCurrentUser();
});
let options = [
  {
    label: t("lang.uzbekLatin"),
    key: "lt",
    shortLabel: "O'z",
  },
  {
    label: t("lang.uzbekKrill"),
    key: "uz",
    shortLabel: "Ўз",
  },
  {
    label: t("lang.russian"),
    key: "ru",
    shortLabel: "Ру",
  },
  {
    label: t("lang.english"),
    key: "en",
    shortLabel: "En",
  },
];
const router = useRouter();
async function logout() {
  useAuthStore().logout();
  await router.push("/auth/login");
}
const defaultLocale = useStorage("locale", "lt");

function changeLocale(value: string) {
  locale.value = value;
  defaultLocale.value = value;
  window.location.reload();
}
let isUpPassShow = ref(false);
async function updatePass(e: any) {
  try {
    isUpPassShow.value = false;
    let res = await UserService.updatePassword(e);
    toastSuccess();
  } finally {
  }
}
let showHeader = window.innerWidth > 768;
let showMenu = ref(false);
</script>
<template>
  <div class="app-header">
    <div v-if="showHeader" class="app-header-title" id="appTitle"></div>
    <div class="md:hidden">
      <RouterLink to="/">
        <img class="w-10" src="/img/logo.png" alt="" />
      </RouterLink>
    </div>
    <div class="flex justify-end items-center">
      <div class="flex gap-1 items-center">
        <n-tooltip placement="bottom" trigger="click" :show-arrow="false" raw>
          <template #trigger>
            <button class="app-header-profile">
              <div class="app-header-avatar">
                {{ user?.first_name?.charAt(0) || 'U' }}
              </div>
              <div class="text-left hidden sm:block">
                <div class="app-header-name">
                  {{ user?.first_name }} {{ user?.last_name }}
                </div>
                <div class="app-header-role">
                  {{ RoleType[user?.role!] }}
                </div>
              </div>
              <CIcon name="down" width="20" class="ml-1 hidden sm:block" />
            </button>
          </template>
          <div class="app-header-dropdown">
            <n-list hoverable clickable>
              <!-- <n-list-item style="padding: 0">
                <RouterLink class="flex px-3 py-3" to="/profile">
                  <CIcon class="mr-2" name="user" />
                  <span>{{ $t("employee.profile") }}</span>
                </RouterLink>
              </n-list-item>
              <n-list-item style="padding: 0" @click="isUpPassShow = true">
                <a href="javascript:void(0)" class="flex gap-2 px-3 py-3">
                  <CIcon name="lock" width="20" /> <span>Parolni tahrirlash</span>
                </a>
              </n-list-item> -->
              <n-list-item style="padding: 0" @click="logout">
                <a href="javascript:void(0)" class="flex items-center gap-2 px-4 py-3 text-red-500 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span>{{ $t("actions.logout") }}</span>
                </a>
              </n-list-item>
            </n-list>
          </div>
        </n-tooltip>
        <button @click="showMenu=true" class="app-header-burger md:!hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </div>
  <CModal v-model:show="isUpPassShow" title="Parolni o'zgartirish" class="max-w-[500px]">
    <!-- <UpdatePasswordOwn @close="isUpPassShow = false" @success="updatePass" /> -->
  </CModal>
  <n-drawer v-model:show="showMenu" :width="280">
    <div class="w-[280px] h-full" @close="showMenu = false" :closable="true" title="Menyu">
      <AppNavigation class="" @close="showMenu=false"/>
    </div>
  </n-drawer>
</template>
<style lang="scss">
.app-header {
  width: 100%;
  height: 72px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 40;
}

.app-header-title {
  font-size: 20px;
  font-weight: 700;
  color: #0a1628;
}

.app-header-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: transparent;

  &:hover {
    background: #F6F7F9;
  }
}

.app-header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #007BFF, #0056B3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}

.app-header-name {
  font-size: 13px;
  font-weight: 600;
  color: #0a1628;
  line-height: 1.2;
}

.app-header-role {
  font-size: 11px;
  color: #6B758C;
  margin-top: 1px;
}

.app-header-dropdown {
  width: 220px;
  padding: 6px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #EDEDF1;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}

.app-header-burger {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #0a1628;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 4px;

  &:hover {
    background: #F6F7F9;
  }

  &:active {
    background: #EDEDF1;
  }
}

// Mobile
@media (max-width: 768px) {
  .app-header {
    height: 60px;
    padding: 0 16px;
  }
}

.notification-badge {
}
</style>
