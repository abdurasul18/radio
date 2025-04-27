<script lang="ts" setup>
let isMounted = ref(false);
onMounted(async () => {
  await nextTick();
  isMounted.value = true;
});
onUnmounted(() => {
  isMounted.value = false;
});
</script>
<template>
  <Teleport v-if="isMounted" to="#appTitle">
    <slot></slot>
  </Teleport>
</template>
<style lang="scss"></style>
