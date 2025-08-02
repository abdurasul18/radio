<script lang="ts" setup>
let form = ref({
  title: "",
  body: "",
});
let files = ref([]);
</script>
<template>
  <div class="grid gap-4">
  <AppTitle> Yangi xizmat qo'shish </AppTitle>
   <n-card class="base-card" :bordered="false">
     <div class="grid gap-4 grid-cols-2">
      <CInput
        v-model:value="form.title"
        label="Sarlavha"
        icon="draft"
      />
      <CSelect icon="category" label="Kategoriya" />
    </div>
   </n-card>
    <Editor v-model:value="form.body" />
    <n-card class="base-card" :bordered="false">
     <DropFile v-model:value="files" label="Fayllar" icon="draft" />
    </n-card>
  </div>
</template>
<style lang="scss"></style>
