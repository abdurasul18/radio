<script lang="ts" setup>
import AppHeader from "../layout/AppHeader.vue";
import AppNavigation from "../layout/AppNavigation.vue";
let showHeader = window.innerWidth > 768;
</script>
<template>
  <div class="flex h-screen bg-[#F0F2F5]">
    <AppNavigation class="hidden md:block flex-shrink-0" />
    <div class="w-full max-h-screen overflow-y-auto">
      <AppHeader />
      <div class="site-content">
        <div v-if="!showHeader" class="text-xl font-semibold" id="appTitle"></div>
        <Transition name="fade">
          <RouterView />
        </Transition>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.site-content {
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px 12px;
  }
}
</style>
