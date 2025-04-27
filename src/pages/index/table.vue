<script lang="ts" setup></script>
<template>
  <div>
    <n-card class="base-card" :bordered="false">
      <div class="flex justify-between mb-9">
        <div class="text-[28px] font-semibold">{{ $t("journal.duty") }}</div>
      </div>
      <div class="-m-6 pt-6">
        <table class="c-table2">
          <thead>
            <tr>
              <th style="width: 80px">
                {{ $t("field.number") }}
              </th>
              <th>{{ $t("field.beginDate") }}</th>
              <th>{{ $t("field.endDate") }}</th>
              <th>{{ $t("references.region") }}</th>
              <th>{{ $t("field.orderRegNumber") }}</th>
              <th>{{ $t("field.orderDate") }}</th>
              <th>{{ $t("field.orderDate") }}</th>
              <th class="w-[120px] text-right">{{ $t("actions.title") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i">
              <td>{{ i }}</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>
                <CIconButton icon="eye" />
              </td>
            </tr>
          </tbody>
        </table>
        <div></div>
        <!-- <AppNotFound /> -->
      </div>
    </n-card>
    <div class="mt-5 ml-4 mb-5">
      <n-pagination class="c-pagination" :page-count="20" :page-size="20" />
    </div>
  </div>
</template>
<style lang="scss"></style>
