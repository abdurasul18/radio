<script lang="ts" setup>
import { subMenus } from '/@src/services/question';



</script>

<template>
  <CSelect :options="subMenus" v-bind="$attrs" />
</template>
