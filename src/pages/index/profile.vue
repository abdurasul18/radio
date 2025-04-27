<script lang="ts" setup>
import { IUser, UserService } from "/@src/services/user";
let employeeData = ref<IUser>();
let loading = ref(false);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "");
});
async function getCurrentUser() {
  try {
    loading.value = true;
    if (userId.value) {
      let res = await UserService.getById(userId.value);
      employeeData.value = res.data.data;
    } else {
      employeeData.value = (await UserService.getCurrentUser()).data?.data;
    }
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getCurrentUser();
});
watchEffect(() => {
  getCurrentUser();
});
</script>
<template>
  <div>
    <AppTitle> {{ $t("employee.profile") }} </AppTitle>

    <n-spin :show="loading">
      <div class="flex lg:flex-row flex-col gap-4">
        <div class="bg-white p-2 rounded-xl flex flex-col text-grey-800">
          <div class="flex gap-4 items-center flex-col mb-4">
            <n-image
              class="c-avatar flex-shrink-0"
              :src="$withBaseUrl(employeeData?.avatar)"
            />
            <div class="text-center max-w-[250px]">
              <div class="font-semibold text-lg" style="line-height: 1.1">
                {{ employeeData?.last_name }} {{ employeeData?.first_name }}
                {{ employeeData?.middle_name }}
              </div>
              <div class="mt-2" style="line-height: 1">
                {{ employeeData?.direction?.name }}
              </div>
            </div>
          </div>
         <div class="grid w-full">
          <RouterLink
            class="profile-nav"
            :to="`/profile?userId=${$route.query.userId || ''}`"
          >
            <CIcon name="user" class="mr-2 w-5" />
            <span>Shaxsiy ma'lumotlar</span>
          </RouterLink>
          <RouterLink
            class="profile-nav"
            :to="`/profile/docs?userId=${$route.query.userId || ''}`"
          >
            <CIcon name="file" class="mr-2 w-5" />
            <span>Hujjatlar</span>
          </RouterLink>
          <RouterLink
            class="profile-nav"
            :to="`/profile/time-table?userId=${$route.query.userId || ''}`"
          >
            <CIcon name="calendar" class="mr-2" />
            <span>Dars jadvali</span>
          </RouterLink>
          <RouterLink
            class="profile-nav"
            :to="`/profile/personal-task?userId=${$route.query.userId || ''}`"
          >
            <CIcon name="task2" class="mr-2" />
            <span>Topshiriqlar</span>
          </RouterLink>
          <RouterLink
            class="profile-nav"
            :to="`/profile/task?userId=${$route.query.userId || ''}`"
          >
            <CIcon name="geometric" class="mr-2 w-5" />
            <span>Yuklamalar</span>
          </RouterLink>
         </div>
          <!-- <RouterLink
            class="profile-nav"
            :to="`/profile/attendance?userId=${$route.query.userId || ''}`"
          >
            <CIcon name="check" class="mr-2 w-5" />
            <span>Davomat</span>
          </RouterLink> -->
        </div>

        <div class="ml-4 w-full">
          <Transition name="fade">
            <RouterView />
          </Transition>
        </div>
      </div>
    </n-spin>
  </div>
</template>
<style lang="scss">
.profile-nav {
  @apply flex items-center py-2 pl-3 pr-2 rounded-lg mb-2 text-sm sm:w-[264px];
  &:hover {
    @apply bg-gray-100;
  }
  &.router-link-exact-active {
    @apply bg-blue-500 text-white;
    path,
    ellipse,
    circle {
      stroke: #fff;
    }
  }
}
</style>
