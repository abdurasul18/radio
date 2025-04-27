<script lang="ts" setup>
import { EduTypes } from '/@src/services/criterion';

// 1 - O'quv , 2 - Ilmiy ,3 - Manaviy ,4 - Tashkiliy

</script>

<template>
  <CSelect :options="EduTypes" v-bind="$attrs" />
</template>
