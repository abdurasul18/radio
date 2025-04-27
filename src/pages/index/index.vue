<script lang="ts" setup>
import { IPersonalTask, UserService } from "/@src/services/user";
import {
  ITimeTableDetail,
  TimeTableService,
  TimeTableStatus,
} from "/@src/services/time-table";
import { useAuthStore } from "/@src/store/auth";
import { formatDate } from "/@src/utils/date";
import { toastSuccess } from "/@src/plugins/toast";
import { TaskType } from "/@src/services/task";
import { EduTypes } from "/@src/services/criterion";
const { user } = toRefs(useAuthStore());

let payload = computed(() => {
  return {
    user_id: user.value?.id,
    from_date: formatDate(new Date())?.split(" ")[0],
    to_date: formatDate(new Date())?.split(" ")[0],
  };
});
let loading = ref(false);
let events = ref<ITimeTableDetail[]>([]);
async function getTimeTable() {
  try {
    loading.value = true;
    let res = await TimeTableService.getOwn(payload.value);
    res.data.data.forEach((el) => {
      el.timeTableDetails.forEach((item) => {
        events.value.push({
          ...item,
        });
      });
    });
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getTimeTable();
});
let eventLoading = ref(false);

async function confirm(item: ITimeTableDetail) {
  try {
    eventLoading.value = true;
    let res = await TimeTableService.lessonConfirm(item?.id!);
    toastSuccess();
    let eventIndex = events.value.findIndex((el) => el.id == item?.id);
    if (eventIndex != -1) {
      events.value[eventIndex].status = 2;
    }
  } finally {
    eventLoading.value = false;
  }
}
//
let list = ref<IPersonalTask[]>([]);
async function getList() {
  try {
    loading.value = true;
    let res = await UserService.getPersonalTask(user.value?.id!);
    list.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getList();
});
let cardData = computed<
  {
    name: string;
    all: number;
    completed: number;
  }[]
>(() => {
  return EduTypes.map((item) => {
    return {
      name: item.name,
      all: list.value.filter((el) => el.type == item.id).length,
      completed: list.value.filter((el) => el.type == item.id && el.status == 2).length,
    };
  });
});
</script>
<template>
  <n-spin :show="loading" size="large">
    <div class="grid gap-4">
      <AppTitle> Dashboard </AppTitle>
      <div class="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <n-card class="rounded-2xl border border-grey-100 min-h-[134px] w-full p-1">
          <div class="flex flex-col justify-between h-full">
            <div class="text-sm">Umumiy dars soati</div>
            <div class="flex justify-between items-end">
              <div class="text-[28px] font-semibold">
                <n-number-animation
                  locale="ru"
                  show-separator
                  :from="0"
                  :to="user.confirm_lesson_count"
                  :active="true"
                />
                /
                <n-number-animation
                  locale="ru"
                  show-separator
                  :from="0"
                  :to="user.total_lesson_count"
                  :active="true"
                />
              </div>
              <div>
                <img class="flex-shrink-0" src="/@src/assets/img/d-send.png" alt="" />
              </div>
            </div>
          </div>
        </n-card>
        <n-card
          class="rounded-2xl border border-grey-100 min-h-[134px] w-full p-1"
          v-for="(item, i) in cardData"
          :key="i"
        >
          <div class="flex flex-col justify-between h-full">
            <div class="text-sm">{{ item.name }}</div>
            <div class="flex justify-between items-end">
              <div class="text-[28px] font-semibold">
                <n-number-animation
                  locale="ru"
                  show-separator
                  :from="0"
                  :to="item.all"
                  :active="true"
                />
                /
                <n-number-animation
                  locale="ru"
                  show-separator
                  :from="0"
                  :to="item.completed"
                  :active="true"
                />
              </div>
              <div>
                <CIcon class="info-svg" height="30px" name="info" />
              </div>
            </div>
          </div>
        </n-card>
      </div>
      <div class="grid gap-4 xl:grid-cols-5">
        <div class="xl:col-span-3">
          <n-card class="rounded-2xl border border-grey-100 min-h-[134px] w-full p-1">
            <div class="flex flex-col sm:flex-row gap-4 justify-between">
              <div class="title">Bugungi darslarim</div>
              <CButton
                @click="$router.push('/profile/time-table')"
                ghost
                class="w-max ml-auto"
                icon="list-number"
                size="small"
              >
                Barcha darslarim</CButton
              >
            </div>
            <div class="-m-7 pt-12">
                <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
                  <table class="c-table2 min-w-[600px]">
                    <thead>
                      <tr>
                        <th>{{ $t("field.number") }}</th>
                        <th>Dars</th>
                        <th>Boshlanish vaqti</th>
                        <th>Tugash vaqti</th>
                        <th>Holati</th>
                        <th>Amallar</th>
                      </tr>
                    </thead>
                    <tbody v-if="events.length">
                      <tr v-for="(item, i) in events" :key="i">
                        <td>{{ i + 1 }}</td>
                        <td>{{ item.subject }}</td>
                        <td>{{ item.start_time }}</td>
                        <td>{{ item.end_time }}</td>
                        <td>
                          <CTag :type="TimeTableStatus[item.status].color">
                            {{ TimeTableStatus[item?.status!].name }}
                          </CTag>
                        </td>
                        <td>
                          <CButton
                            v-if="item?.status == 1"
                            @click="confirm(item)"
                            class="w-full"
                            icon="tick"
                            type="info"
                            :loading="eventLoading"
                            >O'tildi</CButton
                          >
                        </td>
                      </tr>
                    </tbody>
                    <AppNotFound v-else mode="table" />
                  </table>
                </div>
            </div>
          </n-card>
        </div>
        <div class="xl:col-span-2">
          <n-card
            class="rounded-2xl border border-grey-100 min-h-[134px] h-full w-full p-1"
          >
            <div class="flex flex-col sm:flex-row gap-4 justify-between">
              <div class="title">Shaxsiy topshiriqlar</div>
              <CButton
                @click="$router.push('/profile/personal-task')"
                ghost
                class="w-max ml-auto"
                icon="list-number"
                size="small"
              >
                Barcha topshiriqlar</CButton
              >
            </div>
            <n-divider style="margin: 10px 0" />
            <div class="grid gap-2">
              <div
                class="rounded border-l-4 border-blue-500 pl-4 grid gap-1"
                v-for="(item, i) in list"
                :key="i"
              >
                <div style="line-height: 1">{{ item.task?.title }}</div>
                <div>
                  <CTag :type="TaskType[item.status]?.color" size="small">
                    {{ TaskType[item.status]?.name }}
                  </CTag>
                </div>
                <div class="text-sm text-grey-400">{{ item.academicYear?.title }}</div>
                <div>{{ item.deadline }}</div>
              </div>
              <AppNotFound v-if="!list.length" mode="card" />
            </div>
          </n-card>
        </div>
      </div>
      <TeacherStatDashboard />
    </div>
  </n-spin>
</template>
<style lang="scss" scoped></style>
