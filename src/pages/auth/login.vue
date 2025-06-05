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
  <div class="bg-white">
    <div class="grid grid-cols-12 min-h-screen h-full p-4 sm:p-9">
      <div
        class="col-span-7 h-full bg-no-repeat bg-contain hidden xl:flex justify-center items-center bg-[#F5F5F5] rounded-xl"
      >
        <img class="w-[220px]" src="/img/logo.png" alt="" />
       
      </div>
      <div class="col-span-12 xl:col-span-5 flex flex-col justify-between relative">
        <div class="flex sm:hidden justify-center items-center mb-4">
          <img class="w-32" src="/img/logo.png" alt="" />
        </div>
        <div class="flex flex-col h-full justify-center -mt-32 sm:-mt-0">
          <div class="text-center mt-2 2xl:mt-12">
            <div class="text-[42px] text-grey-900 font-bold" style="line-height: 1.1">
              AMUR FM
            </div>
            <p class="text-xl text-grey-500 mt-2">Tizimga kirish</p>
          </div>
          <div class="w-full sm:w-[435px] mx-auto mt-7 2xl:mt-14">
            <CInput
              :label="$t('field.login')"
              icon="user"
              v-model:value="form.username"
              :schema="v$.username"
              @keyup.enter="login"
              :medium="false"
            />
            <CInput
              class="mt-4 2xl:mt-7"
              :label="$t('field.password')"
              type="password"
              show-password-on="click"
              icon="lock"
              v-model:value="form.password"
              :schema="v$.password"
              :medium="false"
              @keyup.enter="login"
            >
            </CInput>
            <CButton @click="login" :loading="loading" class="mt-5 2xl:mt-14 w-full">{{
              $t("actions.login")
            }}</CButton>
          </div>
        </div>
        <div class="text-center">©2025 AMUR FM. All rights reserved.</div>
      </div>
    </div>
    <!-- <Signature v-model:show="signShow" /> -->
  </div>
</template>
<style lang="scss"></style>
