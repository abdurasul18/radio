<script lang="ts" setup>
import AppHeader from "../layout/AppHeader.vue";
import AppNavigation from "../layout/AppNavigation.vue";
</script>
<template>
  <div class="flex h-screen">
    <AppNavigation />
    <div class="w-full max-h-screen overflow-y-scroll">
      <AppHeader />
      <div class="site-content px-9 py-4">
        <Transition name="fade">
          <AppNotFound />
        </Transition>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
