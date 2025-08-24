<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Ref } from "vue";
let emits = defineEmits(["update:value"]);
type PropType = {
  value: any;
  accept?: any;
  schema?: any;
  label?: string;
  message?: string;
};
let props = withDefaults(defineProps<PropType>(), {
  accept: ".jpg, .jpeg, .png",
});
const uploadRef: Ref<File[]> = ref([]);
watch(
  () => uploadRef.value,
  (val) => {
    emits("update:value", val?.[0]);
  }
);
let fileInpRef = ref<HTMLInputElement>();
function selectFile(e: any) {
  let extension = e.target.files[0].name?.split?.(".")?.pop?.();
  let extensions = acceptComp.value
    .split(", ")
    .map((el: string) => el.replace("image/", "").replace(".", ""));
  if (extensions.some((el: string) => el == extension)) {
    uploadRef.value = e.target.files;
  }
}
let acceptComp = computed(() => {
  if (!props.accept) return "";
  let capital = props.accept
    ?.split(",")
    .map((el: string) => el.toUpperCase())
    .join(",");
  let lower = props.accept
    ?.split(",")
    .map((el: string) => el.toLowerCase())
    .join(",");
  return capital + ", " + lower;
});
</script>
<template>
  <div>
    <CTooltip>
      <template #trigger>
        <div class="relative">
          <label
            class="flex items-center w-full bg-grey-50 border border-grey-100 rounded-[10px] cursor-pointer base-file-select"
            :class="[props.value ? 'focused' : '', schema?.$error ? 'error' : '']"
          >
            <input
              :accept="acceptComp"
              id="FileUpload"
              class="hidden"
              type="file"
              ref="fileInpRef"
              @change="selectFile"
            />
            <div class="flex">
              <CIcon class="mr-4 shrink-0" name="upload" />
              <div>
                <div class="file-label">{{ props.label }}</div>
                <div class="file-name" v-if="uploadRef?.[0]?.name">
                  {{ uploadRef?.[0]?.name || "" }}
                </div>
              </div>
            </div>
          </label>
          <CIcon
            class="absolute right-1 cursor-pointer top-[21px] w-5"
            name="times"
            v-if="uploadRef?.[0]?.name"
            @click.stop="uploadRef = []"
          />
        </div>
      </template>
      <div>
        <div>Tanlashingiz mumkin :</div>
        <div>{{ accept }}</div>
      </div>
    </CTooltip>
    <p v-if="schema?.$error" class="text-error text-sm mt-[2px]">
      {{ message ? message : schema?.$model ? $t("error.invalid") : $t("error.empty") }}
    </p>
  </div>
</template>
<style lang="scss">
.base-file-select {
  padding: 10px;
  &.error {
    @apply border border-error;
  }
  .file-name {
    font-weight: 600;
  }
  .file-label {
    font-size: 14px;
  }
  &.focused {
    .file-label {
      margin-top: -10px;
      font-size: 12px;
    }
    .file-name {
      margin-top: -5px;
    }
  }
}
</style>
