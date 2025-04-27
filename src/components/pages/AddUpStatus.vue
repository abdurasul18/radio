<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ILocaleText } from "/@src/services/lang";
import { toCyrill, toLatin } from "/@src/locales/translate";
import { IStatus, StatusService } from "/@src/services/references/status";
let emits = defineEmits(["success", "close"]);
let props = withDefaults(
  defineProps<{
    item?: IStatus;
    mode: "create" | "update" | "add-child";
  }>(),
  {
    mode: "create",
  }
);
onMounted(() => {
  if (props.mode == "update") {
    form.value.status = props.item?.status || "";
    form.value.color = props.item?.color || "";
    form.value.order = props.item?.order || "";
    form.value.localeName.lt = props.item?.localeName?.lt || "";
    form.value.localeName.uz = props.item?.localeName?.uz || "";
    form.value.localeName.ru = props.item?.localeName?.ru || "";
    form.value.localeName.en = props.item?.localeName?.en || "";
  }
});
let form = ref({
  localeName: {
    uz: "",
    ru: "",
    en: "",
    lt: "",
  },
  order: "",
  color: "",
  status: "",
});
const rules = {
  localeName: {
    uz: { required },
    lt: { required },
    en: { required },
    ru: { required },
  },
  status: { required },
};
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}

async function save() {
  if (await validate()) {
    emits("success", form.value);
  }
}
//
let statusLoading = ref(false);
let statusList = ref([]);
async function getStatusList() {
  statusLoading.value = true;
  let res = await StatusService.listStatuses();
  statusList.value = res.data.map((el: any) => {
    return {
      id: el,
      name: el,
    };
  });
  statusLoading.value = false;
}
onMounted(getStatusList);
</script>

<template>
  <div>
    <div class="grid gap-4">
      <div>
        <CInput
          icon="draft"
          v-model:value="form.localeName.lt"
          :schema="v$.localeName.lt"
          translate
          @translate="form.localeName.lt = toLatin(form.localeName.uz)"
          :label="$t('lang.uzbekLatin')"
        >
          <template #suffix>
            <CIconButton
              size="small"
              icon="translate"
              @click="form.localeName.lt = toLatin(form.localeName.uz)"
            />
          </template>
        </CInput>
      </div>
      <div>
        <CInput
          icon="draft"
          v-model:value="form.localeName.uz"
          :schema="v$.localeName.uz"
          :label="$t('lang.uzbekKrill')"
        >
          <template #suffix>
            <CIconButton
              size="small"
              icon="translate"
              @click="form.localeName.uz = toCyrill(form.localeName.lt)"
            />
          </template>
        </CInput>
      </div>
      <div>
        <CInput
          icon="draft"
          v-model:value="form.localeName.ru"
          :schema="v$.localeName.ru"
          :label="$t('lang.russian')"
        />
      </div>
      <div>
        <CInput
          icon="draft"
          v-model:value="form.localeName.en"
          :schema="v$.localeName.en"
          :label="$t('lang.english')"
        />
      </div>
      <div>
        <CSelect
          icon="hashtag"
          :label="$t('field.code')"
          v-model:value="form.status"
          :schema="v$.status"
          :options="statusList"
        />
      </div>
      <div>
        <p>{{ $t("field.color") }}</p>
        <n-color-picker
          :show-preview="true"
          v-model:value="form.color"
          :modes="['hex']"
        />
      </div>
      <div>
       <CInput
        v-model:value="form.order"
        type="number"
        :label="$t('field.order')"
        :schema="v$.order"
        v-maska="`#####`"
       />
      </div>
    </div>
    <div class="mt-5">
      <div class="flex justify-end">
        <CButton type="default" @click="emits('close')">
          {{ $t("actions.close") }}</CButton
        >
        <CButton @click="save" class="ml-4"> {{ $t("actions.save") }}</CButton>
      </div>
    </div>
  </div>
</template>
