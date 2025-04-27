<script lang="ts" setup>
let value = ref(null);
let files = ref([]);
</script>
<template>
  <div class="max-w-[800px] mx-auto">
    <n-card class="base-card" :bordered="false">
      <div class="grid grid-cols-2 gap-4">
        <CInput v-model:value="value" label="Name" icon="draft" />
        <CDatepicker v-model:value="value" label="Name" icon="draft" />
        <CFileSelect v-model:value="value" label="Name" icon="draft" />
        <CDatepickerRange
          v-model:value="value"
          label="Name"
          icon="draft"
        />
        <CInput
          type="textarea"
          class="col-span-full"
          v-model:value="value"
          label="Name"
          icon="draft"
        />
        <CSelect
          :options="[]"
          type="textarea"
          class="col-span-full"
          v-model:value="value"
          label="Name"
          icon="draft"
        />
        <CYearPicker v-model:value="value" label="Name" icon="draft" />
        <CTreeSelect :options="[]" v-model:value="value" label="Name" icon="draft" />
        <CInputNumber :options="[]" v-model:value="value" label="Name" icon="draft" />
        <DropFile class="col-span-full" v-model:value="files" label="Name" icon="draft" />
        <div class="col-span-full flex justify-end mt-8 gap-4">
          <CButton type="default"> Bekor qilish </CButton>
          <CButton> Saqlash </CButton>
        </div>
      </div>
    </n-card>
  </div>
</template>
<style lang="scss"></style>
