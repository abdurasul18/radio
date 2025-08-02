<script lang="ts" setup>
let loading = ref(false);
let search = ref("");
</script>
<template>
  <div>
    <AppTitle> Xizmatlar </AppTitle>
    <n-spin :show="loading" size="large">
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
          <CButton icon="plus" @click="$router.push('/organization/add')">
            {{ $t("actions.add") }}
          </CButton>
        </div>
      </div>
      <div class="pt-3">
        <TransitionGroup name="list" tag="div" class="grid grid-cols-4 gap-5">
          <n-card
            class="base-card base-card-hover overflow-hidden"
            v-for="(item, index) in 8"
          >
            <template #cover>
              <div class="cursor-default" @click.stop>
                <n-carousel
                  show-arrow
                  draggable
                  slides-per-view="auto"
                  :space-between="10"
                >
                  <img
                    v-for="file in 8"
                    class="w-full h-[200px] object-cover rounded-2xl"
                    :src="`https://picsum.photos/seed/${file}/800/600`"
                  />
                </n-carousel>
              </div>
            </template>
            <div class="grid gap-2">
              <div class="flex justify-between gap-4">
                <div class="font-semibold leading-4 mb-4">
                  Lorem ipsum dolor sit amet.
                </div>
              </div>
              <div class="flex gap-2">
                <CIcon class="info-svg" width="20" name="phone" /> +1 (331) 800 001
              </div>
              <div class="flex gap-2">
                <CIcon class="info-svg" width="20" name="location" />Brooklyn, NY 10019
              </div>
            </div>
            <n-divider />
            <div class="flex justify-end gap-2">
              <CActionIcon icon="delete" class="error-svg" />
              <CActionIcon class="info-svg" icon="edit" />
              <CActionIcon icon="eye" />
            </div>
          </n-card>
        </TransitionGroup>
      </div>
    </n-spin>
  </div>
</template>
<style lang="scss"></style>
