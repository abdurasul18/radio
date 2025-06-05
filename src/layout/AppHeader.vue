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
  <div
    class="bg-white w-full h-20 px-9 flex justify-between items-center border-b border-gray-100"
  >
    <div v-if="showHeader" class="text-xl font-semibold" id="appTitle"></div>
    <div class="md:hidden">
      <RouterLink to="/">
        <img class="w-10" src="/img/logo.png" alt="" />
      </RouterLink>
    </div>
    <div class="flex justify-end items-center">
     
      <n-divider vertical />
      <!-- <n-dropdown trigger="click" :options="options" :on-select="changeLocale">
        <button class="flex items-center text-sm font-semibold mx-6">
          <LangSvg class="mr-3" />
          {{ options.find((item) => item.key == locale)?.shortLabel }}
          <CIcon name="down" class="ml-1" />
        </button>
      </n-dropdown> -->
      <!-- <n-divider vertical /> -->
      <div class="flex gap-1">
        <n-tooltip placement="bottom" trigger="click" :show-arrow="false" raw>
          <template #trigger>
            <button class="flex items-center ml-6">
              <img
                class="w-10 h-10 rounded-full border bored-grey-100 bg-grey-50 flex justify-center items-center mr-3 object-contain"
                :src="$withBaseUrl(user?.avatar)"
                alt=""
              />
              <div class="text-left">
                <div class="text-sm font-semibold" style="line-height: 1">
                  {{ user?.first_name }} {{ user?.last_name }}
                </div>
                <div class="text-xs text-grey-500">
                  {{ RoleType[user?.role!] }}
                </div>
              </div>
              <CIcon name="down" width="20" class="ml-1" />
            </button>
          </template>
          <div class="w-[200px] p-2 bg-white">
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
                <a href="javascript:void(0)" class="flex px-3 py-3">
                  <span>{{ $t("actions.logout") }}</span>
                </a>
              </n-list-item>
            </n-list>
          </div>
        </n-tooltip>
        <CActionIcon @click="showMenu=true" class="md:hidden" icon="menu2"/>
      </div>
    </div>
  </div>
  <CModal v-model:show="isUpPassShow" title="Parolni o'zgartirish" class="max-w-[500px]">
    <UpdatePasswordOwn @close="isUpPassShow = false" @success="updatePass" />
  </CModal>
  <n-drawer v-model:show="showMenu" :width="300">
    <div class="w-[300px] bg-grey-50 h-full" @close="showMenu = false" :closable="true" title="Menyu">
      <AppNavigation class="" @close="showMenu=false"/>
    </div>
  </n-drawer>
</template>
<style lang="scss">
.notification-badge {
}
</style>
