<script lang="ts" setup>
import AppHeader from "../layout/AppHeader.vue";
import AppNavigation from "../layout/AppNavigation.vue";
let showHeader = window.innerWidth > 768;
</script>
<template>
  <div class="flex h-screen">
    <AppNavigation class="hidden md:block" />
    <div class="w-full max-h-screen overflow-y-scroll">
      <AppHeader />
      <div class="site-content px-4 py-4">
        <div v-if="!showHeader" class="text-xl font-semibold" id="appTitle"></div>
        <Transition name="fade">
          <RouterView />
        </Transition>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
