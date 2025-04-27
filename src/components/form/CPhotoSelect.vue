<script lang="ts" setup>
import { FileService } from "/@src/services/file";
import { fileToBase64 } from "/@src/utils";
let props = defineProps<{
  value?: any;
  schema?: any;
}>();
let emits = defineEmits(["update:value", "update:loading"]);
let fileInpRef = ref<HTMLInputElement | null>(null);
const handleFileInput = () => {
  fileInpRef.value?.click();
};
let fileVal = ref<File | null>(null);
let id = Math.random().toString(36).substring(7);
let compValue = computed({
  get: () => props.value,
  set: (val) => {
    emits("update:value", val);
  },
});

async function uploadFile(e: Event) {
  let file = (e.target as HTMLInputElement).files?.[0];
  fileVal.value = file || null;
}
function cancelUpload() {
  compValue.value = "";
  if (fileInpRef.value) {
    fileInpRef.value.value = "";
  }
}
watch(
  () => fileVal.value,
  async (val) => {
    if (val) {
      emits("update:loading", true);
      let res = await FileService.upload(val);
      compValue.value = res.data.file?.url;
      emits("update:loading", false);
    } else {
      compValue.value = "";
    }
  }
);
</script>
<template>
  <div class="relative">
    <label :for="id" class="photo-upload relative" v-bind="$attrs">
      <img
        v-if="compValue"
        class="object-cover w-full h-full"
        :src="$withBaseUrl(compValue)"
        alt=""
      />
      <div v-else class="flex flex-col justify-center items-center text-center">
        <CIcon class="mb-2" height="40" name="upload" />
        <div class="text-xs leading-[1]">{{ $t("info.dropFile") }}</div>
      </div>
      <input
        :id="id"
        type="file"
        class="opacity-0 absolute inset-0"
        ref="fileInpRef"
        accept="image/*"
        @change="uploadFile"
      />
    </label>
    <CIcon
      v-if="compValue"
      @click="cancelUpload"
      class="absolute top-0 right-0 error-svg cursor-pointer"
      name="times"
    />
    <p v-if="schema?.$error" class="text-error text-sm mt-[2px] text-center">
      {{ $t("error.empty") }}
    </p>
  </div>
</template>
<style lang="scss">
.photo-upload {
  @apply flex items-center justify-center border-2 border-grey-100 bg-grey-50 rounded-lg overflow-hidden cursor-pointer;
  transition: all 0.3s;
  svg {
    transition: all 0.3s;
  }
  &:hover {
    @apply border-2 border-grey-200 border-dashed;
    svg {
      transform: translateY(-3px);
    }
    path {
      stroke: #43c073 !important;
    }
  }
}
</style>
