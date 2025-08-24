<script lang="ts" setup>
import { useAuthStore } from "/@src/store/auth";

const { educations } = useAuthStore();
</script>

<template>
  <div>
    <AppTitle> Ta'lim </AppTitle>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="(item, index) in educations"
        class="flex p-5 rounded-2xl border border-grey-100 bg-white relative"
      >
        <div class="absolute top-2 right-2">
          <CDropdown>
            <template #trigger>
              <CActionIcon icon="more" @click.stop />
            </template>
            <n-list hoverable clickable>
              <n-list-item @click="$router.push(`/education/${item.code}/subject`)">
                <div class="flex text-base">
                  <img class="w-6 mr-4 object-contain" src="/img/lesson.png" alt="" />
                  Ta’lim
                </div>
              </n-list-item>
              <n-list-item @click="$router.push(`/question?menu=${item.code}`)">
                <div class="flex text-base">
                  <img class="w-6 mr-4 object-contain" src="/img/test.png" alt="" />
                  Test
                </div>
              </n-list-item>
            </n-list>
          </CDropdown>
        </div>
        <div class="flex gap-4 items-center">
          <img class="w-[60px]" :src="item.img" alt="" />
          <div class="font-semibold text-lg leading-5">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
