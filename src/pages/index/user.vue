<script lang="ts" setup>
import { UserService, IUser } from "/@src/services/user";
import { useApiService } from "/@src/composable/getList";
import { confirmDelete } from "/@src/composable/helpers";
import { toastSuccess } from "/@src/plugins/toast";
import { useModal } from "naive-ui";
import { RoleType } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
const { user } = toRefs(useAuthStore());
let modal = useModal();
let route = useRoute();
let direction_id = ref(
  Number(route.query.direction_id) || user.value?.direction_id || null
);
let paramsAdd = computed(() => {
  return {
    query: {
      direction_id: direction_id.value,
    },
  };
});
const {
  list,
  loading,
  search,
  per_page,
  limits,
  fetchData,
  total,
  page,
} = useApiService<IUser>(UserService.getList, paramsAdd);

onMounted(() => {
  fetchData();
});

let addShow = ref(false);
let mode = ref<"create" | "update">("create");
let currentItem = ref<IUser | null>(null);

async function deleteItem(item: IUser) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await UserService.delete(item.id!);
    fetchData();
    toastSuccess();
  }
}
let excelLoading = ref(false);
async function exportExcel() {
  window.open(
    import.meta.env.VITE_API_API_SERVICE +
      "user/export-excel?direction_id=" +
      direction_id.value
  );
}
</script>

<template>
  <div>
    <AppTitle>O'qituvchilar</AppTitle>

    <n-spin :show="loading">
      <n-card class="base-card" :bordered="false">
        <div
          class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
        >
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex">
              <n-input
                v-model:value="search"
                clearable
                size="large"
                :placeholder="$t('actions.search')"
                class="search-input min-w-[200px]"
              >
                <template #prefix>
                  <CIcon name="search" class="mr-4" />
                </template>
              </n-input>
              <select v-model="per_page" class="w-[156px] c-select-grey ml-4">
                <option v-for="val in limits" :value="val">{{ val }}</option>
              </select>
            </div>
            <SelectDirection
              class="w-full"
              v-model:value="direction_id"
              label="Kafedra"
            />
          </div>
          <div class="flex gap-2">
            <CButton
              :loading="excelLoading"
              @click="exportExcel"
              class="text-green-500"
              type="default"
            >
              <img class="mr-3" src="/@src/assets/img/excel.png" alt="" />Excelga
              ko'chirish</CButton
            >
            <CButton
              icon="plus"
              @click="
                mode = 'create';
                addShow = true;
              "
            >
              {{ $t("actions.add") }}
            </CButton>
          </div>
        </div>
        <div class="-m-6 pt-6">
          <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
            <table class="c-table2 min-w-[1000px]">
              <thead>
                <tr>
                  <th style="width: 80px">№</th>
                  <th>Xodim</th>
                  <th>Foydalanuvchi nomi</th>
                  <th>Tug'ilgan sanasi</th>
                  <th>Telefon raqami</th>
                  <th>Darajasi</th>
                  <th>Role</th>
                  <!-- <th>Status</th> -->
                  <th class="min-w-[120px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody v-if="list.length">
                <tr v-for="(item, i) in list" :key="i">
                  <td>{{ $paginate(i, page, per_page) }}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <n-image class="c-avatar" :src="$withBaseUrl(item.avatar)" />
                      <div>
                        {{ item.first_name }} {{ item.last_name }} <br />
                        {{ item.middle_name }}
                      </div>
                    </div>
                  </td>
                  <td>{{ item.username }}</td>
                  <td>{{ item.birthday }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.degree?.name }}</td>
                  <td>
                    {{RoleType[item.role!] }}
                  </td>
                  <!-- <td>
                  <CTag v-if="item.status == 1" type="success">Active</CTag>
                  <CTag v-else type="error">Inactive</CTag>
                </td> -->
                  <td>
                    <div class="grid grid-cols-3 gap-1">
                      <CTooltip>
                        <template #trigger>
                          <CIconButton
                            size="small"
                            icon="user"
                            @click="$router.push(`/profile?userId=${item.id}`)"
                          />
                        </template>
                        <div>Profil</div>
                      </CTooltip>
                      <CTooltip>
                        <template #trigger>
                          <n-badge
                            class="c-badge"
                            type="warning"
                            processing
                            :value="item.processing_lesson_count"
                          >
                            <CIconButton
                              size="small"
                              icon="calendar"
                              @click="
                                $router.push(`/profile/time-table?userId=${item.id}`)
                              "
                            />
                          </n-badge>
                        </template>
                        <div>Dars jadvali</div>
                      </CTooltip>
                      <CTooltip>
                        <template #trigger>
                          <n-badge
                            class="c-badge"
                            type="warning"
                            processing
                            :value="item.processing_task_count"
                          >
                            <CIconButton
                              size="small"
                              icon="task2"
                              @click="
                                $router.push(`/profile/personal-task?userId=${item.id}`)
                              "
                            />
                          </n-badge>
                        </template>
                        <div>Topshiriqlar</div>
                      </CTooltip>
                      <CTooltip>
                        <template #trigger>
                          <CIconButton
                            size="small"
                            icon="geometric"
                            @click="$router.push(`/profile/task?userId=${item.id}`)"
                          />
                        </template>
                        <div>Yuklamalar</div>
                      </CTooltip>

                      <CTooltip>
                        <template #trigger>
                          <CIconButton
                            size="small"
                            @click="
                              mode = 'update';
                              addShow = true;
                              currentItem = item;
                            "
                            icon="edit"
                            type="info"
                          />
                        </template>
                        <div>Tahrirlash</div>
                      </CTooltip>
                      <CTooltip>
                        <template #trigger>
                          <CIconButton
                            size="small"
                            icon="delete"
                            type="error"
                            @click="deleteItem(item)"
                          />
                        </template>
                        <div>O'chirish</div>
                      </CTooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
              <AppNotFound v-else mode="table" />
            </table>
          </div>
        </div>
      </n-card>
      <div class="mt-5 ml-4 mb-5">
        <n-pagination
          class="c-pagination"
          v-model:page="page"
          v-model:page-size="per_page"
          :page-count="Math.ceil(total / per_page)"
        />
      </div>
    </n-spin>

    <CModal
      v-model:show="addShow"
      :title="mode === 'create' ? 'Xodim qo\'shish' : 'Xodim tahrirlash'"
      class="max-w-[800px]"
    >
      <AddUpUser
        :mode="mode"
        :item="currentItem!"
        @close="addShow = false"
        @success="
          addShow = false;
          fetchData();
        "
      />
    </CModal>
  </div>
</template>

<style lang="scss">
.c-badge {
  .n-badge-sup {
    left: 70% !important;
  }
}
</style>
