<script lang="ts" setup>
import { IUserDocument, UserService } from "/@src/services/user";
import { useAuthStore } from "/@src/store/auth";
const { user } = toRefs(useAuthStore());
let loading = ref(false);
let addShow = ref(false);
let list = ref<IUserDocument[]>([]);
const route = useRoute();
let userId = computed(() => {
  return String(route.query.userId || "") || user.value.id;
});
async function getList() {
  try {
    loading.value = true;
    let res = await UserService.getDocuments(userId.value!);
    list.value = res.data.data?.documents || [];
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getList();
});
</script>
<template>
  <div>
    <n-spin :show="loading" size="large">
      <n-card class="base-card" :bordered="false">
        <div class="flex justify-between mb-9">
          <div class="text-[28px] font-semibold">Hujjatlar</div>
          <CButton icon="plus" @click="addShow = true">
            {{ $t("actions.add") }}
          </CButton>
        </div>
        <div class="-m-6 pt-6">
          <div class="max-w-[90vw] sm:max-w-[100%] overflow-x-scroll sm:overflow-x-auto">
            <table class="c-table2 min-w-[600px]" v-if="list.length">
            <thead>
              <tr>
                <th style="width: 80px">
                  {{ $t("field.number") }}
                </th>
                <th>Izoh</th>
                <th>Fayl</th>
                <th class="w-[120px] text-right">{{ $t("actions.title") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.comment }}
                </td>
                <td>
                  <a :href="$withBaseUrl(item.file_url)" download class="flex gap-2 items-center text-blue-500">
                    <CIcon name="download"  class="info-svg"/> Yuklab olish
                  </a>
                </td>
                <td>
                  <div class="flex gap-2 justify-end">
                    <CActionIcon icon="delete" class="error-svg" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <AppNotFound v-else />
          </div>
        </div>
      </n-card>
    </n-spin>
    <CModal v-model:show="addShow" title="Hujjat qo'shish" class="max-w-[500px]">
      <AddDoc
        @success="
          addShow = false;
          getList();
        "
        @close="addShow = false"
        :id="userId!"
      />
    </CModal>
  </div>
</template>
<style lang="scss"></style>
