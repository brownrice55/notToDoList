<script setup lang="ts">
  interface Props {
    notToDoListData: Array;
  }
  defineProps<Props>();
</script>

<template>
  <ul>
    <template v-for="data in notToDoListData" :key="data">
      <li v-if="data[0]==='毎日'">
        <input type="checkbox" id="">
        <label for="">{{ data[1] }}</label>
      </li>
    </template>
  </ul>
</template>

<style scoped>
</style>
