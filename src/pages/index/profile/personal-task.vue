<script lang="ts" setup>
import { useModal } from "naive-ui";
import { TaskType } from "/@src/services/task";
import { IPersonalTask, UserService } from "/@src/services/user";
import { useAuthStore } from "/@src/store/auth";
import { confirmAction } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
const { user } = toRefs(useAuthStore());
const modal = useModal();
let loading = ref(false);
let addShow = ref(false);
let list = ref<IPersonalTask[]>([]);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "") || user.value.id;
});
async function getList() {
  try {
    loading.value = true;
    let res = await UserService.getPersonalTask(userId.value!);
    list.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getList();
});
let mode = ref<"create" | "update">("create");
let currentItem = ref<IPersonalTask | null>(null);
//
let showCompleting = ref(false);
async function confirmTask(item: IPersonalTask) {
  let isConfirm = await confirmAction(modal, "Topshiriqni tasdiqlaysizmi?");
  if (!isConfirm) return;
  try {
    loading.value = true;
    let res = await UserService.taskConfirm(item?.id!);
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
          <div class="text-[28px] font-semibold">Topshiriqlar</div>
          <CButton
            icon="plus"
            v-if="user?.role === 100"
            @click="
              mode = 'create';
              addShow = true;
            "
          >
            {{ $t("actions.add") }}
          </CButton>
        </div>
        <div class="-m-6 pt-6">
          <n-scrollbar x-scrollable>
            <div
              class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto"
            >
              <table class="c-table2 min-w-[800px]" v-if="list.length">
                <thead>
                  <tr>
                    <th style="width: 80px">
                      {{ $t("field.number") }}
                    </th>
                    <th>Topshiriq mavzusi</th>
                    <th class="one-line">O'quv yili</th>
                    <th>Mezoni</th>
                    <th class="one-line">Deadline</th>
                    <th class="one-line">Ball</th>
                    <th>Holati</th>
                    <th class="one-line">File</th>
                    <th class="one-line text-right">{{ $t("actions.title") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in list" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      {{ item.task?.title }}
                    </td>

                    <td>
                      {{ item.academicYear?.title }}
                    </td>
                    <td>
                      {{ item.task?.criterion?.name }}
                    </td>
                    <td>
                      {{ item.deadline }}
                    </td>
                    <td>
                      {{ item.rate }}
                    </td>
                    <td>
                      <CTag :type="TaskType[item.status]?.color" size="small">
                        {{ TaskType[item.status]?.name }}
                      </CTag>
                    </td>
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
                      <div class="flex gap-1 flex-col">
                        <CButton
                          v-if="user?.role === 100 && item.status === 1"
                          size="small"
                          icon="edit"
                          type="default"
                          @click="
                            mode = 'update';
                            currentItem = item;
                            addShow = true;
                          "
                        >
                          Tahrirlash
                        </CButton>
                        <CButton
                          v-if="item.status === 1"
                          @click="
                            currentItem = item;
                            showCompleting = true;
                          "
                          size="small"
                          icon="tick"
                        >
                          Bajardim
                        </CButton>
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
              </table>
              <AppNotFound v-else />
            </div>
          </n-scrollbar>
        </div>
      </n-card>
    </n-spin>
    <CModal v-model:show="addShow" title="Topshiriq qo'shish" class="max-w-[500px]">
      <AddUpPersonalTask
        @success="
          addShow = false;
          getList();
        "
        @close="addShow = false"
        :user-id="userId!"
        :mode="mode"
        :item="currentItem!"
      />
    </CModal>
    <!--  -->
    <CModal v-model:show="showCompleting" title="Bajardim" class="max-w-[500px]">
      <TaskCompleting
        @success="
          showCompleting = false;
          getList();
        "
        @close="showCompleting = false"
        :task_id="currentItem?.task.id!"
        :user_task_id="currentItem?.id!"
      />
    </CModal>
  </div>
</template>
<style lang="scss"></style>
