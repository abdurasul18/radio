<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { FileService } from "/@src/services/file";
import { OrganizationService } from "/@src/services/organization";
import { toastSuccess } from "/@src/plugins/toast";
import { IFile } from "/@src/services/types";
const route = useRoute();
const router = useRouter();
const defaultContent = `<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`;

let form = ref({
  name: "",
  description: "",
  service_id:
    route.query.service_id && !isNaN(Number(route.query.service_id))
      ? Number(route.query.service_id)
      : null,
  region_id: "",
  phone_number: "",
  address: "",
  lat: null as number | null,
  lon: null as number | null,
  details: [
    {
      title: "",
      file: null as any,
      file_id: null as string | null,
    },
  ],
});
const rules = {
  name: { required },
  service_id: { required },
  region_id: { required },
};
let files = ref([]);
const v$ = useVuelidate(rules, form.value);
async function validate() {
  return await v$.value.$validate();
}
let loading = ref(false);
async function save() {
  if (!(await validate())) return;
  loading.value = true;
  try {
    let payload = {
      ...form.value,
      lat: form.value.lat ? String(form.value.lat) : null,
      lon: form.value.lon ? String(form.value.lon) : null,
      file_ids: uploadedFiles.value.map((el) => el.id),
      details: form.value.details.map((d, index) => ({
        title: d.title,
        file_id: d.file_id ? d.file_id : null,
        file: d.file ? d.file : null,
      })),
    };
    if (files.value.length > 0) {
      let res = await FileService.upload(files.value);
      payload.file_ids = [...payload.file_ids, ...res.data.data.map((el: any) => el.id)];
    }
    await Promise.all(
      payload.details.map(async (detail, index) => {
        if (detail.file && detail.file instanceof File) {
          let res = await FileService.upload([detail.file]);
          detail.file_id = res.data.data?.[0]?.id || null;
        }
        if (detail.file) {
          delete detail.file;
        }
      })
    );
    if (route.query.id) {
      await OrganizationService.update(String(route.query.id), payload);
    } else {
      await OrganizationService.create(payload);
    }
    toastSuccess();
    router.back();
  } finally {
    loading.value = false;
  }
}
//
let uploadedFiles = ref<IFile[]>([]);
onMounted(async () => {
  if (route.query.id) {
    let res = await OrganizationService.getById(String(route.query.id));
    form.value.name = res.data.data.name;
    form.value.description = res.data.data.description;
    form.value.service_id = res.data.data.service_id
      ? Number(res.data.data.service_id)
      : null;
    form.value.region_id = res.data.data.region_id;
    form.value.phone_number = res.data.data.phone_number;
    form.value.address = res.data.data.address;
    form.value.lat = res.data.data.lat ? Number(res.data.data.lat) : null;
    form.value.lon = res.data.data.lon ? Number(res.data.data.lon) : null;
    uploadedFiles.value = res.data.data.files.map((el) => el.file);
    form.value.details = res.data.data.details.map((d) => ({
      title: d.title,
      file: d.file,
      file_id: d.file_id,
    }));
  }
});
</script>
<template>
  <div class="grid gap-4">
    <AppTitle> Yangi xizmat qo'shish </AppTitle>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Umumiy ma'lumotlar</div>
      <div class="grid gap-4 grid-cols-2">
        <CInput
          v-model:value="form.name"
          :schema="v$.name"
          label="Sarlavha"
          icon="draft"
        />
        <SelectService v-model:value="form.service_id" :schema="v$.service_id" />
        <SelectRegion v-model:value="form.region_id" :schema="v$.region_id" />
        <CInput
          v-model:value="form.phone_number"
          :schema="v$.phone_number"
          label="Telefon raqam"
          icon="phone"
        />
        <CInput
          class="col-span-full"
          v-model:value="form.address"
          :schema="v$.address"
          label="Manzil"
          type="textarea"
        />
      </div>
    </n-card>
    <n-card class="base-card" :bordered="false">
    <div class="title mb-2"> Fayllar </div>
      <DropFile v-model:value="files" label="Fayllar" icon="draft" />
      <FileShow
        v-for="value in uploadedFiles"
        :key="value.id"
        :data="value"
        @delete="uploadedFiles = uploadedFiles.filter((file) => file.id !== value.id)"
      />
    </n-card>
    <n-card class="base-card" :bordered="false">
      <div class="title mb-4">Tavsif</div>
      <n-card v-for="(item, index) in form.details" class="base-card mb-4">
        <div class="flex justify-end -mt-4 mb-2">
          <CIconButton
            @click="form.details.splice(index, 1)"
            type="error"
            icon="delete"
          />
        </div>
        <CInput class="mb-4" type="textarea" v-model:value="item.title" label="Matn" />
        <CFileSelect
          v-if="!item.file_id"
          v-model:value="item.file"
          label="Fayl yuklang"
        />
        <FileShow
          v-else
          :data="item.file"
          @delete="
            item.file = null;
            item.file_id = null;
          "
        />
      </n-card>
      <CButton
        @click="form.details.push({ title: '', file: null, file_id: null })"
        class="w-full"
        icon="plus"
      >
        Qo'shish
      </CButton>
    </n-card>

    <n-card class="base-card" :bordered="false">
    <div class="title mb-4"> Lokatsiya </div>
      <SelectLocation v-model:lat="form.lat" v-model:lon="form.lon" />
      <div class="grid grid-cols-2 gap-4 mt-4">
        <CInput v-model:value="form.lat" label="Kenglik" type="number" icon="hashtag" />
        <CInput v-model:value="form.lon" label="Uzunlik" type="number" icon="hashtag" />
      </div>
    </n-card>
    <div class="flex justify-end mt-8 gap-4">
      <CButton @click="$router.back()" type="default"> Bekor qilish </CButton>
      <CButton @click="save" type="primary" :loading="loading"> Saqlash </CButton>
    </div>
  </div>
</template>
<style lang="scss"></style>
