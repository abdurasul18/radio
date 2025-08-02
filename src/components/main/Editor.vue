<script lang="ts" setup>
let props = defineProps<{
  value: string;
  id?: string;
  landscape?: boolean;
  viewMode?: boolean;
  width ?:string
  hasVideo?: boolean;
}>();
let emits = defineEmits(["update:value"]);
let text = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("update:value", val);
  },
});
let keyIndex = ref(0);
function reInit() {
  keyIndex.value++;
}
onMounted(() => {
  reInit();
});
defineExpose({
  reInit,
});
</script>
<template>
  <div>
    <FroalaEditor
      :key="keyIndex"
      v-model:value="text"
      :id="props.id || 'froala'"
      :landscape="landscape"
      :viewMode="props.viewMode"
      :width="props.width"
      :hasVideo="props.hasVideo"
    />
  </div>
</template>

<style lang="scss">

</style>
