<script lang="ts" setup>
import { IFile } from "/@src/services/types";
import { imgFormat, videoFormat } from "/@src/utils/file-formats";

let props = defineProps<{
  data: IFile;
  deletable?: boolean;
}>();
let emits = defineEmits(["delete"]);
const baseUrl = import.meta.env.VITE_API_IMG_URL;
let extension = computed(() => {
  return props.data.name.split(".").pop()?.toLowerCase() || "";
});
let fileType = computed(() => {
  if (imgFormat.includes(extension.value)) {
    return "image";
  } else if (videoFormat.includes(extension.value)) {
    return "video";
  } else if (extension.value == "pdf") {
    return "pdf";
  } else {
    return "other";
  }
});
let showPdf = ref(false);
function showOrDownload() {
  if (fileType.value == "pdf" || fileType.value == "video") {
    showPdf.value = true;
  } else if (fileType.value == "image") {
    return;
  } else {
    download();
  }
}
function download() {
  let link = document.createElement("a") as HTMLAnchorElement;
  link.download = `${props.data.name || "file"}`;
  link.href = `${baseUrl}/${props.data.uploadPath || props.data.path}`;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
<template>
  <div
    class="p-4 rounded-2xl bg-white border broder-grey-100 flex justify-between items-center gap-4 mb-4"
  >
    <div class="flex items-center">
      <div class="cursor-pointer mr-4 rounded-xl overflow-hidden" @click="showOrDownload">
        <div
          class="flex items-center justify-center bg-[#FFEDED] w-12 h-12"
          v-if="fileType == 'pdf'"
        >
          <img src="/@src/assets/img/pdf.png" alt="" />
        </div>
        <div
          class="flex items-center justify-center bg-blue-50 w-12 h-12"
          v-else-if="fileType == 'image'"
        >
          <n-image
            class="n-contain"
            v-if="data.uploadPath || data.path"
            :src="$withBaseUrl(data.uploadPath || data.path)"
          />
        </div>
        <div class="flex items-center justify-center bg-blue-50 w-12 h-12" v-else>
          <CIcon class="info-svg" name="file" />
        </div>
      </div>
      <div class="text-sm max-w-[70%]">
        <div class="font-semibold">{{ data.name }}</div>
        <!-- <div class="text-grey-500">17.38 Kb</div> -->
      </div>
    </div>
    <div class="flex justify-end items-center gap-2">
      <CIconButton icon="download" @click="download" />
      <CIconButton type="error" icon="delete" @click="emits('delete', data.id)" />
    </div>
  </div>

  <CModal v-model:show="showPdf" :title="data.name">
    <iframe
      width="100%"
      :src="`${$baseUrl}/${data.uploadPath ||data.path}`"
      style="min-height: 80vh; background-color: #ffffff"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    />
  </CModal>
</template>
<style lang="scss">
.n-contain {
  img {
    object-fit: contain !important;
  }
}
</style>
