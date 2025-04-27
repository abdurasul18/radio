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
let updateShow = ref(false);
watchEffect(() => {
  getCurrentUser();
});
</script>
<template>
  <div>
    <CLoader :active="loading">
      <div class="grid md:grid-cols-2 gap-4">
        <n-card class="base-card col-span-full" :bordered="false">
          <div class="text-[28px] mb-9 font-semibold">
            {{ $t("employee.privateInfo") }}
          </div>
          <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="flex items-center">
              <img

                class="w-32 h-[140px] rounded-xl border bored-grey-100 bg-grey-50 hidden lg:flex justify-center items-center mr-6 object-cover"
                :src="$withBaseUrl(employeeData?.avatar)"
                alt=""
              />
              <div class="">
                <div class="text-xl font-semibold mb-1">
                  {{ employeeData?.first_name }} {{ employeeData?.last_name }}
                  {{ employeeData?.middle_name }}
                </div>
                <div class="text-sm text-grey-500">
                  {{ employeeData?.bio }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
              <div class="flex mr-9">
                <CIcon class="mr-3" name="phone" /> {{ employeeData?.phone }}
              </div>
              <div class="flex mr-9">
                <CIcon class="mr-3" name="location" />{{ employeeData?.address }}
              </div>
              <div class="grid gap-1 grid-cols-2">
                <CButton
                  v-if="!userId"
                  @click="updateShow = true"
                  type="success"
                  icon="edit"
                >
                  Tahrirlash
                </CButton>
              </div>
            </div>
          </div>
        </n-card>
        <n-card class="base-card text-sm" :bordered="false">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-grey-500 mb-[2px]">{{ $t("field.fio") }}</div>
              <div class="font-semibold">
                {{ employeeData?.last_name }} {{ employeeData?.first_name }}
                {{ employeeData?.middle_name }}
              </div>
            </div>
            <div>
              <div class="text-grey-500 mb-[2px]">{{ $t("field.birthday") }}</div>
              <div class="font-semibold">
                {{ employeeData?.birthday }}
              </div>
            </div>
            <div>
              <div class="text-grey-500 mb-[2px]">Foydalanuvchi nomi</div>
              <div class="font-semibold">
                {{ employeeData?.username }}
              </div>
            </div>
            <div>
              <div class="text-grey-500 mb-[2px]">Passport</div>
              <div class="font-semibold">
                {{ employeeData?.passport }}
              </div>
            </div>
            <div>
              <div class="text-grey-500 mb-[2px]">Manzil</div>
              <div class="font-semibold">
                {{ employeeData?.address }}
              </div>
            </div>
            <div>
              <div class="text-grey-500 mb-[2px]">Telefon</div>
              <div class="font-semibold">
                {{ employeeData?.phone }}
              </div>
            </div>
          </div>
        </n-card>
        <n-card class="base-card text-sm" :bordered="false">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-grey-500 mb-[2px]">Kafedra</div>
              <div class="font-semibold">
                {{ employeeData?.direction?.name }}
              </div>
            </div>

            <div>
              <div class="text-grey-500 mb-[2px]">Daraja</div>
              <div class="font-semibold">
                {{ employeeData?.degree?.name }}
              </div>
            </div>
            <div>
              <div class="text-grey-500 mb-[2px]">Status</div>
              <div class="mt-2">
                <CTag  type="success">Active</CTag>
              </div>
            </div>
          </div>
        </n-card>
      </div>
      <ViewResume ref="viewResumeRef" />
      <ViewPdf ref="viewPdfRef" />
      <CModal v-model:show="updateShow" :title="'Tahrirlash'" class="max-w-[800px]">
        <AddUpProfile
          :item="employeeData!"
          @close="updateShow = false"
          @success="
            updateShow = false;
            getCurrentUser();
          "
        />
      </CModal>
    </CLoader>
  </div>
</template>
<style lang="scss"></style>
