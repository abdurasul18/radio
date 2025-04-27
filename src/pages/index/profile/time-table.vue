<script lang="ts" setup>
import { UserService } from "/@src/services/user";
import {
  ITimeTableDetail,
  ITimeTableOwn,
  TimeTableService,
  TimeTableStatus,
} from "/@src/services/time-table";
import { addDays, isYesterday } from "date-fns";
import { useAuthStore } from "/@src/store/auth";
const { user } = toRefs(useAuthStore());
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  localeUz,
  monthNames,
  dayNameCr,
  dayNameLt,
  dayNameRu,
  dayNameEn,
} from "./util/translate";
import locales from "@fullcalendar/core/locales-all";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import moment from "moment";
import { ddmmyyyyhhmmss, formatDate } from "/@src/utils/date";
import { toastSuccess } from "/@src/plugins/toast";
interface IEvent extends ITimeTableDetail {
  id: string;
  start: string;
  end: string;
  title: string;
  status: 1 | 2 | 3 | 4;
}
const { t, locale } = useI18n();
let fullcalendar = ref();
let calendarOptions: CalendarOptions = {
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin, // needed for dateClick
  ],
  firstDay: 1,
  headerToolbar: {
    left: "prev,next,today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  titleFormat: { year: "numeric", month: "2-digit" },
  initialView: "dayGridMonth",
  // initialEvents: [],
  locales: [...locales, localeUz],
  locale: locale.value == "ru" ? "ru" : locale.value == "eng" ? "en" : "uzb",
  dayHeaderContent: function (arg: any) {
    if (locale.value == "ru") {
      return dayNameRu[arg.date.getDay()];
    } else if (locale.value == "eng") {
      return dayNameEn[arg.date.getDay()];
    } else if (locale.value == "lt") {
      return dayNameLt[arg.date.getDay()];
    } else {
      return dayNameCr[arg.date.getDay()];
    }
  },
  events: [] as any, // alternatively, use the `events` setting to fetch from a feed
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  // select: handleDateSelect,
  // eventClick: handleEventClick,
  // eventsSet: dateChanged,
  datesSet: dateChanged,
  /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
};
let activeDate = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});
let from_date = computed(() => {
  return new Date(activeDate.value.year, activeDate.value.month, -10)
    .toISOString()
    .split("T")[0];
});
let to_date = computed(() => {
  return new Date(activeDate.value.year, activeDate.value.month + 1, 10)
    .toISOString()
    .split("T")[0];
});
function dateChanged(e: any) {
  let start = e.start;
  let end = e.end;

  if (start) {
    activeDate.value = {
      month: new Date(start).getMonth() + 1,
      year: new Date(start).getFullYear(),
    };
  }
}
let loading = ref(false);
let addShow = ref(false);
let list = ref<ITimeTableOwn[]>([]);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "") || user.value.id;
});
let payload = computed(() => {
  return {
    user_id: userId.value,
    from_date: from_date.value,
    to_date: to_date.value,
  };
});
let events = ref<IEvent[]>([]);
async function getList() {
  try {
    loading.value = true;
    let res = await TimeTableService.getOwn(payload.value);
    list.value = res.data.data;
    list.value.forEach((el) => {
      el.timeTableDetails.forEach((item) => {
        events.value.push({
          ...item,
          title: `${item.subject}-(${item.start_time.slice(0, -3)}-${item.end_time.slice(
            0,
            -3
          )})`,
          start: formatDate(
            new Date(
              `${el.year}-${el.month}-${+el.start_day + +item.day - 1} ${item.start_time}`
            )
          ),
          end: formatDate(
            new Date(
              `${el.year}-${el.month}-${+el.start_day + +item.day - 1} ${item.end_time}`
            )
          ),
          id: item.id,
          status: item.status,
        });
      });
    });
  } finally {
    loading.value = false;
  }
}

