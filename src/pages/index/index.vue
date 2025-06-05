<script lang="ts" setup>
import { useAuthStore } from "/@src/store/auth";
const { user } = toRefs(useAuthStore());
const router = useRouter();
onMounted(()=>{
  router.push('/notification')
})
const loading = ref(false);
</script>
<template>
  <n-spin :show="loading" size="large">
    <div class="grid gap-4">
      <AppTitle> Dashboard </AppTitle>
     
    </div>
  </n-spin>
</template>
<style lang="scss" scoped></style>
