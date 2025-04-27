<script lang="ts" setup>
import { IconName } from "../components/ui/CIcon.vue";

let props = withDefaults(
  defineProps<{
    active: boolean;
    to: string;
    icon: IconName;
    text: string;
  }>(),
  {
    active: false,
  }
);
</script>
<template>
  <n-tooltip
    trigger="hover"
    placement="right"
    :show-arrow="false"
    class="nav-link-tooltip"
    :class="{ 'nav-link-tooltip-active': active }"
    :keep-alive-on-hover="true"
  >
    <template #trigger>
      <RouterLink :to="props.to" class="nav-link" :class="{ 'nav-link-active': active }">
        <CIcon :name="props.icon" />
      </RouterLink>
    </template>
    <RouterLink :to="props.to" class="nav-link-content"> {{ text }} </RouterLink>
  </n-tooltip>
</template>
<style lang="scss"></style>
