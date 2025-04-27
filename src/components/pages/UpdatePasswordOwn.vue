<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import { generateRandomPassword } from "/@src/utils/random-password";
const { t } = useI18n();
const emits = defineEmits(["close", "success"]);

const form = ref({
  old_password: "",
  new_password: "",
  password_confirm: "",
});
const rules = computed(() => {
  return {
    old_password: {
      required: required,
    },
    new_password: {
      required,
      // passValidate: passValidate,
    },
    password_confirm: {
      required,
      validate(e: any) {
        return e == form.value.new_password;
      },
    },
  };
});
let passRules = [
  {
    regex: /[A-Za-z\d-!$%^&*()_+|~=`{}\[\]:.";'<>?,@#$:<>\/]{8,}/,
    message: "Parol 8 ta belgidan kam bo'lishi mumkin emas",
  },
  {
    regex: /(?=.*[a-z])/,
    message: "Parolda kichik harf bo'lishi kerak",
  },
  {
    regex: /(?=.*[A-Z])/,
    message: "Parolda katta harf bo'lishi kerak",
  },
  {
    regex: /(?=.*\d)/,
    message: "Parolda raqam bo'lishi kerak",
  },
  {
    regex: /(?=.*[!$%^&*()_+|~=`{}\[\]:.";'<>?,@#$:<>])/,
    message: "Parolda kamida bitta belgi bo'lishi kerak",
  },
];
let errorMessage = computed(() => {
  let mes = "";
  passRules.forEach((el, index) => {
    let result = el.regex.test(form.value.new_password);
    if (!result) {
      mes = el.message;
    }
  });
  return mes;
});
let validRuleCount = computed(() => {
  let index = 0;
  passRules.forEach((el) => {
    let result = el.regex.test(form.value.new_password);
    if (result) index++;
  });
  return index;
});
function passValidate(e: string) {
  return validRuleCount.value == passRules.length;
}
let colorProccess = computed(() => {
  if (validRuleCount.value == 1) {
    return "#ff8c00";
  } else if (validRuleCount.value == 2) {
    return "#ff4500";
  } else if (validRuleCount.value == 3) {
    return "#ff0000";
  } else if (validRuleCount.value < 5) {
    return "#8b0000";
  } else if (validRuleCount.value == passRules.length) {
    return "#008000";
  }
  return "#000000";
});
const v$ = useVuelidate(rules, form);
async function validate() {
  let result = await v$.value.$validate();
  if (result) {
    emits("success", form.value);
  }
}
function createRandom() {
  form.value.new_password = generateRandomPassword();
}
</script>
<template>
  <form @submit.prevent="validate">
    <div class="grid gap-4">
      <n-alert title="Xavfsiz parol tanlang" type="info">
        Xavfsizlik uchun tavsiyalarga rioya qiling
      </n-alert>
      <div class="">
        <CInput
          v-model:value="form.old_password"
          :schema="v$.old_password"
          type="password"
          show-password-on="click"
          label="Hozirgi parol"
        />
      </div>
      <div>
        <div class="flex items-center">
          <CInput
            class="pass-inp"
            v-model:value="form.new_password"
            :schema="v$.new_password"
            type="password"
            show-password-on="click"
            :message="' '"
            style="width: 100%"
            label="Yangi parol"
          />
          <CTooltip>
            <template #trigger>
              <CIconButton
                class="ml-1"
                type="info"
                icon="key"
                @click="createRandom"
                :circle="false"
              />
            </template>
            <div>Random generatsiya qilish</div>
          </CTooltip>
        </div>
        <p class="text-yellow-500" v-if="errorMessage">{{ errorMessage }}</p>

        <n-progress
          class="mt-2"
          type="line"
          indicator-placement="none"
          :color="colorProccess"
          :percentage="(validRuleCount / passRules.length) * 100"
          :height="15"
        />
      </div>

      <div class="">
        <CInput
          v-model:value="form.password_confirm"
          :schema="v$.password_confirm"
          label="Parolni tasdiqlang"
          type="password"
          show-password-on="click"
          size="large"
        />
      </div>
      <div class="flex justify-end gap-4 mt-5">
        <CButton type="default" @click="$emit('close')">
          {{ $t("actions.cancel") }}
        </CButton>
        <CButton @click="validate">
          {{ $t("actions.save") }}
        </CButton>
      </div>
    </div>
  </form>
</template>

<style lang="scss"></style>