watch(
  () => payload.value,
  () => {
    getList();
  },
  { deep: true }
);
let keyIndex = ref(0);
let cachedEvent = ref<string[]>([]);
function setCalendarEvents(events: IEvent[]) {
  // calendarOptions.events = [...events];
  // keyIndex.value++;
  console.log("events", events);

  events.forEach((el) => {
    if (!cachedEvent.value.includes(el.id)) {
      fullcalendar.value.calendar.addEvent({
        title: el.title,
        start: el.start,
        end: el.end,
        id: el.id,
        status: el.status,
      });
      cachedEvent.value.push(el.id);
    }
  });
}
watch(
  () => events.value,
  (val) => {
    setCalendarEvents(val);
  },
  {
    deep: true,
  }
);
//
let showEvent = ref(false);
let currentEvent = ref<IEvent>();
function openEvent(id: string) {
  let event = events.value.find((el) => el.id == id);
  if (event) {
    currentEvent.value = event;
    showEvent.value = true;
  }
}
function getEventClass(id: string) {
  let event = events.value.find((el) => el.id == id);
  if (event) {
    return `event-${TimeTableStatus[event.status].color}`;
  }
}
//
let eventLoading = ref(false);
async function confirm() {
  try {
    eventLoading.value = true;
    let res = await TimeTableService.lessonConfirm(currentEvent.value?.id!);
    toastSuccess();
    showEvent.value = false;
    let eventIndex = events.value.findIndex((el) => el.id == currentEvent.value?.id);
    if (eventIndex != -1) {
      events.value[eventIndex].status = 2;
    }
  } finally {
    eventLoading.value = false;
  }
}
async function accept() {
  try {
    eventLoading.value = true;
    let res = await TimeTableService.confirmByAdmin(currentEvent.value?.id!);
    toastSuccess();
    showEvent.value = false;
    let eventIndex = events.value.findIndex((el) => el.id == currentEvent.value?.id);
    if (eventIndex != -1) {
      events.value[eventIndex].status = 4;
    }
  } finally {
    eventLoading.value = false;
  }
}
async function reject() {
  try {
    eventLoading.value = true;
    let res = await TimeTableService.cancelByAdmin(currentEvent.value?.id!);
    toastSuccess();
    showEvent.value = false;
    let eventIndex = events.value.findIndex((el) => el.id == currentEvent.value?.id);
    if (eventIndex != -1) {
      events.value[eventIndex].status = 3;
    }
  } finally {
    eventLoading.value = false;
  }
}
</script>
<template>
  <div>
    <n-spin :show="loading" size="large">
      <n-card class="base-card" :bordered="false">
        <div class="flex justify-between mb-9">
          <div class="text-[28px] font-semibold">Dars jadvali</div>
        </div>
        <div class="-m-4 -mt-8 d-fullcalendar">
        <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
          <FullCalendar
            ref="fullcalendar"
            class="min-w-[600px]"
            :options="calendarOptions"
            :key="keyIndex"
          >
            <template v-slot:eventContent="arg">
              <div
                class="my-event"
                style="display: flex; flex-direction: column"
                @click="openEvent(arg.event.id)"
                :class="getEventClass(arg.event.id)"
              >
                <div class="text-xs text-gray-600" style="line-height: 1">
                  {{ arg.event.title }}
                </div>
              </div>
            </template>
          </FullCalendar>
        </div>
        </div>
      </n-card>
    </n-spin>
    <CModal v-model:show="showEvent" class="max-w-[500px]" :title="currentEvent?.title">
      <div class="">
        <table class="base-table">
          <tr>
            <th class="w-[120px]">Dars:</th>
            <td>{{ currentEvent?.title }}</td>
          </tr>
          <tr>
            <th>Boshlanish vaqti:</th>
            <td>{{ currentEvent?.start }}</td>
          </tr>
          <tr>
            <th>Tugash vaqti:</th>
            <td>{{ currentEvent?.end }}</td>
          </tr>
          <tr v-if="currentEvent?.status">
            <th>Holati:</th>
            <td>
              <CTag :type="TimeTableStatus[currentEvent.status].color">
                {{ TimeTableStatus[currentEvent?.status!].name }}
              </CTag>
            </td>
          </tr>
          <tr v-if="currentEvent?.status == 3 || currentEvent?.status == 4">
            <th v-if="currentEvent?.status==4">Tasdiqlagan</th>
            <th v-else>Rad qilgan</th>
            <td>
              <div class="flex gap-2">
                <img
                  class="rounded w-[60px] h-[70px] flex-shrink-0 object-contain"
                  :src="$withBaseUrl(currentEvent?.updatedBy?.avatar)"
                />
                <div>
                  {{ currentEvent?.updatedBy?.first_name }}
                  {{ currentEvent?.updatedBy?.last_name }}
                  <br />
                  {{ currentEvent?.updatedBy?.middle_name }}
                  <div class="text-blue-500"> {{ currentEvent?.updated_at }} </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div class="mt-8 flex justify-end flex-col gap-2">
          <CButton
            v-if="currentEvent?.status == 1"
            @click="confirm()"
            class="w-full"
            icon="tick"
            type="info"
            :loading="eventLoading"
            >O'tildi</CButton
          >
          <div class="grid grid-cols-2 gap-2" v-if="user.role == 100">
            <CButton
              v-if="currentEvent?.status == 2"
              @click="reject()"
              class="w-full"
              icon="times"
              type="error"
              :loading="eventLoading"
              >Bekor qilish</CButton
            >
            <CButton
              v-if="currentEvent?.status == 2 || currentEvent?.status == 3"
              @click="accept()"
              class="w-full"
              icon="tick2x"
              type="success"
              :loading="eventLoading"
              >Tasdiqlash</CButton
            >
          </div>
        </div>
      </div>
    </CModal>
  </div>
