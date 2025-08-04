<script lang="ts" setup>
import { IOrganization, OrganizationService } from "/@src/services/organization";

let route = useRoute();
let routeId = computed(() => {
  return route.params.id ? String(route.params.id) : "";
});
let loading = ref(false);
let data = ref<IOrganization>();
async function getData() {
  try {
    loading.value = true;
    let res = await OrganizationService.getById(routeId.value);
    data.value = res.data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(getData);
</script>
<template>
  <n-spin :show="loading">
  <AppTitle> {{ data?.name }} </AppTitle>
  <CButton type="default" @click="$router.back()"> Orqaga</CButton>
    <n-card class="base-card base-card-hover overflow-hidden max-w-[600px] mx-auto">
      <template #cover>
        <div class="cursor-default" @click.stop>
          <n-carousel show-arrow draggable slides-per-view="1" :space-between="10">
            <n-image
              v-for="(file, fileIndex) in data?.files"
              class="w-full h-[400px] n-img-cover  rounded-2xl overflow-hidden"
              :src="$withBaseUrl(file.file?.path)"
            />
          </n-carousel>
        </div>
      </template>
      <div class="grid gap-2">
        <div class="flex justify-between gap-4">
          <div class="font-semibold leading-4 mb-4">
            {{ data?.name }}
          </div>
        </div>
        <div class="flex gap-2">
          <CIcon class="info-svg" width="20" name="phone" /> {{ data?.phone_number }}
        </div>
        <div class="flex gap-2">
          <CIcon class="info-svg" width="20" name="location" /> {{ data?.address }}
        </div>
        <n-divider />
        <div v-html="data?.description"></div>
        <SelectLocation
          :lat="Number(data?.lat) || null"
          :lon="Number(data?.lon) || null"
          :view-mode="true"
        />
      </div>
    </n-card>
  </n-spin>
</template>
<style lang="scss"></style>
