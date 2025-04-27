<script lang="ts" setup>
let search = ref("");
let limit = ref(10);
let limits = [10, 20, 30, 40, 50];
</script>
<template>
  <div>
    <AppTitle> Kiruvchi </AppTitle>
    <div class="bg-white -mx-9 -my-4 py-4">
        <div class="px-9 flex mb-4 items-center justify-between">
          <div class="flex">
            <n-input
              v-model:value="search"
              clearable
              size="large"
              :placeholder="$t('actions.search')"
              class="search-input"
            >
              <template #prefix>
                <CIcon name="search" class="mr-4" />
              </template>
            </n-input>
            <select v-model="limit" class="w-[156px] c-select-grey ml-4">
              <option v-for="val in limits" :value="val">{{ val }}</option>
            </select>
          </div>
          <CButton icon="plus">
            {{ $t("actions.add") }}
          </CButton>
        </div>
      <n-scrollbar x-scrollable>
        <table class="c-table min-w-[100%] action-mode">
          <thead>
            <tr>
              <th>Lorem, ipsum.</th>
              <th>Lorem, ipsum.</th>
              <th>Lorem, ipsum.</th>
              <th>Lorem, ipsum.</th>
              <th>Lorem, ipsum.</th>
              <th>Lorem, ipsum.</th>
              <th>Lorem, ipsum.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i">
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td><CDropdown /></td>
            </tr>
          </tbody>
        </table>
      </n-scrollbar>
      <div class="mt-5 ml-4 mb-5">
        <n-pagination class="c-pagination" :page-count="20" :page-size="20" />
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
