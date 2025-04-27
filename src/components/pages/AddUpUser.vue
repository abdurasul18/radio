<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
import { toastSuccess } from "/@src/plugins/toast";
import { IUser, UserService } from "../../services/user";
import { FileService } from "/@src/services/file";
let emits = defineEmits(["success", "close"]);
let props = withDefaults(
  defineProps<{
    item?: IUser | null;
    mode: "create" | "update";
  }>(),
  {
    mode: "create",
  }
);
onMounted(() => {
  if (props.mode == "update") {
    form.value.first_name = props.item?.first_name || "";
    form.value.last_name = props.item?.last_name || "";
    form.value.middle_name = props.item?.middle_name || "";
    form.value.birthday = props.item?.birthday?.split(" ")[0] || "";
    form.value.phone = props.item?.phone || "";
    form.value.address = props.item?.address || "";
    form.value.bio = props.item?.bio || "";
    form.value.degree_id = props.item?.degree_id || "";
    form.value.direction_id = props.item?.direction_id || "";
    form.value.username = props.item?.username || "";
    form.value.role = String(props.item?.role) || "";
    form.value.avatar = props.item?.avatar || "";
    form.value.passport = props.item?.passport || "";
  }
});
let form = ref({
  first_name: "",
  last_name: "",
  middle_name: "",
  birthday: "",
  phone: "",
  address: "",
  bio: "",
  degree_id: "" as any,
  direction_id: "" as any,
  username: "",
  role: "" as any,
  avatar: "",
  passport: "",
  password: undefined,
  password_confirm: undefined,
});
const rules = {
  first_name: { required },
  last_name: { required },
  middle_name: {},
  birthday: { required },
  phone: { required },
  address: { required },
  bio: {},
  passport: { required },
};
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let loading = ref(false);
async function save() {
  if (await validate()) {
    if (loading.value) return;
    try {
      loading.value = true;

      if (props.mode == "create") {
        await UserService.create({ ...form.value });
      } else {
        await UserService.update(props.item?.id!, { ...form.value });
      }
      emits("success");
      toastSuccess();
    } finally {
      loading.value = false;
    }
  }
}
//
let status = [
  {
    name: "Active",
    id: 1,
  },
  {
    name: "Inactive",
    id: 0,
  },
];
</script>

<template>
  <div>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="col-span-full flex gap-4">
        <div>
          <CPhotoSelect
            class="h-[180px] w-[160px]"
            v-model:value="form.avatar"
            v-model:loading="loading"
          />
        </div>
        <div class="grid gap-4 w-full">
          <CInput
            icon="user"
            v-model:value="form.first_name"
            :schema="v$.first_name"
            label="Ism"
          />
          <CInput
            icon="user"
            v-model:value="form.last_name"
            :schema="v$.last_name"
            label="Familya"
          />
          <CInput
            icon="user"
            v-model:value="form.middle_name"
            :schema="v$.middle_name"
            label="Otasining ismi"
          />
        </div>
      </div>
      <CDatepicker
        icon="calendar"
        v-model:value="form.birthday"
        :schema="v$.birthday"
        label="Tug'ilgan sanasi"
      />
      <CInput
        icon="phone"
        v-model:value="form.phone"
        :schema="v$.phone"
        label="Telefon raqami"
      />
      <CInput
        icon="location"
        v-model:value="form.address"
        :schema="v$.address"
        label="Manzil"
      />
      <CInput
        icon="faceID"
        v-model:value="form.passport"
        :schema="v$.passport"
        v-maska="'AA#######'"
        label="Passport seriya raqami"
      />
      <CInput icon="draft" v-model:value="form.bio" :schema="v$.bio" label="Bio" />
      <SelectDegree
        icon="award"
        v-model:value="form.degree_id"
        label="Daraja"
        :schema="v$.degree_id"
      />
      <SelectDirection
        icon="book"
        v-model:value="form.direction_id"
        label="Kafedra"
        :schema="v$.direction_id"
      />
      <SelectRole icon="user" v-model:value="form.role"  label="Rol" :schema="v$.role" />
      <CInput
        icon="user"
        v-model:value="form.username"
        :schema="v$.username"
        label="Foydalanuvchi nomi"
        autocomplete="off"
      />
      <CInput
        icon="lock"
        v-model:value="form.password"
        :schema="v$.password"
        label="Parol"
        type="password"
        show-password-on="click"
        autocomplete="off"
      />
      <CInput
        icon="lock"
        show-password-on="click"
        v-model:value="form.password_confirm"
        :schema="v$.password_confirm"
        label="Parolni tasdiqlash"
        type="password"
        autocomplete="off"
      />
    </div>
    <div class="mt-5">
      <div class="flex justify-end">
        <CButton type="default" @click="emits('close')">
          {{ $t("actions.close") }}</CButton
        >
        <CButton @click="save" :loading="loading" class="ml-4">
          {{ $t("actions.save") }}</CButton
        >
      </div>
    </div>
  </div>
</template>
