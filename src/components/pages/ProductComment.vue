<script lang="ts" setup>
import { useModal } from "naive-ui";
import { useApiServiceAll } from "/@src/composable/getListAll";
import { confirmDelete } from "/@src/composable/helpers";
import { IComment, OrganizationService } from "/@src/services/organization";
const props = defineProps<{
  product_id: string;
}>();
const modal = useModal();
const route = useRoute();
let limit = ref(
  route.query.limit && !isNaN(Number(route.query.limit)) ? Number(route.query.limit) : 20
);
let page = ref(Number(route.query.offset || 0) / limit.value + 1);
let paramsAdd = computed(() => {
  return {
    query: {
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
      product_id: props.product_id,
    },
  };
});
const { list, loading, fetchData, total } = useApiServiceAll<IComment>(
  OrganizationService.getComments,
  paramsAdd
);
onMounted(() => {
  fetchData();
});

function getInitials(user: IComment["user"]): string {
  const first = user?.first_name?.charAt(0) ?? "";
  const last = user?.last_name?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function handleDelete(item: IComment) {
  let isConfirmed = await confirmDelete(modal);
  if (isConfirmed) {
    await OrganizationService.deleteComment(item.id);
    fetchData();
  }
}
</script>

<template>
  <div class="">
    <n-spin :show="loading">
      <!-- Chat list -->
      <n-scrollbar style="height: calc(100vh - 200px)" trigger="none">
        <div class="max-w-3xl mx-auto px-4 space-y-4">
          <div v-for="item in list" :key="item.id" class="flex items-start gap-3 group">
            <!-- Avatar -->
            <n-avatar
              v-if="item.user?.avatar"
              round
              :src="$withBaseUrl2(item.user?.avatar)"
            />
            <n-avatar
              v-else
              round
              :style="{
                color: '#fff',
                backgroundColor: '#00AAFF',
              }"
            >
              {{ getInitials(item.user) }}
            </n-avatar>

            <!-- Bubble + meta -->
            <div class="flex flex-col items-start max-w-[75%]">
              <!-- Username + time -->
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-gray-800">
                  {{ item.user?.first_name }} {{ item.user?.last_name }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>

              <!-- Bubble -->
              <div
                class="relative bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-gray-800 text-sm leading-relaxed"
              >
                <!-- Message text -->
                <p class="whitespace-pre-wrap break-words">{{ item.text }}</p>
              </div>

              <!-- Delete button below bubble -->
              <button
                @click="handleDelete(item)"
                class="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors duration-150 opacity-0 group-hover:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                O'chirish
              </button>
            </div>
          </div>
          <AppNotFound v-if="!list.length" />
        </div>
      </n-scrollbar>

      <!-- Pagination -->
      <div class="mt-2">
        <n-pagination
          class="c-pagination"
          :page-count="Math.ceil(total / limit)"
          :page-size="limit"
          v-model:page="page"
        />
      </div>
    </n-spin>
  </div>
</template>

<style lang="scss"></style>
