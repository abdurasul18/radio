<script lang="ts" setup>
import { RefNameType } from "../../services/references/config";
import { createRefService } from "/@src/services/reference";
import { references } from "/@src/services/references";
let props = defineProps<{
  type: RefNameType;
  schema?: any;
  notGetMounted?: boolean;
}>();
let config = references.find((item) => item.name === props.type);
const Service = createRefService(config!);
let list = ref<any>([]);
let loading = ref(false);
async function getList(search = "") {
  try {
    let body = {
      page: 0,
      limit: 20,
    };
    let query = {
      search,
    };
    loading.value = true;
    let res = await Service.getList(query, body);
    list.value = config?.pagination ? res.data.list : res.data;
  } finally {
    loading.value = false;
  }
}
let index = ref(0);
function updateShow(v: boolean) {
  if (v) {
    index.value++;
    if (index.value > 1 || props.notGetMounted) {
      getList();
    }
  }
}
onMounted(() => {
  if (!props.notGetMounted) {
    getList();
  }
});
//
let listComp = computed(() => {
  if (props.type == "directory-type") {
    return list.value.map((item: any) => {
      return {
        id: item.id,
        name: item.code,
      };
    });
  } else if (props.type == "contragent") {
    return list.value.map((item: any) => {
      return {
        id: item.id,
        name: item.shortName,
      };
    });
  } 
else if(props.type == "tabel-symbol") {
    return list.value.map((item: any) => {
      return {
        ...item,
        id: item.id,
        name: item.name + ` (${item.code})`,
      };
    });
  }
  else {
    return list.value;
  }
});
</script>
<template>
  <CSelect
    :options="listComp"
    :loading="loading"
    @search="getList"
    :onUpdateShow="updateShow"
    v-bind="$attrs"
    :label="$t(`references.${config?.label!}`)"
    :schema="schema"
  />
</template>
<style lang="scss" scoped></style>
