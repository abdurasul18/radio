<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { AuthService } from "/@src/services/auth";
import { useAuthStore } from "/@src/store/auth";
import ApiService from "/@src/services/api";

let router = useRouter();
const route = useRoute();
let signShow = ref(false);
const form = ref({
  username: "",
  password: "",
});
const rules = {
  username: { required },
  password: { required },
};
const v$ = useVuelidate(rules, form);
async function validate() {
  return await v$.value.$validate();
}
let loading = ref(false);
async function login() {
  if (loading.value) return;
  if (await validate()) {
    loading.value = true;
    try {
      let res = await AuthService.login(form.value);
      useAuthStore().login(res.data.data);
      ApiService.setHeader();
      if (route.query.redirect) {
        await router.push(route.query.redirect as string);
      } else {
        await router.push("/");
      }
    } finally {
      loading.value = false;
    }
  }
}
</script>
<template>
  <div class="bg-grey-50 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
    <div class="grid grid-cols-12 max-w-[1200px] w-full min-h-[680px] bg-white rounded-3xl overflow-hidden shadow-xl border border-grey-100 p-2 sm:p-4">
      <!-- Left Panel: Brand Details (Hidden on mobile) -->
      <div
        class="col-span-7 h-full hidden xl:flex flex-col justify-between p-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#142240] to-[#0056B3] shadow-inner"
      >
        <!-- Glowing background effects -->
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-[#1DBF73] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#007BFF] rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
        
        <!-- Brand Header/Badge -->
        <div class="z-10 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#1DBF73] animate-pulse"></span>
          <span class="text-xs text-white/60 font-semibold tracking-widest uppercase">Radio Administration</span>
        </div>
        
        <!-- Logo & Center Slogan -->
        <div class="z-10 flex flex-col items-center text-center my-auto">
          <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-8 transition-transform hover:scale-[1.03] duration-300">
            <img class="w-[180px] " src="/img/logo.png" alt="Amur FM Logo" />
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-wide leading-tight">
            AMUR FM <span class="text-[#1DBF73]">Radio</span>
          </h1>
          <p class="text-white/70 text-base mt-3 max-w-[380px] font-medium leading-relaxed">
            Efir boshqaruvi, xizmatlar tahlili va amaliy boshqaruv tizimi.
          </p>
        </div>
        
        <!-- Footer badge -->
        <div class="z-10 text-white/40 text-xs font-medium tracking-wide">
          Version 1.0.0 &bull; Secure Connection Enabled
        </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="col-span-12 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 relative min-h-[580px] xl:min-h-0">
        <!-- Mobile Logo -->
        <div class="flex xl:hidden justify-center items-center mb-6">
          <div class="p-4 rounded-2xl bg-grey-50 border border-grey-100 shadow-sm">
            <img class="w-[110px]" src="/img/logo.png" alt="Amur FM" />
          </div>
        </div>

        <!-- Form Body -->
        <div class="flex flex-col h-full justify-center my-auto max-w-[380px] w-full mx-auto">
          <div class="text-center xl:text-left mb-8">
            <h2 class="text-3xl text-grey-900 font-extrabold tracking-tight leading-none mb-3">
              Xush kelibsiz
            </h2>
            <p class="text-grey-400 font-medium text-sm">Tizimga kirish uchun login va parolingizni kiriting</p>
          </div>
          
          <div class="flex flex-col gap-4">
            <CInput
              :label="$t('field.login')"
              icon="user"
              v-model:value="form.username"
              :schema="v$.username"
              @keyup.enter="login"
              :medium="false"
              class="c-input-grey"
            />
            <CInput
              :label="$t('field.password')"
              type="password"
              show-password-on="click"
              icon="lock"
              v-model:value="form.password"
              :schema="v$.password"
              :medium="false"
              @keyup.enter="login"
              class="c-input-grey"
            />
            
            <CButton @click="login" :loading="loading" class="w-full !py-6 text-base font-semibold mt-4 shadow-md shadow-blue-500/10">
              Kirish
            </CButton>
          </div>
        </div>

        <!-- Footer Copyright -->
        <div class="text-center text-xs text-grey-400 mt-8">
          © {{ new Date().getFullYear() }} AMUR FM. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
