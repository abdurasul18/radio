<script lang="ts" setup>
let emits = defineEmits(["close"]);
</script>
<template>
  <div>
    <div class="text-grey-400 text-xl mb-6">Reytinglar</div>
    <div>
      <RouterLink class="submenu-link" @click="emits('close')" to="/rating/faculty">
        Fakultet bo'yicha
      </RouterLink>
      <RouterLink class="submenu-link" @click="emits('close')" to="/rating/direction">
        Kafedra bo'yicha
      </RouterLink>
      <RouterLink class="submenu-link" @click="emits('close')" to="/rating/teacher">
        O'qituvchilar bo'yicha
      </RouterLink>
    </div>
  </div>
</template>
<style lang="scss">
.submenu-link {
  @apply py-2 flex px-2  pl-4  rounded-lg text-grey-500;
  transition: all ease-in-out 0.3s;
  &:hover {
    @apply bg-gray-100;
  }
  &.router-link-active {
    @apply bg-blue-500 text-white;
  }
}
.create-doc {
  .n-collapse-item__content-inner {
    padding-top: 5px !important;
  }
  .n-collapse-item__header-main {
    display: flex;
    justify-content: space-between;
  }
}
</style>
