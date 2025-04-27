<script lang="ts" setup>
import { ITask, TaskType } from "/@src/services/task";
import { IPersonalTask, UserService } from "/@src/services/user";
import { useAuthStore } from "/@src/store/auth";
import { confirmAction } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
const modal = useModal();

const { user } = toRefs(useAuthStore());
let loading = ref(false);
let addShow = ref(false);
let list = ref<ITask[]>([]);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "") || user.value.id;
});
async function getList() {
  try {
    loading.value = true;
    let res = await UserService.getYuklama(userId.value!);
    list.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getList();
});
let showDrawer = ref(false);
let currentItem = ref<ITask | null>(null);
let width = window.innerWidth > 900 ? 800 : window.innerWidth - 50;
//
let currentUserTask = ref<IPersonalTask | null>(null);
let showCompleting = ref(false);
async function confirmTask(item: IPersonalTask) {
  let isConfirm = await confirmAction(modal, "Topshiriqni tasdiqlaysizmi?");
  if (!isConfirm) return;
  try {
    loading.value = true;
    let res = await UserService.taskConfirm(item?.id!);
    showDrawer.value = false;
    toastSuccess();
    getList();
  } finally {
    loading.value = false;
  }
}
async function rejectTask(item: IPersonalTask) {
  let isConfirm = await confirmAction(modal, "Topshiriqni rad qilasizmi?");
  if (!isConfirm) return;
  try {
    loading.value = true;
    let res = await UserService.taskReject(item?.id!);
    showDrawer.value = false;
    toastSuccess();
    getList();
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div>
    <n-spin :show="loading" size="large">
      <n-card class="base-card" :bordered="false">
        <div class="flex justify-between mb-9">
          <div class="text-[28px] font-semibold">Yuklamalar</div>
        </div>
        <div class="-m-6 pt-6">
          <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
            <table class="c-table2 min-w-[600px]" v-if="list.length">
              <thead>
                <tr>
                  <th style="width: 80px">
                    {{ $t("field.number") }}
                  </th>
                  <th>Nomi</th>
                  <th class="one-line">Me'zoni</th>
                  <th class="one-line">Miqdori</th>
                  <th>Holati</th>
                  <th class="one-line text-right">{{ $t("actions.title") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in list" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    {{ item.title }}
                  </td>

                  <td>
                    {{ item.criterion?.name }}
                  </td>
                  <td>
                    <div class="flex items-center gap-1">
                      <CTag> {{ item.volume }} </CTag> /
                      <CTag> {{ item.userTasks.length }}</CTag>
                    </div>
                  </td>
                  <td>
                    <CTag :type="TaskType[item.status]?.color">
                      {{ TaskType[item.status]?.name }}
                    </CTag>
                  </td>

                  <td>
                    <CIconButton
                      @click="
                        currentItem = item;
                        showDrawer = true;
                      "
                      icon="eye"
                      type="info"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <AppNotFound v-else />
          </div>
        </div>
      </n-card>
    </n-spin>
    <n-drawer :width="width" v-model:show="showDrawer">
      <n-card
        class="w-full h-screen"
        closable
        @close="showDrawer = false"
        :title="`${currentItem?.title}`"
      >
        <div class="flex justify-end mb-4">
          <CButton @click="showCompleting = true">
            <CIcon name="plus" class="info-svg" /> Fayl qo'shish
          </CButton>
        </div>
        <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
          <table class="base-table w-full min-w-[800px]">
            <thead>
              <tr>
                <th>{{ $t("field.number") }}</th>
                <th>Izoh</th>
                <th class="w-[120px]">Sana</th>
                <th>Fayl</th>
                <th>Holati</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody v-if="currentItem?.userTasks.length">
              <tr v-for="(item, i) in currentItem.userTasks">
                <td>{{ i + 1 }}</td>
                <td>{{ item.task.title }}</td>
                <td>{{ item.created_at }}</td>
                <td>
                  <a
                    v-if="item.file?.file_url"
                    :href="$withBaseUrl(item.file?.file_url)"
                    download
                    class="flex gap-2 items-center text-blue-500 one-line"
                  >
                    <CIcon name="download" class="info-svg" /> Yuklab olish
                  </a>
                </td>
                <td>
                  <CTag :type="TaskType[item.status]?.color">
                    {{ TaskType[item.status]?.name }}
                  </CTag>
                </td>
                <td>
                  <div class="flex gap-1 flex-col">
                    <template  v-if="user?.role === 100">
                        <CButton
                          v-if="item.status === 2 || item.status === 4"
                          @click="confirmTask(item)"
                          size="small"
                          type="success"
                          icon="tick2x"
                        >
                          Tasdiqlash
                        </CButton>
                        <CButton
                          v-if="item.status === 2 "
                          @click="rejectTask(item)"
                          size="small"
                          type="error"
                          icon="times"
                        >
                          Rad qilish
                        </CButton>
                       </template>
                  </div>
                </td>
              </tr>
            </tbody>
            <AppNotFound v-else mode="table" />
          </table>
        </div>
      </n-card>
    </n-drawer>
    <CModal v-model:show="showCompleting" title="Bajardim" class="max-w-[500px]">
      <TaskCompleting
        @success="
          showCompleting = false;
          showDrawer = false;
          getList();
        "
        @close="showCompleting = false"
        :task_id="currentItem?.id!"
        :user_task_id="''"
      />
    </CModal>
  </div>
</template>
<style lang="scss"></style>
