<script setup lang="ts">
import UploadSvg from "/@src/assets/img/svg/file-upload.svg";
import { fileToBase64 } from "/@src/utils";

let props = withDefaults(
  defineProps<{
    value: any;
    notMultiple?: boolean;
    accept?: string;
  }>(),
  {
    accept: ".jpg, .jpeg, .png, .svg, .docx, .doc, .pdf, .xlsx, .xls",
  }
);
let emits = defineEmits(["update:value"]);
let fileRef = ref<HTMLInputElement>();
function onAddFile(e: any) {
  let isAcceptable = true;
  Array.from(e.target.files).forEach((e: any) => {
    let extension = e.name?.split?.(".")?.pop?.();
    let extensions = props.accept
      .split(", ")
      .map((el: string) => el.replace("image/", "").replace(".", ""));
    if (!extensions.some((el: string) => el?.toLowerCase() == extension?.toLowerCase())) {
      isAcceptable = false;
    }
  });
  if (isAcceptable) {
    files.value = [...files.value, ...Array.from(e.target.files)];
  } else {
    if (fileRef.value) fileRef.value.value = "";
  }

  if (fileRef.value) fileRef.value.value = "";
}

let files = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("update:value", val);
  },
});
function addMore() {
  fileRef.value?.click();
}
let inputId = Math.random().toString(36).substring(7);
function getSize(size: number) {
  let sizeKb = size / 1024;
  if (sizeKb / 1024 >= 0.5) {
    return `${(sizeKb / 1024).toFixed(2)} MB`;
  } else {
    return sizeKb.toFixed(2) + " KB";
  }
}
let showFile = ref(false);
let base64 = ref("");
async function openFile(file: File) {
  if (file.type !== "application/pdf" && !file.type.startsWith("image")) {
    return;
  }
  let val = await fileToBase64(file);
  if (val.startsWith("data:application/pdf")) {
    base64.value = val;
  } else {
    base64.value = `data:${file.type};base64,${val}`;
  }
  showFile.value = true;
}
</script>

<template>
  <div>
    <label :for="inputId" v-show="!files.length">
      <div class="mb-4">
        <UploadSvg />
      </div>
      <div class="font-semibold">{{ $t("actions.uploadFile") }}</div>
      <div class="text-grey-500">{{ $t("info.dropFile") }}</div>
      <div class="text-sm text-grey-500">({{ accept }})</div>
      <input
        @change="onAddFile"
        class="file"
        type="file"
        :id="inputId"
        :multiple="!notMultiple"
        ref="fileRef"
        :accept="accept"
      />
    </label>
    <div v-if="files.length">
      <div class="mt-4">
        <div class="border-b border-grey-100" v-for="(item, index) in files">
          <div
            class="flex justify-between items-center uploaded-file hover:bg-gray-50 p-1"
          >
            <div class="flex items-center">
              <div
                @click="openFile(item)"
                class="flex items-center justify-center rounded-xl bg-blue-50 mr-4 w-12 h-12 cursor-pointer"
              >
                <CIcon class="info-svg" name="file" />
              </div>
              <div class="text-sm">
                <div class="font-semibold">{{ item.name }}</div>
                <div class="text-grey-500">{{ getSize(item.size) }}</div>
              </div>
            </div>
            <CIcon @click="files.splice(index, 1)" class="cursor-pointer" name="times" />
          </div>
        </div>
        <CButton v-if="!notMultiple" @click="addMore" class="w-full mt-4" icon="upload" size="small" ghost>
          {{ $t("actions.uploadFile") }}
        </CButton>
      </div>
    </div>
    <CModal v-model:show="showFile" class="max-w-[1000px]">
      <iframe class="w-full h-[800px]" :src="`${base64}`" frameborder="0" :key="base64"/>
    </CModal>
  </div>
</template>
<style lang="scss" scoped>
label {
  min-height: 126px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  box-sizing: content-box;
  margin-bottom: 15px;
  @apply border border-dashed border-grey-300;
  cursor: pointer;
  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    cursor: pointer;
  }

  &:hover {
    &::after {
      content: "";
      position: absolute;
      inset: -3px;
      border-radius: 12px;
      @apply border border-dashed border-grey-300;
    }
  }
}
</style>
