<script lang="ts" setup>
import { IconName } from "../components/ui/CIcon.vue";
import { useAuthStore } from "../store/auth";
const { token } = toRefs(useAuthStore());
let props = defineProps<{
  icon: IconName;
  isLocked: boolean;
  isActive?: boolean;
  text: string;
  url?: string;
}>();
function openProject() {
  if (props.isLocked) {
    return;
  }
    window.open(`${props.url}auth/login-with-token?token=${token.value}`, "_blank");
}
</script>
<template>
  <button
    class="flex flex-col items-center w-[104px] p-2 rounded-lg hover:bg-grey-50"
    :class="[
      props.isLocked ? 'text-grey-500' : 'text-grey-800',
      isActive ? 'active' : '',
    ]"
    @click="openProject"
  >
    <div class="app-item-icon">
      <CIcon :name="icon" />
    </div>
    <div class="flex gap-1">
      <div class="one-line w-[70px]">{{ props.text }}</div>
      <CIcon v-if="isLocked" name="lock2" />
    </div>
  </button>
</template>
<style lang="scss"></style>
