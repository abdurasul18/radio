<script lang="ts" setup>
import { IAttedance, UserService } from "/@src/services/user";
import { useAuthStore } from "/@src/store/auth";
const { user } = toRefs(useAuthStore());
let loading = ref(false);
let addShow = ref(false);
let list = ref<IAttedance[]>([]);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "") || user.value.id;
});
async function getList() {
  try {
    loading.value = true;
    let res = await UserService.getAttendance(userId.value!);
    list.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getList();
});
let mode = ref<"create" | "update">("create");
let currentItem = ref<IAttedance | null>(null);
</script>
<template>
  <div>
    <n-spin :show="loading" size="large">
      <n-card class="base-card" :bordered="false">
        <div class="flex justify-between mb-9">
          <div class="text-[28px] font-semibold">Davomat</div>
        </div>
        <div class="-m-6 pt-6">
          <table class="c-table2" v-if="list.length">
            <thead>
              <tr>
                <th style="width: 80px">
                  {{ $t("field.number") }}
                </th>
                <th>Fan nomi</th>
                <th class="one-line">Vaqti</th>
                <th class="one-line">Hafta kuni</th>
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
                  {{ item.volume }}
                </td>
                <td>
                  <CTag> Tasdiqlanmagan </CTag>
                </td>
                <td>
                  <a
                    v-if="item.file_url"
                    :href="item.file_url"
                    download
                    class="flex gap-2 items-center text-blue-500"
                  >
                    <CIcon name="download" class="info-svg" /> Yuklab olish
                  </a>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <AppNotFound v-else />
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
  </div>
</template>
<style lang="scss"></style>
