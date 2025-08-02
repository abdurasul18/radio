<script lang="ts" setup>
let search = ref("");
</script>

<template>
  <div>
    <AppTitle> Xizmat turlari </AppTitle>
    <div
      class="px-2 sm:px-9 flex flex-col-reverse sm:flex-row gap-4 mb-4 items-center justify-between"
    >
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="flex justify-between">
          <n-input
            v-model:value="search"
            clearable
            size="large"
            :placeholder="$t('actions.search')"
            class="search-input min-w-[400px]"
          >
            <template #prefix>
              <CIcon name="search" class="mr-4" />
            </template>
          </n-input>
        </div>
      </div>
      <div class="flex gap-2">
        <CButton icon="plus">
          {{ $t("actions.add") }}
        </CButton>
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <RouterLink
        :to="`/category?service_id=${item}`"
        v-for="item in 8"
        class="flex p-5 rounded-2xl border border-grey-100 bg-white cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all duration-200"
      >
        <div class="flex gap-4 items-center">
          <img src="/img/edu.png" alt="" />
          <div class="font-semibold text-lg">Ta’lim kurslari</div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
<style lang="scss"></style>