</template>
<style lang="scss">
.fc-dayTitle-button {
  cursor: default !important;
  background-color: transparent !important;
  border: 0 !important;
  font-size: 1.75em !important;
  outline: none !important;
}
.d-fullcalendar {
  .fc-v-event {
    background: #ede7f6 !important;
  }
  .fc-myCustomButton-button {
    background-color: #00aaff !important;
    color: #fff !important;
    border: 0 !important;
  }
  .my-event {
    color: #000;
    width: 100%;
    white-space: normal !important;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    padding: 2px 2px 5px;
    cursor: pointer;
    &:hover {
      background-color: rgba(115, 103, 240, 0.12);
      // color: var(--info);
    }
    border-radius: 2px 10px 10px 2px;
    //
    &.event-default {
      background-color: rgba(115, 103, 240, 0.12);
      border-left: 4px solid rgb(87 84 120 / 80%);
    }
    &.event-info {
      background-color: rgb(0 170 255 / 23%);
      border-left: 4px solid #00aaff;
    }
    &.event-success {
      background-color: #5abf5e8c;
      border-left: 4px solid #1fb426;
    }
    &.event-error {
      background-color: #f4433638;
      border-left: 4px solid #f44336;
    }
  }

  .fc .fc-toolbar {
    padding: 10px;
  }
  .fc .fc-button-primary {
    background: transparent;
    color: #000;
  }
  .fc-button-active {
    background-color: #00aaff !important;
    color: #fff !important;
  }
  .fc .fc-button .fc-icon {
    color: #000;
  }
  .fc .fc-button-primary:not(:disabled).fc-button-active,
  .fc .fc-button-primary:not(:disabled):active {
    color: #000;
    background: transparent;
  }

  .fc .fc-button-primary:disabled {
    color: #000;
  }
  .fc-h-event {
    height: 68px;
    background: rgba(115, 103, 240, 0.12);
    border-left: 4px solid rgba(115, 103, 240, 0.8);
  }
  .fc-h-event .fc-event-main {
    text-overflow: initial;
    white-space: normal;
  }
}
</style>
