<script lang="ts" setup>
import { AuthService } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
const router = useRouter();
const token = useRoute().query.token as string;
const redirect = useRoute().query.redirect as string;
const { login } = useAuthStore();
onMounted(async () => {
  try {
    let res = await AuthService.loginWithToken(token);
    login(res.data);
    if (redirect) {
      await router.push(redirect);
    } else {
      await router.push("/");
    }
  } catch {
    await router.push("/auth/login");
  }
});
</script>
<template>
  <n-spin :show="true" :size="80" description="Loading...">
    <n-card class="h-screen"> </n-card>
  </n-spin>
</template>
<style lang="scss"></style>
